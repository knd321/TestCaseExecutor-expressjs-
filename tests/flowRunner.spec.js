

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('🔁 Execute flow steps from flow.json', async ({ page }, testInfo) => {
  const raw = process.env.FLOW_JSON_FROM_REQUEST;
  if (!raw) throw new Error('No script passed in env');

  const flow = JSON.parse(raw);
  const screenshotsDir = path.join(testInfo.outputDir, 'step-screens');

  fs.mkdirSync(screenshotsDir, { recursive: true });

  for (let i = 0; i < flow.length; i++) {
    const step = flow[i];
    const stepName = `step-${i + 1}-${step.type}${step.text ? '-' + step.text : ''}`.replace(/[^a-z0-9\-]/gi, '_');
    console.log(`🔹 Executing: ${stepName}`);

    switch (step.type) {
      case 'goto':
        await page.goto(step.url);
        await page.screenshot({ path: path.join(screenshotsDir, `${stepName}.png`) });
        break;

      case 'click': {
        const locator = page.getByText(step.text, { exact: true });

        // Highlight the element (temporary outline via JS)
        await locator.evaluate(el => {
          el.style.outline = '3px solid red';
        });

        await locator.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200); // just to let highlight be visible in screenshot
        await page.screenshot({ path: path.join(screenshotsDir, `${stepName}.png`) });

        await locator.click();
        break;
      }

      // Add more step types if needed

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }
});
