import { test, expect } from '@playwright/test';

test('landing page loads and has correct title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('text=Detect Phishing')).toBeVisible();
  await page.screenshot({ path: 'landing-page.png', fullPage: true });
});

test('navigation works', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.click('text=URL Scanner');
  await expect(page).toHaveURL(/\/url-scanner/);
  await expect(page.locator('text=URL Threat Analyzer')).toBeVisible();
  await page.screenshot({ path: 'url-scanner.png' });
});

test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/');
  // Toggle is the button with md:hidden class
  await page.click('button.md\\:hidden');
  // Select the link that has the larger font size (the mobile menu link)
  const mobileLink = page.locator('a[href="/email-scanner"].text-lg');
  await expect(mobileLink).toBeVisible();
  await page.screenshot({ path: 'mobile-menu.png' });
});
