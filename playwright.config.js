// // playwright.config.js
// export default {
//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         browserName: 'chromium',
//         headless: true
//       },
//     },
//   ],
// };
// playwright.config.js
// const path = require('path');

// const resultsDir = process.env.PLAYWRIGHT_RESULTS_DIR || 'test-results/default';

// module.exports = {
//   reporter: [
//     ['list'],
//     ['json', { outputFile: path.join(resultsDir, 'report.json') }],
//     ['html', { outputFolder: path.join(resultsDir, 'html-report'), open: 'never' }]
//   ],
//   outputDir: path.join(resultsDir, 'artifacts'),
//   use: {
//     trace: 'on',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure'
//   }
// };


const path = require('path');

// You provide this from your CLI using: PLAYWRIGHT_RESULTS_DIR=...
const resultsDir = process.env.PLAYWRIGHT_RESULTS_DIR || 'test-results/default';

module.exports = {
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(resultsDir, 'report.json') }],
    ['html', { outputFolder: path.join(resultsDir, 'html-report'), open: 'never' }]
  ],
  outputDir: path.join(resultsDir, 'artifacts'),
  use: {
    trace: 'on',
    screenshot: 'on',            // 👈 always capture screenshots
    video: 'on'   // or 'on' if you want every run
  }
};
