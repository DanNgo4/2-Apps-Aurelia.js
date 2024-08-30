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
    
        // initialise app by displaying current user's location's weather
        this.getUserLocation();
    }

    getUserLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // fetch weather by latitude and longtitude
                    this.fetchWeather(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.key}`, 
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.key}`);
                },
                err => {
                    console.error("Error retrieving location", err);
                    alert("Unable to retrieve your location. Please enter a city name manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser. Please enter a city name manually.");
        }
    }

    getWeather(): void {
        if (this.city === "") {
            alert("Please enter a city name!");
            return;
        }

        this.fetchWeather(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.key}`, 
            `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.key}`);

        this.city = "";
    }

    fetchWeather(currentWeatherAPI, forecastWeatherAPI): void {
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
                this.displayHourlyForecast(data);
            })
            .catch(err => {
                console.error("Error fetching forecast weather data", err);
            });
    }

    displayWeather(data): void {
        const weatherIcon = document.getElementById("weather-icon") as HTMLImageElement;
        const weatherH2 = document.getElementById("weather-h2");
        const weatherH3 = document.getElementById("weather-h3");

        if (data.cod === "404") {
            weatherIcon.style.display = "none";
            weatherH2.style.display = "none";
            weatherH3.style.display = "none";
            this.weatherInfo = data.message;
        } else {
            document.getElementById("current-weather").style.display = "flex";
            const des = data.weather[0].description;

            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            weatherIcon.alt = des;
            this.cityName = data.name;
            this.temp = `${Math.round(data.main.temp - 273.15)}°C`;
            this.weatherInfo = des;

            weatherIcon.style.display = "block";
            weatherH2.style.display = "block";
            weatherH3.style.display = "block";
        }
    }

    displayHourlyForecast(data): void {
        const hourlyForecastSection = document.getElementById("hourly-forecast");
        hourlyForecastSection.innerHTML = "";

        if (data.cod === "404") {
            return;
        } else {
            hourlyForecastSection.style.display = "flex";

            const next24Hours = data.list.slice(0, 16);

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
}
