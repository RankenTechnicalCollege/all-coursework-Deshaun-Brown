
const $ = (id) => document.getElementById(id);



$('truthy-btn').addEventListener('click', () => {
  let rawInput = $('truthy-input').value;
  let convertedInput;
  let inputType;

  // Try to convert to number or boolean
  if (rawInput.toLowerCase() === 'true' || rawInput.toLowerCase() === 'false') {
    convertedInput = rawInput.toLowerCase() === 'true';
  } else if (!isNaN(Number(rawInput))) {
    convertedInput = Number(rawInput);
  } else {
    convertedInput = rawInput;
  }

  inputType = typeof convertedInput;

  let message = convertedInput
    ? `Your input (${rawInput}) is Truthy! Its JavaScript Data Type is ${inputType}.`
    : `Your input (${rawInput}) is Falsy! Its JavaScript Data Type is ${inputType}.`;

  document.getElementById('truthy-result').textContent = message;
});