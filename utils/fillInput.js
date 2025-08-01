//   const path = require('path');
// export const fillInput = async (page, label, value) => {
//   const variants = [
//     () => page.getByLabel(label),
//     () => page.getByRole('textbox', { name: label }),
//     async () => (await page.getByText(label)).locator('input, textarea')
//   ];

// //   const takeShotFactory = async (label) => {
// //   try {
// //     await page.screenshot({ path: path.join(screenshotDir, `shot\${shot++}_${label || 'default'}.png`) });
// //   } catch (e) {
// //     console.warn('⚠️ Could not take screenshot:', e.message);
// //   }
// // };

//   for (const variant of variants) {
//     try {
//       const locator = await variant();
//       await scrollWaitAndHighlight(locator);
//       await locator.fill(value);
//       console.log("✅ Filled '" + label + "'");
//       // await takeShotFactory("after_fill_" + label.replace(/\s+/g, '_'));
//       return;
//     } catch (e) {
//       // try next variant
//     }
//   }

//   console.warn("❌ Could not fill '" + label + "'");
//   // await takeShotFactory("fillfail_" + label.replace(/\s+/g, '_'));
// };
const path = require('path');
const { takeShotFactory } = require('./takeShot');
const { scrollWaitAndHighlight } = require('./scrollWaitAndHighlight');

export const fillInput = async (page, label, value) => {
  const variants = [
    () => page.getByLabel(label),
    () => page.getByRole('textbox', { name: label }),
    () => page.getByPlaceholder(label),
    async () => {
      const textLocator = await page.getByText(label);
      return textLocator.locator('input, textarea');
    }
  ];

  for (const [i, variant] of variants.entries()) {
    try {
      console.log(`🔍 Trying variant ${i + 1} for label '${label}'`);
      const locator = await variant();

      // Check if locator is valid and has a fill function
      if (!locator || typeof locator.fill !== 'function') {
        throw new Error("Invalid locator object returned");
      }

      // Optional: highlight or scroll into view
      // await scrollWaitAndHighlight(locator);

      await locator.fill(value);
      console.log(`✅ Filled '${label}' using variant ${i + 1}`);
      await takeShotFactory(`after_fill_${label.replace(/\s+/g, '_')}`);
      return; // Success, exit early
    } catch (e) {
      console.log(`⚠️ Variant ${i + 1} failed for label '${label}': ${e.message}`);
    }
  }

  // If all variants fail
  console.warn(`❌ Could not fill '${label}' with any variant`);

  try {
    const content = await page.content();
    console.log(`🧾 Page content snapshot:\n${content}`);
  } catch (e) {
    console.log('⚠️ Could not get page content:', e.message);
  }

  await takeShotFactory(`after_fill_failed_${label.replace(/\s+/g, '_')}`);
};
