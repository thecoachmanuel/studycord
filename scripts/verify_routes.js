const http = require('http');

const routes = [
  '/',
  '/splash',
  '/intro-slider',
  '/login',
  '/sign-up',
  '/otp',
  '/quiz',
  '/result',
  '/review-answers',
  '/category',
  '/levels',
  '/self-challenge',
  '/contest',
  '/contest/leaderboard',
  '/fun-and-learn',
  '/guess-the-word',
  '/multi-match',
  '/battle/find-opponent',
  '/battle/group',
  '/exam',
  '/bookmark',
  '/badges',
  '/rewards',
  '/statistics',
  '/wallet',
  '/coin-store',
  '/coin-history',
  '/refer-and-earn',
  '/notifications',
  '/about',
  '/settings',
  '/profile/edit',
  '/manifest.json',
  '/sw.js',
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3005${route}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          contentType: res.headers['content-type'] || '',
          size: body.length,
          hasContent: body.length > 50,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ route, status: 'ERROR', error: err.message });
    });
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ route, status: 'TIMEOUT' });
    });
  });
}

async function run() {
  console.log('Testing ' + routes.length + ' routes on http://localhost:3005 ...');
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const res = await checkRoute(route);
    if (res.status === 200 && res.hasContent) {
      console.log(`[PASS] ${res.status} ${route.padEnd(25)} (${res.size} bytes)`);
      passed++;
    } else {
      console.error(`[FAIL] ${res.status} ${route.padEnd(25)} ${res.error || ''}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

run();
