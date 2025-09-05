import readline from 'readline';

function generateMultiplicationTable(size) {
  const cellWidth = 6;

  // Header row
  let header = ''.padStart(cellWidth);
  for (let i = 1; i <= size; i++) {
    header += i.toFixed(0).padStart(cellWidth);
  }
  console.log(header);

  // Table rows
  for (let row = 1; row <= size; row++) {
    let line = row.toFixed(0).padStart(cellWidth);
    for (let col = 1; col <= size; col++) {
      const product = (row * col).toFixed(0).padStart(cellWidth);
      line += product;
    }
    console.log(line);
  }
}

function runMultiplicationApp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('📊 How big do you want the table to be (1–12)? ', (input) => {
    const size = parseFloat(input);

    if (isNaN(size) || size < 1 || size > 12) {
      console.log('❌ Invalid input. Please enter a number between 1 and 12.');
    } else {
      console.log(`\n✅ Multiplication Table (1 to ${size})\n`);
      generateMultiplicationTable(Math.floor(size));
    }

    rl.close();
  });
}

runMultiplicationApp();