export class WeatherApp {
    key: string;
    h1: string;
    city: string;
    cityName: string;
    temp: string;
    weatherInfo: string;

    constructor() {
        this.key = import.meta.env.VITE_API_KEY;
        this.h1 = "My Weather App";
        this.city = "";
        this.cityName = "";
        this.temp = "";
        this.weatherInfo = "";
    }

    getWeather(): void {
        if (this.city === "") {
            alert("Please enter a city name!");
            return;
        }

        const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.key}`;

        const forecastWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.key}`;

        fetch(currentWeatherAPI)
            .then(res => res.json())
            .then(data => {
                this.displayWeather(data);
            })
            .catch(err => {
                console.error("Error fetching current weather data", err);
            });

        fetch(forecastWeatherAPI)
            .then(res => res.json())
            .then(data => {
                if (data.cod === "404") return;
                this.displayHourlyForecast(data.list);
            })
            .catch(err => {
                console.error("Error fetching forecast weather data", err);
            });

        this.city = "";
    }

    displayWeather(data): void {
        const weatherIcon = document.getElementById("weather-icon") as HTMLImageElement;
        document.getElementById("current-weather").style.display = "flex";

        if (data.cod === "404") {
            this.weatherInfo = data.message;
            weatherIcon.src = `<p>${data.message}</p>`;
        } else {
            const des = data.weather[0].description;

            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            weatherIcon.alt = des;
            weatherIcon.style.display = "block";

            this.cityName = data.name;
            this.temp = `${Math.round(data.main.temp - 273.15)}°C`;
            this.weatherInfo = data.weather[0].description;
        }
    }

    displayHourlyForecast(list): void {
        const hourlyForecastSection = document.getElementById("hourly-forecast");
        hourlyForecastSection.innerHTML = "";
        hourlyForecastSection.style.display = "flex";

        const next24Hours = list.slice(0, 16);

        next24Hours.forEach(item => {
            const hourlyItemHTML = `
                <div>
                    <p>${(new Date(item.dt * 1000)).getHours()}:00</p>
                    <img 
                        src="${`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}" 
                        alt="Hourly Weather Icon"
                    />
                    <p>${Math.round(item.main.temp - 273.15)}°C</p>
                </div>
            `;

            hourlyForecastSection.innerHTML += hourlyItemHTML; 
        });
    }
}