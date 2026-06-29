
import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'url_scanner', path: '/url-scanner' },
  { name: 'email_scanner', path: '/email-scanner' },
  { name: 'about', path: '/about' },
];

for (const pageInfo of pages) {
  test(`verify ${pageInfo.name} page`, async ({ page }) => {
    await page.goto(`http://localhost:5173${pageInfo.path}`);

    // Wait for animations to complete
    await page.waitForTimeout(2000);

    // Check if main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Take full page screenshot
    await page.screenshot({ path: `v2_${pageInfo.name}.png`, fullPage: true });

    // Check for specific elements
    if (pageInfo.name === 'home') {
      await expect(page.getByText('Detect Phishing Before It Detects You')).toBeVisible();
    } else if (pageInfo.name === 'url_scanner') {
      await expect(page.getByText('URL Threat Analyzer')).toBeVisible();
      await expect(page.getByPlaceholder('https://suspicious-link.com')).toBeVisible();
    }
  });
}

test('verify mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/');

  // The menu button is visible only on mobile (hidden on desktop)
  const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
  await menuButton.waitFor({ state: 'visible' });
  await menuButton.click();

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v2_mobile_menu.png' });

  // Check if mobile links are visible in the header menu (not the footer)
  await expect(page.locator('header').getByRole('link', { name: 'URL Scanner' })).toBeVisible();
});
