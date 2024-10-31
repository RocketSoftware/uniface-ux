import { BasePage } from './BasePage';
const { expect } = require("@playwright/test");

class HomePage extends BasePage              
{
    constructor(page)
{
  super(page);
  this.resultsFooterText = "#test-result";
  this.failurePage = "li[class='failures'] a";
  this.failureLocator = "li[class='failures'] em";
  this.passLocator = "li[class='passes'] em";
}

async checkElementVisibilityAndExtractText(newPage, selector) {
    await newPage.waitForLoadState();
    await expect(newPage.locator(selector)).toBeVisible();
    const elementText = await newPage.locator(selector).textContent();
    //console.log('Extracted Text:', elementText);
    return elementText;
  }

async getFailureCount(newPage) {   
  return await newPage.locator(this.failureLocator).textContent();
}

async getPassCount(newPage) {
  return await newPage.locator(this.passLocator).textContent();
}

async navigateToFailurePage(newPage)
{
  await newPage.locator(this.failurePage).click();
}

async scrollToBottom(page, test) {
  const viewportHeight = await page.evaluate(() => window.innerHeight); // Get the height of the viewport
  const maxScrollHeight = await page.evaluate(() => document.body.scrollHeight); // Get the total scroll height
  const distance = Math.ceil(viewportHeight); // Scroll distance to cover at least one viewport height
  let totalHeight = 0; // Total height scrolled

  //**console.log(`Total Scroll Height: ${maxScrollHeight}, Distance per scroll: ${distance}`);

  // Counter for naming screenshots
  let screenshotCounter = 0;

  // Capture the initial screenshot at the top of the page
  const initialScreenshot = await page.screenshot();
  test.info().attach(`screenshot-${screenshotCounter++}-top.png`, {
      body: initialScreenshot,
      contentType: 'image/png',
  });
  //**console.log(`Initial Screenshot taken at height ${totalHeight} and attached to report.`);

  // To avoid duplicates, we track the last screenshot position
  let lastScreenshotHeight = 0;

  while (totalHeight < maxScrollHeight) {
      await page.evaluate(`window.scrollBy(0, ${distance})`); // Scroll down by the calculated distance
      totalHeight += distance; // Increment the total height scrolled

      // Wait for a moment to allow content to load
      await page.waitForTimeout(500); // Adjusted wait time

      // Check if we have actually scrolled to a new position
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (currentHeight > lastScreenshotHeight) {
          // Take a screenshot at the current position
          const screenshot = await page.screenshot();

          // Attach the screenshot to the test report with sequential naming
          test.info().attach(`screenshot-${screenshotCounter++}.png`, {
              body: screenshot,
              contentType: 'image/png',
          });

          //**console.log(`Screenshot taken at height ${totalHeight} and attached to report.`);

          // Update the last screenshot height
          lastScreenshotHeight = currentHeight; // Update to the new position
      }
  }
}

async checkFailuresEncountered(newPage, test) {
  try {
      let actualFailureCount = await this.getFailureCount(newPage);
      let actualPassCount = await this.getPassCount(newPage);

      // Check if both actualFailureCount and actualPassCount are 0
      if (parseInt(actualFailureCount) === 0 && parseInt(actualPassCount) === 0) {
          console.log('Widget Not Loading. Please Check !!');
      }
      else if (parseInt(actualFailureCount) > 0) {
          await this.navigateToFailurePage(newPage);
          const currentUrl = newPage.url();
          console.log('Failure URL:', currentUrl);
          await this.scrollToBottom(newPage, test);
          await expect(parseInt(actualFailureCount)).toBe(0, `Test failed with ${actualFailureCount} failure(s).`);
      } 
    //   else {
    //     console.log('No Failures');
    // }
  } catch (e) {
      console.error("Error encountered in FailuresEncountered:", e.message || e);
      throw e;
  }
}


}
module.exports = {HomePage};