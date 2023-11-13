import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cryptr from 'cryptr';

import dotenv from 'dotenv';
dotenv.config();

const LandingPage = () => {

    let [searchParams, setSearchParams] = useSearchParams();
    // let hasLoggedIn = localStorage.get("access_token");
    let [hasLoggedIn, setHasLoggedIn] = useState(false); // hasLoggedIn = false;
    const [activities, setActivities] = useState([]);

    // new logic for login
    // check if there is a cookie with an access token. If so, they have logged in prior. If not, they are not logged in. If access token expired, refresh it
    useEffect(() => {
        // check if logged in
        if (localStorage.getItem("access_token") || searchParams.get('code')) {
            console.log("logged in");
            setHasLoggedIn(true);
        }
    }, [])

    useEffect(() => {
        if (hasLoggedIn) {
            getAccessTokenAndActivities();
        }
    }, [hasLoggedIn, searchParams]);

    let useRefreshToken = async () => {
        let cryptr = new Cryptr(process.env.SECRET)
        let refreshToken = cryptr.decrypt(localStorage.getItem("refresh_token"));

        let {data} = await axios.post("https://www.strava.com/api/v3/oauth/token", {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        })
        let access_token = data.access_token;
        return access_token
    }

    const getAccessTokenAndActivities = async (getNew = false) => {
                    
        let token = localStorage.getItem('access_token');
        let code = searchParams.get('code');
        let cryptr = new Cryptr(process.env.SECRET)

        if (!token) {
            let response = await axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`);
            let token = cryptr.encrypt(response.data.access_token);
            let refresh = cryptr.encrypt(response.data.refresh_token);
            let athleteID = cryptr.encrypt(response.data.athlete.id);
    
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('athlete_id', athleteID);
        } else {
            let newtoken = await useRefreshToken();
            localStorage.setItem('access_token', cryptr.encrypt(newtoken));
        }

        // check if there are activities in local storage

        let savedActivities = localStorage.getItem('activities');

        if (savedActivities, getNew == false) {
            console.log("pulled activities from local storage");
            let parsedActivities = JSON.parse(savedActivities);
            setActivities(parsedActivities);
        } else {
            let accessToken = cryptr.decrypt(localStorage.getItem('access_token'));
            const { data } = await axios.get('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=50', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
    
            let newActivities = data.map(activity => {
                return {
                    id: activity.id,
                    name: activity.name,
                    date: activity.start_date,
                    distance: activity.distance
                }
            })

            setActivities(newActivities);
            localStorage.setItem('activities', JSON.stringify(newActivities));
        }
    }

    if (!hasLoggedIn && !searchParams.get('code')) {
        // user has not logged in with Strava
        return (
            <div className="LandingPage">
                <a className="LoginButton" href={`http://strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&scope=read_all,activity:read_all&redirect_uri=${process.env.REDIRECT_URI}`}>Login with Strava</a>
            </div>
        )
    }
    
    else {
        // user has logged in with Strava. We either have a code to get activities or we already have a token.

        return (
            <div className="LandingPage">
                <button onClick={()=>getAccessTokenAndActivities(true)}>Get Newer Rides</button>
                <ul>
                    {activities.map((activity) => {
                        return (
                        <Link to={`/ride/${activity.id}`} key={activity.id}>
                            <li>{activity.date} {activity.name} - {(activity.distance / 1609.34).toFixed(2)} miles</li>
                        </Link>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default LandingPage