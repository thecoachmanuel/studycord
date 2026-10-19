const fs = require('fs');

const filesToScan = [
  './src/lib/questionsData.ts',
  './src/lib/levelQuestionsPool.ts',
  './src/lib/comprehensionData.ts',
  './src/lib/api.ts'
];

filesToScan.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const bracketMatches = [];
  
  // Find all question text patterns
  const regex = /question:\s*(['"`])([\s\S]*?)\1/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const qText = match[2];
    if (qText.startsWith('[') || qText.includes('[Question') || qText.includes('[Q') || /\[.*?\]/.test(qText)) {
      bracketMatches.push(qText);
    }
  }
  console.log(`File: ${filePath} -> bracket question matches: ${bracketMatches.length}`);
  if (bracketMatches.length > 0) {
    console.log('Sample matches:', bracketMatches.slice(0, 5));
  }
});
