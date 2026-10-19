const fs = require('fs');

const raw = fs.readFileSync('./src/lib/questionsData.ts', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('Original line count:', lines.length);

// Find the start of the q-extra block
let cutIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "q-extra-') || lines[i].includes("id: 'q-extra-")) {
    // Cut from the preceding '{'
    cutIndex = i - 1;
    break;
  }
}

console.log('Cut index line:', cutIndex + 1);
if (cutIndex > 0) {
  const cleanLines = lines.slice(0, cutIndex);
  cleanLines.push('];');
  cleanLines.push('');
  fs.writeFileSync('./src/lib/questionsData.ts', cleanLines.join('\n'), 'utf8');
  console.log('Successfully cleaned questionsData.ts! New line count:', cleanLines.length);
}
