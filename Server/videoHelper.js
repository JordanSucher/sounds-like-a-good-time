import ffmpeg from 'fluent-ffmpeg'
import { uploadVideoFromFile } from './awsHelper.js';
import fs from 'fs';
import { progressLog } from "../server.js";



export const generateVidFromS3 = (activityId) => {
    let url = `https://ridevisualizer.s3.us-east-2.amazonaws.com/${activityId}/frames/frame%d.webp`

    ffmpeg()
        .input(url) 
        .inputFPS(20) // Set the frame rate
        .complexFilter([
            { filter: 'split', options: { outputs: 28 }, outputs: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'v20', 'v21', 'v22', 'v23', 'v24', 'v25', 'v26', 'v27', 'v28'] },
            { filter: 'tpad', options: { start_duration: 0 }, inputs: 'v1', outputs: 'v1out' },
            { filter: 'tpad', options: { start_duration: 0.083 }, inputs: 'v2', outputs: 'v2out' },
            { filter: 'tpad', options: { start_duration: 0.166 }, inputs: 'v3', outputs: 'v3out' },
            { filter: 'tpad', options: { start_duration: 0.249 }, inputs: 'v4', outputs: 'v4out' },
            { filter: 'tpad', options: { start_duration: 0.332 }, inputs: 'v5', outputs: 'v5out' },
            { filter: 'tpad', options: { start_duration: 0.415 }, inputs: 'v6', outputs: 'v6out' },
            { filter: 'tpad', options: { start_duration: 0.498 }, inputs: 'v7', outputs: 'v7out' },
            { filter: 'tpad', options: { start_duration: 0.581 }, inputs: 'v8', outputs: 'v8out' },
            { filter: 'tpad', options: { start_duration: 0.664 }, inputs: 'v9', outputs: 'v9out' },
            { filter: 'tpad', options: { start_duration: 0.747 }, inputs: 'v10', outputs: 'v10out' },
            { filter: 'tpad', options: { start_duration: 0.830 }, inputs: 'v11', outputs: 'v11out' },
            { filter: 'tpad', options: { start_duration: 0.913 }, inputs: 'v12', outputs: 'v12out' },
            { filter: 'tpad', options: { start_duration: 0.996 }, inputs: 'v13', outputs: 'v13out' },
            { filter: 'tpad', options: { start_duration: 1.079 }, inputs: 'v14', outputs: 'v14out' },
            { filter: 'tpad', options: { start_duration: 1.162 }, inputs: 'v15', outputs: 'v15out' },
            { filter: 'tpad', options: { start_duration: 1.245 }, inputs: 'v16', outputs: 'v16out' },
            { filter: 'tpad', options: { start_duration: 1.328 }, inputs: 'v17', outputs: 'v17out' },
            { filter: 'tpad', options: { start_duration: 1.411 }, inputs: 'v18', outputs: 'v18out' },
            { filter: 'tpad', options: { start_duration: 1.494 }, inputs: 'v19', outputs: 'v19out' },
            { filter: 'tpad', options: { start_duration: 1.577 }, inputs: 'v20', outputs: 'v20out' },
            { filter: 'tpad', options: { start_duration: 1.660 }, inputs: 'v21', outputs: 'v21out' },
            { filter: 'tpad', options: { start_duration: 1.743 }, inputs: 'v22', outputs: 'v22out' },
            { filter: 'tpad', options: { start_duration: 1.826 }, inputs: 'v23', outputs: 'v23out' },
            { filter: 'tpad', options: { start_duration: 1.909 }, inputs: 'v24', outputs: 'v24out' },
            { filter: 'tpad', options: { start_duration: 1.992 }, inputs: 'v25', outputs: 'v25out' },
            { filter: 'tpad', options: { start_duration: 2.075 }, inputs: 'v26', outputs: 'v26out' },
            { filter: 'tpad', options: { start_duration: 2.158 }, inputs: 'v27', outputs: 'v27out' },
            { filter: 'tpad', options: { start_duration: 2.241 }, inputs: 'v28', outputs: 'v28out' },
            { filter: 'hstack', options: { inputs: 7 }, inputs: ['v1out', 'v2out', 'v3out', 'v4out', 'v5out', 'v6out', 'v7out'], outputs: 'top_row' },
            { filter: 'hstack', options: { inputs: 7 }, inputs: ['v8out', 'v9out', 'v10out', 'v11out', 'v12out', 'v13out', 'v14out'], outputs: 'second_row' },
            { filter: 'hstack', options: { inputs: 7 }, inputs: ['v15out', 'v16out', 'v17out', 'v18out', 'v19out', 'v20out', 'v21out'], outputs: 'third_row' },
            { filter: 'hstack', options: { inputs: 7 }, inputs: ['v22out', 'v23out', 'v24out', 'v25out', 'v26out', 'v27out', 'v28out'], outputs: 'bottom_row' },
            { filter: 'vstack', options: { inputs: 4 }, inputs: ['top_row', 'second_row', 'third_row', 'bottom_row'], outputs: 'grid' }
        ])
        .map('[grid]')
        .videoCodec('libx264')
        .addOption('-crf', '34', '-preset', 'ultrafast', '-loglevel', 'debug')
        .format('mp4')
        .output(`${activityId}.mp4`)
        // .output(videoStream) // Output
        .on('error', function(err) {
            progressLog[activityId].push('Error generating video')
            console.error('Error:', err);
        })
        .on('progress', function(progress) {
            progressLog[activityId].push('Generating video: ' + progress.percent + '% done')
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', async function() {
            progressLog[activityId].push('Video created successfully')
            console.log('Video created successfully');
            await uploadVideoFromFile(activityId)
            progressLog[activityId].push("everything done")
    
            fs.unlink(`${activityId}.mp4`, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Successfully deleted local file:', `${activityId}.mp4`);
                }
            })
        })
        .run();
}

