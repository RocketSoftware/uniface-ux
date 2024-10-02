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
static expectedUXButtonTitle = 'Widget test - UX.Button - test_ux_button.js';
static expectedUXCheckboxTitle = 'Widget test - UX.Checkbox - test_ux_checkbox.js';
static expectedUXWidgetNumberField = 'Widget test - UX.NumberField - test_ux_number_field.js';
static expectedPlainTextTitle = 'Widget test - UX.PlainText - test_ux_plain_text.js';
static expectedSelectTitle = 'Widget test - UX.Select - test_ux_select.js';
static expectedRadioGroupTitle = 'Widget test - UX.RadioGroup - test_ux_radio_group.js';
static expectedSwitchTitle = 'Widget test - UX.Switch - test_ux_switch.js';
static expectedTextAreaTitle = 'Widget test - UX.TextArea - test_ux_text_area.js';
static expectedTextFieldTitle = 'Widget test - UX.TextField - test_ux_text_field.js';

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