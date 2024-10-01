import { BasePage } from './BasePage';
const { expect } = require("@playwright/test");

class FailurePage extends BasePage
{
    constructor(page)
{
    super(page);
    this.errorMsg = page.locator("//pre[contains(text(),'AssertionError: The template file ')]");
    this.endTextlocator = page.locator("text='End'");
    this.setDefault =  page.locator("li[class='test fail'] h2");
}

async verifyEndHeaderPresent(ExpectedEndText)
{
    await expect(this.endTextlocator).toHaveText(ExpectedEndText);
}

async verifySetDefaultTextPresent(ExpectedDefaultText)
{
    await expect(this.setDefault).toHaveText(ExpectedDefaultText);
}

async getErrorMsg()
{
    console.log(await this.errorMsg.innerText());
}

}
module.exports = {FailurePage};