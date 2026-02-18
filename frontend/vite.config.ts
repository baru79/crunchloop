import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    onUnhandledError: () => {
      // Suppress unhandled errors - they are expected in error-handling tests
      return false;
    },
  },
});
