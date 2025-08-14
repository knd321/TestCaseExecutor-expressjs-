// import express from 'express';
// import { chromium } from 'playwright';
// import { executeTestFlow } from './tests/flowRunner.spec.js';

// const app = express();
// const port = 8002;

// app.use(express.json());

// app.post('/exec/execScript', async (req, res) => {
//   if (!req.body || !Array.isArray(req.body)) {
//     return res.status(400).json({ error: 'Request body must be an array of test steps' });
//   }

//   const browser = await chromium.launch({ 
//     headless: false,
//     timeout: 60000
//   });
//   const context = await browser.newContext({
//     viewport: { width: 1280, height: 720 },
//     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//   });
//   const page = await context.newPage();

//   try {
//     const testInfo = {
//       outputDir: './test-results',
//       payload: req.body
//     };

//     await executeTestFlow({ page }, testInfo);
    
//     res.json({ 
//       status: 'success',
//       message: 'Test executed successfully',
//       screenshots: `${process.cwd()}/test-results/screenshots`
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//       suggestion: 'Check if the page structure changed or try different selectors',
//       debug: {
//         url: page.url(),
//         screenshot: `${process.cwd()}/test-results/screenshots/last-error.png`
//       }
//     });
//   } finally {
//     await browser.close();
//   }
// });

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
///////////////////////////////////////////////////////////////

import express from 'express';
import { chromium } from 'playwright';
import { executeTestFlow } from './tests/flowRunner.spec.js';

const app = express();
const port = 8002;

app.use(express.json());

app.post('/exec/execScript', async (req, res) => {
  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be an array of test steps' });
  }

  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    const testInfo = {
      outputDir: './test-results',
      payload: req.body
    };

    await executeTestFlow({ page }, testInfo);
    
    res.json({ 
      status: 'success',
      message: 'Test executed successfully',
      screenshots: `${process.cwd()}/test-results/screenshots`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      suggestion: 'Check if the page structure changed or try different selectors'
    });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
////////////////////////////2nd 
