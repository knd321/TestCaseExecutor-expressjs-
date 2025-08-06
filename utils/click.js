// const { scrollWaitAndHighlight } = require('./scrollWaitAndHighlight');

export async function click(page, labelText) {
  console.log(`🔍 Trying to click element with label "${labelText}"`);

  try {
    // 🛡 Step 0: Wait for page to be stable
    let waited = 0;
    while (waited < 10000) {
      if (page.isClosed()) throw new Error("Page is closed before click attempt");
      const state = await page.evaluate(() => document.readyState);
      if (state === "complete" || state === "interactive") break;
      await page.waitForTimeout(500);
      waited += 500;
    }

    // 🧠 Step 1: Try role-based match
    let target = page.getByRole('button', { name: labelText }).first();
    if (await isVisible(target)) {
      return await retryClick(target, labelText, 'getByRole');
    }

    // 🧠 Step 2: Try exact text match
    target = page.getByText(labelText, { exact: true }).first();
    if (await isVisible(target)) {
      return await retryClick(target, labelText, 'getByText exact');
    }

    // 🧠 Step 3: Try regex match
    const regex = new RegExp(labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    target = page.getByText(regex).first();
    if (await isVisible(target)) {
      return await retryClick(target, labelText, 'getByText regex');
    }

    // 🧠 Step 4: Proximity fallback
    const labelNode = page.locator(`text=${labelText}`);
    await labelNode.waitFor({ timeout: 5000 });

    const labelBox = await labelNode.boundingBox();
    if (!labelBox) throw new Error(`Label "${labelText}" not visible`);

    const clickables = page.locator(
      'button, a, [role=button], [onclick], [tabindex], svg[onclick], div[class*=button]'
    );

    const count = await clickables.count();
    let closest = null;
    let minDist = Infinity;

    for (let i = 0; i < count; i++) {
      const el = clickables.nth(i);
      const box = await el.boundingBox();
      if (!box) continue;

      const dx = box.x - labelBox.x;
      const dy = box.y - labelBox.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        closest = el;
      }
    }

    if (!closest) throw new Error(`No clickable element found near label "${labelText}"`);

    return await retryClick(closest, labelText, 'proximity fallback');

  } catch (err) {
    console.error(`❌ Failed to click element with label "${labelText}": ${err.message}`);
  }
}

// 🔁 Retryable click with logging and highlight
async function retryClick(target, labelText, strategy) {
await target.page().waitForLoadState('domcontentloaded');

const timeout = 10000;
const start = Date.now();
let lastError = null;

while (Date.now() - start < timeout) {
  try {
    if (target.page().isClosed()) throw new Error("Page is closed");

    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ timeout: 3000 });

    try {
      await highlight(target);
    } catch (e) {
      console.warn("⚠️ Skipped highlight (evaluate failed)");
    }

    await target.click({ force: true });
    console.log(`✅ Clicked "${labelText}" via ${strategy}`);
    return;
  } catch (err) {
    lastError = err;
    await target.page().waitForTimeout(500);
  }
}

throw new Error(`Timeout while trying to click "${labelText}" via ${strategy}: ${lastError?.message}`);

}

// 🧪 Is element visible?
async function isVisible(locator) {
  try {
    await locator.waitFor({ timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

// 🔴 Visual outline for debugging
async function highlight(locator) {
  try {
    if (locator.page().isClosed()) return;
    await locator.evaluate(el => {
      el.style.outline = '2px solid red';
      el.style.transition = 'outline 0.3s ease-in-out';
    });
  } catch (err) {
    // Silent fallback
  }
}
