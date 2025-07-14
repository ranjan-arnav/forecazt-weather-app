"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
// Import the fast local weather service - NO API CALLS
import { getWeatherData } from "@/lib/fast-weather-service";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;
  forecast?: ForecastDay[];
}

interface ForecastDay {
  date: string;
  dayName: string;
  temperature: number;
  condition: string;
  icon: string;
}

const weatherIcons = {
  sunny: Sun,
  clear: Sun,
  cloudy: Cloud,
  clouds: Cloud,
  rainy: CloudRain,
  rain: CloudRain,
  snowy: Snowflake,
  snow: Snowflake,
};

interface WeatherDisplayProps {
  searchCity?: string;
}

export function WeatherDisplay({ searchCity }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchCity) {
      fetchWeatherData(searchCity);
    } else {
      // Load default city
      fetchWeatherData("San Francisco");
    }
  }, [searchCity]);

  const fetchWeatherData = async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperature = (temp: number) => {
    if (isCelsius) return `${temp}°C`;
    return `${Math.round((temp * 9/5) + 32)}°F`;
  };

  const WeatherIcon = weatherData ? weatherIcons[weatherData.condition as keyof typeof weatherIcons] || Cloud : Cloud;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full">
              <Cloud className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Weather Not Available
            </h3>
            <p className="text-red-200 mb-6 text-lg">
              {error}
            </p>
            <button
              onClick={() => fetchWeatherData(searchCity || "San Francisco")}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">
          Search for a city to see weather information
        </p>
      </div>
    );
  }

  // Fix country display for "Unknown" country
  const displayCountry = weatherData.country && weatherData.country !== 'Unknown' ? weatherData.country : '';
  const locationDisplay = displayCountry ? `${weatherData.city}, ${displayCountry}` : weatherData.city;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        className="max-w-6xl mx-auto"
      >
        {/* Main Weather Card - Cursor style */}
        <motion.div
          className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-3xl p-8 mb-8"
          layoutId="weather-card"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Weather Info */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold mb-4 text-white"
              >
                {locationDisplay}
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-6 mb-6"
              >
                <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {getTemperature(weatherData.temperature)}
                </div>
                <WeatherIcon size={80} className="text-blue-400" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 text-xl mb-6 capitalize"
              >
                {weatherData.description}
              </motion.p>

              {/* Temperature Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className={`text-sm ${isCelsius ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  °C
                </span>
                <button
                  onClick={() => setIsCelsius(!isCelsius)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {isCelsius ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </button>
                <span className={`text-sm ${!isCelsius ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  °F
                </span>
              </motion.div>
            </div>

            {/* Weather Details - Cursor style */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="text-blue-400" size={24} />
                  <span className="text-sm font-medium text-gray-300">Humidity</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.humidity}%
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="text-green-400" size={24} />
                  <span className="text-sm font-medium text-gray-300">Wind</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.windSpeed} km/h
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="text-purple-400" size={24} />
                  <span className="text-sm font-medium text-gray-300">Visibility</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.visibility} km
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Thermometer className="text-red-400" size={24} />
                  <span className="text-sm font-medium text-gray-300">Feels like</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {getTemperature(weatherData.temperature + 2)}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 7-Day Forecast Preview - Cursor style */}
        {weatherData.forecast && weatherData.forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-white">
              7-Day Forecast
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {weatherData.forecast.map((dayForecast, index) => {
                const DayWeatherIcon = weatherIcons[dayForecast.condition as keyof typeof weatherIcons] || Cloud;
                
                return (
                  <motion.div
                    key={dayForecast.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
                  >
                    <div className="text-sm text-gray-300 mb-3 font-medium">
                      {dayForecast.dayName}
                    </div>
                    <DayWeatherIcon className="text-blue-400 mx-auto mb-3" size={28} />
                    <div className="text-lg font-bold text-white">
                      {getTemperature(dayForecast.temperature)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
