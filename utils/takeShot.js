// utils/takeShot.js
const path = require('path');
const fs = require('fs');

function takeShotFactory(page, screenshotDir) {
  let shot = 1;

  return async function takeShot(label) {
    try {
      fs.mkdirSync(screenshotDir, { recursive: true });
      await page.screenshot({
        path: path.join(screenshotDir, `shot${shot++}_${label || 'default'}.png`),
      });
    } catch (e) {
      console.warn('⚠️ Could not take screenshot:', e.message);
    }
  };
}

module.exports = { takeShotFactory };
