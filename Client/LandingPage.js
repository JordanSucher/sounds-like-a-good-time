import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

    const getAccessTokenAndActivities = async () => {
                    
        let token = localStorage.getItem('access_token');
        let code = searchParams.get('code');

        if (!token) {
            let response = await axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`);
            let token = response.data.access_token;
            let refresh = response.data.refresh_token;
            let expiresAt = response.data.expires_at;
            let athleteID = response.data.athlete.id;
    
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('expires_at', expiresAt);
            localStorage.setItem('athlete_id', athleteID);
        }

        // check if there are activities in local storage

        let savedActivities = localStorage.getItem('activities');

        if (savedActivities) {
            console.log("pulled activities from local storage");
            let parsedActivities = JSON.parse(savedActivities);
            setActivities(parsedActivities);
        } else {
            const { data } = await axios.get('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=50', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
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
                <a href={`http://strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&scope=read_all,activity:read_all&redirect_uri=${process.env.REDIRECT_URI}`}>Login with Strava</a>
            </div>
        )
    }
    else {
        // user has logged in with Strava. We either have a code to get activities or we already have a token.

        return (
            <ul>
                {activities.map((activity) => {
                    return (
                    <Link to={`/ride/${activity.id}`} key={activity.id}>
                        <li>{activity.date} {activity.name} - {(activity.distance / 1609.34).toFixed(2)} miles</li>
                    </Link>
                    )
                })}
            </ul>
        )
    }
}

export default LandingPage