var express = require('express');
const Users = require("../model/Users.schema");
//expressjwt
var router = express.Router();

const WEATHER_KEY = process.env.WEATHER_KEY


router.post('/get-data', async function(req, res, next) {

    let date_time = new Date();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    console.log(hours + ":" + minutes + ":" + seconds);



    const BASE_URL = 'http://api.weatherapi.com/v1/';
    const query = req.body.query.q;
    console.log(query);

    let jsonData;
    let retries = 3; // Кількість спроб підключення

    while (retries > 0) {
        try {
            const response = await fetch(`${BASE_URL}forecast.json?&days=3&key=${WEATHER_KEY}&q=${query}&lang=uk`);
            console.log(`${BASE_URL}forecast.json?&days=3&key=${WEATHER_KEY}&q=${query}&lang=uk`);
            jsonData = await response.json();
            break; // Якщо підключення вдалося, виходимо з циклу
        } catch (error) {
            console.log('Error connecting to weather API:', error);

            if (error.code === 'ENOTFOUND') {
                retries--; // Зменшуємо кількість спроб, якщо помилка ENOTFOUND
                console.log(`Retrying connection. Retries left: ${retries}`);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Затримка перед повторним підключенням
            } else {
                // Якщо виникла інша помилка, зупиняємо цикл і обробляємо помилку
                console.log('Unhandled error occurred. Stopping retries.');
                throw error;
            }
        }
    }

    return res.status(200).json(jsonData);
});
module.exports = router;