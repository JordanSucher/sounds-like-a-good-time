import dotenv from "dotenv"
dotenv.config()
import AWS from "aws-sdk";
import { PassThrough } from "stream";
import {downloadTileFromMapboxToS3} from "./tileHelper.js";
import { sendProgress } from "./worker.js";


let bucketName = 'ridevisualizer'


AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

let s3 = new AWS.S3({apiVersion: '2006-03-01'});

export const checkIfInS3 = async (prefix) => {
    
    let {Contents} = await s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: prefix
    }).promise()

    return Contents.length > 0
}

export const getLatLongsFromS3 = async (activityId) => {
    let params = {
        Bucket: bucketName,
        Key: `${activityId}/latLongs.json`
    }
    let data = await s3.getObject(params).promise()
    return JSON.parse(data.Body)
}


export const getFileDirectory = async (prefix) => {
    let fileSet = new Set()
    let isTruncated = true
    let nextContinuationToken = null

    while (isTruncated) {
        let data = await s3.listObjectsV2({
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: nextContinuationToken  }).promise()

        data.Contents.forEach(file => fileSet.add(file.Key))
        isTruncated = data.IsTruncated
        nextContinuationToken = data.NextContinuationToken

            
    }
    
    return fileSet
}

export const getReadStream =  (key) => {
    let s3stream =  s3.getObject({
        Bucket: bucketName,
        Key: key
    }).createReadStream()
    
    return s3stream
}

const maxRetries = 3;  // Maximum number of retries
const backoffMultiplier = 2; // Backoff multiplier (e.g., wait 2, 4, 8 seconds)

const uploadWithRetry = async (activityId, tile, pass, attempt = 0) => {
    try {
        // Your upload logic here
        await s3.upload({
            Bucket: bucketName,
            Key: `${activityId}/tiles/x${tile.x}-y${tile.y}.webp`,
            Body: pass,
            ContentType: 'image/webp',
        }).promise();
    } catch (err) {
        if (attempt < maxRetries) {
            const delay = Math.pow(backoffMultiplier, attempt) * 1000; // Calculate delay
            console.log(`Upload failed, retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the delay
            return uploadWithRetry(attempt + 1); // Recursive call to retry
        } else {
            throw err; // If max retries reached, throw the error
        }
    }
};


export const uploadFromStream = async (activityId, tile, sourceStream) => {
    let pass = new PassThrough();
    sourceStream.pipe(pass);

    // Call the retry function
    await uploadWithRetry(activityId, tile, pass);

    // Clean up
    pass.destroy();
};


export const uploadFromBuffer = async (activityId, index, buffer) => {
    s3.upload({
        Bucket: bucketName,
        Key: `${activityId}/frames/frame${index}.webp`,
        Body: buffer,
        ContentType: 'image/webp',
    }, async (err, data) => {
        if (err) {
            await sendProgress(activityId, `failed to upload frame ${index}`)
            console.log(err)
        } else {
            await sendProgress(activityId, `uploaded frame ${index}`)
            console.log("success: ",data)
        }
    }).promise()

}

export const addTilesToS3 = async (activityId, tiles, fileDirectory, size) => {

    let promises = tiles.map(async tile => {
        let prefix = `${activityId}/tiles/x${tile.x}-y${tile.y}.webp`
        if (fileDirectory.has(prefix)) {
            return
        } else {
            await downloadTileFromMapboxToS3(tile, activityId, size)
        }   
    })
    
    await Promise.all(promises)
}

