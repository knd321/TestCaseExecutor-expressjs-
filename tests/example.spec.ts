import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await page.goto('https://www.iana.org/help/example-domains');
});