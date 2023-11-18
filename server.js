import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
// import AWS from 'aws-sdk';
import fs from 'fs';
import cors from 'cors';
import { checkIfInS3, saveLatLongsToS3, getFileDirectory, getLatLongsFromS3 } from './Server/awsHelper.js'
import { createFrames } from './Server/frameHelper.js'
import redis from 'redis'
export let progressLog = {}

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    tls: {} //
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
    await redisClient.connect();
    console.log('Redis client connected');
})();

process.on('SIGINT', () => {
    redisClient.quit().then(() => {
        console.log('Redis client disconnected');
        process.exit(0);
    });
});



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

app.get('/api/simplestatus', async (req, res) => {
    let activityId = req.query.activityId;
    let activityInS3 = await checkIfInS3(activityId)
    let videoInS3 = await checkIfInS3(`${activityId}/video.mp4`)

    if (videoInS3) {
        res.json({ status: 'videoInS3' })
    } else if (activityInS3) {
        res.json({ 
            status: 'activityInS3',
            progress: progressLog[activityId] ? progressLog[activityId].length : 0})
    } else {
        res.json({ status: 'notInS3' })
    }
})

app.get('/api/customactivities', async (req, res) => {
    let activities = await getFileDirectory(`custom`)
    let activitiesArray = Array.from(activities)
    let deduped = new Set()
    activitiesArray.map(activity => {
        let parsed = activity.split('/')
        let result = parsed ? parsed[1] : activity
        deduped.add(result)
    })
    let dedupedArray = Array.from(deduped)

    res.send(dedupedArray)
})

app.post('/api/customactivities', async (req, res) => {
    let name = req.body.name;
    let latlongs = req.body.latlongs;
    let latlongsjson = JSON.parse(latlongs)
    let size = req.body.size;
    await saveLatLongsToS3(`custom/${name}`, latlongsjson)
    progressLog[`custom/${name}`] = [`created custom activity ${name}`]
    let url = 'http://soundslikeagoodti.me/api/video'
    if (process.env.ENVIRONMENT == 'dev') url = 'http://localhost:8000/api/video'
    try {
        await axios.post(url, {
            activityId: `custom/${name}`,
            latlongs: latlongs,
            size: size
        })
    } catch (error) {
        console.log(error)
    }
    res.send("Ok, saved " + name)

})


app.get('/api/progress', (req, res) => {
    let activityId = req.query.activityId
    // fs.writeFileSync('./progressLog.json', JSON.stringify(progressLog, null, 2))
    if (progressLog[activityId]) progressLog[activityId] = progressLog[activityId].slice(-50)
    res.send(progressLog[activityId])
})

app.post('/api/progress', (req, res) => {
    let activityId = req.body.activityId;
    let progress = req.body.progress;
    progressLog[activityId].push(progress) // add progress
    res.send("Ok, updated progress for activity " + activityId)
})


const enqueueFrameGenerationTask = async (activityId, size) => {
    const queueName = 'frame-queue'; // The same queue your worker listens on
    const task = { activityId, size };
    try {
        await redisClient.rPush(queueName, JSON.stringify(task));
    }
    catch (err) {
        console.error(err);
    }
};

app.post('/api/video', async (req, res) => {
    let activityId = req.body.activityId;
    let latlongs = req.body.latlongs;
    let size = req.body.size;
    let videosize = size
    if (size !== "large") videosize = "small"
    res.send("Ok, generating video for activity " + activityId)

    progressLog[activityId] = []

    // add latlongs to s3, if not custom
    if (activityId.split('/')[0] !== 'custom') {
        await saveLatLongsToS3(activityId, latlongs);
    } else {
        // get latlongs from s3
        latlongs = await getLatLongsFromS3(activityId);
    }

    // generate frame generation task
    await enqueueFrameGenerationTask(activityId, videosize);

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