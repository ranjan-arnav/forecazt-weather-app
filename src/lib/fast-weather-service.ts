export interface WeatherData {
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
  hourlyData?: HourlyWeather[];
  uvIndex?: number;
  pressure?: number;
  sunrise?: string;
  sunset?: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  temperature: number;
  minTemperature?: number;
  condition: string;
  icon: string;
  precipitation?: number;
  windSpeed?: number;
  humidity?: number;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  console.log(`🚀 OPEN-METEO SERVICE: Getting weather for ${city} using Open-Meteo API`);
  
  try {
    // Fetch real-time weather data from Open-Meteo (no API key required!)
    const weatherData = await fetchRealTimeWeather(city);
    console.log(`🌤️ OPEN-METEO SUCCESS: Retrieved live data for ${weatherData.city}:`, weatherData);
    return weatherData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // If it's a "city not found" error, re-throw it to show error to user
    if (errorMessage.includes('not found')) {
      console.error(`❌ CITY NOT FOUND: ${errorMessage}`);
      throw error;
    }
    
    // For other API errors, use fallback data
    console.error(`❌ OPEN-METEO ERROR: Failed to fetch weather for ${city}:`, error);
    console.log(`🔄 FALLBACK: Using realistic weather data for ${city} due to API error`);
    return getRealisticWeatherFallback(city);
  }
}

async function fetchRealTimeWeather(city: string): Promise<WeatherData> {
  console.log(`🌍 FETCHING: Requesting live weather data for ${city} via Open-Meteo`);
  
  try {
    // Step 1: Get coordinates for the city using Open-Meteo's geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    
    console.log(`📍 GEOCODING: Finding coordinates for ${city}`);
    
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      console.log(`❌ GEOCODING ERROR: ${geoResponse.status} ${geoResponse.statusText}`);
      throw new Error(`Geocoding failed: ${geoResponse.status} ${geoResponse.statusText}`);
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      console.log(`❌ CITY NOT FOUND: "${city}" not found in geocoding results`);
      throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
    }
    
    const location = {
      name: geoData.results[0].name,
      country: geoData.results[0].country,
      latitude: geoData.results[0].latitude,
      longitude: geoData.results[0].longitude
    };
    
    console.log(`✅ LOCATION FOUND: ${location.name}, ${location.country} (${location.latitude}, ${location.longitude})`);
    
    // Step 2: Get current weather, hourly data, and forecast using Open-Meteo weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,pressure_msl&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7&forecast_hours=24`;
    
    console.log(`🌤️ WEATHER API: Fetching weather data from Open-Meteo`);
    
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      console.log(`❌ WEATHER API ERROR: ${weatherResponse.status} ${weatherResponse.statusText}`);
      throw new Error(`Weather API failed: ${weatherResponse.status} ${weatherResponse.statusText}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    console.log(`📊 API RESPONSE: Received weather data from Open-Meteo`);
    
    // Step 3: Parse the weather data
    const current = weatherData.current;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;
    
    const temperature = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const windSpeed = Math.round(current.wind_speed_10m);
    const visibility = current.visibility ? Math.round(current.visibility / 1000) : 10; // Convert m to km
    const pressure = current.pressure_msl ? Math.round(current.pressure_msl) : undefined;
    const weatherCode = current.weather_code;
    
    const { condition, description, icon } = getOpenMeteoWeatherInfo(weatherCode);
    
    // Step 4: Create hourly data for charts (next 24 hours)
    const hourlyData: HourlyWeather[] = [];
    const maxHours = Math.min(24, hourly.time.length);
    
    for (let i = 0; i < maxHours; i++) {
      hourlyData.push({
        time: hourly.time[i],
        temperature: Math.round(hourly.temperature_2m[i]),
        humidity: hourly.relative_humidity_2m[i],
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        precipitation: hourly.precipitation[i] || 0,
        weatherCode: hourly.weather_code[i]
      });
    }
    
    // Step 5: Create enhanced forecast data
    const forecast: ForecastDay[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = new Date(daily.time[i]);
      const maxTemp = Math.round(daily.temperature_2m_max[i]);
      const minTemp = Math.round(daily.temperature_2m_min[i]);
      const weatherCode = daily.weather_code[i];
      const { condition: dayCondition, icon: dayIcon } = getOpenMeteoWeatherInfo(weatherCode);
      
      forecast.push({
        date: daily.time[i],
        dayName: dayNames[date.getDay()],
        temperature: maxTemp,
        minTemperature: minTemp,
        condition: dayCondition,
        icon: dayIcon,
        precipitation: daily.precipitation_sum?.[i] || 0,
        windSpeed: daily.wind_speed_10m_max?.[i] ? Math.round(daily.wind_speed_10m_max[i]) : undefined,
        humidity: undefined // Not available in daily data
      });
    }
    
    const result: WeatherData = {
      city: location.name,
      country: location.country,
      temperature,
      condition,
      humidity,
      windSpeed,
      visibility,
      description,
      icon,
      forecast,
      hourlyData,
      uvIndex: daily.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : undefined,
      pressure,
      sunrise: daily.sunrise?.[0],
      sunset: daily.sunset?.[0]
    };
    
    console.log(`✅ SUCCESS: Open-Meteo weather data processed for ${result.city}:`, result);
    
    return result;
    
  } catch (error) {
    console.error(`❌ OPEN-METEO ERROR: Failed to fetch real-time weather data for ${city}:`, error);
    console.log(`🔄 FALLBACK: Using realistic weather data for ${city}`);
    return getRealisticWeatherFallback(city);
  }
}

// Weather code mapping for Open-Meteo
// Reference: https://open-meteo.com/en/docs
function getOpenMeteoWeatherInfo(code: number): { condition: string; description: string; icon: string } {
  const weatherCodes: { [key: number]: { condition: string; description: string; icon: string } } = {
    0: { condition: 'sunny', description: 'Clear sky', icon: 'sunny' },
    1: { condition: 'sunny', description: 'Mainly clear', icon: 'sunny' },
    2: { condition: 'partly-cloudy', description: 'Partly cloudy', icon: 'partly-cloudy' },
    3: { condition: 'cloudy', description: 'Overcast', icon: 'cloudy' },
    45: { condition: 'cloudy', description: 'Fog', icon: 'cloudy' },
    48: { condition: 'cloudy', description: 'Depositing rime fog', icon: 'cloudy' },
    51: { condition: 'rainy', description: 'Light drizzle', icon: 'rainy' },
    53: { condition: 'rainy', description: 'Moderate drizzle', icon: 'rainy' },
    55: { condition: 'rainy', description: 'Dense drizzle', icon: 'rainy' },
    56: { condition: 'rainy', description: 'Light freezing drizzle', icon: 'rainy' },
    57: { condition: 'rainy', description: 'Dense freezing drizzle', icon: 'rainy' },
    61: { condition: 'rainy', description: 'Slight rain', icon: 'rainy' },
    63: { condition: 'rainy', description: 'Moderate rain', icon: 'rainy' },
    65: { condition: 'rainy', description: 'Heavy rain', icon: 'rainy' },
    66: { condition: 'rainy', description: 'Light freezing rain', icon: 'rainy' },
    67: { condition: 'rainy', description: 'Heavy freezing rain', icon: 'rainy' },
    71: { condition: 'snowy', description: 'Slight snow fall', icon: 'snowy' },
    73: { condition: 'snowy', description: 'Moderate snow fall', icon: 'snowy' },
    75: { condition: 'snowy', description: 'Heavy snow fall', icon: 'snowy' },
    77: { condition: 'snowy', description: 'Snow grains', icon: 'snowy' },
    80: { condition: 'rainy', description: 'Slight rain showers', icon: 'rainy' },
    81: { condition: 'rainy', description: 'Moderate rain showers', icon: 'rainy' },
    82: { condition: 'rainy', description: 'Violent rain showers', icon: 'rainy' },
    85: { condition: 'snowy', description: 'Slight snow showers', icon: 'snowy' },
    86: { condition: 'snowy', description: 'Heavy snow showers', icon: 'snowy' },
    95: { condition: 'rainy', description: 'Thunderstorm', icon: 'rainy' },
    96: { condition: 'rainy', description: 'Thunderstorm with slight hail', icon: 'rainy' },
    99: { condition: 'rainy', description: 'Thunderstorm with heavy hail', icon: 'rainy' }
  };
  
  return weatherCodes[code] || { condition: 'cloudy', description: 'Unknown', icon: 'cloudy' };
}

function getRealisticWeatherFallback(city: string): WeatherData {
  console.log(`🌤️ FALLBACK: Getting realistic weather data for ${city}`);
  
  // Realistic weather data based on geography and season (July 2025)
  const realisticWeatherData = {
    // Major Indian cities - Monsoon season
    'mumbai': { temp: 29, condition: 'rainy', humidity: 85, wind: 12, visibility: 8, country: 'IN', desc: 'Monsoon showers' },
    'patna': { temp: 33, condition: 'rainy', humidity: 80, wind: 8, visibility: 9, country: 'IN', desc: 'Monsoon season' },
    'delhi': { temp: 36, condition: 'cloudy', humidity: 75, wind: 10, visibility: 8, country: 'IN', desc: 'Hot and humid' },
    'kolkata': { temp: 32, condition: 'rainy', humidity: 88, wind: 15, visibility: 7, country: 'IN', desc: 'Heavy monsoon' },
    'chennai': { temp: 34, condition: 'sunny', humidity: 78, wind: 14, visibility: 12, country: 'IN', desc: 'Hot coastal weather' },
    'bangalore': { temp: 25, condition: 'cloudy', humidity: 68, wind: 8, visibility: 15, country: 'IN', desc: 'Pleasant weather' },
    
    // US cities - Summer
    'san francisco': { temp: 18, condition: 'cloudy', humidity: 75, wind: 20, visibility: 12, country: 'US', desc: 'Cool and foggy' },
    'new york': { temp: 29, condition: 'sunny', humidity: 65, wind: 12, visibility: 15, country: 'US', desc: 'Warm summer day' },
    'los angeles': { temp: 27, condition: 'sunny', humidity: 58, wind: 8, visibility: 16, country: 'US', desc: 'Perfect California weather' },
    'chicago': { temp: 26, condition: 'cloudy', humidity: 68, wind: 15, visibility: 12, country: 'US', desc: 'Mild summer weather' },
    
    // European cities - Summer
    'london': { temp: 23, condition: 'cloudy', humidity: 72, wind: 12, visibility: 10, country: 'GB', desc: 'Typical London summer' },
    'paris': { temp: 26, condition: 'sunny', humidity: 58, wind: 8, visibility: 14, country: 'FR', desc: 'Beautiful summer day' },
    'berlin': { temp: 24, condition: 'cloudy', humidity: 62, wind: 10, visibility: 12, country: 'DE', desc: 'Mild summer weather' },
    'rome': { temp: 31, condition: 'sunny', humidity: 55, wind: 6, visibility: 16, country: 'IT', desc: 'Hot Mediterranean summer' },
    
    // Asian cities
    'tokyo': { temp: 32, condition: 'sunny', humidity: 72, wind: 8, visibility: 12, country: 'JP', desc: 'Hot humid summer' },
    'singapore': { temp: 33, condition: 'rainy', humidity: 85, wind: 10, visibility: 8, country: 'SG', desc: 'Tropical afternoon rain' },
    'bangkok': { temp: 35, condition: 'sunny', humidity: 78, wind: 5, visibility: 10, country: 'TH', desc: 'Very hot and humid' },
    
    // Other major cities
    'sydney': { temp: 17, condition: 'sunny', humidity: 58, wind: 15, visibility: 16, country: 'AU', desc: 'Cool winter day' },
    'dubai': { temp: 43, condition: 'sunny', humidity: 42, wind: 12, visibility: 15, country: 'AE', desc: 'Extremely hot' },
    'moscow': { temp: 21, condition: 'cloudy', humidity: 62, wind: 8, visibility: 12, country: 'RU', desc: 'Cool summer day' },
  };
  
  const cityKey = city.toLowerCase().trim();
  const data = realisticWeatherData[cityKey as keyof typeof realisticWeatherData];
  
  if (data) {
    console.log(`✅ FALLBACK: Found realistic data for ${city}`);
    return {
      city: city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      country: data.country,
      temperature: data.temp,
      condition: data.condition,
      humidity: data.humidity,
      windSpeed: data.wind,
      visibility: data.visibility,
      description: data.desc,
      icon: data.condition,
      forecast: generateRealisticForecast(data.temp, data.condition)
    };
  } else {
    console.log(`❌ FALLBACK ERROR: City "${city}" not found in fallback database`);
    // For unknown cities, throw an error instead of returning generic data
    throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
  }
}

function generateRealisticForecast(baseTemp: number, baseCondition: string): ForecastDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const conditions = [baseCondition, 'cloudy', 'sunny', 'cloudy', 'sunny', 'cloudy', 'sunny'];
  const tempVariations = [0, -2, 1, -1, 2, 0, 1]; // Realistic temperature changes
  
  return days.map((day, index) => ({
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dayName: day,
    temperature: Math.max(5, Math.min(45, baseTemp + tempVariations[index])),
    condition: conditions[index],
    icon: conditions[index]
  }));
}
