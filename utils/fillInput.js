export async function fillInput(page, label, value) {
  console.log(`Filling ${label} with ${value}`);
  
  try {
    // Try multiple selector strategies for input fields
    const inputSelectors = [
      `input[name="${label}"], input[id="${label}"]`,
      `input[name*="${label.toLowerCase()}" i], input[id*="${label.toLowerCase()}" i]`,
      `input[placeholder*="${label}"], textarea[placeholder*="${label}"]`,
      `input[type="text"], input[type="email"]`,
      'input:not([type="hidden"])'
    ];

    for (const selector of inputSelectors) {
      try {
        const input = page.locator(selector).first();
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(value);
        console.log(`✅ Successfully filled using selector: ${selector}`);
        return;
      } catch (err) {
        console.log(`⚠️ Input selector failed: ${selector}`);
      }
    }

    // Special handling for password fields
    if (label.toLowerCase().includes('password')) {
      const passwordField = await page.locator('input[type="password"]').first();
      await passwordField.waitFor({ state: 'visible', timeout: 5000 });
      await passwordField.fill(value);
      console.log(`✅ Successfully filled password field`);
      return;
    }

    throw new Error(`Could not find ${label} field with any selector strategy`);
  } catch (error) {
    console.error(`❌ Failed to fill ${label}: ${error.message}`);
    throw error;
  }
}
////////////////////////////////////////////////////
