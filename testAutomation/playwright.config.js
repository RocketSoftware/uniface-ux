// @ts-check
const { devices } = require('@playwright/test');

module.exports = {
  testDir: './tests',
  retries: 1,
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [['html'], ['allure-playwright']],
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: "on",
    trace: 'retain-on-failure'
  },

};