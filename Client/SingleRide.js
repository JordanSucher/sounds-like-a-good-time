import React, { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SingleRide = () => {
    
    const { id } = useParams();
    let activities = localStorage.getItem('activities');
    activities = JSON.parse(activities);
    let activity = activities.find(activity => activity.id == id);
    let [videoInS3, setVideoInS3] = useState('');
    let [latlongs, setLatlongs] = useState([]);
    let [progress, setProgress] = useState([]);

    useEffect(() => {
        let useRefreshToken = async () => {
            let {data} = await axios.post("https://www.strava.com/api/v3/oauth/token", {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                refresh_token: localStorage.getItem("refresh_token"),
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
            console.log("latlongs: ", data.latlng.data)
            setLatlongs(data.latlng.data)
        }

        getLatLongs()

    },[id])


    useEffect(() => {
        // check if video is in S3
        let check = async () => {
            let { data } = await axios.get('/api/simplestatus?activityId=' + id);
            setVideoInS3 (data.status)
        }
        check()
    }, [id])

    const generateVideo = async () => {
        // mark video as in progress
        setVideoInS3('activityInS3')
        // initiate video generation
        await axios.post('/api/video', {
            activityId: id,
            latlongs: latlongs
        })
    }

    const getProgress = async () => {
        let { data } = await axios.get('/api/progress?activityId=' + id);
        if (data[data.length - 1] == "everything done") {
            setVideoInS3('videoInS3')
        }
        setProgress(data)
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
        console.log("new progress: ", progress)
    }, [progress])


return (
    <div className='single-ride'>
        <h1>{activity.name} - {activity.date}</h1>
        <h2>{(activity.distance / 1609.34).toFixed(2)} miles</h2>
        <div>
            {videoInS3 == 'notInS3' || videoInS3 == 'activityInS3' && <button onClick={()=>generateVideo()}>Generate Visualization</button> }
            {videoInS3 == 'activityInS3' && <button disabled>Visualization being generated. Check back later.</button> }
            {videoInS3 == 'videoInS3' && <Link to={`/visualize/${id}`}>Play Ride</Link>}

            {progress && progress.length > 0 &&
            <ul>
                {progress.reverse().map((log) => {
                   return <li>{log}</li>
                })}
            </ul>
            }
        </div>
    </div>
)

}

export default SingleRide