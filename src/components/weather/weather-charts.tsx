"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HourlyWeather } from "@/lib/fast-weather-service";

interface WeatherChartsProps {
  hourlyData: HourlyWeather[];
  city: string;
}

export function WeatherCharts({ hourlyData, city }: WeatherChartsProps) {
  // Format time for chart display
  const chartData = hourlyData.map((item) => ({
    ...item,
    timeFormatted: new Date(item.time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    hour: new Date(item.time).getHours(),
  }));

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; unit?: string; color?: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-lg bg-black/80 border border-white/20 rounded-lg p-3 text-white">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          24-Hour Weather Analytics for {city}
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base">
          Detailed hourly forecasts and weather patterns
        </p>
      </div>

      {/* Temperature Chart */}
      <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
          🌡️ Temperature Trend
        </h3>
        <div className="h-40 sm:h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timeFormatted" 
                stroke="#9ca3af" 
                fontSize={8}
                interval="preserveStartEnd"
                tick={{ fontSize: 8 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={8}
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 8 }}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#temperatureGradient)"
                name="Temperature"
                unit="°C"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Humidity & Wind Speed Chart */}
      <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
          💨 Humidity & Wind Speed
        </h3>
        <div className="h-40 sm:h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timeFormatted" 
                stroke="#9ca3af" 
                fontSize={8}
                interval="preserveStartEnd"
                tick={{ fontSize: 8 }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="humidity"
                stroke="#60a5fa" 
                fontSize={8}
                domain={[0, 100]}
                tick={{ fontSize: 8 }}
                tickLine={false}
                width={25}
              />
              <YAxis 
                yAxisId="wind"
                orientation="right"
                stroke="#10b981" 
                fontSize={8}
                domain={[0, 'dataMax + 5']}
                tick={{ fontSize: 8 }}
                tickLine={false}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                name="Humidity"
                unit="%"
              />
              <Line
                yAxisId="wind"
                type="monotone"
                dataKey="windSpeed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Wind Speed"
                unit=" km/h"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Precipitation Chart */}
      <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
          🌧️ Precipitation Forecast
        </h3>
        <div className="h-40 sm:h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timeFormatted" 
                stroke="#9ca3af" 
                fontSize={8}
                interval="preserveStartEnd"
                tick={{ fontSize: 8 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={8}
                domain={[0, 'dataMax + 1']}
                tick={{ fontSize: 8 }}
                tickLine={false}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="precipitation"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Precipitation"
                unit=" mm"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {chartData.every(item => item.precipitation === 0) && (
          <div className="text-center py-4 sm:py-6 text-gray-400">
            <p className="text-sm">No precipitation expected in the next 24 hours</p>
          </div>
        )}
      </div>

      {/* Weather Pattern Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">🌡️ Temperature Range</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">High:</span>
              <span className="text-orange-400 font-bold">
                {Math.max(...chartData.map(d => d.temperature))}°C
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Low:</span>
              <span className="text-blue-400 font-bold">
                {Math.min(...chartData.map(d => d.temperature))}°C
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Average:</span>
              <span className="text-white font-bold">
                {Math.round(chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length)}°C
              </span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">💨 Wind Analysis</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Max Speed:</span>
              <span className="text-green-400 font-bold">
                {Math.max(...chartData.map(d => d.windSpeed))} km/h
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Min Speed:</span>
              <span className="text-blue-400 font-bold">
                {Math.min(...chartData.map(d => d.windSpeed))} km/h
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Average:</span>
              <span className="text-white font-bold">
                {Math.round(chartData.reduce((sum, d) => sum + d.windSpeed, 0) / chartData.length)} km/h
              </span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">💧 Humidity Info</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Max:</span>
              <span className="text-blue-400 font-bold">
                {Math.max(...chartData.map(d => d.humidity))}%
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Min:</span>
              <span className="text-orange-400 font-bold">
                {Math.min(...chartData.map(d => d.humidity))}%
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Average:</span>
              <span className="text-white font-bold">
                {Math.round(chartData.reduce((sum, d) => sum + d.humidity, 0) / chartData.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
