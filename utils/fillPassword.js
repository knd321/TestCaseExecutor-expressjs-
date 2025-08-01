//   const path = require('path');
// export const fillPassword = async (page, label, value) => {
//   const variants = [
//     () => page.getByLabel(label),
//     () => page.getByRole('textbox', { name: label }),
//     async () => (await page.getByText(label)).locator('input, textarea')
//   ];

//   //   const takeShotFactory = async (label) => {
//   // try {
//   //   await page.screenshot({ path: path.join(screenshotDir, `shot\${shot++}_${label || 'default'}.png`) });
//   // } catch (e) {
//   //   console.warn('⚠️ Could not take screenshot:', e.message);
//   // }
//   // };


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
const {takeShotFactory} = require('./takeShot')
const { scrollWaitAndHighlight } = require('./scrollWaitAndHighlight');
export const fillPassword = async (page, label, value) => {
  const variants = [
    () => page.getByLabel(label),
    () => page.getByRole('textbox', { name: label }),
    () => page.getByPlaceholder(label),
    async () => (await page.getByText(label)).locator('input[type="password"], input, textarea'),
    () => page.locator('input[type="password"]') // Catch-all for password fields
  ];

  for (const [i, variant] of variants.entries()) {
    try {
      const locator = await variant();
      // await scrollWaitAndHighlight(locator);
      await locator.fill(value);
      console.log(`✅ Filled '${label}' with '********'`);
      await takeShotFactory("after_fill_" + label.replace(/\s+/g, '_'));
      return;
    } catch (e) {
      console.log(`⚠️ Variant ${i + 1} failed for '${label}': ${e.message}`);
    }
  }

  console.warn(`❌ Could not fill password for '${label}'`);

  // Optional: Debugging snapshot (not recommended if passwords are visible)
  try {
    const content = await page.content();
    console.log(`🧾 Page HTML (sanitized) for '${label}':\n${content}`);
  } catch (e) {
    console.log('⚠️ Could not capture page content:', e.message);
    await takeShotFactory("after_fill_" + label.replace(/\s+/g, '_'));
  }
};
