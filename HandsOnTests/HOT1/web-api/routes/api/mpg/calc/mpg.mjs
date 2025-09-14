
// Express route handler for MPG calculation
import debug from 'debug';
const debugServer = debug('app:mpg');

export default function mpgHandler(req, res) {
  const { milesDriven, gallonsUsed } = req.body;
  const miles = parseFloat(milesDriven);
  const gallons = parseFloat(gallonsUsed);

  if (isNaN(miles) || miles <= 0) {
    return res.status(400).json({ error: 'milesDriven must be a number greater than 0.' });
  }
  if (isNaN(gallons) || gallons <= 0) {
    return res.status(400).json({ error: 'gallonsUsed must be a number greater than 0.' });
  }

  const mpg = miles / gallons;
  const mpgFormatted = mpg.toFixed(2);
  debugServer(`Calculated MPG: ${mpgFormatted}`);
  res.json({ mpg: mpgFormatted });
}