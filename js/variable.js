const SECRET = true; // could be a number, string, or boolean

document.getElementById('guess-btn').addEventListener('click', () => {
  let userInput = document.getElementById('guess-input').value;
  let resultMessage = '';
  let inputType;

  if (userInput === '') {
    resultMessage = 'Please enter a guess.';
    inputType = 'undefined';
  } else {
    let parsedInput;

    // Try to match type of SECRET
    if (typeof SECRET === 'number') {
      parsedInput = Number(userInput);
    } else if (typeof SECRET === 'boolean') {
      parsedInput = userInput.toLowerCase() === 'true';
    } else {
      parsedInput = userInput;
    }

    inputType = typeof parsedInput;

    if (parsedInput === SECRET) {
      resultMessage = 'Correct! You guessed the secret value.';
    } else {
      resultMessage = 'Incorrect. Try again!';
    }
  }

  document.getElementById('guess-result').textContent =
    `${resultMessage} Data Type: ${inputType}`;
});