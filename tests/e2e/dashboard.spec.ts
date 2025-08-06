import { test, expect } from "@playwright/test";

test.describe("ContentHub Dashboard E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Initial Load and Layout", () => {
    test("should load dashboard with proper layout", async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Check sidebar elements
      await expect(page.locator("text=ContentHub")).toBeVisible();
      await expect(page.locator("text=Feed")).toBeVisible();
      await expect(page.locator("text=Trending")).toBeVisible();
      await expect(page.locator("text=Favorites")).toBeVisible();

      // Check header elements
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
      await expect(page.locator('[title*="dark mode"]')).toBeVisible();

      // Check content cards are loaded
      await expect(page.locator(".grid")).toBeVisible();
      const cards = page.locator('[data-testid="content-card"]');
      await expect(cards).toHaveCount(6);
    });

    test("should display loading state initially", async ({ page }) => {
      // Reload to see loading state
      await page.reload();

      // Should show loading spinner
      await expect(
        page.locator("text=Loading your personalized content"),
      ).toBeVisible();

      // Loading should disappear after content loads
      await page.waitForSelector("text=Loading your personalized content", {
        state: "hidden",
        timeout: 10000,
      });
    });
  });

  test.describe("Search Functionality", () => {
    test("should filter content based on search query", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill("tech");

      // Should show search results indicator
      await expect(
        page.locator('text=Showing results for "tech"'),
      ).toBeVisible();

      // Should filter content cards
      const visibleCards = page.locator('[data-testid="content-card"]:visible');
      const cardCount = await visibleCards.count();
      expect(cardCount).toBeGreaterThan(0);

      // Check that visible cards contain search term
      for (let i = 0; i < cardCount; i++) {
        const cardText = await visibleCards.nth(i).textContent();
        expect(cardText?.toLowerCase()).toContain("tech");
      }
    });

    test("should clear search when switching sections", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Enter search query
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill("movie");

      // Switch to trending section
      await page.locator("text=Trending").click();

      // Search input should be cleared
      await expect(searchInput).toHaveValue("");
    });

    test("should handle empty search results", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill("nonexistent-term-xyz");

      // Should show no results message
      await expect(page.locator("text=No content found")).toBeVisible();
      await expect(
        page.locator("text=Try adjusting your search terms"),
      ).toBeVisible();
    });
  });

  test.describe("Section Navigation", () => {
    test("should switch between feed, trending, and favorites", async ({
      page,
    }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Test Feed section (default)
      await expect(page.locator("text=Your Personalized Feed")).toBeVisible();
      await expect(
        page.locator("text=Curated content based on your preferences"),
      ).toBeVisible();

      // Switch to Trending
      await page.locator("text=Trending").click();
      await expect(page.locator("text=Trending Content")).toBeVisible();
      await expect(
        page.locator("text=Most popular content with highest ratings"),
      ).toBeVisible();

      // Switch to Favorites
      await page.locator("text=Favorites").click();
      await expect(page.locator("text=Your Favorites")).toBeVisible();
      await expect(page.locator("text=No favorites yet")).toBeVisible();

      // Switch back to Feed
      await page.locator("text=Feed").click();
      await expect(page.locator("text=Your Personalized Feed")).toBeVisible();
    });

    test("should maintain active section styling", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Feed should be active by default
      const feedButton = page.locator("text=Feed").first();
      await expect(feedButton).toHaveClass(/bg-primary/);

      // Click Trending
      const trendingButton = page.locator("text=Trending").first();
      await trendingButton.click();
      await expect(trendingButton).toHaveClass(/bg-primary/);
      await expect(feedButton).not.toHaveClass(/bg-primary/);
    });
  });

  test.describe("Favorites Functionality", () => {
    test("should add and remove favorites", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Find a favorite button (heart icon)
      const favoriteButton = page
        .locator('[data-testid="favorite-button"]')
        .first();

      // Initially should be unfavorited (white heart)
      await expect(favoriteButton.locator("text=🤍")).toBeVisible();

      // Click to favorite
      await favoriteButton.click();

      // Should now be favorited (red heart)
      await expect(favoriteButton.locator("text=❤️")).toBeVisible();

      // Go to favorites section
      await page.locator("text=Favorites").click();

      // Should see the favorited item
      const favoriteCards = page.locator('[data-testid="content-card"]');
      await expect(favoriteCards).toHaveCount(1);

      // Click to unfavorite
      const favoritedButton = page
        .locator('[data-testid="favorite-button"]')
        .first();
      await favoritedButton.click();

      // Should show empty favorites
      await expect(page.locator("text=No favorites yet")).toBeVisible();
    });

    test("should persist favorites across page reloads", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Add a favorite
      const favoriteButton = page
        .locator('[data-testid="favorite-button"]')
        .first();
      await favoriteButton.click();

      // Reload the page
      await page.reload();
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Go to favorites section
      await page.locator("text=Favorites").click();

      // Should still see the favorited item
      const favoriteCards = page.locator('[data-testid="content-card"]');
      await expect(favoriteCards).toHaveCount(1);
    });
  });

  test.describe("Settings Panel", () => {
    test("should open and close settings panel", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Click settings button
      await page.locator('[title="Settings"]').click();

      // Settings panel should be visible
      await expect(page.locator("text=Settings")).toBeVisible();
      await expect(page.locator("text=Feed Preferences")).toBeVisible();

      // Close settings panel
      await page.locator('[data-testid="close-settings"]').click();

      // Settings panel should be hidden
      await expect(page.locator("text=Feed Preferences")).not.toBeVisible();
    });

    test("should modify content preferences", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Open settings
      await page.locator('[title="Settings"]').click();

      // Ensure we're on the preferences tab
      await page.locator("text=Feed Preferences").click();

      // Toggle a category (e.g., Science)
      const scienceButton = page.locator("text=Science").first();
      await scienceButton.click();

      // Save changes
      await page.locator("text=Save Changes").click();

      // Settings should close
      await expect(page.locator("text=Feed Preferences")).not.toBeVisible();
    });
  });

  test.describe("Dark Mode", () => {
    test("should toggle dark mode", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Get initial theme class
      const htmlElement = page.locator("html");
      const initialClasses = await htmlElement.getAttribute("class");

      // Click dark mode toggle
      await page.locator('[title*="dark mode"]').click();

      // Wait for theme to change
      await page.waitForTimeout(500);

      // Check if dark class was toggled
      const newClasses = await htmlElement.getAttribute("class");
      expect(newClasses).not.toBe(initialClasses);

      // Toggle back
      await page.locator('[title*="mode"]').click();
      await page.waitForTimeout(500);

      // Should be back to original state
      const finalClasses = await htmlElement.getAttribute("class");
      expect(finalClasses).toBe(initialClasses);
    });
  });

  test.describe("Notifications", () => {
    test("should open and close notifications panel", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Click notifications button
      await page.locator('[title="Notifications"]').click();

      // Notifications panel should be visible
      await expect(page.locator("text=Notifications")).toBeVisible();

      // Should show notification count badge initially
      await expect(
        page.locator('[data-testid="notification-badge"]'),
      ).toBeVisible();

      // Close notifications panel
      await page.locator('[data-testid="close-notifications"]').click();

      // Notifications panel should be hidden
      await expect(page.locator("text=All (5)")).not.toBeVisible();
    });
  });

  test.describe("Load More Functionality", () => {
    test("should load more content when button is clicked", async ({
      page,
    }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Count initial cards
      const initialCards = page.locator('[data-testid="content-card"]');
      const initialCount = await initialCards.count();

      // Click load more button
      await page.locator("text=Load More Content").click();

      // Should show loading state
      await expect(page.locator("text=Loading...")).toBeVisible();

      // Wait for loading to complete
      await page.waitForSelector("text=Loading...", {
        state: "hidden",
        timeout: 5000,
      });

      // Should have more cards
      const newCards = page.locator('[data-testid="content-card"]');
      const newCount = await newCards.count();
      expect(newCount).toBeGreaterThan(initialCount);
    });
  });

  test.describe("Drag and Drop", () => {
    test("should allow dragging cards in feed section", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Ensure we're in feed section
      await page.locator("text=Feed").click();

      // Get first two cards
      const cards = page.locator('[data-testid="content-card"]');
      const firstCard = cards.nth(0);
      const secondCard = cards.nth(1);

      // Get initial titles
      const firstTitle = await firstCard.locator("h3").textContent();
      const secondTitle = await secondCard.locator("h3").textContent();

      // Perform drag and drop
      await firstCard.dragTo(secondCard);

      // Wait for reorder to complete
      await page.waitForTimeout(1000);

      // Check if order changed
      const newFirstTitle = await cards.nth(0).locator("h3").textContent();
      const newSecondTitle = await cards.nth(1).locator("h3").textContent();

      // Order should have changed
      expect(newFirstTitle).not.toBe(firstTitle);
      expect(newSecondTitle).not.toBe(secondTitle);
    });

    test("should show drag instruction in feed section", async ({ page }) => {
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Should show drag instruction
      await expect(
        page.locator("text=Drag and drop cards to reorder your feed"),
      ).toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should work on mobile viewport", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Should still show main content
      await expect(page.locator("text=Your Personalized Feed")).toBeVisible();

      // Content cards should be in single column on mobile
      const cards = page.locator('[data-testid="content-card"]');
      await expect(cards.first()).toBeVisible();
    });

    test("should work on tablet viewport", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForSelector('[data-testid="dashboard-content"]', {
        timeout: 10000,
      });

      // Should show content in appropriate layout
      await expect(page.locator("text=Your Personalized Feed")).toBeVisible();
      const cards = page.locator('[data-testid="content-card"]');
      await expect(cards).toHaveCount(6);
    });
  });

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate network failure
      await page.route("**/*", (route) => route.abort());

      await page.goto("/");

      // Should show error state or loading state that doesn't crash
      // This test mainly ensures no JavaScript errors occur
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      await page.waitForTimeout(3000);
      expect(errors.length).toBe(0);
    });
  });
});
