import { test, expect, type Page } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// API Mocks — intercept every backend call so the test runs without a real API
// ─────────────────────────────────────────────────────────────────────────────
async function mockAllApis(page: Page) {
	// Login
	await page.route("**/auth/login", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				user: { id: 1, name: "Test User", email: "test@example.com" },
				accessToken: "mock-access-token",
				refreshToken: "mock-refresh-token",
			}),
		}),
	);

	// Logout
	await page.route("**/auth/logout", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ message: "Logged out successfully" }),
		}),
	);

	// Users list
	await page.route("**/users", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([
				{
					id: 1,
					name: "Test User",
					email: "test@example.com",
					createdAt: "2026-03-01T10:00:00.000Z",
				},
			]),
		}),
	);

	// Topics list
	await page.route("**/topics", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([
				{
					id: 1,
					label: "React",
					description: "React framework",
					subTopics: [{ id: 1, label: "Components", topicId: 1 }],
					createdAt: "2026-03-01T10:00:00.000Z",
					updatedAt: "2026-03-01T10:00:00.000Z",
				},
			]),
		}),
	);

	// Skill-matrix entries
	await page.route("**/skill-matrix", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([
				{
					id: 1,
					userId: 1,
					topicId: 1,
					value: 88,
					createdAt: "2026-03-01T10:00:00.000Z",
					updatedAt: "2026-03-01T10:00:00.000Z",
				},
			]),
		}),
	);
}

async function loginToDashboard(page: Page) {
	await page.goto("/");
	await expect(page).toHaveURL(/\/login$/);
	await expect(page.locator("#login-form-email-id, #login-form-email").first()).toBeVisible();

	await page.locator("#login-form-email-id, #login-form-email").first().fill("test@example.com");
	await page.locator("#login-form-password").fill("Password123!");
	await page.getByTestId("login-submit-btn").click();

	await page.waitForURL("**/dashboard", { timeout: 10000 });
	await expect(page).toHaveURL(/\/dashboard$/);
}

// ─────────────────────────────────────────────────────────────────────────────
// Full application navigation flow
// ─────────────────────────────────────────────────────────────────────────────
test("Full app flow: Login → Dashboard → SkillMatrix → Reports → Logout", async ({ page }) => {
	await mockAllApis(page);

	// ── Step 1 + Step 2: Open app and login ───────────────────────────────────
	await loginToDashboard(page);

	// ── Step 3: Dashboard ─────────────────────────────────────────────────────
	await page.waitForURL("**/dashboard", { timeout: 10000 });
	await expect(page).toHaveURL(/\/dashboard$/);
	// Header title updates to match the current page
	await expect(page.locator("header h2")).toContainText("Dashboard");
	// KPI cards rendered from skill-matrix data
	await expect(page.getByText("Total Users")).toBeVisible();

	// ── Step 4: Navigate → Skill Matrix ──────────────────────────────────────
	await page.getByTestId("navlink-/skillMatrix").click();
	await page.waitForURL("**/skillMatrix", { timeout: 10000 });
	await expect(page).toHaveURL(/\/skillMatrix$/);
	await expect(page.locator("header h2")).toContainText("Skill Matrix");
	// Table must be visible with the first column header
	await expect(page.locator("table")).toBeVisible();
	await expect(page.locator("table thead th").first()).toContainText(/User \/ (Skill|Topic)/);

	// ── Step 5: Navigate → Reports ────────────────────────────────────────────
	await page.getByTestId("navlink-/reports").click();
	await page.waitForURL("**/reports", { timeout: 10000 });
	await expect(page).toHaveURL(/\/reports$/);
	await expect(page.locator("header h2")).toContainText("Reports");

	// ── Step 6: Navigate back → Dashboard ────────────────────────────────────
	await page.getByTestId("navlink-/dashboard").click();
	await page.waitForURL("**/dashboard", { timeout: 10000 });
	await expect(page).toHaveURL(/\/dashboard$/);
	await expect(page.locator("header h2")).toContainText("Dashboard");

	// ── Step 7: Logout via profile menu ──────────────────────────────────────
	await page.getByTestId("profile-trigger").click();
	await expect(page.getByTestId("profile-dropdown")).toBeVisible();
	await page.getByTestId("menu-item-logout").click();
	await page.waitForURL("**/login", { timeout: 10000 });
	await expect(page).toHaveURL(/\/login$/);
	// Login form reappears — session is fully cleared
	await expect(page.locator("#login-form-email-id, #login-form-email").first()).toBeVisible();
});

test("Dashboard components and sidebar navigation flow", async ({ page }) => {
	await mockAllApis(page);
	await loginToDashboard(page);

	// Validate KPICards content.
	await expect(page.getByText("Total Users")).toBeVisible();
	await expect(page.getByText(/^Topics$/).first()).toBeVisible();
	await expect(page.getByText("Total Skills")).toBeVisible();
	await expect(page.getByText("Skills per User")).toBeVisible();
	await expect(page.getByText("Topics Covered")).toBeVisible();

	// Validate all requested dashboard components.
	await expect(page.getByRole("heading", { name: /Top Performers/i })).toBeVisible();
	await expect(page.getByRole("heading", { name: /Learning Recommendations/i })).toBeVisible();
	await expect(page.getByRole("heading", { name: /Skill Coverage Analysis/i })).toBeVisible();
	await expect(page.getByRole("heading", { name: /Team Insights/i })).toBeVisible();
	await expect(page.getByRole("heading", { name: /Skill Distribution/i })).toBeVisible();

	// Sidebar entries must be visible.
	await expect(page.getByTestId("navlink-/dashboard")).toBeVisible();
	await expect(page.getByTestId("navlink-/skillMatrix")).toBeVisible();
	await expect(page.getByTestId("navlink-/reports")).toBeVisible();

	// Sidebar navigation flow.
	await page.getByTestId("navlink-/skillMatrix").click();
	await page.waitForURL("**/skillMatrix", { timeout: 10000 });
	await expect(page.locator("header h2")).toContainText("Skill Matrix");

	await page.getByTestId("navlink-/reports").click();
	await page.waitForURL("**/reports", { timeout: 10000 });
	await expect(page.locator("header h2")).toContainText("Reports");

	await page.getByTestId("navlink-/dashboard").click();
	await page.waitForURL("**/dashboard", { timeout: 10000 });
	await expect(page.locator("header h2")).toContainText("Dashboard");
});
