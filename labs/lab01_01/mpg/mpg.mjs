import * as readline from 'node:readline/promises';
import { stdin as input, stdoutl as output } from 'node:process';

const rl = readline.createInterface({input, output });

const milesDriven = await rl.question()

const gallonsUsed = await rl.question('How many gallons did you use?');

const mpg = milesDriven / gallonsUsed;

console.log (`After driving ${milesDriven} miles and using ${gallonsUsed} gallons your MPG is ${mpg.toFixed(2)}`);

rl.close();