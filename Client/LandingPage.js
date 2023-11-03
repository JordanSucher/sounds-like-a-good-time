import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {

    let [searchParams, setSearchParams] = useSearchParams();
    // let hasLoggedIn = localStorage.get("access_token");
    let hasLoggedIn = false;

    // new logic for login
    // check if there is a cookie with an access token. If so, they have logged in prior. If not, they are not logged in. If access token expired, refresh it

    // upon login, need to persist: access token, expiresAt, refresh token, athlete ID

    // upon page load, need to hit a server route to get activities. server should use athlete ID as key to retrieve activities. Need to decide when the server gets new activities from strava (perhaps a param for the route)

    // upon page load if logged in, should 

    if (!hasLoggedIn && !searchParams.get('code')) {
        // user has not logged in with Strava
        return (
            <div className="LandingPage">
                <a href={`http://strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&scope=read_all,activity:read_all&redirect_uri=http://localhost:8000/`}>Login with Strava</a>
            </div>
        )
    }
    else {
        // user has logged in with Strava. We either have a code to get activities or we already have a token.

        const [activities, setActivities] = useState([]);

        if(hasLoggedIn) {
            // case when we have a token in local storage
                // make sure token hasnt expired yet. if it has, refresh it
                // hit API to get activities from dynamodb. 

            

        }


        else{
            // case when we don't have a token in local storage, we have an access code
                // authorize with strava. persist token, refresh, expires at, and athlete ID in local storage

                const getAccessTokenAndActivities = async () => {
                    
                    let code = searchParams.get('code');
                    let response = await axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`);
                    let token = response.data.access_token;
                    let refresh = response.data.refresh_token;
                    let expiresAt = response.data.expires_at;
                    let athleteID = response.data.athlete.id;
            
                    localStorage.setItem('access_token', token);
                    localStorage.setItem('refresh_token', refresh);
                    localStorage.setItem('expires_at', expiresAt);
                    localStorage.setItem('athlete_id', athleteID);

                    // hit API to get activities into dynamodb

                }
            
                useEffect(() => {
                    getAccessTokenAndActivities();
                }, [])


        }

        

        

        return (
            <ul>
                {activities.map((activity) => {
                    return <li>{activity.name}</li>
                })}
            </ul>
        )
    }
}

export default LandingPage