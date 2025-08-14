// // // import { expect } from 'playwright/test';
// // // import { promises as fs } from 'fs';
// // // import path from 'path';
// // // import { fillInput } from '../utils/fillInput.js';

// // // export async function executeTestFlow({ page }, testInfo) {
// // //   const flow = testInfo.payload;
// // //   const screenshotsDir = path.join(testInfo.outputDir, 'screenshots');
// // //   await fs.mkdir(screenshotsDir, { recursive: true });

// // //   for (let i = 0; i < flow.length; i++) {
// // //     const step = flow[i];
// // //     const stepName = `step-${i + 1}-${step.intent}`.replace(/[^a-z0-9\-]/gi, '_');

// // //     console.log(`Executing: ${stepName}`);

// // //     try {
// // //       switch (step.intent.toLowerCase()) {
// // //         case 'navigate':
// // //           await page.goto(step.url, {
// // //             waitUntil: 'networkidle',
// // //             timeout: 30000
// // //           });
// // //           await page.waitForLoadState('domcontentloaded');
// // //           break;

// // //         case 'input':
// // //           await fillInput(page, step.label, step.value);
// // //           break;

// // //         default:
// // //           throw new Error(`Unknown intent: ${step.intent}`);
// // //       }

// // //       await page.screenshot({ 
// // //         path: path.join(screenshotsDir, `${stepName}.png`),
// // //         fullPage: true
// // //       });
// // //     } catch (err) {
// // //       console.error(`Error in step ${i + 1}: ${err.message}`);
// // //       await page.screenshot({ 
// // //         path: path.join(screenshotsDir, `${stepName}-error.png`),
// // //         fullPage: true
// // //       });
// // //       throw err;
// // //     }
// // //   }
// // // }
// // //////////////////////////////////////////////////////////////////////////////////////////

// // import { expect } from 'playwright/test';
// // import { promises as fs } from 'fs';
// // import path from 'path';
// // import { fillInput } from '../utils/fillInput.js';
// // import { click } from '../utils/click.js';

// // export async function executeTestFlow({ page }, testInfo) {
// //   const flow = testInfo.payload;
// //   const screenshotsDir = path.join(testInfo.outputDir, 'screenshots');
// //   await fs.mkdir(screenshotsDir, { recursive: true });

// //   for (let i = 0; i < flow.length; i++) {
// //     const step = flow[i];
// //     const stepName = `step-${i + 1}-${step.intent}`.replace(/[^a-z0-9\-]/gi, '_');

// //     console.log(`Executing: ${stepName}`);

// //     try {
// //       switch (step.intent.toLowerCase()) {
// //         case 'navigate':
// //           await page.goto(step.url, {
// //             waitUntil: 'networkidle',
// //             timeout: 30000
// //           });
// //           break;

// //         case 'input':
// //           await fillInput(page, step.label, step.value);
// //           break;

// //         case 'click':
// //           await click(page, step.text);
// //           break;

// //         default:
// //           throw new Error(`Unknown intent: ${step.intent}`);
// //       }

// //       await page.waitForTimeout(1000); // Short pause between steps
// //       await page.screenshot({ 
// //         path: path.join(screenshotsDir, `${stepName}.png`),
// //         fullPage: true
// //       });
// //     } catch (err) {
// //       console.error(`Error in step ${i + 1}: ${err.message}`);
// //       await page.screenshot({ 
// //         path: path.join(screenshotsDir, `${stepName}-error.png`),
// //         fullPage: true
// //       });
// //       throw err;
// //     }
// //   }
// // }  2nd stp


import { expect } from 'playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { fillInput } from '../utils/fillInput.js';
import { click } from '../utils/click.js';
import { selectDropdown } from '../utils/dropdown.js';

export async function executeTestFlow({ page }, testInfo) {
  const flow = testInfo.payload;
  const screenshotsDir = path.join(testInfo.outputDir, 'screenshots');
  await fs.mkdir(screenshotsDir, { recursive: true });

  // Log video path if you want to track it
  if (testInfo.videoPath) {
    console.log(`Video will be saved to: ${testInfo.videoPath}`);
  }

  for (let i = 0; i < flow.length; i++) {
    const step = flow[i];
    const stepName = `step-${i + 1}-${step.intent}`.replace(/[^a-z0-9\-]/gi, '_');

    console.log(`Executing: ${stepName}`);

    try {
      switch (step.intent.toLowerCase()) {
        case 'navigate':
          await page.goto(step.url, { waitUntil: 'networkidle', timeout: 30000 });
          break;

        case 'input':
          await fillInput(page, step.label, step.value);
          break;

        case 'click':
          await click(page, step.text);
          break;

        case 'select':
          await selectDropdown(page, step.label, step.value);
          break;

        default:
          throw new Error(`Unknown intent: ${step.intent}`);
      }

      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, `${stepName}.png`),
        fullPage: true
      });
    } catch (err) {
      console.error(`Error in step ${i + 1}: ${err.message}`);
      await page.screenshot({ 
        path: path.join(screenshotsDir, `${stepName}-error.png`),
        fullPage: true
      });
      throw err;
    }
  }
}