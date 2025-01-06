// playwright.config.ts or playwright.config.js
import { defineConfig } from '@playwright/test';
const CustomReporter = require('./custom-reporter');

export default defineConfig({
  workers: 2, // Set the number of workers
  timeout: 30000, // Set timeout for each test
  retries: 1, // Number of retries for failed tests
  globalSetup: './global-setup.js', // Reference to the global setup file
  reporter: [
    ['./custom-reporter.js'], // Custom reporter
    ['list'], // Default list reporter
    ['html'], // HTML reporter
    ['allure-playwright'] // Allure reporter
  ],
  use: {
    baseURL: process.env.UX_WIDGETS_BASE_URL || 'http://localhost:8080/ux-widgets/test/',
    headless: true, // Run tests in headless mode
    viewport: { width: 1280, height: 720 }, // Set viewport size
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    screenshot: 'on', // Take screenshots[on, off, only-on-failure are few options]
    video: 'on', // Record video of tests ['on', 'off' or 'retain-on-failure']
    trace: 'off' // Disable tracing
  },
});