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
import path from 'path';
import fs from 'fs';

const app = express();
const port = 8002;

app.use(express.json());

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

app.post('/exec/execScript', async (req, res) => {
  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be an array of test steps' });
  }

  const videosDir = path.join(process.cwd(), 'test-results', 'videos');
  ensureDirExists(videosDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const videoFilename = `test-recording-${timestamp}.webm`;
  const videoPath = path.join(videosDir, videoFilename);

  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videosDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    const testInfo = {
      outputDir: './test-results',
      payload: req.body
    };

    await executeTestFlow({ page }, testInfo);

    // Properly close context to finalize video
    const video = page.video();
    await context.close();

    if (!video) {
      throw new Error('Video recording not available');
    }

    // Get the actual video path from Playwright
    const recordedVideoPath = await video.path();
    if (!fs.existsSync(recordedVideoPath)) {
      throw new Error('Video file was not created');
    }

    // Rename to our desired filename
    fs.renameSync(recordedVideoPath, videoPath);

    // Set download headers
    res.setHeader('Content-Disposition', `attachment; filename="${videoFilename}"`);
    res.setHeader('Content-Type', 'video/webm');

    // Stream the video
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);

    videoStream.on('end', () => {
      try {
        fs.unlinkSync(videoPath);
      } catch (e) {
        console.error('Error cleaning up video:', e);
      }
    });

    videoStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).end();
    });

  } catch (error) {
    console.error('Test error:', error);
    
    try {
      const video = page.video();
      if (video) {
        const recordedVideoPath = await video.path();
        if (fs.existsSync(recordedVideoPath)) {
          res.setHeader('Content-Disposition', `attachment; filename="error-${videoFilename}"`);
          res.setHeader('Content-Type', 'video/webm');
          fs.createReadStream(recordedVideoPath).pipe(res);
          return;
        }
      }
    } catch (e) {
      console.error('Error handling failed test video:', e);
    }

    res.status(500).json({ 
      error: error.message,
      suggestion: 'Check test steps and website availability'
    });
  } finally {
    try {
      await browser.close();
    } catch (e) {
      console.error('Error closing browser:', e);
    }
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});