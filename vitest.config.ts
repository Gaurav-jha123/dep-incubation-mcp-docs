import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    environment: "jsdom",
    testTimeout:10000,
  },
})