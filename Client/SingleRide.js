import React, { useEffect, useState } from 'react';

import { useSearchParams, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SingleRide = () => {
    
    const { id } = useParams();
    let activities = localStorage.getItem('activities');
    activities = JSON.parse(activities);
    let activity = activities.find(activity => activity.id == id);
    let [videoInS3, setVideoInS3] = useState('');
    let [latlongs, setLatlongs] = useState([]);

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
            let { data } = await axios.get('/api/video?activityId=' + id);
            setVideoInS3 (data.status)
        }
        check()
    }, [activity, id])

    const generateVideo = async () => {
        // mark video as in progress
        setVideoInS3('activityInS3')
        // initiate video generation
        await axios.post('/api/video', {
            activityId: id,
            latlongs: latlongs
        })
    }


return (
    <div className='single-ride'>
        <h1>{activity.name} - {activity.date}</h1>
        <h2>{(activity.distance / 1609.34).toFixed(2)} miles</h2>
        <div>
            {videoInS3 == 'notInS3' && <button onClick={()=>generateVideo()}>Generate Visualization</button> }
            {videoInS3 == 'activityInS3' && <button disabled>Visualization being generated. Check back later.</button> }
            {videoInS3 == 'videoInS3' && <Link to={`/visualize/${id}`}>Play Ride</Link>}
        </div>
    </div>
)

}

export default SingleRide