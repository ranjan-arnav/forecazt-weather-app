// Test file to verify error handling
import { getWeatherData } from './fast-weather-service';

// Test with a valid city
console.log('Testing with valid city: Mumbai');
getWeatherData('Mumbai').then(data => {
  console.log('✅ SUCCESS for Mumbai:', data.city, data.temperature + '°C');
}).catch(error => {
  console.log('❌ ERROR for Mumbai:', error.message);
});

// Test with an invalid city
console.log('Testing with invalid city: invalidcityname12345');
getWeatherData('invalidcityname12345').then(data => {
  console.log('✅ SUCCESS for invalid city (unexpected):', data);
}).catch(error => {
  console.log('❌ ERROR for invalid city (expected):', error.message);
});
