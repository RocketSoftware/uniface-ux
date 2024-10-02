import { BasePage } from './BasePage';
import { expect } from "@playwright/test";

class IndexPage extends BasePage {
    constructor(page)
{
    super(page);
    this.buttonWidget = page.locator("#button");
    this.checkboxWidget = page.locator("#checkbox");
    this.numberFieldWidget = page.locator("#number-field");
    this.plainTextWidget = page.locator("#plain-text");
    this.selectWidget = page.locator("#select");
    this.radioGroupWidget = page.locator("#radio-group");
    this.switchWidget = page.locator("#switch");
    this.textAreaWidget = page.locator("#text-area");
    this.textFieldWidget = page.locator("#text-field");

}

//Constant Variables
static indexPageTitle = 'UX widget tests overview';

async clickButtonWidgetLink()
{   
    await this.buttonWidget.click();
}

async clickCheckBoxWidgetLink()
{
    await this.checkboxWidget.click();
}

async clickNumberFieldWidgetLink()
{
    await this.numberFieldWidget.click();
}

async clickPlainTextWidgetLink()
{
    await this.plainTextWidget.click();
}

async clickSelectWidgetLink()
{
    await this.selectWidget.click();
}

async clickRadioGroupWidgetLink()
{
    await this.radioGroupWidget.click();
}

async clickSwitchWidgetLink()
{
    await this.switchWidget.click();
}

async clickTextAreaWidgetLink()
{
    await this.textAreaWidget.click();
}

async clickTextFieldWidgetLink()
{
    await this.textFieldWidget.click();
}

}
module.exports = {IndexPage};