// VowelCount - Async Function Declaration
async function VowelCount(str) {
  const vowels = 'aeiouAEIOU';
  return [...str].filter(char => vowels.includes(char)).length;
}

// ReverseString - Async Function Declaration
async function ReverseString(str) {
  return str.split('').reverse().join('');
}

// CapitalizeWords - Async Function Expression
const CapitalizeWords = async function(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// WordCount - Async Arrow Function
const WordCount = async str => str.trim().split(/\s+/).length;

// ConcatenateStrings - Async Arrow Function (2 inputs)
const ConcatenateStrings = async (str1, str2) => `${str1} ${str2}`;

export { VowelCount, ReverseString, CapitalizeWords, WordCount, ConcatenateStrings };

