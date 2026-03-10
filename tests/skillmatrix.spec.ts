import { test, expect } from '@playwright/test';
import skillMatrixData from '../src/mocks/skillMatrix';

test.describe('Skill Matrix Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login first since dashboard is protected
    await page.goto('/login');
    
    // Wait for login form to be visible
    await page.waitForSelector('#login-form-email-id', { timeout: 10000 });
    
    // Perform login to access protected routes using correct selectors
    await page.fill('#login-form-email-id', 'test@example.com');
    await page.fill('#login-form-password', 'Password123!');
    await page.click('[data-testid="login-submit-btn"]');
    
    // Wait for successful login and navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    
    // Additional wait to ensure the skill matrix component is loaded
    await page.waitForSelector('table', { timeout: 5000 });
  });

  test('should display skill matrix table with correct structure', async ({ page }) => {
    // Verify the skill matrix table is visible
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check table headers
    const headerRow = table.locator('thead tr').first();
    await expect(headerRow.locator('th').first()).toContainText('User / Skill');
    
    // Verify skill topic headers are present
    const skillHeaders = await table.locator('thead th').allTextContents();
    expect(skillHeaders.length).toBeGreaterThan(1); // Should have user column + skill columns
    
    // Check that each skill topic from mock data appears in headers
    const topicLabels = skillMatrixData.topics.map(topic => topic.label);
    for (const topic of topicLabels) {
      await expect(table.locator(`th[title="${topic}"]`)).toBeVisible();
    }
  });

  test('should display all users from mock data', async ({ page }) => {
    const table = page.locator('table tbody');
    
    // Verify each user from mock data is displayed
    for (const user of skillMatrixData.users) {
      const userRow = table.locator(`tr:has(td:text("${user.name}"))`);
      await expect(userRow).toBeVisible();
    }
    
    // Check total number of user rows
    const userRows = await table.locator('tr').count();
    expect(userRows).toBe(skillMatrixData.users.length);
  });

  test('should display skill values correctly', async ({ page }) => {
    const table = page.locator('table');
    
    // Test a few specific skill values from the mock data
    const alexUser = skillMatrixData.users.find(u => u.name === 'Alex Johnson');
    const alexSkills = skillMatrixData.skills.filter(s => s.userId === alexUser?.id);
    
    if (alexUser && alexSkills.length > 0) {
      const alexRow = table.locator(`tr:has(td:text("${alexUser.name}"))`);
      
      // Check specific skill values
      for (const skill of alexSkills.slice(0, 3)) { // Test first 3 skills
        const topic = skillMatrixData.topics.find(t => t.id === skill.topicId);
        if (topic) {
          const skillCell = alexRow.locator('td').nth(skillMatrixData.topics.findIndex(t => t.id === skill.topicId) + 1);
          await expect(skillCell).toHaveText(skill.value.toString());
        }
      }
    }
  });

  test('should have working filter controls', async ({ page }) => {
    // Check that filter controls exist
    const sortBySelect = page.locator('select').first();
    const orderSelect = page.locator('select').nth(1);
    
    await expect(sortBySelect).toBeVisible();
    await expect(orderSelect).toBeVisible();
    
    // Verify default values
    await expect(sortBySelect).toHaveValue('User / Skill');
    await expect(orderSelect).toHaveValue('ascending');
    
    // Check that all sort options are available
    const sortOptions = await sortBySelect.locator('option').allTextContents();
    expect(sortOptions).toContain('User / Skill');
    
    // Verify skill topics are in sort options
    for (const topic of skillMatrixData.topics) {
      expect(sortOptions).toContain(topic.id);
    }
  });

  test('should sort by user name correctly', async ({ page }) => {
    const table = page.locator('table tbody');
    
    // Wait for both select elements to be available
    await expect(page.locator('select').nth(1)).toBeVisible();
    
    // Test ascending order (default)
    const ascendingNames = await table.locator('tr td:first-child').allTextContents();
    const sortedNames = [...ascendingNames].sort();
    expect(ascendingNames).toEqual(sortedNames);
    
    // Change to descending order
    await page.locator('select').nth(1).selectOption('descending');
    await page.waitForTimeout(500); // Allow for re-render
    
    const descendingNames = await table.locator('tr td:first-child').allTextContents();
    const reverseSortedNames = [...ascendingNames].sort().reverse();
    expect(descendingNames).toEqual(reverseSortedNames);
  });

  test('should sort by skill values correctly', async ({ page }) => {
    // Wait for both select elements to be available
    await expect(page.locator('select').nth(1)).toBeVisible();
    
    // Select a skill column to sort by
    const firstSkillTopic = skillMatrixData.topics[0];
    await page.locator('select').first().selectOption(firstSkillTopic.id);
    await page.waitForTimeout(1000); // Increased wait time
    
    const table = page.locator('table tbody');
    const skillValues: number[] = [];
    
    // Find the correct column index for this skill topic
    const topicIndex = skillMatrixData.topics.findIndex(t => t.id === firstSkillTopic.id) + 1;
    
    // Collect skill values from the sorted column
    const rows = await table.locator('tr').count();
    for (let i = 0; i < rows; i++) {
      const cellText = await table.locator('tr').nth(i).locator('td').nth(topicIndex).textContent();
      const value = cellText && cellText.trim() ? parseInt(cellText.trim()) : -Infinity;
      skillValues.push(isNaN(value) ? -Infinity : value);
    }
    
    // Verify ascending order
    const sortedValues = [...skillValues].sort((a, b) => a - b);
    expect(skillValues).toEqual(sortedValues);
    
    // Test descending order
    await page.locator('select').nth(1).selectOption('descending');
    await page.waitForTimeout(1000);
    
    const descendingValues: number[] = [];
    for (let i = 0; i < rows; i++) {
      const cellText = await table.locator('tr').nth(i).locator('td').nth(topicIndex).textContent();
      const value = cellText && cellText.trim() ? parseInt(cellText.trim()) : -Infinity;
      descendingValues.push(isNaN(value) ? -Infinity : value);
    }
    
    const reverseSortedValues = [...skillValues].sort((a, b) => b - a);
    expect(descendingValues).toEqual(reverseSortedValues);
  });

  test('should handle table scrolling for large datasets', async ({ page }) => {
    const tableContainer = page.locator('.overflow-x-auto');
    await expect(tableContainer).toBeVisible();
    
    // Check if horizontal scrolling is enabled
    const isScrollable = await tableContainer.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });
    
    if (isScrollable) {
      // Test horizontal scroll
      await tableContainer.hover();
      await page.mouse.wheel(100, 0); // Scroll horizontally
      
      const scrollLeft = await tableContainer.evaluate(el => el.scrollLeft);
      expect(scrollLeft).toBeGreaterThan(0);
    }
    
    // Check vertical scrolling container
    const verticalContainer = page.locator('[class*="max-h"]');
    await expect(verticalContainer).toBeVisible();
  });

  test('should display correct skill matrix statistics', async ({ page }) => {
    // Count total number of skills displayed
    const table = page.locator('table');
    const dataRows = await table.locator('tbody tr').count();
    const skillColumns = await table.locator('thead th').count() - 1; // Minus user name column
    
    expect(dataRows).toBe(skillMatrixData.users.length);
    expect(skillColumns).toBe(skillMatrixData.topics.length);
    
    // Verify no empty skill values where data exists
    const nonEmptyCells = await table.locator('tbody td:not(:first-child)').filter({ hasNotText: '' }).count();
    expect(nonEmptyCells).toBeGreaterThan(0);
  });

  test('should handle sticky column and header behavior', async ({ page }) => {
    const table = page.locator('table');
    
    // Check sticky positioning classes
    const stickyHeader = table.locator('th.sticky');
    await expect(stickyHeader.first()).toBeVisible();
    
    const stickyUserColumn = table.locator('td.sticky');
    await expect(stickyUserColumn.first()).toBeVisible();
    
    // Verify z-index layering for sticky elements
    const headerZIndex = await stickyHeader.first().evaluate(el => 
      getComputedStyle(el).zIndex
    );
    expect(parseInt(headerZIndex)).toBeGreaterThan(10);
  });

  test('should display tooltips for skill topics', async ({ page }) => {
    const table = page.locator('table thead');
    
    // Test tooltip on skill headers (title attributes)
    for (const topic of skillMatrixData.topics.slice(0, 3)) { // Test first 3 topics
      const header = table.locator(`th[title="${topic.label}"]`);
      await expect(header).toBeVisible();
      
      // Hover to potentially trigger tooltip
      await header.hover();
      const title = await header.getAttribute('title');
      expect(title).toBe(topic.label);
    }
  });

  test('should show sort indicators correctly', async ({ page }) => {
    // Wait for both select elements to be available
    await expect(page.locator('select').nth(1)).toBeVisible();
    
    // Check initial sort indicator on User/Skill column
    const userHeader = page.locator('th:has-text("User / Skill")');
    await expect(userHeader.locator('span')).toHaveText('▲'); // Ascending arrow
    
    // Change to descending and check arrow
    await page.locator('select').nth(1).selectOption('descending');
    await page.waitForTimeout(300);
    
    await expect(userHeader.locator('span')).toHaveText('▼'); // Descending arrow
    
    // Switch to a skill column and verify arrow moves
    const firstSkillTopic = skillMatrixData.topics[0];
    await page.locator('select').first().selectOption(firstSkillTopic.id);
    await page.waitForTimeout(300);
    
    const skillHeader = page.locator(`th[title="${skillMatrixData.topics[0].label}"]`);
    await expect(skillHeader.locator('span')).toHaveText('▼');
    
    // User column should no longer have arrow
    await expect(userHeader.locator('span')).toHaveCount(0);
  });

  test('should maintain responsive design', async ({ page }) => {
    // Test on different viewport sizes
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('table')).toBeVisible();
    
    // Test on mobile-like viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Table should still be accessible via horizontal scroll
    const scrollContainer = page.locator('.overflow-x-auto');
    await expect(scrollContainer).toBeVisible();
    
    // Filter controls should remain accessible
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('select').nth(1)).toBeVisible();
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    const table = page.locator('table tbody');
    
    // Look for empty skill cells (should show empty string, not undefined/null)
    const emptyCells = table.locator('td:empty');
    const emptyCellCount = await emptyCells.count();
    
    // Empty cells should render as empty strings, not show "undefined" or "null"
    if (emptyCellCount > 0) {
      for (let i = 0; i < Math.min(emptyCellCount, 5); i++) {
        const cellText = await emptyCells.nth(i).textContent();
        expect(cellText).toBe('');
      }
    }
    
    // Verify numeric values are properly formatted
    const skillCells = table.locator('td:not(:first-child):not(:empty)');
    const skillCellCount = await skillCells.count();
    
    for (let i = 0; i < Math.min(skillCellCount, 10); i++) {
      const cellText = await skillCells.nth(i).textContent();
      if (cellText && cellText.trim()) {
        const numericValue = parseInt(cellText.trim());
        expect(numericValue).toBeGreaterThanOrEqual(0);
        expect(numericValue).toBeLessThanOrEqual(100);
      }
    }
  });
});
