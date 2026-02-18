/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

const CLIENT_URL = "http://localhost:5173";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* * Reduced workers for local execution to avoid race conditions with the shared API.
   * On CI we use 1 worker to ensure stability.
   */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. */
  reporter: "html",
  /* Shared settings for all projects */
  use: {
    /* Base URL to avoid repeating it in every page.goto() */
    baseURL: "http://localhost:5173",

    /* Collect trace when retrying. Useful for debugging CI failures. */
    trace: "on-first-retry",

    /* Take a screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    /* * Webkit is disabled due to environment-specific 'Bus error: 10' on macOS.
     * Uncomment only if browser binaries are reinstalled and stable.
     */
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* * Automatically start your local dev server before starting the tests.
   * This ensures the app is always up when you run the tests.
   */
  webServer: {
    command: "npm run dev",
    url: CLIENT_URL,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120 * 1000,
  },
});
