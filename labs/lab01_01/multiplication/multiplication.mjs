


// Import the readline module
import readline from 'readline';

// Create an interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for two numbers
rl.question('Enter the first number: ', (num1) => {
  rl.question('Enter the second number: ', (num2) => {
    // Convert inputs to numbers and perform multiplication
    const result = parseFloat(num1) * parseFloat(num2);

    // Display the result
    console.log(`The result of multiplying ${num1} and ${num2} is: ${result}`);

    // Close the readline interface
    rl.close();
  });
});
