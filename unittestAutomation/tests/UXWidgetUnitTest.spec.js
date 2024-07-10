import { test, expect, chromium, firefox } from '@playwright/test';
import { BasePage } from '../pageobjects/BasePage';
import { HomePage } from '../pageobjects/HomePage';
import { IndexPage } from '../pageobjects/IndexPage';
import { FailurePage } from '../pageobjects/FailurePage';

const browsers = [firefox, chromium];

for (const browserType of browsers) {
    test.describe(browserType.name(), () => {  
        test.describe.configure({mode: 'parallel'});
        let browser, page, indexPage, context, homePage, failurePage, basePage;
    
        test.beforeEach(async () => {
            browser = await browserType.launch();
            context = await browser.newContext();
            page = await context.newPage();
            basePage = new BasePage(page);
            await basePage.open();
            await expect(page).toHaveTitle(IndexPage.indexPageTitle);
        });
    
        test.afterEach(async () => {
            await browser.close();    
        });
    
        test('UX Widget Button Unit Test', async () => {
            indexPage = new IndexPage(page);
            const pagePromise = context.waitForEvent('page')
            await indexPage.clickButtonWidgetLink();
            homePage = new HomePage(page);
            await homePage.getFailureCountMsg(HomePage.expectedUXButtonTitle,pagePromise);
        });

        test('UX Widget Checkbox Unit Test', async () => {
            indexPage = new IndexPage(page);
            const pagePromise = context.waitForEvent('page')
            await indexPage.clickCheckBoxWidgetLink();
            homePage = new HomePage(page);
            await homePage.getFailureCountMsg(HomePage.expectedUXCheckboxTitle, pagePromise);
        });
    
        test('UX Widget Number Field Unit Test', async () => {
            indexPage = new IndexPage(page);
            const pagePromise = context.waitForEvent('page')
            await indexPage.clickNumberFieldWidgetLink();
            homePage = new HomePage(page);
            await homePage.getFailureCountMsg(HomePage.expectedUXWidgetNumberField,pagePromise);
        });

});

}