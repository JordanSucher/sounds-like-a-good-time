import dotenv from "dotenv"
dotenv.config()
import AWS from "aws-sdk";
import { PassThrough } from "stream";
import {downloadTileFromMapboxToS3} from "./tileHelper.js";
import fs from 'fs'
import { progressLog } from "../server.js";


let bucketName = 'ridevisualizer'


AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

let s3 = new AWS.S3({apiVersion: '2006-03-01'});

// to generate a visualization, client will hit api with the latLongs for the ride and the ride ID
// the api will need to...
    //  check if a folder for the ride exists in S3
    //  save the latLongs to S3 if they don't exist
    //  generate frames for the ride and save them to S3. For each frame, will need to either get tiles from S3 or from mapbox
    // generate a video from the frames and save it to S3
    // get the video link and somehow pass it to the client. maybe the client can infer the video link from the activity ID, check if it exists, and if it doesn't then allow the user to click generate visualization. or maybe the client can poll for the status of the video occasionally, server can check if video exists.


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

export const saveLatLongsToS3 = async (activityId, latLongs) => {
    if (await checkIfInS3(activityId)) {
        return
    } else {
        let params = {
            Bucket: bucketName,
            Key: `${activityId}/latLongs.json`,
            Body: JSON.stringify(latLongs)
        }
        console.log("saving latLongs to S3")
        if (progressLog[activityId])progressLog[activityId].push(`saving latLongs to S3`)
        await s3.putObject(params).promise()
    }    
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

export const uploadFromStream = async (activityId, tile, sourceStream) => {
    let pass = new PassThrough()
    sourceStream.pipe(pass)
    
    await s3.upload({
        Bucket: bucketName,
        Key: `${activityId}/tiles/x${tile.x}-y${tile.y}.webp`,
        Body: pass,
        ContentType: 'image/webp',
    }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
        }
    }).promise()

    // clean up
    pass.destroy();
}

export const uploadVideoFromFile = async (activityId) => {
    let path = `${activityId}.mp4`
    let stream = fs.createReadStream(path)

    await s3.upload({
        Bucket: bucketName,
        Key: `${activityId}/video.mp4`,
        Body: stream,
        ContentType: 'video/mp4',
    }, (err, data) => {
        if (err) {
            progressLog[activityId].push(`failed to upload video`)
            console.log(err)
        } else {
            progressLog[activityId].push(`uploaded video`)
            console.log("success: ",data)
        }
    }).promise()

    stream.destroy()

}

export const uploadFromBuffer = async (activityId, index, buffer) => {
    s3.upload({
        Bucket: bucketName,
        Key: `${activityId}/frames/frame${index}.webp`,
        Body: buffer,
        ContentType: 'image/webp',
    }, (err, data) => {
        if (err) {
            progressLog[activityId].push(`failed to upload frame ${index}`)
            console.log(err)
        } else {
            progressLog[activityId].push(`uploaded frame ${index}`)
            console.log("success: ",data)
        }
    }).promise()

}

export const addTilesToS3 = async (activityId, tiles, fileDirectory) => {

    let promises = tiles.map(async tile => {
        let prefix = `${activityId}/tiles/x${tile.x}-y${tile.y}.webp`
        if (fileDirectory.has(prefix)) {
            return
        } else {
            await downloadTileFromMapboxToS3(tile, activityId)
        }   
    })
    
    await Promise.all(promises)
}

