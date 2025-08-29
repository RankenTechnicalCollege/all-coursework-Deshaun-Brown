import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function fahrenheitToKelvin(fahrenheit) {
  return celsiusToKelvin(fahrenheitToCelsius(fahrenheit));
}

function kelvinToFahrenheit(kelvin) {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin));
}

async function runConverter() {
  try {
    const scale = await rl.question('Enter the scale (C, F, or K): ');
    const value = parseFloat(await rl.question(`Enter the temperature in ${scale.toUpperCase()}: `));

    switch (scale.toLowerCase()) {
      case 'c':
        console.log(`${value}°C to Fahrenheit: ${celsiusToFahrenheit(value).toFixed(2)}°F`);
        console.log(`${value}°C to Kelvin: ${celsiusToKelvin(value).toFixed(2)}K`);
        break;
      case 'f':
        console.log(`${value}°F to Celsius: ${fahrenheitToCelsius(value).toFixed(2)}°C`);
        console.log(`${value}°F to Kelvin: ${fahrenheitToKelvin(value).toFixed(2)}K`);
        break;
      case 'k':
        console.log(`${value}K to Celsius: ${kelvinToCelsius(value).toFixed(2)}°C`);
        console.log(`${value}K to Fahrenheit: ${kelvinToFahrenheit(value).toFixed(2)}°F`);
        break;
      default:
        console.log('❌ Invalid scale. Please enter C, F, or K.');
    }
  } catch (err) {
    console.error('Error during conversion:', err);
  } finally {
    rl.close();
  }
}

runConverter();