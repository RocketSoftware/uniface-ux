// playwright.config.ts or playwright.config.js
import { defineConfig } from '@playwright/test';

/**
 * System environment variable: UX_WIDGETS_BASE_URL
 * Configure the base URL of the index.html file.
 * Default value: specified by constant defaultBaseURL;
 */
const defaultBaseURL = 'http://localhost:9000/test/';
let baseURL;
function getBaseURL() {
  if (!baseURL) {
    baseURL = process.env.UX_WIDGETS_BASE_URL;

    if (!baseURL) {
      baseURL = defaultBaseURL;
    }
  }
  return baseURL;
}

export default defineConfig({
  workers: 2, // Set the number of workers
  timeout: 30000, // Set timeout for each test
  retries: 1, // Number of retries for failed tests
  globalSetup: './global-setup.js', // Reference to the global setup file
  reporter: [
    ['./custom-reporter.js'], // Custom reporter
    ['list'], // Default list reporter
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }] // HTML reporter
  ],
  webServer: {
    command: 'cd .. && npm run serve',
    url: getBaseURL(),
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe'
  },
  use: {
    baseURL: getBaseURL(),
    headless: true, // Run tests in headless mode
    viewport: { width: 1280, height: 720 }, // Set viewport size
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    screenshot: 'on', // Take screenshots[on, off, only-on-failure are few options]
    video: 'on', // Record video of tests ['on', 'off' or 'retain-on-failure']
    trace: 'off' // Disable tracing
  },
});
