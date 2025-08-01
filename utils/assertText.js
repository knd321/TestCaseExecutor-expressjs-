const { scrollWaitAndHighlight } = require('./scrollWaitAndHighlight');
const {takeShotFactory} = require('./takeShot')
export const assertTextVisible = async (page, text) => {
  try {
    const locator = page.getByText(text);
    await scrollWaitAndHighlight(locator);
    console.log("✅ Found '" + text + "'");
  } catch (e) {
    console.warn("❌ Could not find '" + text + "'");
    await takeShotFactory("missing_" + text.replace(/\s+/g, '_'));
  }
};
