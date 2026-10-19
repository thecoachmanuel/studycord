const fs = require('fs');

const content = fs.readFileSync('./src/lib/questionsData.ts', 'utf8');
const lines = content.split('\n');

console.log('Line 10190: ', lines[10189]);
console.log('Line 10191: ', lines[10190]);
console.log('Line 10192: ', lines[10191]);

let templatedCount = 0;
let lastTemplatedLine = 0;
lines.forEach((l, idx) => {
  if (l.includes('[') && l.includes('Level') && l.includes('which statement represents a core fundamental principle?')) {
    templatedCount++;
    lastTemplatedLine = idx + 1;
  }
});

console.log('Total templated questions:', templatedCount);
console.log('Last templated line:', lastTemplatedLine);
console.log('Total file lines:', lines.length);
console.log('Lines around last templated line:');
console.log(lines.slice(Math.max(0, lastTemplatedLine - 10), Math.min(lines.length, lastTemplatedLine + 25)).join('\n'));
