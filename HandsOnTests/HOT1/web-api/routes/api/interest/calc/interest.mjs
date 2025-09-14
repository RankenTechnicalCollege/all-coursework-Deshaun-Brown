
// Express route handler for interest calculation
import debug from 'debug';
const debugServer = debug('app:interest');

export default async function interestHandler(req, res) {
	const { principal, interestRate, years } = req.body;
	const p = parseFloat(principal);
	const r = parseFloat(interestRate);
	const y = parseFloat(years);

	if (isNaN(p) || p <= 0) {
		return res.status(400).json({ error: 'principal must be a number greater than 0.' });
	}
	if (isNaN(r) || r <= 0 || r > 100) {
		return res.status(400).json({ error: 'interestRate must be a number between 0 and 100.' });
	}
	if (isNaN(y) || y <= 0 || y > 50) {
		return res.status(400).json({ error: 'years must be a number between 1 and 50.' });
	}

	const finalAmount = p * ((1 + r / 100 / 12) ** (y * 12));
	const finalAmountFormatted = finalAmount.toFixed(2);
	debugServer(`Calculated final amount: ${finalAmountFormatted}`);
	res.json({ finalAmount: finalAmountFormatted });
}
