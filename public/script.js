const cityName = document.getElementById("cityName");
const description = document.getElementById("description");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const errorMessage = document.getElementById("errorMessage");


async function loadWeather() {

    try {

        const response = await fetch("/api/weather");

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Unable to load weather."
            );

        }

        displayWeather(data);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to load weather information.";

        cityName.textContent = "Weather unavailable";

        description.textContent = "";

        temperature.textContent = "--°C";

    }

}


function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    description.textContent =
        data.weather[0].description;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

}


loadWeather();