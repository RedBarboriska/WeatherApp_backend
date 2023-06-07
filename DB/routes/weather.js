var express = require('express');
const Users = require("../model/Users.schema");
//expressjwt
var router = express.Router();

const WEATHER_KEY = process.env.WEATHER_KEY

router.post('/get-data', async function(req, res, next) {
    const BASE_URL = 'http://api.weatherapi.com/v1/'
    const query=req.body.query.q
    console.log("query")
    console.log(query)
    const response = await fetch(`${BASE_URL}forecast.json?&days=3&key=${WEATHER_KEY}&q=${query}&lang=uk`);
    const jsonData = await response.json();
    console.log(`${BASE_URL}forecast.json?&days=3&key=${WEATHER_KEY}&q=${query}&lang=uk`)
    console.log(jsonData)
    return res.status(200).json(jsonData);
});
module.exports = router;