import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "path";
import { fileURLToPath } from "node:url";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const storybookConfigDir = path.resolve(dirname, ".storybook").replaceAll("\\", "/");

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-dev-runtime"],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
          testTimeout: 15000,
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: storybookConfigDir,
          }),
        ],
        test: {
          name: `storybook:${storybookConfigDir}`,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
