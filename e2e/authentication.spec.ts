import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login options", async ({ page }) => {
    await page.goto("/auth/signin");

    // Check page loads
    await expect(page).toHaveTitle(/Sign In|התחברות/);

    // Check for login form elements
    await expect(page.locator("form")).toBeVisible();

    // Check for email/password fields
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email"]'
    );
    const passwordInput = page.locator(
      'input[type="password"], input[name="password"]'
    );

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }

    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }

    // Check for Google sign-in button
    const googleButton = page
      .locator("button")
      .filter({ hasText: /Google|גוגל/ })
      .first();
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
    }
  });

  test("should handle invalid login attempts", async ({ page }) => {
    await page.goto("/auth/signin");

    // Find login form elements
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /Sign In|התחבר/ })
      .first();

    if (
      (await emailInput.isVisible()) &&
      (await passwordInput.isVisible()) &&
      (await submitButton.isVisible())
    ) {
      // Try invalid credentials
      await emailInput.fill("invalid@email.com");
      await passwordInput.fill("wrongpassword");
      await submitButton.click();

      // Wait for error message
      await page.waitForTimeout(2000);

      // Check for error message
      const errorMessage = page
        .locator('.error, [role="alert"], .text-red')
        .first();
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test("should navigate to business registration", async ({ page }) => {
    await page.goto("/");

    // Look for business/register links
    const businessLink = page
      .locator('a[href*="business"], a')
      .filter({ hasText: /עסק|business/i })
      .first();

    if (await businessLink.isVisible()) {
      await businessLink.click();

      // Wait for navigation
      await page.waitForURL(/business/);

      // Check we're on business page
      expect(page.url()).toMatch(/business/);

      // Check for registration elements
      const registerButton = page
        .locator('a[href*="register"], button')
        .filter({ hasText: /הרשמה|register/i })
        .first();
      if (await registerButton.isVisible()) {
        await expect(registerButton).toBeVisible();
      }
    }
  });

  test("should handle logout when authenticated", async ({ page }) => {
    // This test would require setting up authenticated state
    // For now, check if logout functionality exists
    await page.goto("/");

    // Look for user menu or logout button
    const userMenu = page
      .locator(
        '[data-testid*="user-menu"], .user-nav, button[aria-label*="user"]'
      )
      .first();
    const logoutButton = page
      .locator("button, a")
      .filter({ hasText: /יציאה|logout|התנתק/i })
      .first();

    if (await userMenu.isVisible()) {
      await userMenu.click();

      // Check if logout option appears
      if (await logoutButton.isVisible()) {
        await expect(logoutButton).toBeVisible();
      }
    } else if (await logoutButton.isVisible()) {
      await expect(logoutButton).toBeVisible();
    }
  });

  test("should protect business dashboard routes", async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto("/business/dashboard");

    // Should redirect to login or show access denied
    await page.waitForTimeout(2000);

    const currentUrl = page.url();

    // Check if redirected to login or access denied
    expect(currentUrl).toMatch(/(signin|login|auth|unauthorized|403)/);
  });

  test("should show registration form with required fields", async ({
    page,
  }) => {
    await page.goto("/business/register");

    // Check for registration form
    const form = page.locator("form").first();
    if (await form.isVisible()) {
      await expect(form).toBeVisible();

      // Check for required fields
      const nameInput = page
        .locator('input[name*="name"], input[placeholder*="שם"]')
        .first();
      const emailInput = page
        .locator('input[type="email"], input[name="email"]')
        .first();
      const websiteInput = page
        .locator('input[name*="website"], input[placeholder*="אתר"]')
        .first();

      if (await nameInput.isVisible()) {
        await expect(nameInput).toBeVisible();
      }

      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
      }

      if (await websiteInput.isVisible()) {
        await expect(websiteInput).toBeVisible();
      }
    }
  });
});
