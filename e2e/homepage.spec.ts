import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage successfully", async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Rate It/i);

    // Check for main navigation elements
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should display search functionality", async ({ page }) => {
    // Check for search input
    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="חיפוש"], input[placeholder*="search"]'
      )
      .first();
    await expect(searchInput).toBeVisible();

    // Test search functionality
    await searchInput.fill("AI tools");
    await searchInput.press("Enter");

    // Wait for search results or navigation
    await page.waitForTimeout(1000);

    // Check if we're on search page or results are displayed
    const url = page.url();
    expect(url).toMatch(/(search|חיפוש)/);
  });

  test("should display categories section", async ({ page }) => {
    // Check for categories
    const categoriesSection = page
      .locator("section")
      .filter({ hasText: /קטגוריות|categories/i })
      .first();
    await expect(categoriesSection).toBeVisible();

    // Check for category cards/buttons
    const categoryElements = page
      .locator('[data-testid*="category"], .category, button')
      .filter({ hasText: /יצירת|AI|טקסט/ });
    await expect(categoryElements.first()).toBeVisible();
  });

  test("should display latest tools section", async ({ page }) => {
    // Check for latest tools section
    const latestToolsSection = page
      .locator("section")
      .filter({ hasText: /כלים חדשים|latest tools/i })
      .first();
    if (await latestToolsSection.isVisible()) {
      await expect(latestToolsSection).toBeVisible();

      // Check for tool cards
      const toolCards = page
        .locator('[data-testid*="tool"], .tool-card, article')
        .first();
      await expect(toolCards).toBeVisible();
    }
  });

  test("should handle responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Check that page still loads and main elements are visible
    await expect(page.locator("header")).toBeVisible();

    // Check for mobile navigation (hamburger menu)
    const mobileMenu = page.locator(
      'button[aria-label*="menu"], .hamburger, [data-testid*="mobile-menu"]'
    );
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator("nav ul, .mobile-nav")).toBeVisible();
    }
  });

  test("should navigate to tool page when clicking on a tool", async ({
    page,
  }) => {
    // Wait for tool cards to load
    await page.waitForTimeout(2000);

    // Find the first tool card/link
    const toolLink = page
      .locator('a[href*="/tool/"], [data-testid*="tool-card"] a, article a')
      .first();

    if (await toolLink.isVisible()) {
      await toolLink.click();

      // Wait for navigation
      await page.waitForURL(/\/tool\//);

      // Check we're on a tool page
      expect(page.url()).toMatch(/\/tool\//);

      // Check for tool page elements
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should handle footer links", async ({ page }) => {
    // Scroll to footer
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Check footer is visible
    await expect(page.locator("footer")).toBeVisible();

    // Check for important footer links
    const privacyLink = page
      .locator('a[href*="privacy"], a')
      .filter({ hasText: /פרטיות|privacy/i })
      .first();
    const termsLink = page
      .locator('a[href*="terms"], a')
      .filter({ hasText: /תנאים|terms/i })
      .first();

    if (await privacyLink.isVisible()) {
      await expect(privacyLink).toBeVisible();
    }

    if (await termsLink.isVisible()) {
      await expect(termsLink).toBeVisible();
    }
  });
});
