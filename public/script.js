const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const weatherCard = document.getElementById("weatherCard");
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

const celsiusButton = document.getElementById("celsiusButton");
const fahrenheitButton = document.getElementById("fahrenheitButton");


let currentWeather = null;

let currentUnit = "C";


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    loadWeather(city);

});


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


function displayWeather(data) {

    hideLoading();

    hideError();

    weatherCard.classList.remove("hidden");

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

}


function celsiusToFahrenheit(celsius) {

    return (celsius * 9 / 5) + 32;

}


function showLoading() {

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");

    errorMessage.classList.add("hidden");

}


function hideLoading() {

    loading.classList.add("hidden");

}


function showError(message) {

    loading.classList.add("hidden");

    weatherCard.classList.add("hidden");

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}


function hideError() {

    errorMessage.classList.add("hidden");

}


loadWeather("Addis Ababa");