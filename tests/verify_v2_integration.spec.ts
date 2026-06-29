
import { test, expect } from '@playwright/test';

test('verify url scanner integration', async ({ page }) => {
  await page.goto('http://localhost:5173/url-scanner');
  await page.waitForTimeout(2000);

  const input = page.getByPlaceholder('https://suspicious-link.com');
  await input.fill('https://paypal-login-security.xyz/login');
  await page.getByRole('button', { name: 'Start Analysis' }).click();

  // Wait for results directly since loading might be too fast
  await expect(page.getByText('Analysis Results')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('paypal-login-security.xyz')).toBeVisible();

  // Take screenshot of results
  await page.screenshot({ path: 'v2_analysis_results.png', fullPage: true });
});

test('verify url scanner error handling', async ({ page }) => {
  await page.goto('http://localhost:5173/url-scanner');
  await page.waitForTimeout(2000);

  const input = page.getByPlaceholder('https://suspicious-link.com');
  await input.fill('invalid-url');
  await page.getByRole('button', { name: 'Start Analysis' }).click();

  await expect(page.getByText('Invalid or malformed URL')).toBeVisible();
  await page.screenshot({ path: 'v2_error_handling.png' });
});
