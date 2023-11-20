import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { uploadFromStream } from "./awsHelper.js";
import { sendProgress } from "./worker.js";


// Tile Setup
export let z = 19;
let tileSize = 256;


const EARTH_CIRCUMFERENCE = 40075017; // Earth's circumference in meters

export let xSize = 360 / Math.pow(2, z);
export let ySize


export const setTileSize = (size) => {
  if (size == "large") {
    tileSize = 1024;
  } else {
    tileSize = 256;
  }
}

export const setZoom = (size) => {
  if (size == "large") {
    z = 17;
    xSize = 360 / Math.pow(2, z);
  } else {
    z = 19;
    xSize = 360 / Math.pow(2, z);
  }
}

export function setYSize(latLongs, size) {
  let centerLat =
    latLongs.map((latlng) => latlng[0]).reduce((a, b) => a + b, 0) /
    latLongs.length;

  let latRadians = centerLat * (Math.PI / 180);
  let adjustedZ
  if (size == 'large') {
    adjustedZ = z
  } else {
    adjustedZ = z
  }
  const metersPerPixel =
    (EARTH_CIRCUMFERENCE * Math.cos(latRadians)) /
    Math.pow(2, adjustedZ + Math.log2(tileSize));

  ySize = (metersPerPixel * tileSize) / 111320;
}

export function latLngToTile(lat, lng, zoom) {
  let xtile = parseInt(Math.floor(((lng + 180) / 360) * (1 << zoom)));
  let ytile = parseInt(
    Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        (1 << zoom)
    )
  );

  return { x: xtile, y: ytile };
}

export function tile2long(x, z) {
  let lng = (x / Math.pow(2, z)) * 360 - 180;
  return lng;
}

export function tile2lat(y, z) {
  let lat =
    Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / Math.pow(2, z)))) *
    (180 / Math.PI);
  return lat;
}

export const downloadTileFromMapboxToS3 = async (tile, activityId, size) => {
 
    let x = tile.x;
    let y = tile.y;

    let tileUrl = (size == "small") ? 
    `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}.webp?access_token=${process.env.MAPBOX_API_KEY}`
  : `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/17/${x}/${y}@2x?access_token=${process.env.MAPBOX_API_KEY}`
    try {
        const res = await axios({
            method: 'get',
            url: tileUrl,
            responseType: 'stream',
        });
        uploadFromStream(activityId, tile, res.data, size);
    } catch (err) {
        console.error("Error:", err);
        await sendProgress(activityId, `Error: ${err}`)
    }
}



// `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}@2x.webp?access_token=${process.env.MAPBOX_API_KEY}`