import { BasePage } from './BasePage';
import { FailurePage } from '../pageobjects/FailurePage';
const { expect } = require("@playwright/test");

class HomePage extends BasePage              
{
    constructor(page)
{
    super(page);
    this.failureLocator = page.locator("li[class='failures'] em");
    this.passLocator = page.locator("li[class='passes'] em");
    this.failurePage = page.locator("li[class='failures'] a");
}

//Constant Variables
static expectedUXButtonTitle = 'Unit test - UX.Button';
static expectedUXCheckboxTitle = 'Unit test - UX.Checkbox';
static expectedUXWidgetNumberField = 'Unit test - UX.NumberField';
static expectedPlainTextTitle = 'Unit test - UX.PlainText';
static expectedSelectTitle = 'Unit test - UX.Select';
static expectedRadioGroupTitle = 'Unit test - UX.RadioGroup';
static expectedSwitchTitle = 'Unit test - UX.Switch';
static expectedTextAreaTitle = 'Unit test - UX.TextArea';
static expectedTextFieldTitle = 'Unit test - UX.TextField';

async getFailureCount()
{   
    return await this.failureLocator.textContent();
}

async getPassCount()
{
    return await this.passLocator.textContent();
}

async navigateToFailurePage()
{
    await this.failurePage.click();
}

async getFailureCountMsg(expectedUXWidgetTitle, pagePromise)
    {
        let basePage, failurePage;
        const newPage = await pagePromise;
        await expect(newPage).toHaveTitle(expectedUXWidgetTitle);
        this.homePage = new HomePage(newPage);
        basePage = new BasePage(newPage)
        await basePage.resultsLoadTimeout(4000);

        try{
            let actualFailureCount = await this.homePage.getFailureCount();
            let actualPassCount = await this.homePage.getPassCount();
    
            if(parseInt(actualFailureCount) > 0){
                await this.homePage.navigateToFailurePage();
                failurePage = new FailurePage(newPage);
                basePage.resultsLoadTimeout(20000);
                await failurePage.getErrorMsg();
            }
            else{
                console.log('No Failures');
            }
        }
        catch (e) {
            console.log("Error: " + e.description);
        }

    }

  }

module.exports = {HomePage};