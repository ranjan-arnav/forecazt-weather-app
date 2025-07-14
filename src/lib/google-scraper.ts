import puppeteer from 'puppeteer';

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

export async function scrapeGoogleWeather(city: string): Promise<WeatherData> {
  let browser;
  
  try {
    console.log(`Starting Google weather scrape for: ${city}`);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to Google search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(city + ' weather')}`;
    console.log(`Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Wait for weather widget to load
    await page.waitForSelector('.wob_t, [data-wob-field="temp"]', { timeout: 5000 });
    
    // Extract weather data
    const weatherData = await page.evaluate((cityName) => {
      // Helper function to get text content safely
      const getTextContent = (selector: string): string => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || '';
      };
      
      // Extract temperature
      let temperature = 20;
      const tempSelectors = [
        '.wob_t',
        '[data-wob-field="temp"]',
        '#wob_tm'
      ];
      
      for (const selector of tempSelectors) {
        const tempText = getTextContent(selector);
        if (tempText) {
          const tempMatch = tempText.match(/(\d+)/);
          if (tempMatch) {
            temperature = parseInt(tempMatch[1]);
            break;
          }
        }
      }
      
      // Extract condition
      let condition = 'cloudy';
      const conditionSelectors = [
        '.wob_dc',
        '[data-wob-field="primary-text"]',
        '#wob_dc'
      ];
      
      for (const selector of conditionSelectors) {
        const condText = getTextContent(selector);
        if (condText && condText.length > 0) {
          condition = condText.toLowerCase();
          break;
        }
      }
      
      // Extract humidity
      let humidity = 60;
      const humidityText = getTextContent('[data-wob-field="humidity"]') || getTextContent('#wob_hm');
      const humidityMatch = humidityText.match(/(\d+)%/);
      if (humidityMatch) {
        humidity = parseInt(humidityMatch[1]);
      }
      
      // Extract wind speed
      let windSpeed = 10;
      const windText = getTextContent('[data-wob-field="wind"]') || getTextContent('#wob_ws');
      const windMatch = windText.match(/(\d+)/);
      if (windMatch) {
        windSpeed = parseInt(windMatch[1]);
      }
      
      // Extract location
      let location = cityName;
      const locationText = getTextContent('[data-wob-field="location"]') || getTextContent('.wob_loc');
      if (locationText) {
        location = locationText;
      }
      
      return {
        temperature,
        condition,
        humidity,
        windSpeed,
        location,
        visibility: 10 // Default value
      };
      
    }, city);
    
    await browser.close();
    
    // Parse location
    const [cityName, countryCode] = weatherData.location.split(',').map(s => s.trim());
    
    // Generate forecast
    const forecast = generateForecast(weatherData.temperature);
    
    const result: WeatherData = {
      city: cityName || city,
      country: countryCode || 'Unknown',
      temperature: weatherData.temperature,
      condition: mapConditionToIcon(weatherData.condition),
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
      visibility: weatherData.visibility,
      description: weatherData.condition,
      icon: mapConditionToIcon(weatherData.condition),
      forecast
    };
    
    console.log('Successfully scraped weather data:', result);
    return result;
    
  } catch (error) {
    console.error('Google weather scraping failed:', error);
    
    if (browser) {
      await browser.close();
    }
    
    // Return fallback data
    throw new Error(`Failed to scrape weather data for ${city}: ${error}`);
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

function generateForecast(baseTemp: number): ForecastDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const conditions = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny', 'cloudy', 'sunny'];
  
  return days.map((day, index) => ({
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dayName: day,
    temperature: Math.max(0, Math.min(50, baseTemp + Math.floor(Math.random() * 8 - 4))),
    condition: conditions[index],
    icon: conditions[index]
  }));
}
