import React, { useEffect, useRef, useState } from 'react';

import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import dotenv from 'dotenv';
import Cryptr from 'cryptr';
dotenv.config();

const SingleRide = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const custom = searchParams.get('custom');
    const { id } = useParams();
    let activityIdRef = useRef(id);
    if (custom == 'true') {
        activityIdRef.current = 'custom/' + id
    }
    let activities = localStorage.getItem('activities');
    activities = JSON.parse(activities);
    let activity = activities ? activities.find(activity => activity.id == id) : {name:id, date:'N/A'};
    let [videoInS3, setVideoInS3] = useState('');
    let [latlongs, setLatlongs] = useState([]);
    let [progress, setProgress] = useState([]);
    let progressRef = useRef([]);
    let numFramesRef = useRef(1);
    let [currFrame, setCurrFrame] = useState(0);

    useEffect(() => {
        let cryptr = new Cryptr(process.env.SECRET)
        let refreshToken = localStorage.getItem("refresh_token") ? cryptr.decrypt(localStorage.getItem("refresh_token")) : null

        let useRefreshToken = async () => {
            let {data} = await axios.post("https://www.strava.com/api/v3/oauth/token", {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
            let access_token = data.access_token;
            return access_token
        }

        let getLatLongs = async () => {
            let access_token = await useRefreshToken();
            let { data } = await axios.get(`https://www.strava.com/api/v3/activities/${id}/streams?keys=latlng&key_by_type=true`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            setLatlongs(data.latlng.data)
        }

        if (refreshToken) {
            getLatLongs()
        }

    },[id])


    useEffect(() => {
        // check if video is in S3
        let check = async () => {
            let { data } = await axios.get('/api/simplestatus?activityId=' + activityIdRef.current);
            console.log("data: ", data)
            setVideoInS3 (data.status)
            // if no progress, restart generation
            if (data.status == 'activityInS3' && data.progress == 0) {
                generateVideo();
            }

        }
        check()
    }, [id])

    const generateVideo = async () => {
        // mark video as in progress
        setVideoInS3('activityInS3')

        // initiate video generation
        await axios.post('/api/video', {
            activityId: activityIdRef.current,
            latlongs: latlongs
        })
    }

    const getProgress = async () => {
        let { data } = await axios.get('/api/progress?activityId=' + activityIdRef.current);
        if (data[data.length - 1] == "everything done") {
            setVideoInS3('videoInS3')
        }
        if (data[data.length - 1] !== progressRef.current[progressRef.current.length - 1]) {
            setProgress(data)
            progressRef.current = data
        }
        let pattern = /frame (\d+)/
        let frameNums = data ? data.map(frame => {
            let match = pattern.exec(frame)
            if (!match) {
                return 1
            }
            return match[1]
        }) : [1]
        let maxframe = Math.max(...frameNums)
        numFramesRef.current = maxframe
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getProgress()
        }, 1000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [id])

    useEffect(() => {
        console.log("setting up interval")
        let interval = setInterval(() => {
            setCurrFrame((prevFrame) => (prevFrame + 1) % numFramesRef.current)
        }, 1000)
    
        return function cleanup() {
            clearInterval(interval)
        }
    
    }, [])


return (
    <div className='single-ride'>
        <h1>{activity.name} - {activity.date}</h1>
        <h2>{(activity.distance / 1609.34).toFixed(2)} miles</h2>
        <div>
            {(videoInS3 == 'notInS3') && <button onClick={()=>generateVideo()}>Generate Visualization</button> }
            {videoInS3 == 'activityInS3' && <button disabled>Visualization being generated. Come back in a bit.</button> }
            {videoInS3 == 'videoInS3' && <Link to={`/visualize/${id}`}>Play Ride</Link>}

            {progress && progress.length > 0 &&
            <span>
                <ul>
                    {progress.toReversed().map((log) => {
                    return <li>{log}</li>
                    })}
                </ul>
                <div className="imgContainer"> 
                    <img 
                        src={`https://d315wm83g1nlu7.cloudfront.net/${activityIdRef.current}/frames/frame${currFrame}.webp`} 
                        alt={`frame-${currFrame}`}
                    /> 
                    <img 
                        src={`https://d315wm83g1nlu7.cloudfront.net/${activityIdRef.current}/frames/frame${Math.max(currFrame-5,0)}.webp`} 
                        alt={`frame-${Math.max(currFrame-5,0)}`}
                    />
                    <img 
                        src={`https://d315wm83g1nlu7.cloudfront.net/${activityIdRef.current}/frames/frame${Math.max(currFrame-10,0)}.webp`} 
                        alt={`frame-${Math.max(currFrame-10,0)}`}
                    />
                </div>
            </span>
            }
        </div>
    </div>
)

}

export default SingleRide