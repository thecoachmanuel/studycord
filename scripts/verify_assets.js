const fs = require('fs');
const path = require('path');

function getFiles(dir, exts, list = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      getFiles(full, exts, list);
    } else if (exts.some(e => item.endsWith(e))) {
      list.push(full);
    }
  }
  return list;
}

const srcFiles = getFiles('src', ['.ts', '.tsx', '.js']);
const assetRegex = /\/assets\/[^"'`,\s)]+/g;
const matchedAssets = new Set();

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = assetRegex.exec(content)) !== null) {
    matchedAssets.add(m[0]);
  }
}

console.log(`Checking ${matchedAssets.size} unique asset paths in src/ ...`);
let missing = 0;
for (const asset of matchedAssets) {
  const fullPath = path.join('public', asset.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] ${asset} -> ${fullPath}`);
    missing++;
  } else {
    console.log(`[OK] ${asset}`);
  }
}

console.log(`\nResults: ${matchedAssets.size - missing} present, ${missing} missing.`);
if (missing > 0) process.exit(1);
