import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:4000/api";

test.describe("Todo List Application", () => {
  // Deep cleanup before starting the test suite
  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext();
    try {
      const response = await requestContext.get(`${API_URL}/todo-lists`);

      if (response.ok()) {
        const lists = await response.json();
        // Delete all existing lists in parallel to start from a clean state
        await Promise.all(
          lists.map((list: { id: number }) =>
            requestContext.delete(`${API_URL}/todo-lists/${list.id}`),
          ),
        );
      }
    } catch {
      console.error(
        "Warning: Initial API cleanup failed. Check if backend is running.",
      );
    }
    await requestContext.dispose();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear storage and reload to ensure test isolation
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
  });

  test("should allow creating a new list and adding items", async ({
    page,
  }) => {
    // Generate a unique name for this execution to avoid worker collisions
    const uniqueId = Math.floor(Math.random() * 10000);
    const listName = `List ${uniqueId}`;

    // 1. Create a new List
    const inputList = page.getByPlaceholder(/new list name/i);
    await inputList.fill(listName);
    await inputList.press("Enter");

    // 2. Locate the unique header
    const header = page.getByRole("heading", { name: listName }).first();
    await expect(header).toBeVisible();

    // 3. Locate the list container using the header as an anchor
    const listContainer = page
      .locator("div, section")
      .filter({ has: header })
      .first();

    // 4. Add an item within that specific container
    // Using .first() to handle cases where multiple identical inputs might exist (e.g., responsive design)
    const inputItem = listContainer.getByPlaceholder(/add your task/i).first();
    await inputItem.fill("Buy milk");
    await inputItem.press("Enter");

    // 5. Verify item presence within the container
    const itemCreated = listContainer.getByText("Buy milk").first();
    await expect(itemCreated).toBeVisible({ timeout: 10000 });
  });

  test("should show error notification if server fails", async ({ page }) => {
    // Intercept and abort the POST request to simulate server failure
    await page.route("**/api/todo-lists", (route) => {
      if (route.request().method() === "POST") {
        return route.abort("failed");
      }
      return route.continue();
    });

    const inputList = page.getByPlaceholder(/new list name/i);
    await inputList.fill("Failed List");
    await inputList.press("Enter");

    // Verify that the error toast is visible and contains expected error text
    const toast = page.locator("li[data-sonner-toast]");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/(failed|error|network)/i);
  });

  test("should persist dark mode on reload", async ({ page }) => {
    // Find the theme toggle button by its characteristic SVG or role
    const themeButton = page
      .getByRole("button")
      .filter({ has: page.locator("svg") })
      .first();

    // Toggle to dark mode
    await themeButton.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Reload the page and verify state persistence
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
