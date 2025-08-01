// utils/scrollWaitAndHighlight.js

async function scrollWaitAndHighlight(locator) {
  try {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    const handle = await locator.elementHandle();
    if (handle) {
      try {
        await handle.scrollIntoViewIfNeeded();
      } catch (scrollErr) {
        console.warn("⚠️ scrollIntoViewIfNeeded failed: " + scrollErr.message);
      }
      await locator.evaluate(el => el.style.border = '2px solid red');
    } else {
      console.warn('⚠️ elementHandle() returned null, skipping scroll/highlight');
    }
  } catch (waitErr) {
    console.warn("⚠️ Locator not visible: " + waitErr.message);
  }
}

module.exports = { scrollWaitAndHighlight };
