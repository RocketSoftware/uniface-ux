class BasePage{
    constructor(page) {
      this.page = page;
    }

    async open()
    {
        await this.page.goto('./index.html');  // relative to use.baseURL
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
  
    async waitForTimeout(timeout) {
      await this.page.waitForTimeout(timeout);
    }

    async takeScreenshot(filename) {
      await this.page.screenshot({ path: filename });
      console.log(`Screenshot taken: ${filename}`);
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

  }
  
  module.exports = {BasePage};
  