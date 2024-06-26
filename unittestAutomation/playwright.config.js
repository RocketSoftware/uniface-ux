// @ts-check
const { devices } = require('@playwright/test');

module.exports = {
  testDir: './tests',
  retries: 1,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: "on",
    trace: 'retain-on-failure'
  },

};