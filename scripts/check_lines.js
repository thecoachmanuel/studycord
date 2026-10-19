const fs = require('fs');

const raw = fs.readFileSync('./src/lib/questionsData.ts', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('Total lines in questionsData.ts:', lines.length);

for (let i = 10185; i <= 10215; i++) {
  console.log(`[${i}] ${lines[i - 1]}`);
}

console.log('--- Last 20 lines of file: ---');
for (let i = lines.length - 20; i < lines.length; i++) {
  console.log(`[${i + 1}] ${lines[i]}`);
}
