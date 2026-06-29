import { test, expect } from '@playwright/test';

test.describe('PhishGuard AI Phase 3 - AI Integration & Email Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should navigate to Email Scanner and perform analysis', async ({ page }) => {
    await page.click('nav >> text=Email Scanner');
    await expect(page).toHaveURL(/.*email-scanner/);

    const textarea = page.locator('textarea');
    await textarea.fill('URGENT: Your bank account has been compromised. Please verify your identity at http://evil.com/login');

    await page.click('button:has-text("Run Threat Scan")');

    await expect(page.locator('h3:has-text("Analysis Results")')).toBeVisible({ timeout: 15000 });

    // Check for classification text inside the card
    await expect(page.locator('.glass-card').filter({ hasText: 'Classification' })).toContainText('Suspicious');
    await expect(page.locator('text=Explainable AI Insights')).toBeVisible();
  });

  test('should show AI fallback message when Gemini fails (expected when no real key)', async ({ page }) => {
    await page.click('nav >> text=URL Scanner');
    const input = page.locator('input[placeholder="https://suspicious-link.com"]');
    await input.fill('https://example.com');
    await page.click('button:has-text("Start Analysis")');

    await expect(page.locator('h3:has-text("Analysis Results")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=AI explanation temporarily unavailable.')).toBeVisible();
  });
});
