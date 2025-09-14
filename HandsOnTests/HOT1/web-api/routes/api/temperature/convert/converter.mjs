
// Express route handler for temperature conversion
import debug from 'debug';
const debugServer = debug('app:temperature');

export default function convertTemperatureHandler(req, res) {
	const { mode, temp } = req.body;
	if (mode !== 'FtoC' && mode !== 'CtoF') {
		return res.status(400).json({ error: 'mode must be "FtoC" or "CtoF".' });
	}
	const temperature = parseFloat(temp);
	if (isNaN(temperature) || temperature <= 0) {
		return res.status(400).json({ error: 'temp must be a number greater than 0.' });
	}
	let converted;
	if (mode === 'FtoC') {
		converted = (temperature - 32) * (5 / 9);
	} else {
		converted = (temperature * (9 / 5)) + 32;
	}
	const convertedFormatted = converted.toFixed(2);
	debugServer(`Converted temperature: ${convertedFormatted}`);
	res.json({ converted: convertedFormatted });
}
