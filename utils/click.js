export async function click(page, text) {
  console.log(`Clicking element with text "${text}"`);
  
  try {
    // Try multiple strategies to find clickable elements
    const clickSelectors = [
      `button:has-text("${text}")`,
      `a:has-text("${text}")`,
      `input[type="button"][value="${text}"], input[type="submit"][value="${text}"]`,
      `text="${text}"`
    ];

    for (const selector of clickSelectors) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        await element.click();
        console.log(`✅ Successfully clicked using selector: ${selector}`);
        return;
      } catch (err) {
        console.log(`⚠️ Click selector failed: ${selector}`);
      }
    }

    throw new Error(`Could not find clickable element with text "${text}"`);
  } catch (error) {
    console.error(`❌ Failed to click "${text}": ${error.message}`);
    throw error;
  }
}