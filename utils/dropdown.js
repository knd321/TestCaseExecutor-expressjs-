
export async function selectDropdown(page, labelText, value) {
  console.log(`🔍 Trying to select "${value}" for label "${labelText}"`);

  try {
    // Ensure page is stable before starting
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 🧠 Step 1: Find the label element
    const label = page.locator(`text=${labelText}`);
    await label.waitFor({ timeout: 10000 });

    const labelBox = await label.boundingBox();
    if (!labelBox) throw new Error(`Label "${labelText}" not visible`);

    // 🧠 Step 2: Collect all potential dropdown-like elements nearby
    const dropdownCandidates = page.locator(
      'select, input, [role=combobox], div[class*=dropdown], div[class*=select], div[tabindex]'
    );

    const count = await dropdownCandidates.count();
    let closest = null;
    let minDist = Infinity;

    // 🧠 Step 3: Choose the closest candidate to the label
    for (let i = 0; i < count; i++) {
      const box = await dropdownCandidates.nth(i).boundingBox();
      if (!box) continue;

      const dx = box.x - labelBox.x;
      const dy = box.y - labelBox.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        closest = dropdownCandidates.nth(i);
      }
    }

    if (!closest) throw new Error(`No dropdown found near label "${labelText}"`);

    await closest.scrollIntoViewIfNeeded();
    await closest.waitFor({ timeout: 8000 });

    // 🧠 Step 4: Act based on the element type
    const tagName = await closest.evaluate(el => el.tagName.toLowerCase());

    if (tagName === 'select') {
      // 🧠 If it's a native <select>, use selectOption
      await closest.selectOption({ label: value });

    } else if (tagName === 'input') {
      // 🧠 If it's an input (e.g., Telerik dropdown), type and wait
      await closest.click({ force: true });
      await closest.fill('');
      await page.waitForTimeout(300);
      await closest.type(value, { delay: 50 });
      await page.waitForTimeout(1000);

    } else {
      // 🧠 Otherwise, it's likely a div-based dropdown — click to open
      await closest.click({ force: true });
      await page.waitForTimeout(500);
    }

    // 🧠 Step 5: Locate and click the option
    let option = page.getByText(value, { exact: true });
    try {
      await option.waitFor({ timeout: 5000 });
    } catch {
      // Fallback: case-insensitive regex if exact match fails
      const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      option = page.getByText(regex);
      await option.waitFor({ timeout: 5000 });
    }

    await option.scrollIntoViewIfNeeded();
    await option.click({ force: true });

    console.log(`✅ Successfully selected "${value}" for "${labelText}"`);

  } catch (err) {
    console.error(`❌ Failed to select "${value}" for label "${labelText}": ${err.message}`);
  }
}
