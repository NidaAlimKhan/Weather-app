import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch city coordinates
  const fetchCoordinates = async (cityName) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country,
      };
    } else {
      throw new Error("City not found");
    }
  };

  // Fetch weather data
  const fetchWeather = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    );
    const data = await response.json();
    return data.hourly.temperature_2m[0]; // Get the first hour's temperature
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setError(null);
      setWeatherData(null);

      // Get city coordinates
      const { latitude, longitude, name, country } = await fetchCoordinates(city);

      // Get weather data
      const temperature = await fetchWeather(latitude, longitude);

      // Set weather data
      setWeatherData({ name, country, temperature });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>React Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br/>
      <br/>
      <button onClick={handleSearch}>Get Weather</button>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{`${weatherData.name}, ${weatherData.country}`}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
