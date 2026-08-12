const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const weatherCard = document.getElementById("weatherCard");
const adviceCard = document.getElementById("adviceCard");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const lastUpdated = document.getElementById("lastUpdated");

const clothingAdvice = document.getElementById("clothingAdvice");
const weatherMeaning = document.getElementById("weatherMeaning");
const humidityAdvice = document.getElementById("humidityAdvice");
const windAdvice = document.getElementById("windAdvice");
const outdoorAdvice = document.getElementById("outdoorAdvice");
const activityAdvice = document.getElementById("activityAdvice");

const celsiusButton = document.getElementById("celsiusButton");
const fahrenheitButton = document.getElementById("fahrenheitButton");

let currentWeather = null;
let currentUnit = "C";


/* =========================
   SEARCH
   ========================= */

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    loadWeather(city);
});


/* =========================
   CELSIUS
   ========================= */

celsiusButton.addEventListener("click", function () {
    if (currentUnit === "C") {
        return;
    }

    currentUnit = "C";

    celsiusButton.classList.add("active");
    fahrenheitButton.classList.remove("active");

    if (currentWeather) {
        displayWeather(currentWeather);
    }
});


/* =========================
   FAHRENHEIT
   ========================= */

fahrenheitButton.addEventListener("click", function () {
    if (currentUnit === "F") {
        return;
    }

    currentUnit = "F";

    fahrenheitButton.classList.add("active");
    celsiusButton.classList.remove("active");

    if (currentWeather) {
        displayWeather(currentWeather);
    }
});


/* =========================
   LOAD WEATHER
   ========================= */

async function loadWeather(city) {
    showLoading();

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to find weather for that city."
            );
        }

        if (!data.main || !data.weather || !data.sys) {
            throw new Error("The weather data is incomplete.");
        }

        currentWeather = data;

        displayWeather(data);

    } catch (error) {
        console.error(error);

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );
    }
}


/* =========================
   DISPLAY WEATHER
   ========================= */

function displayWeather(data) {
    hideLoading();
    hideError();

    weatherCard.classList.remove("hidden");
    adviceCard.classList.remove("hidden");

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    description.textContent =
        data.weather[0].description;

    const iconCode = data.weather[0].icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    let temp = data.main.temp;
    let feels = data.main.feels_like;

    if (currentUnit === "F") {
        temp = celsiusToFahrenheit(temp);
        feels = celsiusToFahrenheit(feels);
    }

    temperature.textContent =
        `${Math.round(temp)}°${currentUnit}`;

    feelsLike.textContent =
        `${Math.round(feels)}°${currentUnit}`;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    sunrise.textContent =
        formatTime(data.sys.sunrise);

    sunset.textContent =
        formatTime(data.sys.sunset);

    lastUpdated.textContent =
        new Date().toLocaleTimeString();

    generateSmartAdvice(data);
}


/* =========================
   SMART WEATHER ADVICE
   ========================= */

function generateSmartAdvice(data) {

    const temperatureC = data.main.temp;
    const feelsLikeC = data.main.feels_like;

    const humidityValue = data.main.humidity;
    const windSpeed = data.wind.speed;

    const condition =
        data.weather[0].main.toLowerCase();


    const isRain =
        condition === "rain" ||
        condition === "drizzle";

    const isThunderstorm =
        condition === "thunderstorm";

    const isSnow =
        condition === "snow";

    const isClear =
        condition === "clear";

    const isCloudy =
        condition === "clouds";


    /*
        FEELS-LIKE temperature is used for clothing
        because it better represents how the weather
        actually feels to a person.
    */

    const clothingTemp = feelsLikeC;

    const clothes = [];


    /* =========================
       FREEZING / EXTREME COLD
       ========================= */

    if (clothingTemp < 0) {

        clothes.push("🧥 Heavy insulated winter coat");
        clothes.push("🧶 Thermal base layer");
        clothes.push("👕 Warm sweater or fleece");
        clothes.push("👖 Thick trousers");
        clothes.push("🧦 Thick warm socks");
        clothes.push("🥾 Insulated waterproof boots");
        clothes.push("🧤 Gloves");
        clothes.push("🧣 Scarf");
        clothes.push("🧢 Warm winter hat");

    }


    /* =========================
       VERY COLD
       ========================= */

    else if (clothingTemp < 5) {

        clothes.push("🧥 Heavy winter coat");
        clothes.push("🧶 Warm sweater");
        clothes.push("👖 Thick trousers or jeans");
        clothes.push("🧦 Warm socks");
        clothes.push("🥾 Boots or closed shoes");
        clothes.push("🧤 Gloves");
        clothes.push("🧣 Scarf");
        clothes.push("🧢 Warm hat");

    }


    /* =========================
       COLD
       ========================= */

    else if (clothingTemp < 12) {

        clothes.push("🧥 Warm jacket or coat");
        clothes.push("👕 Long-sleeve shirt");
        clothes.push("👖 Long trousers or jeans");
        clothes.push("🧦 Warm socks");
        clothes.push("🥾 Boots or closed shoes");

    }


    /* =========================
       COOL
       ========================= */

    else if (clothingTemp < 18) {

        clothes.push("🧥 Light jacket or hoodie");
        clothes.push("👕 Long-sleeve shirt");
        clothes.push("👖 Jeans or long trousers");
        clothes.push("🧦 Normal socks");
        clothes.push("👟 Closed sneakers");

    }


    /* =========================
       COMFORTABLE
       ========================= */

    else if (clothingTemp < 25) {

        clothes.push("👕 T-shirt or light shirt");
        clothes.push("👖 Jeans, chinos, or lightweight trousers");
        clothes.push("👟 Sneakers or comfortable shoes");
        clothes.push("🧦 Lightweight socks");

    }


    /* =========================
       WARM
       ========================= */

    else if (clothingTemp < 30) {

        clothes.push("👕 Lightweight breathable shirt");
        clothes.push("🩳 Shorts or lightweight trousers");
        clothes.push("👟 Breathable sneakers or sandals");
        clothes.push("🧢 Cap or hat");
        clothes.push("🕶️ Sunglasses");

    }


    /* =========================
       HOT
       ========================= */

    else if (clothingTemp < 35) {

        clothes.push("👕 Very lightweight breathable clothing");
        clothes.push("🩳 Loose shorts or lightweight trousers");
        clothes.push("👟 Breathable shoes or sandals");
        clothes.push("🧢 Hat or cap");
        clothes.push("🕶️ Sunglasses");
        clothes.push("💧 Carry water");

    }


    /* =========================
       EXTREME HEAT
       ========================= */

    else {

        clothes.push("👕 Very lightweight loose clothing");
        clothes.push("🩳 Loose shorts or lightweight trousers");
        clothes.push("👟 Breathable sandals or shoes");
        clothes.push("🧢 Wide-brimmed hat or cap");
        clothes.push("🕶️ Sunglasses");
        clothes.push("💧 Carry plenty of water");

    }


    /* =========================
       RAIN
       ========================= */

    if (isRain) {

        clothes.push("☔ Carry an umbrella");
        clothes.push("🧥 Waterproof or water-resistant jacket");
        clothes.push("🥾 Water-resistant shoes or boots");

    }


    /* =========================
       SNOW
       ========================= */

    if (isSnow) {

        clothes.push("🥾 Waterproof insulated boots");
        clothes.push("🧤 Waterproof gloves");

    }


    /* =========================
       STRONG WIND
       ========================= */

    if (windSpeed >= 8) {

        clothes.push("🌬️ Add a wind-resistant outer layer");

    }


    /* =========================
       HUMIDITY
       ========================= */

    if (
        humidityValue >= 80 &&
        temperatureC >= 20
    ) {

        clothes.push(
            "💧 Choose breathable fabrics because the air is humid"
        );

    }


    /* =========================
       DISPLAY CLOTHING
       ========================= */

    clothingAdvice.innerHTML = "";

    clothes.forEach(function (item) {

        const li = document.createElement("li");

        li.textContent = item;

        clothingAdvice.appendChild(li);

    });


    /* =========================
       WEATHER MEANING
       ========================= */

    let meaning;


    if (clothingTemp < 0) {

        meaning =
            "It feels freezing outside. Prolonged exposure can be uncomfortable and potentially dangerous, so warm layers and protection for exposed skin are important.";

    }

    else if (clothingTemp < 5) {

        meaning =
            "It feels very cold outside. A proper winter coat and several warm layers are recommended.";

    }

    else if (clothingTemp < 12) {

        meaning =
            "It feels cold outside. Most people will be more comfortable wearing a warm jacket or coat.";

    }

    else if (clothingTemp < 18) {

        meaning =
            "It feels cool outside. A light jacket or hoodie should keep you comfortable.";

    }

    else if (clothingTemp < 25) {

        meaning =
            "The temperature feels comfortable for most everyday activities.";

    }

    else if (clothingTemp < 30) {

        meaning =
            "It feels warm outside. Lightweight clothing should be comfortable for most people.";

    }

    else if (clothingTemp < 35) {

        meaning =
            "It feels hot outside. Lightweight breathable clothing and regular hydration are recommended.";

    }

    else {

        meaning =
            "It feels extremely hot outside. Try to avoid prolonged exposure to the heat, stay hydrated, and seek shade when possible.";

    }


    if (isClear) {

        meaning +=
            " The sky is clear, so direct sunlight may make it feel warmer.";

    }


    if (isCloudy) {

        meaning +=
            " Cloud cover reduces direct sunlight and may make the conditions feel cooler.";

    }


    if (isRain) {

        meaning +=
            " Rain is present, so keeping yourself and your shoes dry is important.";

    }


    if (isSnow) {

        meaning +=
            " Snow is present, so warm and water-resistant clothing is recommended.";

    }


    weatherMeaning.textContent = meaning;


    /* =========================
       HUMIDITY
       ========================= */

    if (temperatureC <= 5) {

        if (humidityValue >= 80) {

            humidityAdvice.textContent =
                "Humidity is very high, but because the temperature is cold, the main concern is cold exposure rather than heat discomfort.";

        }

        else if (humidityValue >= 50) {

            humidityAdvice.textContent =
                "Humidity is moderate to high. In cold conditions, damp clothing can make you feel colder, so staying dry is important.";

        }

        else {

            humidityAdvice.textContent =
                "The air is relatively dry for these cold conditions. Protect exposed skin from the cold and wind.";

        }

    }

    else if (temperatureC < 18) {

        if (humidityValue < 30) {

            humidityAdvice.textContent =
                "The air is quite dry. You may notice dry skin or throat in these cooler conditions.";

        }

        else if (humidityValue < 60) {

            humidityAdvice.textContent =
                "Humidity is at a comfortable level for most people.";

        }

        else {

            humidityAdvice.textContent =
                "Humidity is moderately high. Damp conditions can make cool weather feel less comfortable.";

        }

    }

    else {

        if (humidityValue < 30) {

            humidityAdvice.textContent =
                "The air is quite dry. You may notice dry skin or throat, especially during longer outdoor activities.";

        }

        else if (humidityValue < 60) {

            humidityAdvice.textContent =
                "Humidity is at a comfortable level for most people.";

        }

        else if (humidityValue < 80) {

            humidityAdvice.textContent =
                "Humidity is moderately high. Warm weather may feel more uncomfortable than the temperature alone suggests.";

        }

        else {

            humidityAdvice.textContent =
                "Humidity is very high. Sweat evaporates more slowly, which can make warm weather feel significantly more uncomfortable.";

        }

    }


    /* =========================
       WIND
       ========================= */

    if (windSpeed < 2) {

        windAdvice.textContent =
            "The air is mostly calm with very little noticeable wind.";

    }

    else if (windSpeed < 6) {

        windAdvice.textContent =
            "There is a light breeze. Wind should not significantly affect most outdoor plans.";

    }

    else if (windSpeed < 10) {

        if (temperatureC <= 5) {

            windAdvice.textContent =
                "The wind is noticeable and can make cold conditions feel significantly colder. A wind-resistant outer layer is recommended.";

        }

        else {

            windAdvice.textContent =
                "The wind is noticeable. A light outer layer may make you more comfortable.";

        }

    }

    else if (windSpeed < 15) {

        windAdvice.textContent =
            "Strong wind is present. It can make the temperature feel colder and may make some outdoor activities uncomfortable.";

    }

    else {

        windAdvice.textContent =
            "Very strong wind is present. Consider avoiding unnecessary outdoor activities.";

    }


    /* =========================
       OUTDOOR ADVICE
       ========================= */

    let outdoor;


    if (isThunderstorm) {

        outdoor =
            "⚠️ Avoid unnecessary outdoor activity during a thunderstorm. Stay indoors when possible.";

    }

    else if (clothingTemp < 0) {

        outdoor =
            "🥶 Freezing conditions are present. Avoid prolonged outdoor exposure and dress in several warm layers.";

    }

    else if (clothingTemp < 5) {

        outdoor =
            "❄️ It is very cold outside. Outdoor activity is possible with proper winter clothing, but limit prolonged exposure.";

    }

    else if (temperatureC >= 35) {

        outdoor =
            "🥵 Extreme heat is present. Avoid prolonged outdoor activity, seek shade, drink water, and avoid the hottest part of the day.";

    }

    else if (temperatureC >= 30) {

        outdoor =
            "🔥 It is hot outside. Outdoor activity is possible, but stay hydrated, take breaks, and seek shade.";

    }

    else if (
        isRain &&
        windSpeed >= 10
    ) {

        outdoor =
            "⚠️ Rain combined with strong wind can make outdoor conditions unpleasant and potentially hazardous.";

    }

    else if (isRain) {

        outdoor =
            "☔ You can go outside, but bring an umbrella and wear water-resistant footwear.";

    }

    else if (windSpeed >= 15) {

        outdoor =
            "⚠️ Very strong wind may make outdoor conditions unsafe or uncomfortable. Consider staying indoors.";

    }

    else {

        outdoor =
            "✅ Conditions look reasonable for going outside with the recommended clothing.";

    }


    outdoorAdvice.textContent = outdoor;


    /* =========================
       ACTIVITY
       ========================= */

    let activity;


    if (isThunderstorm) {

        activity =
            "🏠 Indoor activities are recommended. Avoid outdoor sports during thunderstorms.";

    }

    else if (clothingTemp < 0) {

        activity =
            "🏠 Indoor activities are preferable. If you must go outside, keep outdoor time limited and wear proper winter protection.";

    }

    else if (temperatureC >= 35) {

        activity =
            "🧘 Light indoor or low-intensity activities are better. Avoid intense outdoor exercise during extreme heat.";

    }

    else if (temperatureC >= 30) {

        activity =
            "🚶 Light outdoor activities are possible, preferably during cooler parts of the day. Stay hydrated.";

    }

    else if (isRain) {

        activity =
            "☔ Short outdoor activities are possible with rain protection. Indoor activities may be more comfortable.";

    }

    else if (
        temperatureC >= 18 &&
        temperatureC < 28 &&
        windSpeed < 8
    ) {

        activity =
            "🏃 Great conditions for walking, running, sports, or other outdoor activities.";

    }

    else {

        activity =
            "🚶 Normal outdoor activities should be comfortable with appropriate clothing.";

    }


    activityAdvice.textContent = activity;
}


/* =========================
   CELSIUS → FAHRENHEIT
   ========================= */

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}


/* =========================
   UNIX TIME → CLOCK TIME
   ========================= */

function formatTime(timestamp) {

    return new Date(timestamp * 1000)
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}


/* =========================
   LOADING
   ========================= */

function showLoading() {

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");

    adviceCard.classList.add("hidden");

    errorMessage.classList.add("hidden");
}


function hideLoading() {
    loading.classList.add("hidden");
}


/* =========================
   ERROR
   ========================= */

function showError(message) {

    loading.classList.add("hidden");

    weatherCard.classList.add("hidden");

    adviceCard.classList.add("hidden");

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");
}


function hideError() {
    errorMessage.classList.add("hidden");
}


/* =========================
   INITIAL CITY
   ========================= */

loadWeather("Addis Ababa");