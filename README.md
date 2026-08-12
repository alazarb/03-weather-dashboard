# 🌤️ Weather Dashboard

A responsive weather dashboard built with HTML, CSS, JavaScript, Node.js, Express, and the OpenWeather API.

The goal of this project is not only to display weather numbers, but to turn those numbers into useful everyday advice.

## Features

- 🔎 Search weather by city
- 🌡️ Current temperature
- 🤔 Feels-like temperature
- 💧 Humidity
- 💨 Wind speed
- 🔽 Atmospheric pressure
- 🌅 Sunrise time
- 🌇 Sunset time
- 🌧️ Weather condition and icon
- 🇺🇸 Celsius / Fahrenheit conversion
- 👕 Smart clothing recommendations
- 🥾 Shoe recommendations
- 🧥 Cold-weather recommendations
- ☀️ Hot-weather recommendations
- ❄️ Freezing-weather recommendations
- ☔ Rain recommendations
- 🌬️ Wind recommendations
- ⚠️ Outdoor safety advice
- 🏃 Activity recommendations
- ⏳ Loading state
- ❌ Error handling
- 📱 Responsive design

## Smart Weather Advice

The application interprets weather conditions instead of simply displaying numbers.

For example:

- Below 0°C → freezing-weather protection
- 0–4°C → very cold clothing
- 5–11°C → cold-weather clothing
- 12–17°C → cool-weather clothing
- 18–24°C → comfortable clothing
- 25–29°C → warm-weather clothing
- 30–34°C → hot-weather recommendations
- 35°C+ → extreme-heat recommendations

The application also considers:

- Feels-like temperature
- Humidity
- Wind speed
- Rain
- Snow
- Thunderstorms

## Technologies

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- OpenWeather API
- Fetch API
- Git
- GitHub

## Project Structure

```text
03-weather-dashboard/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── app.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md