import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { uploadFromStream } from "./awsHelper.js";
import { progressLog } from "../server.js";


// Tile Setup
export const z = 19;
const tileSize = 256;

const EARTH_CIRCUMFERENCE = 40075017; // Earth's circumference in meters

export const xSize = 360 / Math.pow(2, z);
export let ySize

export function setYSize(latLongs) {
  let centerLat =
    latLongs.map((latlng) => latlng[0]).reduce((a, b) => a + b, 0) /
    latLongs.length;

  let latRadians = centerLat * (Math.PI / 180);

  const metersPerPixel =
    (EARTH_CIRCUMFERENCE * Math.cos(latRadians)) /
    Math.pow(2, z + Math.log2(tileSize));

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

export const downloadTileFromMapboxToS3 = async (tile, activityId) => {
 
    let x = tile.x;
    let y = tile.y;

    let tileUrl = `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}.webp?access_token=${process.env.MAPBOX_API_KEY}`

    try {
        const res = await axios({
            method: 'get',
            url: tileUrl,
            responseType: 'stream',
        });
        uploadFromStream(activityId, tile, res.data);
    } catch (err) {
        console.error("Error:", err);
        progressLog[activityId].push(`Error: ${err}`)
    }
}
