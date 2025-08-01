

// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// function waitForFile(filePath, timeout = 5000) {
//   return new Promise((resolve, reject) => {
//     const start = Date.now();
//     (function checkFile() {
//       if (fs.existsSync(filePath)) return resolve();
//       if (Date.now() - start > timeout) return reject(new Error(`File ${filePath} not found within timeout`));
//       setTimeout(checkFile, 100);
//     })();
//   });
// }

// async function runPlaywrightTestFromScript(testBody, testName = 'AI Generated Test',creds) {
//   console.log('started executing...')
//   const timestamp = Date.now();
//   const runId = `run-${timestamp}`;
//   const baseDir = path.join(__dirname, '../test-runs', runId);
//   const testFilePath = path.join(baseDir, `test.spec.js`);
//   const reportDir = path.join(baseDir, 'report');
//   const screenshotDir = path.join(baseDir, 'screenshots');
//   const configPath = path.join(baseDir, 'playwright.config.js');

//   fs.mkdirSync(reportDir, { recursive: true });
//   fs.mkdirSync(screenshotDir, { recursive: true });

//   // Replace screenshot paths in user script to absolute screenshotDir
//   const updatedScript = testBody.replace(/path:\s*['"]([^'"]+)['"]/g, (match, filename) => {
//     const absPath = path.join(screenshotDir, filename).replace(/\\/g, '/');
//     return `path: '${absPath}'`;
//   });



// //video recording one
// const fullTestCode = `
//   const { test, expect } = require('@playwright/test');
//   const fs = require('fs');
//   const path = require('path');
//   const { click } = require('${path.resolve(__dirname, '../utils/click.js')}');
//   const { selectDropdown } = require('${path.resolve(__dirname, '../utils/dropdown')}');
//   const { fillPassword } = require('${path.resolve(__dirname, '../utils/fillPassword')}');
//   const { fillInput } = require('${path.resolve(__dirname, '../utils/fillInput')}');
//   const { assertTextVisible } = require('${path.resolve(__dirname, '../utils/assertText')}');

//   const runId = '${runId}';
//   const UserName = '${creds.UserName}';
//    const Password = '${creds.Passwrod}';
//     const url = '${creds.Url}';

// test.use({
//   video: 'on',
//   launchOptions: {
//     headless: true
//   }
// });

//   test('${testName}', async ({ page }) => {
//     const screenshotDir = \`test-runs/\${runId}/screenshots\`;
//     fs.mkdirSync(screenshotDir, { recursive: true });

//     let shot = 1;

//     const takeShot = async (label) => {
//       try {
//         await page.screenshot({ path: path.join(screenshotDir, \`shot\${shot++}_\${label || 'default'}.png\`) });
//       } catch (e) {
//         console.warn('⚠️ Could not take screenshot:', e.message);
//       }
//     };

//     const scrollWaitAndHighlight = async (locator) => {
//       try {
//         await locator.waitFor({ state: 'visible', timeout: 10000 });
//         const handle = await locator.elementHandle();
//         if (handle) {
//           try {
//             await handle.scrollIntoViewIfNeeded();
//           } catch (scrollErr) {
//             console.warn("⚠️ scrollIntoViewIfNeeded failed: " + scrollErr.message);
//           }
//           await locator.evaluate(el => el.style.border = '2px solid red');
//         } else {
//           console.warn('⚠️ elementHandle() returned null, skipping scroll/highlight');
//         }
//       } catch (waitErr) {
//         console.warn("⚠️ Locator not visible: " + waitErr.message);
//       }
//     };







//     try {
//       // ==== AI GENERATED LOGIC STARTS HERE ====
//       ${updatedScript}
//     } catch (err) {
//       console.error('❌ Error during test steps:', err);
//       await takeShot('error_caught');
//     } finally {
//       if (page.video) {
//         try {
//             const videoPath = await page.video().path();
//           const finalPath = path.join(screenshotDir, 'test-video.webm');
//           fs.copyFileSync(videoPath, finalPath);
//           console.log('🎥 Video saved to ' + finalPath);
//         } catch (videoErr) {
//           console.warn('⚠️ Failed to save video:', videoErr.message);
//         }
//       }
//     }
//   });
// `;




// fs.writeFileSync(testFilePath, fullTestCode);


//   // Write config for this test run
//   fs.writeFileSync(configPath, `
//     module.exports = {
//       reporter: [
//         ['html', { outputFolder: '${reportDir.replace(/\\/g, '/')}' }],
//         ['json', { outputFile: '${path.join(reportDir, 'report.json').replace(/\\/g, '/')}' }]
//       ]
//     };
//   `);

//   return new Promise((resolve, reject) => {
//     // console.log('\n📄 Writing test file at:', testFilePath);
//     // fs.writeFileSync(testFilePath, fullTestCode);
//     const command = `npx playwright test ${testFilePath} --config=${configPath}`;
//     exec(command, async (err, stdout, stderr) => {
//       if (err) {
//         console.error('❌ Test execution error:',stdout, stderr);
//         return reject(stderr);
//       }

//       try {
//         const htmlPath = path.join(reportDir, 'index.html');
//         const jsonPath = path.join(reportDir, 'report.json');

//         await waitForFile(htmlPath);
//         await waitForFile(jsonPath);

//         const htmlReport = fs.readFileSync(htmlPath, 'utf-8');
//         const jsonReport = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

//         const screenshotFiles = fs
//           .readdirSync(screenshotDir)
//           .filter(file => file.toLowerCase().endsWith('.png'));

//         const screenshots = screenshotFiles.map(filename => {
//           const filePath = path.join(screenshotDir, filename);
//           const base64 = fs.readFileSync(filePath).toString('base64');
//           return { filename, base64 };
//         });

//         resolve({
//           runId,
//           testFile: testFilePath,
//           htmlReport,
//           jsonReport,
//           screenshots
//         });
//       } catch (fileError) {
//         reject(`Report generation failed: ${fileError.message}`);
//       }
//     });
//   });
// }

// module.exports = { runPlaywrightTestFromScript };


const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

async function runGeneratedTest(flowJson) {
  const runId = uuidv4();
  const runDir = path.join(__dirname, "..", "test-runs", runId);
  fs.mkdirSync(runDir, { recursive: true });

  // Write flowJson to file
  const flowJsonPath = path.join(runDir, "flow.json");
  fs.writeFileSync(flowJsonPath, JSON.stringify(flowJson, null, 2));

  // Create a temporary spec file
  const originalSpecPath = path.join(__dirname, "..", "tests", "flowRunner.spec.js");
  const tempSpecPath = path.join(runDir, "flowRunner.spec.js");
  fs.copyFileSync(originalSpecPath, tempSpecPath);

  return new Promise((resolve, reject) => {
    exec(
      `npx playwright test ${tempSpecPath} --project=chromium --output=${runDir}`,
      {
        env: {
          ...process.env,
          TEST_RUN_DIR: runDir
        }
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Playwright run failed:", stderr);
          return reject(stderr);
        }
        console.log("Playwright run completed.");
        resolve({ runId, runDir, stdout });
      }
    );
  });
}

module.exports =  { runGeneratedTest } ;
