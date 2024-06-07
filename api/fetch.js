import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY;
// const API_KEY = process.env.WEATHER_API_URL;

const forecastEndPoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndPoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log("error message:", err);
  }
};

export const fetchWeatherForecast = (params) => {
  return apiCall(forecastEndPoint(params));
};

export const fetchLocations = (params) => {
  return apiCall(locationEndPoint(params));
};
