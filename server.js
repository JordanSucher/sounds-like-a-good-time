// import dotenv from 'dotenv'
// dotenv.config()
import axios from 'axios'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
// import AWS from 'aws-sdk';
import fs from 'fs';
import cors from 'cors';
import { checkIfInS3, saveLatLongsToS3 } from './Server/awsHelper.js'
import { createFrames } from './Server/frameHelper.js'
import { generateVidFromS3 } from './Server/videoHelper.js'


const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

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
    const start = parseInt(req.query.start, 10) || 0;
    const end = parseInt(req.query.end, 10) || 150; // default chunk size
    const directoryPath = path.join(__dirname, 'accident-ride-frames-lofi-compressed');
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Server error');
        }

        // Sort and filter the files based on the frame number
        const sortedFilteredFiles = files
            .sort((a, b) => {
                const numA = parseInt(a.replace('frame', '').replace('-fs8.webp', ''), 10);
                const numB = parseInt(b.replace('frame', '').replace('-fs8.webp', ''), 10);
                return numA - numB; // sort in ascending order
            })
            .slice(start, end);

        res.json(sortedFilteredFiles);
    });
});

app.get('/api/video', async (req, res) => {
    let activityId = req.query.activityId;
    let activityInS3 = await checkIfInS3(activityId)
    let videoInS3 = await checkIfInS3(`${activityId}/video.mp4`)

    if (videoInS3) {
        res.json({ status: 'videoInS3' })
    } else if (activityInS3) {
        res.json({ status: 'activityInS3' })
    } else {
        res.json({ status: 'notInS3' })
    }

})

app.post('/api/video', async (req, res) => {
    let activityId = req.body.activityId;
    let latlongs = req.body.latlongs;
    res.send("Ok, generating video for activity " + activityId)

    // add latlongs to s3
    await saveLatLongsToS3(activityId, latlongs);

    // generate frames
    await createFrames(latlongs, activityId);

    // generate video
    generateVidFromS3(activityId);
})


app.use('*', (req, res) => {
    res.setHeader('Surrogate-Control', 'no-store'); 
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); 
    res.setHeader('Pragma', 'no-cache'); res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(8000, () => {
    console.log('listening on port 8000')
})