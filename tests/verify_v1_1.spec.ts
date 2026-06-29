
import { test, expect } from '@playwright/test';

test('verify loading screen and home page', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Verify loading screen exists initially
  const loader = page.getByRole('heading', { name: 'PHISHGUARD AI' });
  await expect(loader).toBeVisible();

  // Wait for loader to disappear
  await page.waitForTimeout(2000);
  await expect(loader).not.toBeVisible();

  // Verify hero section
  await expect(page.getByText('Detect Phishing')).toBeVisible();
});

test('verify navbar refinement', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);

  // Check the logo link Specifically in header
  const logoLink = page.locator('header').getByRole('link', { name: 'PhishGuard AI Home' });
  await expect(logoLink).toBeVisible();

  // Check active link indicator
  const homeLink = page.locator('header').getByRole('link', { name: 'Home', exact: true });
  await expect(homeLink).toHaveClass(/text-accent-primary/);
});

test('verify mobile menu accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);

  const menuBtn = page.getByRole('button', { name: 'Open menu' });
  await expect(menuBtn).toBeVisible();
  await menuBtn.click();

  const closeBtn = page.getByRole('button', { name: 'Close menu' });
  await expect(closeBtn).toBeVisible();
});
