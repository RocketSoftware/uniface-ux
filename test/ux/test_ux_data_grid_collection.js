(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();

  /**
   * Function to determine whether the widget class has been loaded.
   */
  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
  }

  describe("Uniface Mockup tests", function () {

    it(`get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });
  });

  describe("Uniface static structure constructor() definition for DataGridCollection class", function () {
    it(`${widgetName} should have a static property structure of type Element`, function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-design-system-provider");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
      expect(structure.hidden).to.equal(false);
    });
  });

  describe("Uniface static structure constructor() definition for DataGridColumnHeader class", function () {
    it("UX.DataGridColumnHeader class should have a static property structure of type Element", function () {
      // eslint-disable-next-line no-undef
      const widgetClassName  = UNIFACE.ClassRegistry.get("UX.DataGridColumnHeader");
      verifyWidgetClass(widgetClassName);
      const structure = widgetClassName.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-data-grid-cell");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
    });
  });

  describe("Uniface static structure constructor() definition for DataGridOccurrence class", function () {
    it("UX.DataGridOccurrence class should have a static property structure of type Element", function () {
      // eslint-disable-next-line no-undef
      const widgetClassName  = UNIFACE.ClassRegistry.get("UX.DataGridOccurrence");
      verifyWidgetClass(widgetClassName);
      const structure = widgetClassName.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-data-grid-row");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.isSetter).to.equal(true);
      expect(structure.childWorkers).to.be.an("array");
      expect(structure.hidden).to.equal(false);
    });
  });

  describe("Uniface static structure constructor() definition for DataGridField class", function () {
    it("UX.DataGridField class should have a static property structure of type Element", function () {
      // eslint-disable-next-line no-undef
      const widgetClassName  = UNIFACE.ClassRegistry.get("UX.DataGridField");
      verifyWidgetClass(widgetClassName);
      const structure = widgetClassName.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-data-grid-cell");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
    });
  });
})();