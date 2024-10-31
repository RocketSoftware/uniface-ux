import { test, expect } from '@playwright/test';

class BasePage{

  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('http://localhost:8080/ux-widgets/test/index.html');
  }

  async verifyPageTitle(expectedTitle) {
    let Title = await this.page.title();
    await expect(Title).toBe(expectedTitle);
  }

  async resultsLoadTimeout(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
    console.log(`Element ${selector} is visible`);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
    console.log(`Element ${selector} is visible`);
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout);
  }

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentUrl() {
    return await this.page.url();
  }

  async refreshPage() {
    await this.page.reload();
  }

  async scrollToBottom(page) {
    const distance = 100; // Distance to scroll each time
    let totalHeight = 0; // Total height scrolled
    const maxScrollHeight = await page.evaluate(() => document.body.scrollHeight); // Get the total scroll height

    while (totalHeight < maxScrollHeight) {
      await page.evaluate(`window.scrollBy(0, ${distance})`); // Scroll down by the specified distance
      totalHeight += distance; // Increment the total height scrolled
      await page.waitForTimeout(100); // Wait for a moment to allow content to load, if necessary
    }
  }

}

module.exports = {BasePage};
