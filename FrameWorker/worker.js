import AWS from 'aws-sdk'
import redis from 'redis'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();
import { createFrames } from './frameHelper.js'
import { getLatLongsFromS3 } from './awsHelper.js'



// Configure AWS S3
let bucketName = 'ridevisualizer'

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

let s3 = new AWS.S3({apiVersion: '2006-03-01'});


// Configure Redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    tls: {}
    
});

(async () => {
    await redisClient.connect();
    console.log('Redis client connected');
})();

const enqueueVideoGenerationTask = async (activityId, size) => {
    const queueName = 'video-queue'; // The same queue your worker listens on
    const task = { activityId, size };
    try {
        await redisClient.rPush(queueName, JSON.stringify(task));
    }
    catch (err) {
        console.error(err);
    }
};

// Function to poll or listen to Redis queue for new tasks
const pollQueue = async () => {
    const queueName = 'frame-queue';

    try {
        const message = await redisClient.lPop(queueName);
        if (message) {
            console.log("Received message:", message);
            let activityId = JSON.parse(message).activityId
            let size = JSON.parse(message).size

            let latlongs = await getLatLongsFromS3(activityId);
    
            await createFrames(latlongs, activityId, size);

            // after frames created, initiate video generation
            await enqueueVideoGenerationTask(activityId, size);
    
        }
    } catch (error) {
        console.error('Error polling queue:', error);
    } finally {
        setTimeout(pollQueue, 5000); // Poll every 5 seconds
    }
}










// Function to update your server on progress (possibly through HTTP requests or another Redis queue).
export const sendProgress = async (activityId, progress) => {
    let url = process.env.UPDATE_API_URL
    
    try {
        await axios.post("https://ride-visualizer.onrender.com/api/progress", {
            activityId: activityId,
            progress: progress
        })
    } catch (error) {
        console.log(error)
    }
}


// Main worker logic
function main() {
    pollQueue();
}

// Start the worker
main();

// Graceful shutdown and error handling
process.on('SIGINT', () => {
    console.log('Shutting down worker...');
    redisClient.quit();
    process.exit(0);
});

// Error handling
redisClient.on('error', (err) => console.log('Redis Client Error', err));
