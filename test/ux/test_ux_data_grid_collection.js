(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;
  const MOCK_OBJ_DEFINITION = {
    "nm": "DATA.NOMODEL",
    "type": "entity",
    "widget_class": "UX.DataGridCollection",
    "occs": {
      "type": "occurrence",
      "#3": {
        "nm": "WIDGET.DATA.NOMODEL",
        "type": "field",
        "widget_class": "UX.TextField",
        "properties": {
          "html:type" : "text",
          "label-text" : "Test DG",
          "size" : "4"
        },
        "id": "#3"
      },
      "widget_class": "UX.DataGridOccurrence"
    },
    "properties":{
      "label-text" : "Test DG",
      "responsive-type" : "horizontal-scroll"
    }
  };

  /**
   * Function to determine whether the widget class has been loaded.
  **/
  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
  }

  describe("Uniface Mockup tests", function () {

    it("get class " + widgetName, function () {
      verifyWidgetClass(widgetClass);
    });
  });

  describe("Uniface static structure constructor definition for DataGridCollection class", function () {
    it("should have a static property structure of type Element", function () {
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

  describe("Uniface static structure constructor definition for DataGridColumnHeader class", function () {
    it("should have a static property structure of type Element DataGridColumnHeader", function () {
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

  describe("Uniface static structure constructor definition for DataGridOccurrence class", function () {
    it("should have a static property structure of type Element DataGridOccurrence", function () {
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

  describe("Uniface static structure constructor definition for DataGridField class", function () {
    it("should have a static property structure of type Element DataGridField", function () {
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


  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it(`${widgetName}.processLayout() with mock properties`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        element = tester.processLayout(MOCK_OBJ_DEFINITION);
        tester.onConnect(element);
        tester.dataInit();
      }).then(function() {
        expect(element).to.have.tagName(tester.uxTagName);
      });
    });
  });

  describe(`${widgetName} Checks`, function () {
    var element;
    before(function () {
      verifyWidgetClass(widgetClass);
      element = tester.processLayout(MOCK_OBJ_DEFINITION);
    });

    it("check instance of HTMLElement", function () {
      expect(element).instanceOf(HTMLElement, "Function processLayout of " + `${widgetName}` + " does not return an HTMLElement.");
    });

    it("check tagName", function () {
      expect(element).to.have.tagName(tester.uxTagName);
    });

    it("check id", function () {
      expect(element).to.have.id(widgetId);
    });

    it("check u-datagrid", function () {
      assert.equal(element.querySelector("fluent-data-grid").getAttribute("class"), "u-datagrid","Widget misses or has incorrect u-datagrid class.");
    });

    it("check u-datagrid role", function () {
      assert.equal(element.querySelector("fluent-data-grid").getAttribute("role"), "grid","Widget misses or has incorrect u-datagrid role.");
    });

    it("check u-datagrid tabindex", function () {
      assert.equal(element.querySelector("fluent-data-grid").getAttribute("tabindex"), 0 ,"Widget misses or has incorrect u-datagrid tabindex.");
    });

    it("check u-datagrid-header-row", function () {
      assert.equal(element.querySelector("fluent-data-grid-row").getAttribute("class"), "u-datagrid-header-row","Widget misses or has incorrect u-datagrid-header-row class.");
    });

    it("check u-datagrid-header-row role", function () {
      assert.equal(element.querySelector("fluent-data-grid-row").getAttribute("role"), "row","Widget misses or has incorrect u-datagrid-header-row role.");
    });

    it("check u-datagrid-header-row row-type", function () {
      assert.equal(element.querySelector("fluent-data-grid-row").getAttribute("row-type"), null ,"Widget misses or has incorrect u-datagrid-header-row row-type.");
    });

    it("check u-datagrid-header-row grid-template-columns", function () {
      assert.equal(element.querySelector("fluent-data-grid-row").getAttribute("grid-template-columns"), null  ,"Widget misses or has incorrect u-datagrid-header-row grid-template-columns.");
    });

    it("check u-sw-field-widget-data-nomodel", function () {
      assert.equal(element.querySelector("fluent-data-grid-cell").getAttribute("class"), "u-sw-field-widget-data-nomodel","Widget misses or has incorrect u-sw-field-widget-data-nomodel class.");
    });

    it("check u-sw-field-widget-data-nomodel role", function () {
      assert.equal(element.querySelector("fluent-data-grid-cell").getAttribute("role"), "gridcell","Widget misses or has incorrect u-sw-field-widget-data-nomodel role.");
    });

    it("check u-sw-field-widget-data-nomodel tabindex", function () {
      assert.equal(element.querySelector("fluent-data-grid-cell").getAttribute("tabindex"), -1 ,"Widget misses or has incorrect u-sw-field-widget-data-nomodel tabindex.");
    });

    it("check u-sw-field-widget-data-nomodel style", function () {
      assert.equal(element.querySelector("fluent-data-grid-cell").getAttribute("style"), "grid-column: undefined;" ,"Widget misses or has incorrect u-sw-field-widget-data-nomodel style.");
    });
  });
})();