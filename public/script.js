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

const clothingAdvice = document.getElementById("clothingAdvice");
const weatherMeaning = document.getElementById("weatherMeaning");
const outdoorAdvice = document.getElementById("outdoorAdvice");
const activityAdvice = document.getElementById("activityAdvice");

const celsiusButton = document.getElementById("celsiusButton");
const fahrenheitButton = document.getElementById("fahrenheitButton");


let currentWeather = null;

let currentUnit = "C";


/* SEARCH */

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {

        showError("Please enter a city name.");

        return;
    }

    loadWeather(city);

});


/* CELSIUS */

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


/* FAHRENHEIT */

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


/* LOAD WEATHER */

async function loadWeather(city) {

    showLoading();

    try {

        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Unable to load weather."
            );

        }

        currentWeather = data;

        displayWeather(data);

    } catch (error) {

        console.error(error);

        showError(error.message);

    }

}


/* DISPLAY WEATHER */

function displayWeather(data) {

    hideLoading();

    hideError();

    weatherCard.classList.remove("hidden");

    adviceCard.classList.remove("hidden");


    cityName.textContent =
        `${data.name}, ${data.sys.country}`;


    description.textContent =
        data.weather[0].description;


    const iconCode =
        data.weather[0].icon;


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


    generateSmartAdvice(data);

}


/* SMART ADVICE ENGINE */

function generateSmartAdvice(data) {

    const temp = data.main.temp;

    const feels = data.main.feels_like;

    const humidityValue = data.main.humidity;

    const windSpeed = data.wind.speed;

    const weatherCondition =
        data.weather[0].main.toLowerCase();

    const descriptionText =
        data.weather[0].description.toLowerCase();


    const isRain =
        weatherCondition === "rain" ||
        weatherCondition === "drizzle";


    const isThunderstorm =
        weatherCondition === "thunderstorm";


    const isSnow =
        weatherCondition === "snow";


    const isClear =
        weatherCondition === "clear";


    const isCloudy =
        weatherCondition === "clouds";


    /* CLOTHING */

    const clothes = [];


    if (temp < 5) {

        clothes.push("🧥 Heavy insulated coat");

        clothes.push("🧶 Warm sweater or thermal layer");

        clothes.push("👖 Thick trousers");

        clothes.push("🧦 Thick warm socks");

        clothes.push("🥾 Insulated boots");

        clothes.push("🧤 Gloves");

        clothes.push("🧣 Scarf");

        clothes.push("🧢 Warm hat");

    }

    else if (temp < 12) {

        clothes.push("🧥 Warm jacket or coat");

        clothes.push("👕 Long-sleeve shirt");

        clothes.push("👖 Long trousers or jeans");

        clothes.push("🧦 Normal or warm socks");

        clothes.push("🥾 Boots or closed shoes");

    }

    else if (temp < 18) {

        clothes.push("🧥 Light jacket or hoodie");

        clothes.push("👕 Long-sleeve shirt");

        clothes.push("👖 Jeans or long trousers");

        clothes.push("👟 Closed sneakers");

        clothes.push("🧦 Normal socks");

    }

    else if (temp < 25) {

        clothes.push("👕 T-shirt or light long-sleeve shirt");

        clothes.push("👖 Jeans, chinos, or lightweight trousers");

        clothes.push("👟 Sneakers or comfortable shoes");

        clothes.push("🧦 Lightweight socks");

    }

    else if (temp < 32) {

        clothes.push("👕 Lightweight breathable shirt");

        clothes.push("🩳 Shorts or lightweight trousers");

        clothes.push("👟 Breathable sneakers or sandals");

        clothes.push("🧢 Cap or hat");

        clothes.push("🕶️ Sunglasses");

    }

    else {

        clothes.push("👕 Very lightweight breathable clothing");

        clothes.push("🩳 Loose shorts or lightweight trousers");

        clothes.push("👟 Breathable sandals or shoes");

        clothes.push("🧢 Hat or cap");

        clothes.push("🕶️ Sunglasses");

    }


    /* RAIN */

    if (isRain) {

        clothes.push("☔ Carry an umbrella");

        clothes.push("🧥 Waterproof or water-resistant jacket");

        clothes.push("🥾 Water-resistant shoes or boots");

    }


    /* SNOW */

    if (isSnow) {

        clothes.push("🥾 Waterproof insulated boots");

        clothes.push("🧤 Waterproof gloves");

    }


    /* WIND */

    if (windSpeed >= 8) {

        clothes.push("🌬️ Add a wind-resistant outer layer");

    }


    /* HUMIDITY */

    if (humidityValue >= 80 && temp >= 20) {

        clothes.push("💧 Choose breathable fabrics because it may feel humid");

    }


    clothingAdvice.innerHTML = "";


    clothes.forEach(function (item) {

        const li = document.createElement("li");

        li.textContent = item;

        clothingAdvice.appendChild(li);

    });


    /* WEATHER MEANING */

    let meaning = "";


    if (temp < 5) {

        meaning =
            "It is very cold outside. The temperature can feel uncomfortable quickly, so warm layers are important.";

    }

    else if (temp < 12) {

        meaning =
            "It is cold enough that most people will feel uncomfortable without a jacket or warm outer layer.";

    }

    else if (temp < 18) {

        meaning =
            "It is cool outside. A light jacket or hoodie should make the conditions comfortable.";

    }

    else if (temp < 25) {

        meaning =
            "The temperature is generally comfortable. Normal everyday clothing should be enough.";

    }

    else if (temp < 32) {

        meaning =
            "It is warm to hot outside. Lightweight clothing will help you stay comfortable.";

    }

    else {

        meaning =
            "It is very hot outside. Heat can become uncomfortable quickly, especially during physical activity.";

    }


    if (isClear) {

        meaning +=
            " The sky is clear, so direct sunlight may make it feel warmer.";

    }


    if (isCloudy) {

        meaning +=
            " Cloud cover may reduce direct sunlight, so it can feel slightly cooler.";

    }


    if (isRain) {

        meaning +=
            " Rain means staying dry should be a priority.";

    }


    if (isSnow) {

        meaning +=
            " Snow and cold conditions require additional protection.";

    }


    weatherMeaning.textContent = meaning;


    /* OUTDOOR ADVICE */

    let outdoor = "";


    if (isThunderstorm) {

        outdoor =
            "⚠️ Avoid unnecessary outdoor activity during a thunderstorm. Stay indoors when possible.";

    }

    else if (isSnow && temp <= 0) {

        outdoor =
            "⚠️ Very cold conditions combined with snow can make outdoor travel difficult. Dress warmly and consider limiting unnecessary time outside.";

    }

    else if (isRain && windSpeed >= 10) {

        outdoor =
            "⚠️ Rain and strong wind can make outdoor conditions unpleasant and potentially hazardous. Consider postponing non-essential outdoor activities.";

    }

    else if (temp >= 35) {

        outdoor =
            "⚠️ It is very hot. Limit prolonged outdoor activity, seek shade, and drink plenty of water.";

    }

    else if (temp <= 0) {

        outdoor =
            "⚠️ Freezing conditions require proper warm clothing. Limit unnecessary outdoor exposure.";

    }

    else if (isRain) {

        outdoor =
            "☔ You can go outside, but bring an umbrella and wear water-resistant footwear.";

    }

    else {

        outdoor =
            "✅ Conditions look reasonable for going outside with the recommended clothing.";

    }


    if (humidityValue >= 85 && temp >= 25) {

        outdoor +=
            " High humidity may make the temperature feel more uncomfortable.";

    }


    outdoorAdvice.textContent = outdoor;


    /* ACTIVITY */

    let activity = "";


    if (isThunderstorm) {

        activity =
            "🏠 Indoor activities are recommended. Avoid outdoor sports.";

    }

    else if (temp >= 35) {

        activity =
            "🧘 Light activities are better. Avoid intense outdoor exercise during the hottest hours.";

    }

    else if (temp <= 5) {

        activity =
            "🚶 Outdoor activity is possible with proper warm clothing, but avoid staying outside for long periods.";

    }

    else if (isRain) {

        activity =
            "☔ Short outdoor activities are okay with rain protection. Indoor activities may be more comfortable.";

    }

    else if (temp >= 18 && temp < 28 && windSpeed < 8) {

        activity =
            "🏃 Great conditions for walking, running, sports, or other outdoor activities.";

    }

    else {

        activity =
            "🚶 Normal outdoor activities should be comfortable with appropriate clothing.";

    }


    activityAdvice.textContent = activity;

}


/* CONVERT TEMPERATURE */

function celsiusToFahrenheit(celsius) {

    return (celsius * 9 / 5) + 32;

}


/* LOADING */

function showLoading() {

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");

    adviceCard.classList.add("hidden");

    errorMessage.classList.add("hidden");

}


function hideLoading() {

    loading.classList.add("hidden");

}


/* ERROR */

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


/* INITIAL WEATHER */

loadWeather("Addis Ababa");