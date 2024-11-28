import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("Toronto");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch current weather
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: city,
              appid: process.env.REACT_APP_API_KEY,
              units: "metric",
            },
          }
        );
        setWeatherData(weatherResponse.data);

        // Fetch 5-day forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              q: city,
              appid: process.env.REACT_APP_API_KEY,
              units: "metric",
            },
          }
        );
        setForecastData(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = () => {
    if (searchCity.trim() !== "") {
      setCity(searchCity);
    }
  };

  return (
    <div className="weather-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="current-weather">
        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <p>{weatherData.weather[0].description.toUpperCase()}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels Like: {weatherData.main.feels_like}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p>Pressure: {weatherData.main.pressure} hPa</p>
          </div>
        )}
      </div>

      {forecastData && (
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {forecastData.list
              .filter((_, index) => index % 8 === 0)
              .map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt={forecast.weather[0].description}
                  />
                  <p>{forecast.weather[0].description.toUpperCase()}</p>
                  <p>Temp: {forecast.main.temp}°C</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
