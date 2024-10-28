import { test, expect } from '@playwright/test';
import { BasePage } from '../pageobjects/BasePage';
import { IndexPage } from '../pageobjects/IndexPage';
import { HomePage } from '../pageobjects/HomePage';

test.describe('Widget Tests', () => {
    test.describe.configure({mode: 'parallel'});
    let basePage, indexPage, homePage;

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        indexPage = new IndexPage(page);
        homePage = new HomePage(page);
        await basePage.open();
    });

    test('ControlBar Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.controlBarWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Button Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.buttonWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Checkbox Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.checkboxWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Number Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.numberFieldWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('RadioGroup Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.radioGroupWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Select Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.selectWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Switch Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.switchWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('TextArea Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.textAreaWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('TextField Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.textFieldWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Base Class Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.baseWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('WidgetClass Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.widgetClassWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });
    
    test('Workers Class Widget Tests', async ({ page }) => {
        const newPage = await indexPage.openNewPage(indexPage.workersClassWidgetLink);
        const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
        await homePage.checkFailuresEncountered(newPage, test);
    });

});