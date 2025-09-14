

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
	return Math.ceil(tax);
}

// Express route handler
export default async function incomeTaxHandler(req, res) {
	const { mode, income } = req.body;

	// Validate mode
	if (typeof mode !== 'string' || (mode !== 'Single' && mode !== 'Married')) {
		res.status(400).json({ error: 'Mode must be "Single" or "Married".' });
		return;
	}

	// Validate income
	const incomeValue = parseFloat(income);
	if (isNaN(incomeValue) || incomeValue <= 0) {
		res.status(400).json({ error: 'Income must be a number greater than 0.' });
		return;
	}

	// Select brackets
	const brackets = mode === 'Single' ? taxBrackets.single : taxBrackets.married;
	const tax = calculateTax(incomeValue, brackets);

	// Log the calculated tax
	if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'test') {
		// Use debug if available, else console.log
		try {
			const debug = (await import('debug')).default;
			debug('tax:calc')(`Calculated income tax: $${tax}`);
		} catch {
			console.log(`Calculated income tax: $${tax}`);
		}
	}

	// Send response
	res.json({ tax });
}
