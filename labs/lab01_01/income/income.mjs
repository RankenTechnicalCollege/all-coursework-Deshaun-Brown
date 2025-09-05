import readline from 'readline';

const taxBrackets = {
  single: [
    { max: 11925, rate: 0.10 },
    { max: 48475, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
  ],
  married: [
    { max: 23850, rate: 0.10 },
    { max: 96950, rate: 0.12 },
    { max: 206700, rate: 0.22 },
    { max: 394600, rate: 0.24 },
    { max: 501050, rate: 0.32 },
    { max: 751600, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
  ]
};

function calculateTax(income, brackets) {
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

  return Math.ceil(tax); // Round up to the next dollar
}

async function runTaxCalculator() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Are you filing as "Single" or "Married filing jointly"? ', (statusInput) => {
    const status = statusInput.trim().toLowerCase();

    if (status !== 'single' && status !== 'married filing jointly') {
      console.log('❌ Invalid status. Please enter "Single" or "Married filing jointly".');
      rl.close();
      return;
    }

    rl.question('Enter your taxable income for 2025: $', (incomeInput) => {
      const income = parseFloat(incomeInput);

      if (isNaN(income) || income <= 0) {
        console.log('❌ Invalid income. Please enter a number greater than 0.');
      } else {
        const brackets = status === 'single' ? taxBrackets.single : taxBrackets.married;
        const taxOwed = calculateTax(income, brackets);
        console.log(`✅ Estimated federal tax owed: $${taxOwed}`);
      }

      rl.close();
    });
  });
}

runTaxCalculator();