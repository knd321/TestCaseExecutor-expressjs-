export async function scrollWaitAndHighlight(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  try {
    await locator.evaluate((el) => {
      const originalOutline = el.style.outline;
      el.style.outline = '2px solid red';
      setTimeout(() => {
        el.style.outline = originalOutline;
      }, 1000);
    });
  } catch (err) {
    console.warn(`⚠️ Could not highlight element: ${err.message}`);
  }
}
