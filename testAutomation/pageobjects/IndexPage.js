import { BasePage } from './BasePage';

class IndexPage extends BasePage {
    constructor(page)
{
    super(page);
    this.childWidgetsWorkerUnitTestLink = '#child-widgets-worker-unit-tests';
    this.layoutWebComponentUnitTestLink = '#layout-web-component-unit-tests';
    this.layoutWebComponentLink = '#layout';
    this.buttonWidgetLink = '#button';
    this.checkboxWidgetLink = '#checkbox';
    this.entLayoutWidgetLink = '#ent-layout';
    this.compLayoutWidgetLink = '#comp-layout';
    this.headerFooterWidgetLink = '#header-footer';
    this.listboxWidgetLink = '#listbox';
    this.numberFieldWidgetLink = '#number-field';
    this.plainTextWidgetLink = '#plain-text';
    this.radioGroupWidgetLink = '#radio-group';
    this.selectWidgetLink = '#select';
    this.switchWidgetLink = '#switch';
    this.textAreaWidgetLink ='#text-area';
    this.textFieldWidgetLink = '#text-field';
    this.baseWidgetLink = '#base';
    this.widgetClassWidgetLink = '#widget';
    this.workersClassWidgetLink = '#workers';
}

async openNewPage(selector) {
    const [newPage] = await Promise.all([
        this.page.waitForEvent('popup'), // Waits for a new page (popup or tab) to be created
        this.page.click(selector) // Click on the user-defined selector
    ]);
    return newPage;
}

}

module.exports = {IndexPage};
