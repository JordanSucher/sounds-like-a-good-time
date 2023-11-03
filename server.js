import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';
import fs from 'fs';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getAthlete = async () => {
    try {
        let { data } = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        })

        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

app.use(express.static(path.join(__dirname, '.', 'dist')))

app.use(express.static(path.join(__dirname, '.', 'accident-ride-frames-lofi')))

app.use(express.static(path.join(__dirname, '.', 'accident-ride-frames-lofi-compressed')))





app.get('/', (req, res) => {
    res.setHeader('Surrogate-Control', 'no-store'); 
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); 
    res.setHeader('Pragma', 'no-cache'); res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.get('/api/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'accident-ride-frames-lofi-compressed');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Sort the files based on the frame number
        files.sort((a, b) => {
            // Extract frame numbers from the filenames
            const numA = parseInt(a.replace('frame', '').replace('.png', ''), 10);
            const numB = parseInt(b.replace('frame', '').replace('.png', ''), 10);
            return numA - numB;  // sort in ascending order
        });

        res.json(files);
    })
});

// app.get('/api/activities', async (req, res) => {
//     // connect to dynamoDB

//     var AWS = require('aws-sdk');
//     AWS.config.update({
//         region: 'us-east-2',
//         credentials: new AWS.SharedIniFileCredentials({ profile: 'default' }),

//     })

//     var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});






//     // if request has a flag, get latest activities from strava and add to what is in dynamodb
//     if (req.headers['update-activities']=='true') {
//         // get activities from strava
//         const { data } = await axios.get('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=50', {
//             headers: {
//                 Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
//             }
//         })

//         let newActivities = data.map(activity => {
//             return {
//                 id: activity.id,
//                 name: activity.name,
//                 date: activity.start_date,
//                 distance: activity.distance
//             }
//         })

//         // add activities to dynamodb


       
//     } else {
//         // return activities from dynamodb

//     }

// })


app.use('*', (req, res) => {
    res.setHeader('Surrogate-Control', 'no-store'); 
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); 
    res.setHeader('Pragma', 'no-cache'); res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(8000, () => {
    console.log('listening on port 8000')
})