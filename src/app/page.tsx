"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WeatherSearch, WeatherSearchRef } from "@/components/weather/weather-search";
import { WeatherCharts } from "@/components/weather/weather-charts";
import { WeatherForecast } from "@/components/weather/weather-forecast";
import { getWeatherData, WeatherData } from "@/lib/fast-weather-service";
import { motion } from "framer-motion";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchRef = useRef<WeatherSearchRef>(null);
  const forecastRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    searchRef.current?.focus();
  };

  const handleForecastClick = () => {
    if (weatherData?.forecast) {
      setTimeout(() => {
        forecastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      searchRef.current?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <Header onSearchClick={handleSearchClick} onForecastClick={handleForecastClick} />
      
      {/* Hero Section with modern design */}
      <section className="relative px-4 pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Enhanced modern background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:2s]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:4s]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Main heading with enhanced modern typography */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            The AI Weather
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Forecazt
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Built to make you extraordinarily informed about weather patterns worldwide.
            <span className="block mt-2">Experience the future of weather forecasting with AI-powered insights.</span>
          </p>
          
          {/* Weather Search Component */}
          <div className="max-w-lg mx-auto px-4">
            <WeatherSearch ref={searchRef} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-2 sm:px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-center mx-2"
            >
              <p className="text-red-200 text-base sm:text-lg">{error}</p>
            </motion.div>
          )}
          
          {/* Loading State */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4">Fetching weather data...</p>
            </motion.div>
          )}

          {/* Weather Data Display */}
          {weatherData && !loading && (
            <div className="space-y-8">
              {/* Current Weather Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 mx-2"
              >
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {weatherData.city}, {weatherData.country}
                  </h2>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-4">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-lg sm:text-xl text-gray-300 capitalize mb-6">
                    {weatherData.condition}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="text-gray-400">
                      Humidity: <span className="text-white block sm:inline">{weatherData.humidity}%</span>
                    </div>
                    <div className="text-gray-400">
                      Wind: <span className="text-white block sm:inline">{weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="text-gray-400">
                      Visibility: <span className="text-white block sm:inline">{weatherData.visibility} km</span>
                    </div>
                    {weatherData.pressure && (
                      <div className="text-gray-400">
                        Pressure: <span className="text-white block sm:inline">{weatherData.pressure} hPa</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Weather Charts Section */}
              {weatherData.hourlyData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <WeatherCharts hourlyData={weatherData.hourlyData} city={weatherData.city} />
                </motion.div>
              )}

              {/* Weather Forecast Section */}
              {weatherData.forecast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  ref={forecastRef}
                >
                  <WeatherForecast forecast={weatherData.forecast} city={weatherData.city} />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
