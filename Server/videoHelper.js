import ffmpeg from 'fluent-ffmpeg'
import { uploadVideoFromFile } from './awsHelper.js';
import fs from 'fs';


export const generateVidFromS3 = (activityId) => {
    let url = `https://ridevisualizer.s3.us-east-2.amazonaws.com/${activityId}/frames/frame%d.webp`

    ffmpeg()
        .input(url) 
        .inputFPS(20) // Set the frame rate
        .complexFilter([
            "split=28[v1][v2][v3][v4][v5][v6][v7][v8][v9][v10][v11][v12][v13][v14][v15][v16][v17][v18][v19][v20][v21][v22][v23][v24][v25][v26][v27][v28]",
            "[v1]tpad=start_duration=0[v1out]",
            "[v2]tpad=start_duration=0.083[v2out]",
            "[v3]tpad=start_duration=0.166[v3out]",
            "[v4]tpad=start_duration=0.249[v4out]",
            "[v5]tpad=start_duration=0.332[v5out]",
            "[v6]tpad=start_duration=0.415[v6out]",
            "[v7]tpad=start_duration=0.498[v7out]",
            "[v8]tpad=start_duration=0.581[v8out]",
            "[v9]tpad=start_duration=0.664[v9out]",
            "[v10]tpad=start_duration=0.747[v10out]",
            "[v11]tpad=start_duration=0.830[v11out]",
            "[v12]tpad=start_duration=0.913[v12out]",
            "[v13]tpad=start_duration=0.996[v13out]",
            "[v14]tpad=start_duration=1.079[v14out]",
            "[v15]tpad=start_duration=1.162[v15out]",
            "[v16]tpad=start_duration=1.245[v16out]",
            "[v17]tpad=start_duration=1.328[v17out]",
            "[v18]tpad=start_duration=1.411[v18out]",
            "[v19]tpad=start_duration=1.494[v19out]",
            "[v20]tpad=start_duration=1.577[v20out]",
            "[v21]tpad=start_duration=1.660[v21out]",
            "[v22]tpad=start_duration=1.743[v22out]",
            "[v23]tpad=start_duration=1.826[v23out]",
            "[v24]tpad=start_duration=1.909[v24out]",
            "[v25]tpad=start_duration=1.992[v25out]",
            "[v26]tpad=start_duration=2.075[v26out]",
            "[v27]tpad=start_duration=2.158[v27out]",
            "[v28]tpad=start_duration=2.241[v28out]",
            "[v1out][v2out][v3out][v4out][v5out][v6out][v7out]hstack=inputs=7[top_row]",
            "[v8out][v9out][v10out][v11out][v12out][v13out][v14out]hstack=inputs=7[second_row]",
            "[v15out][v16out][v17out][v18out][v19out][v20out][v21out]hstack=inputs=7[third_row]",
            "[v22out][v23out][v24out][v25out][v26out][v27out][v28out]hstack=inputs=7[bottom_row]",
            "[top_row][second_row][third_row][bottom_row]vstack=inputs=4[grid]"
        ])
        .map('[grid]')
        .videoCodec('libx264')
        .addOption('-crf', '34', '-preset', 'ultrafast')
        .format('mp4')
        .output(`${activityId}.mp4`)
        // .output(videoStream) // Output
        .on('error', function(err) {
            console.error('Error:', err);
        })
        .on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', async function() {
            console.log('Video created successfully');
            await uploadVideoFromFile(activityId)
    
            fs.unlink(`${activityId}.mp4}`, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Successfully deleted local file:', `${activityId}.mp4`);
                }
            })
        })
        .run();
}

