import { test, expect } from '@playwright/test';

test('should display the correct title on the about page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Expect the title to be "About Playwright"
  await expect(page).toHaveTitle('dep-incubation-dashboard');
  await expect(page.locator('h1').nth(1)).toHaveText('Dashboard');
});

test('should navigate to the user form page and display the form', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Click on the user form link
  await page.click('a[href="/userform"]');
  
  // Expect the user form to be visible
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('h2')).toHaveText('User Form');
});