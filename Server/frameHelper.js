// this code:
// grab a lat long
// translate it into tile coordinates
// grab that tile and its adjacent tiles
// create a micro canvas for that tile and adjacent tiles
// grab a a frame from that canvas that is centered on the lat long

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import sharp from "sharp";
import {
  addTilesToS3,
  getFileDirectory,
  uploadFromBuffer,
  getReadStream,
  checkIfInS3,
} from "./awsHelper.js";
import {
  z,
  setYSize,
  latLngToTile,
  tile2long,
  tile2lat,
  ySize,
  xSize,
} from "./tileHelper.js";

const frameWidth = 256;
const frameHeight = 256;
const MAX_RETRIES = 3; // Maximum number of retries

async function fetchWithRetry(url, retries = 0) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const delay = Math.pow(2, retries) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries + 1);
    } else {
      throw error; // Rethrow error after max retries
    }
  }
}



async function generateFrame(canvasInput, coord, frameIndex, activityId) {
  let left = coord.x;
  let top = coord.y;
  left = parseInt(left) - frameWidth / 2;
  top = parseInt(top) - frameHeight / 2;

  console.log(`Generating frame: ${frameIndex}`);
  console.log(`Left: ${left}, Top: ${top}`);
  console.log(`Frame dimensions: ${frameWidth}x${frameHeight}`);

  try {
    let canvas = await sharp({
      create: {
        width: 3 * frameWidth,
        height: 3 * frameHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
      limitInputPixels: false,
    })
      .composite(canvasInput)
      // .toFile(`${outputPath}/frame${frameIndex}.png`);
      .toBuffer()
      .then(async (data) => {
        await sharp(data, {
          limitInputPixels: false,
          raw: { width: 3 * frameWidth, height: 3 * frameHeight, channels: 4 },
        })
          .extract({ left, top, width: frameWidth, height: frameHeight })
          .webp({ quality: 70 })
          .toBuffer()
          .then((buffer) => {
            uploadFromBuffer(activityId, frameIndex, buffer);
          });
      });
  } catch (err) {
    console.error(`Error generating frame ${frameIndex}:`, err);
  }
}

export const createFrames = async (latLongs, activityId, zoom = z) => {
  // step 0 : get file directory
  let fileDirectory = await getFileDirectory(`${activityId}/tiles`);

  // step 0.5: set ysize
  setYSize(latLongs, zoom);

  // parallel processing w batch size of 20
  let batchSize = 20;

  for (let i = 0; i < latLongs.length; i += batchSize) {
    let batch = latLongs.slice(i, i + batchSize);

    let promises = batch.map(async (latLong, index) => {
      let globalIndex = i + index;

      try {
        // step 0.75: check if frame exists and if so skip
        if (
          (await checkIfInS3(
            `${activityId}/frames/frame${globalIndex}.webp`
          )) == true
        ) {
          console.log("Frame exists, skipping");
          return;
        }

        // step 1: get relevant tile coordinates, then get adjacent tiles
        let tile = latLngToTile(latLong[0], latLong[1], zoom);
        let tileSet = [tile];
        tileSet.push({ x: tile.x + 1, y: tile.y });
        tileSet.push({ x: tile.x - 1, y: tile.y });
        tileSet.push({ x: tile.x, y: tile.y + 1 });
        tileSet.push({ x: tile.x, y: tile.y - 1 });
        tileSet.push({ x: tile.x + 1, y: tile.y + 1 });
        tileSet.push({ x: tile.x - 1, y: tile.y - 1 });
        tileSet.push({ x: tile.x - 1, y: tile.y + 1 });
        tileSet.push({ x: tile.x + 1, y: tile.y - 1 });

        // step 2: create a canvas:
        let minX = Math.min(...tileSet.map((tile) => tile.x));
        let minY = Math.min(...tileSet.map((tile) => tile.y));

        // step 3,ensure that tiles are in S3

        await addTilesToS3(activityId, tileSet, fileDirectory);

        console.log("done adding tiles to S3");

        // step 4:assemble canvas input

        let promises = tileSet.map(async (tile) => {
          try {
            let url = `https://ridevisualizer.s3.us-east-2.amazonaws.com/${activityId}/tiles/x${tile.x}-y${tile.y}.webp`;
            let data = await fetchWithRetry(url);

            let buffer = Buffer.from(data);

            return {
              input: buffer,
              left: (tile.x - minX) * frameWidth,
              top: (tile.y - minY) * frameHeight,
            };
          } catch (err) {
            console.log(err, `x${tile.x}-y${tile.y}.webp`);
          }
        });
        let canvasInput = await Promise.all(promises);

        // step 5: figure out frame offsets
        let tileLat = tile2lat(tile.y, zoom);
        let tileLong = tile2long(tile.x, zoom);

        let longOffset = (latLong[1] - tileLong) / xSize;
        let latOffset = (latLong[0] - tileLat) / ySize;

        let xOffset = longOffset * frameWidth;
        let yOffset = latOffset * frameHeight;

        let frameCoord = {
          x: parseInt((tile.x - minX) * frameWidth + xOffset),
          y: parseInt((tile.y - minY) * frameHeight - yOffset),
        };

        // step 6: grab the frame
        await generateFrame(canvasInput, frameCoord, globalIndex, activityId);
      } catch (err) {
        console.error(`Error generating frame ${globalIndex}:`, err);
      }
    });

    await Promise.all(promises);
  }

  console.log("done creating frames");

};

// let latLongs = sampleLatLongs;
// let activityId = "10030777511";

// createFrames(latLongs, activityId);
