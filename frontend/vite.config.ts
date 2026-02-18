import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/vitest.setup.ts"],
    onUnhandledError: () => {
      return false;
    },
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
});
