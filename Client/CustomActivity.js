import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomActivity = () => {
    let [activities, setActivities] = useState([]);

    let getActivities = async () => {
        let { data } = await axios.get('/api/customactivities')
        setActivities(data)
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
        if (latlongsfile) {
            let latlongs = await latlongsfile.text()
            let { data } = await axios.post('/api/customactivities', { name, latlongs, size })
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
                {activities.map(activity => {
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