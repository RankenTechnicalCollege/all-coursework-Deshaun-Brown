import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

async function runConverter() {
  try {
    console.log('\n🌡️ Temperature Converter');
    console.log('Choose the input scale:');
    console.log('  C - Celsius');
    console.log('  F - Fahrenheit\n');

    const scale = await rl.question('Enter your choice (C or F): ');
    const normalizedScale = scale.trim().toLowerCase();

    if (normalizedScale !== 'c' && normalizedScale !== 'f') {
      console.error('❌ Invalid scale. Please enter C or F only.');
      return;
    }

    const tempInput = await rl.question(`Enter the temperature in ${normalizedScale === 'c' ? 'Celsius' : 'Fahrenheit'}: `);
    const temperature = parseFloat(tempInput);

    if (isNaN(temperature) || temperature <= 0) {
      console.error('❌ Invalid temperature. Please enter a number greater than 0.');
      return;
    }

    if (normalizedScale === 'c') {
      const fahrenheit = celsiusToFahrenheit(temperature);
      console.log(`✅ ${temperature}°C is ${fahrenheit.toFixed(2)}°F`);
    } else {
      const celsius = fahrenheitToCelsius(temperature);
      console.log(`✅ ${temperature}°F is ${celsius.toFixed(2)}°C`);
    }
  } catch (err) {
    console.error('⚠️ Error during conversion:', err);
  } finally {
    rl.close();
  }
}

runConverter();