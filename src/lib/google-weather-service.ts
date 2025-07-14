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

// Since we can't directly scrape Google from the browser due to CORS,
// we'll need to use a proxy service or implement this server-side
export async function getWeatherFromGoogle(city: string): Promise<WeatherData> {
  try {
    // Option 1: Use a CORS proxy service to fetch Google search results
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(city + ' weather')}`;
    const response = await fetch(proxyUrl + encodeURIComponent(googleSearchUrl));
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Google');
    }
    
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Parse the HTML content to extract weather information
    const weatherData = parseGoogleWeatherHTML(htmlContent, city);
    return weatherData;
    
  } catch (error) {
    console.error('Google weather fetch failed:', error);
    // Fallback to mock data
    return getMockWeatherData(city);
  }
}

function parseGoogleWeatherHTML(html: string, city: string): WeatherData {
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  try {
    // Google's weather widget selectors (these may change over time)
    const tempElement = doc.querySelector('[data-wob-field="temp"]');
    const conditionElement = doc.querySelector('[data-wob-field="primary-text"]');
    const humidityElement = doc.querySelector('[data-wob-field="humidity"]');
    const windElement = doc.querySelector('[data-wob-field="wind"]');
    const visibilityElement = doc.querySelector('[data-wob-field="visibility"]');
    const locationElement = doc.querySelector('[data-wob-field="location"]');
    
    // Extract temperature (remove °C or °F)
    const tempText = tempElement?.textContent || '20';
    const temperature = parseInt(tempText.replace(/[°CF]/g, ''));
    
    // Extract condition
    const condition = conditionElement?.textContent?.toLowerCase() || 'cloudy';
    
    // Extract humidity (remove %)
    const humidityText = humidityElement?.textContent || '60%';
    const humidity = parseInt(humidityText.replace('%', ''));
    
    // Extract wind speed (remove units)
    const windText = windElement?.textContent || '10 km/h';
    const windSpeed = parseInt(windText.replace(/[^\d]/g, ''));
    
    // Extract visibility
    const visibilityText = visibilityElement?.textContent || '10 km';
    const visibility = parseInt(visibilityText.replace(/[^\d]/g, ''));
    
    // Get location or use provided city
    const location = locationElement?.textContent || city;
    const [cityName, countryCode] = location.split(',').map(s => s.trim());
    
    // Generate forecast data (Google search results don't always include detailed forecast)
    const forecast = generateMockForecast(temperature);
    
    return {
      city: cityName || city,
      country: countryCode || 'Unknown',
      temperature,
      condition: mapConditionToIcon(condition),
      humidity,
      windSpeed,
      visibility,
      description: condition,
      icon: mapConditionToIcon(condition),
      forecast
    };
    
  } catch (error) {
    console.error('Failed to parse Google weather data:', error);
    return getMockWeatherData(city);
  }
}

function mapConditionToIcon(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return 'sunny';
  } else if (lowerCondition.includes('cloud')) {
    return 'cloudy';
  } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return 'rainy';
  } else if (lowerCondition.includes('snow')) {
    return 'snowy';
  } else {
    return 'cloudy';
  }
}

function generateMockForecast(baseTemp: number): ForecastDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const conditions = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny', 'cloudy', 'sunny'];
  
  return days.map((day, index) => ({
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dayName: day,
    temperature: Math.round(baseTemp + (Math.random() * 10 - 5)),
    condition: conditions[index],
    icon: conditions[index]
  }));
}

function getMockWeatherData(city: string): WeatherData {
  const mockData = {
    'new york': { temp: 22, condition: 'cloudy', humidity: 65, wind: 12, visibility: 10, country: 'US' },
    'london': { temp: 15, condition: 'rainy', humidity: 80, wind: 8, visibility: 8, country: 'UK' },
    'tokyo': { temp: 28, condition: 'sunny', humidity: 55, wind: 6, visibility: 12, country: 'JP' },
    'paris': { temp: 18, condition: 'cloudy', humidity: 70, wind: 10, visibility: 9, country: 'FR' },
    'sydney': { temp: 25, condition: 'sunny', humidity: 60, wind: 15, visibility: 15, country: 'AU' },
  };
  
  const cityKey = city.toLowerCase();
  const data = mockData[cityKey as keyof typeof mockData] || mockData['new york'];
  
  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: data.country,
    temperature: data.temp,
    condition: data.condition,
    humidity: data.humidity,
    windSpeed: data.wind,
    visibility: data.visibility,
    description: `${data.condition} with gentle breeze`,
    icon: data.condition,
    forecast: generateMockForecast(data.temp)
  };
}
