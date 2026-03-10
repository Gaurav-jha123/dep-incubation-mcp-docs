import { test, expect } from '@playwright/test';

test('should display the correct title on the home page', async ({ page }) => {
  await page.goto('/');
  
  // Expect the title to be correct
  await expect(page).toHaveTitle('dep-incubation-dashboard');
  
  // Since home page redirects to login, check for login form
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('text=Welcome to')).toBeVisible();
});

test('should navigate to dashboard after login', async ({ page }) => {
  await page.goto('/login');
  
  // Wait for login form to load
  await page.waitForSelector('#login-form-email-id');
  
  // Perform login
  await page.fill('#login-form-email-id', 'test@example.com');
  await page.fill('#login-form-password', 'Password123!');
  await page.click('[data-testid="login-submit-btn"]');
  
  // Should redirect to dashboard
  await page.waitForURL('**/dashboard');
  
  // Expect the skill matrix table to be visible on dashboard
  await expect(page.locator('table')).toBeVisible();
});