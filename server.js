import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

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




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.get('/api/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'accident-ride-frames-lofi');
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

app.listen(8000, () => {
    console.log('listening on port 8000')
})