import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';


import mpgHandler from './web-api/routes/api/mpg/calc/mpg.mjs';
import interestHandler from './web-api/routes/api/interest/calc/interest.mjs';
import convertTemperatureHandler from './web-api/routes/api/temperature/convert/converter.mjs';
import calculateIncomeTax from './web-api/routes/api/income-tax/calc/income.mjs';



const debugServer = debug('app:Server');

const app = express();

dotenv.config();

app.use(express.json());



// Route for income tax calculation
app.post('/api/income-tax/calc', calculateIncomeTax);
// Route for mpg calculation
app.post('/api/mpg/calc', mpgHandler);
// Route for interest calculation (to be implemented)
app.post('/api/interest/calc', interestHandler);
// Route for temperature conversion (to be implemented)
app.post('/api/temperature/convert', convertTemperatureHandler);


const PORT = process.env.PORT || 5010;
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});