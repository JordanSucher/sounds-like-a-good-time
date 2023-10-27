require('dotenv').config()



var strava = require('strava-v3')
strava.config({
  "access_token"  : process.env.ACCESS_TOKEN,
  "client_id"     : process.env.CLIENT_ID,
  "client_secret" : process.env.CLIENT_SECRET,
  "redirect_uri"  : process.env.REDIRECT_URI,
});

