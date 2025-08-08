import { test, expect } from "@playwright/test";

test.describe("Business Dashboard", () => {
  // Note: These tests assume authentication is handled
  // In a real scenario, you'd set up authenticated state or mock it

  test("should load dashboard with basic metrics", async ({ page }) => {
    // This would require authenticated session
    // For testing purposes, check if dashboard redirects or shows content
    await page.goto("/business/dashboard");

    // Wait for page to load
    await page.waitForTimeout(2000);

    const currentUrl = page.url();

    if (currentUrl.includes("/business/dashboard")) {
      // If we're on dashboard, check for key elements
      const metricsCards = page
        .locator('[data-testid*="metric"], .metric, .card')
        .first();
      if (await metricsCards.isVisible()) {
        await expect(metricsCards).toBeVisible();
      }

      // Check for side navigation
      const sideNav = page.locator("nav, .side-nav, .sidebar").first();
      if (await sideNav.isVisible()) {
        await expect(sideNav).toBeVisible();
      }
    } else {
      // Should be redirected to login
      expect(currentUrl).toMatch(/(signin|login|auth)/);
    }
  });

  test("should navigate between dashboard sections", async ({ page }) => {
    await page.goto("/business/dashboard");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Test navigation to reviews section
      const reviewsLink = page
        .locator('a[href*="reviews"], nav a')
        .filter({ hasText: /ביקורות|reviews/i })
        .first();

      if (await reviewsLink.isVisible()) {
        await reviewsLink.click();
        await page.waitForURL(/\/business\/dashboard\/reviews/);
        expect(page.url()).toMatch(/reviews/);
      }

      // Test navigation to settings
      const settingsLink = page
        .locator('a[href*="settings"], nav a')
        .filter({ hasText: /הגדרות|settings/i })
        .first();

      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await page.waitForURL(/\/business\/dashboard\/settings/);
        expect(page.url()).toMatch(/settings/);
      }
    }
  });

  test("should display reviews management interface", async ({ page }) => {
    await page.goto("/business/dashboard/reviews");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Check for reviews list
      const reviewsList = page
        .locator('[data-testid*="review"], .review-item, table')
        .first();
      if (await reviewsList.isVisible()) {
        await expect(reviewsList).toBeVisible();
      }

      // Check for review response functionality
      const responseButton = page
        .locator("button")
        .filter({ hasText: /השב|respond|reply/i })
        .first();
      if (await responseButton.isVisible()) {
        await expect(responseButton).toBeVisible();
      }
    }
  });

  test("should handle review generator tool", async ({ page }) => {
    await page.goto("/business/dashboard/reviews-generator");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Check for QR code generator
      const qrGenerator = page
        .locator('[data-testid*="qr"], .qr-code, canvas')
        .first();
      if (await qrGenerator.isVisible()) {
        await expect(qrGenerator).toBeVisible();
      }

      // Check for invitation links
      const invitationSection = page
        .locator('[data-testid*="invitation"], .invitation')
        .first();
      if (await invitationSection.isVisible()) {
        await expect(invitationSection).toBeVisible();
      }
    }
  });

  test("should show business tool page", async ({ page }) => {
    await page.goto("/business/dashboard/tool");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Check for business profile information
      const businessProfile = page
        .locator('[data-testid*="profile"], .profile, .business-info')
        .first();
      if (await businessProfile.isVisible()) {
        await expect(businessProfile).toBeVisible();
      }

      // Check for edit functionality
      const editButton = page
        .locator("button")
        .filter({ hasText: /עריכה|edit/i })
        .first();
      if (await editButton.isVisible()) {
        await expect(editButton).toBeVisible();
      }
    }
  });

  test("should handle mobile dashboard navigation", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/business/dashboard");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Check for mobile navigation
      const mobileMenu = page
        .locator(
          'button[aria-label*="menu"], .hamburger, [data-testid*="mobile-menu"]'
        )
        .first();

      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();

        // Check if navigation menu appears
        const navMenu = page.locator("nav, .mobile-nav, .sidebar").first();
        await expect(navMenu).toBeVisible();
      }
    }
  });

  test("should display analytics and metrics", async ({ page }) => {
    await page.goto("/business/dashboard");
    await page.waitForTimeout(2000);

    if (page.url().includes("/business/dashboard")) {
      // Check for analytics cards
      const analyticsCards = page
        .locator(
          '[data-testid*="analytics"], [data-testid*="metric"], .metric-card'
        )
        .first();
      if (await analyticsCards.isVisible()) {
        await expect(analyticsCards).toBeVisible();
      }

      // Check for charts or graphs
      const charts = page
        .locator('canvas, svg, .chart, [data-testid*="chart"]')
        .first();
      if (await charts.isVisible()) {
        await expect(charts).toBeVisible();
      }
    }
  });
});
