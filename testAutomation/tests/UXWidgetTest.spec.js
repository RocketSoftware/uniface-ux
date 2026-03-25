import { test, expect } from '@playwright/test';
import { BasePage } from '../pageobjects/BasePage';
import { IndexPage } from '../pageobjects/IndexPage';
import { HomePage } from '../pageobjects/HomePage';

let basePage, indexPage, homePage;

test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    indexPage = new IndexPage(page);
    homePage = new HomePage(page);
    await basePage.open();
});

test('ChildWidgets Worker Unit Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.childWidgetsWorkerUnitTestLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('Layout Web Component Unit Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.layoutWebComponentUnitTestLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('Layout Web Component Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.layoutWebComponentLink);
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

test('Entity Layout Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.entLayoutWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('Component Layout Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.compLayoutWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('HeaderFooter Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.headerFooterWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('Listbox Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.listboxWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('NumberField Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.numberFieldWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('PlainText Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.plainTextWidgetLink);
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

test('Widget Class Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.widgetClassWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test('Workers Class Widget Tests', async ({ page }) => {
    const newPage = await indexPage.openNewPage(indexPage.workersClassWidgetLink);
    const extractedText = await homePage.checkElementVisibilityAndExtractText(newPage, homePage.resultsFooterText);
    await homePage.checkFailuresEncountered(newPage, test);
});

test.afterEach(async ({ context }) => {
    for (const page of context.pages()) {
        await page.close(); // Closes all pages in the context
    }
});