// income.mjs

import readline from 'readline';

const taxBrackets = [
  { max: 11000, rate: 0.10 },
  { max: 44725, rate: 0.12 },
  { max: 95375, rate: 0.22 },
  { max: 182100, rate: 0.24 },
  { max: 231250, rate: 0.32 },
  { max: 578125, rate: 0.35 },
  { max: Infinity, rate: 0.37 }
];

async function getTaxBrackets() {
  return taxBrackets;
}

async function calculateTax(income) {
  const brackets = await getTaxBrackets();
  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income > bracket.max) {
      tax += (bracket.max - previousMax) * bracket.rate;
      previousMax = bracket.max;
    } else {
      tax += (income - previousMax) * bracket.rate;
      break;
    }
  }

  return tax;
}

async function runTaxCalculator() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your taxable income: $', async (input) => {
    const income = parseFloat(input);

    if (isNaN(income) || income < 0) {
      console.log('❌ Please enter a valid positive number.');
    } else {
      const taxOwed = await calculateTax(income);
      console.log(`✅ Estimated federal tax owed: $${taxOwed.toFixed(2)}`);
    }

    rl.close();
  });
}

runTaxCalculator();