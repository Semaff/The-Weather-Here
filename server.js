/*
  npm i -g nodemon - for autorefreshing the server after making changes in it

  npm i nedb - NEDataBase

  npm i express - framework for node

  npm i cross-fetch - for accessing 'fetch' function in server-side

  npm i dotenv - configuration file or environment variables (for API-keys)
*/

// Setting Server
const { fetch } = require('cross-fetch');
const express = require('express');
const Datastore = require('nedb');
require("dotenv").config();

const app = express();
app.listen(3000, () => console.log("Listening at 3000"));
app.use(express.static('public'));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore('database.db');
database.loadDatabase();

// Making GET requests and response for 'api' route/endpoint..
app.get('/api', (request, response) => {
    database.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }
        response.json(data)
    })
})

// Making POST requests and response for 'api' route/endpoint..
app.post('/api', (request, response) => {
    console.log(request.body);

    // Insert into a database
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);

    response.json({ data, status: "ok" })
})

// Making GET requests and response for 'api' route/endpoint..
app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(",");
    const latitude = latlon[0];
    const longitude = latlon[1];
    
    const weather_APIkey = process.env.API_KEY;
    const weather_APIurl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weather_APIkey}&units=metric`
    const openaq_APIurl = `https://api.openaq.org/v2/latest?city=London`

    const weaherResponse = await fetch(weather_APIurl);
    const weatherData = await weaherResponse.json();

    const openaqResponse = await fetch(openaq_APIurl).catch(err => console.log(err));
    const openaqData = await openaqResponse.json().catch(err => console.log(err));

    const data = {
        weather: weatherData,
        airQuality: openaqData
    }

    response.json(data);
})