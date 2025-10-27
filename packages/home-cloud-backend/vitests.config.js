import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    restoreMocks: true,
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/out/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
