require("dotenv").config();

const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.static("public"));

app.get("/api/weather", async function (req, res) {

    try {

        const city = "Addis Ababa";

        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {

            return res.status(500).json({
                error: "Weather API key is not configured."
            });

        }

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {

            return res.status(response.status).json({
                error: "Unable to fetch weather data."
            });

        }

        const data = await response.json();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error while fetching weather."
        });

    }

});

app.listen(PORT, function () {

    console.log("Server running on port " + PORT);

});