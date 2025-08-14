export async function selectDropdown(page, label, value) {
  console.log(`Selecting "${value}" from "${label}" dropdown`);

  try {
    // Special handling for Schneider Electric client dropdown
    if (label.toLowerCase() === 'client') {
      // Wait for the page to fully load after login
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Try multiple strategies to find the client dropdown
      const dropdownSelectors = [
        // Common selectors for Resource Advisor
        'select[name="client"]',
        'select[id="clientDropdown"]',
        'div[role="combobox"][aria-label*="Client"]',
        'div.client-selector select',
        // Fallback to any dropdown
        'select'
      ];

      for (const selector of dropdownSelectors) {
        try {
          const dropdown = page.locator(selector).first();
          await dropdown.waitFor({ state: 'visible', timeout: 10000 });
          
          // Special handling for different dropdown types
          const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'select') {
            await dropdown.selectOption({ label: value });
          } else {
            // For custom dropdown implementations
            await dropdown.click();
            const option = await page.getByText(value, { exact: true }).first();
            await option.click();
          }

          console.log(`✅ Successfully selected "${value}" using selector: ${selector}`);
          return;
        } catch (err) {
          console.log(`⚠️ Selector failed: ${selector}`);
        }
      }

      // Fallback to click-based selection if dropdown not found
      try {
        await page.getByText(label, { exact: true }).click();
        await page.getByText(value, { exact: true }).click();
        console.log(`✅ Successfully selected via text click`);
        return;
      } catch (err) {
        console.log('⚠️ Text-based selection failed');
      }
    }

    throw new Error(`Could not find or interact with "${label}" dropdown`);
  } catch (error) {
    console.error(`❌ Failed to select from dropdown: ${error.message}`);
    throw error;
  }
}
////////////////////////////
