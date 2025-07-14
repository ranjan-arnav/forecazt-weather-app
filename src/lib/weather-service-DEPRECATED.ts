// THIS FILE IS DEPRECATED - DO NOT USE
// Use fast-weather-service.ts instead for all weather data

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

// THIS FUNCTION IS DEPRECATED - DO NOT USE
export async function getWeatherData_DEPRECATED_DO_NOT_USE(city: string): Promise<WeatherData> {
  console.error('❌ DEPRECATED weather-service.ts called! Use fast-weather-service.ts instead');
  throw new Error(`Deprecated weather service called for ${city}. Use fast-weather-service.ts instead`);
}
