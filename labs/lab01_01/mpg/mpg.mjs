import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

try {
  const milesInput = await rl.question('How many miles did you drive? ');
  const gallonsInput = await rl.question('How many gallons did you use? ');

  const milesDriven = parseFloat(milesInput);
  const gallonsUsed = parseFloat(gallonsInput);

  // Validate input
  if (isNaN(milesDriven) || milesDriven <= 0) {
    console.error('❌ Invalid input: "Miles driven" must be a number greater than 0.');
  } else if (isNaN(gallonsUsed) || gallonsUsed <= 0) {
    console.error('❌ Invalid input: "Gallons used" must be a number greater than 0.');
  } else {
    const mpg = milesDriven / gallonsUsed;
    console.log(`✅ After driving ${milesDriven} miles and using ${gallonsUsed} gallons, your MPG is ${mpg.toFixed(2)}.`);
  }
} catch (err) {
  console.error('⚠️ An unexpected error occurred:', err);
} finally {
  rl.close();
}