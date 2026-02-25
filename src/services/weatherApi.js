import axios from 'axios';

const API_KEY = '1a1f90c81dd8b39443f52943bf9efa99';
const BASE_URL = 'https://api.weatherstack.com';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    access_key: API_KEY,
  },
});

// Current Weather
export const getCurrentWeather = async (query) => {
  try {
    const response = await weatherApi.get('/current', {
      params: { query },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to fetch weather data');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.info || error.message || 'Failed to fetch current weather');
  }
};

// Forecast Weather (requires paid plan)
export const getForecastWeather = async (query, days = 7) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: { 
        query,
        forecast_days: days,
        hourly: 1,
      },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to fetch forecast data');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.info || error.message || 'Failed to fetch forecast');
  }
};

// Historical Weather (requires paid plan)
export const getHistoricalWeather = async (query, date) => {
  try {
    const response = await weatherApi.get('/historical', {
      params: { 
        query,
        historical_date: date,
        hourly: 1,
      },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to fetch historical data');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.info || error.message || 'Failed to fetch historical weather');
  }
};

// Marine Weather (requires Business plan)
export const getMarineWeather = async (query) => {
  try {
    const response = await weatherApi.get('/marine', {
      params: { query },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to fetch marine data');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.info || error.message || 'Failed to fetch marine weather');
  }
};

// Location Autocomplete/Lookup
export const lookupLocation = async (query) => {
  try {
    const response = await weatherApi.get('/autocomplete', {
      params: { query },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to lookup location');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.info || error.message || 'Failed to lookup location');
  }
};

// Helper to format weather data
export const formatWeatherData = (data) => {
  if (!data || !data.current) return null;
  
  return {
    location: {
      name: data.location?.name,
      country: data.location?.country,
      region: data.location?.region,
      lat: data.location?.lat,
      lon: data.location?.lon,
      timezone: data.location?.timezone_id,
      localtime: data.location?.localtime,
    },
    current: {
      temperature: data.current?.temperature,
      feelsLike: data.current?.feelslike,
      humidity: data.current?.humidity,
      windSpeed: data.current?.wind_speed,
      windDir: data.current?.wind_dir,
      pressure: data.current?.pressure,
      precipitation: data.current?.precip,
      cloudCover: data.current?.cloudcover,
      visibility: data.current?.visibility,
      uvIndex: data.current?.uv_index,
      description: data.current?.weather_descriptions?.[0] || 'Unknown',
      icon: data.current?.weather_icons?.[0],
      isDay: data.current?.is_day === 'yes',
    },
  };
};

export default {
  getCurrentWeather,
  getForecastWeather,
  getHistoricalWeather,
  getMarineWeather,
  lookupLocation,
  formatWeatherData,
};
