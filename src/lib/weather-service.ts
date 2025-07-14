// This file is deprecated. Use fast-weather-service.ts instead.
// It now uses Open-Meteo API instead of Google weather scraping.

export function getWeatherData(): never {
  throw new Error('This weather service is deprecated. Use fast-weather-service.ts with Open-Meteo API instead.');
}
