import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomActivity = () => {
    let [activities, setActivities] = useState([]);
    let [error, setError] = useState(null);

    let getActivities = async () => {
        let data = localStorage.getItem('customActivities')
        setActivities(JSON.parse(data))
        console.log("custom activities", data)
    }

    useEffect(() => {
        getActivities()
    }, [])

    const saveActivity = async (e) => {
        e.preventDefault();
        let name = e.target[0].value
        let latlongsfile = e.target[1].files[0]
        let size = e.target[2].value
        console.log('size: ', size)
        if (latlongsfile) {
            // save to server
            let latlongs = await latlongsfile.text()
            try {
                await axios.post('/api/customactivities', { name, latlongs, size })
                // save to local storage
                let localActivities = JSON.parse(localStorage.getItem('customActivities')) || []
                localActivities.push(name)
                localStorage.setItem('customActivities', JSON.stringify(localActivities))
                // refresh activities
                setActivities(localActivities)
            localActivities.push(name)
            } catch (error) {
                console.log("could not save activity")   
                setError("Name is already in use") 
            }

            // clear name
            e.target.reset()
            // refresh activities
            getActivities()
        }
    }


    return (
        <div className="custom-activities">
            <h1>Custom Activity</h1>
            <p>Latlongs must be uploaded as a json file in the format [[lat, long], [lat, long], ...]</p>
            <form onSubmit={saveActivity}>
                <label>
                    Activity Name:
                    <input type="text" name="name" />
                </label>
                {error && <p style={{color: 'red', fontSize: '10px'}}>{error}</p>}
                <label>
                    Latlongs:
                    <input type="file" name="latlongs" />
                </label>
                <label>
                    Size:
                    <select>
                        <option value="small">Small Tiles</option>
                        <option value="large">Large Tiles</option>
                    </select>
                </label>
                <input className="submit" type="submit" value="Submit" />
            </form>

            <ul>
                {activities && activities.map(activity => {
                    return (
                    <li key={activity}>
                        <Link to={`/ride/${activity}?custom=true`}>{activity}</Link>
                    </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CustomActivity