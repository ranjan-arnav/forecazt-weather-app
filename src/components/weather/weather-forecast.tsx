"use client";

import { motion } from "framer-motion";
import { ForecastDay } from "@/lib/fast-weather-service";

interface WeatherForecastProps {
  forecast: ForecastDay[];
  city: string;
}

export function WeatherForecast({ forecast, city }: WeatherForecastProps) {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '☁️';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          7-Day Forecast for {city}
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Extended weather outlook with detailed daily conditions
        </p>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-3 sm:p-4 lg:p-6 hover:bg-black/30 transition-all duration-300 group"
          >
            <div className="text-center">
              {/* Day Name */}
              <div className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                {index === 0 ? 'Today' : day.dayName}
              </div>
              
              {/* Date */}
              <div className="text-xs text-gray-500 mb-2 sm:mb-4">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>

              {/* Weather Icon */}
              <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                {getWeatherIcon(day.icon)}
              </div>

              {/* Temperature */}
              <div className="mb-2 sm:mb-3">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {day.temperature}°
                </div>
                {day.minTemperature && (
                  <div className="text-xs sm:text-sm text-gray-400">
                    Low: {day.minTemperature}°
                  </div>
                )}
              </div>

              {/* Condition */}
              <div className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4 capitalize">
                {day.condition}
              </div>

              {/* Additional Details */}
              <div className="space-y-1 sm:space-y-2 pt-2 sm:pt-3 border-t border-white/10">
                {day.precipitation !== undefined && day.precipitation > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Rain:</span>
                    <span className="text-blue-400">{day.precipitation.toFixed(1)}mm</span>
                  </div>
                )}
                {day.windSpeed && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Wind:</span>
                    <span className="text-green-400">{day.windSpeed}km/h</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">📊 Weekly Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-400 mb-1">
              {Math.max(...forecast.map(d => d.temperature))}°C
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Highest Temperature</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
              {Math.min(...forecast.map(d => d.minTemperature || d.temperature))}°C
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Lowest Temperature</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1">
              {forecast.filter(d => (d.precipitation || 0) > 0).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Days with Rain</div>
          </div>
        </div>
      </div>

      {/* Weather Pattern Insights */}
      <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">🔍 Weather Insights</h3>
        <div className="space-y-3">
          {forecast.filter(d => (d.precipitation || 0) > 0).length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-blue-400">🌧️</span>
              <div>
                <div className="text-white font-medium text-sm sm:text-base">Precipitation Expected</div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Rain is forecasted for {forecast.filter(d => (d.precipitation || 0) > 0).length} days this week.
                  {forecast.filter(d => (d.precipitation || 0) > 5).length > 0 && 
                    " Heavy rainfall expected on some days."
                  }
                </div>
              </div>
            </div>
          )}
          
          {Math.max(...forecast.map(d => d.temperature)) - Math.min(...forecast.map(d => d.minTemperature || d.temperature)) > 15 && (
            <div className="flex items-start gap-3">
              <span className="text-orange-400">🌡️</span>
              <div>
                <div className="text-white font-medium text-sm sm:text-base">High Temperature Variation</div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Expect significant temperature changes throughout the week. 
                  Plan your clothing accordingly.
                </div>
              </div>
            </div>
          )}
          
          {forecast.filter(d => (d.windSpeed || 0) > 20).length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-green-400">💨</span>
              <div>
                <div className="text-white font-medium text-sm sm:text-base">Windy Conditions</div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Strong winds expected on {forecast.filter(d => (d.windSpeed || 0) > 20).length} days. 
                  Secure outdoor items.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
