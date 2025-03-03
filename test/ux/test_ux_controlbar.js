(function () {
  'use strict';

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  const MOCK_EMPTY_DEFINITION = {};
  const MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "",
    "subwidgets-center": "",
    "subwidgets-end": ""
  };
  const MOCK_START_CONTROLS_ONLY_DEFINITION = {
    "subwidgets-start": "first",
    "first_widget-class": "UX.Button"
  };

  const MOCK_CENTER_CONTROLS_ONLY_DEFINITION = {
    "subwidgets-center": "second",
    "second_widget-class": "UX.Select"
  };

  const MOCK_END_CONTROLS_ONLY_DEFINITION = {
    "subwidgets-end": "first",
    "first_widget-class": "UX.TextField"
  };


  const MOCK_CONTROLBAR_DEFAULT_PROPERTIES = {
    "html:hidden":false,
    "class:u-controlbar": true,
    "orientation": "horizontal",
    "widget-resize": false,
    "value": null
  };

  const MOCK_EMPTY_START_CONTROLS_DEFINITION = {
    "subwidgets-start": "",
    "subwidgets-center": "size",
    "subwidgets-end": "goto"
  };

  const MOCK_UNDEFINED_START_CONTROLS_DEFINITION = {
    "subwidgets-center": "goto",
    "subwidgets-end": "size",
    "goto_widget-class": "UX.NumberField",
    "size_widget-class": "UX.Select"
  };

  const MOCK_EMPTY_CENTER_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "",
    "subwidgets-end": "size",
    "info_widget-class": "UX.RadioGroup",
    "size_widget-class": "UX.Select"
  };
  const valRepArray = [
    {
      "value": "1",
      "representation": "a"
    },
    {
      "value": "10",
      "representation": "10"
    },
    {
      "value": "25",
      "representation": "25"
    },
    {
      "value": "50",
      "representation": "50"
    },
    {
      "value": "100",
      "representation": "100"
    }
  ];

  const MOCK_START_CENTER_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "checkbox1info",
    "subwidgets-center": "goto",
    "subwidgets-end": "sizefirst",
    "info_widget-class": "UX.PlainText",
    "goto_widget-class": "UX.NumberField",
    "size_widget-class": "UX.Select",
    "first_widget-class": "UX.Button",
    "checkbox1_widget-class": "UX.Checkbox",
    "goto_delegated-properties": "html:disabledhtml:readonlyclass:classTest"
  };


  const MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-end": "size",
    "info_widget-class": "UX.PlainText",
    "size_widget-class": "UX.Select"
  };


  const MOCK_EMPTY_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "goto",
    "subwidgets-end": "",
    "info_widget-class": "UX.PlainText",
    "goto_widget-class": "UX.NumberField"
  };

  const MOCK_UNDEFINED_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "goto",
    "info_widget-class": "UX.PlainText",
    "goto_widget-class": "UX.NumberField"
  };

  const MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION = {
    "info_widget-class": "UX.PlainText",
    "goto_widget-class": "UX.NumberField",
    "size_widget-class": "UX.Select"
  };

  const MOCK_CONTROLBAR_DATA = {
    "orientation": "vertical",
    "class:classC": "true"
  };

  const MOCK_CONTROLBAR_CONTROLS_DATA = {
    "size:html:disabled": "true",
    "goto:html:hide-step": "true",
    "size:class:classA": "true",
    "goto:class:classB": "true",
    "size:label-text": "Label",
    "first:html:appearance": "accent",
    "first:value": "Go",
    "size:valrep": "1=a10=1025=2550=50100=100"
  };

  const MOCK_DATA_WITH_USEFIELD_VALUE = {
    "subwidgets-start": "select",
    "subwidgets-center": "btn",
    "subwidgets-end": "numberfield",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select:value": "1",
    "select_usefield": "true",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_usefield": "true",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "value": '{"select":"10", "numberfield":"2"}'
  };

  const MOCK_DATA_WITHOUT_USEFIELD_VALUE = {
    "subwidgets-start": "select",
    "subwidgets-center": "btn",
    "subwidgets-end": "numberfield",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select:value": "1",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "value": '{"select":"10","btn":"Hello", "numberfield":"2"}'
  };

  const MOCK_HIDDEN_PROPERTY = {
    "html:hidden": "true"
  };

  const MOCK_DATA_WITHOUT_OVERFLOW = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true"
  };

  const MOCK_DATA_WITH_OVERFLOW_NONE = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "none",
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "none",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "none",
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "none",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "none",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "none"
  };

  const MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "move",
    "select_priority": 2,
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "move",
    "textfld1_priority": 6,
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "move",
    "btn_priority": 3,
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "move",
    "chkbox1_priority": 4,
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "move",
    "numberfield_priority": 5,
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "move",
    "switch1_priority": 1
  };

  const MOCK_DATA_WITH_OVERFLOW_HIDE_AND_PRIORITY = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "hide",
    "select_priority": 1,
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "hide",
    "textfld1_priority": 2,
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "hide",
    "btn_priority": 3,
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "hide",
    "chkbox1_priority": 4,
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "hide",
    "numberfield_priority": 5,
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "hide",
    "switch1_priority": 6
  };

  const MOCK_DATA_WITH_OVERFLOW_MENU_AND_PRIORITY = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "menu",
    "select_priority": 1,
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "menu",
    "textfld1_priority": 2,
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "menu",
    "btn_priority": 3,
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "menu",
    "chkbox1_priority": 4,
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "menu",
    "numberfield_priority": 5,
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "menu",
    "switch1_priority": 6
  };

  const MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "none",
    "select_priority": 2,
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "move",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "menu",
    "btn_priority": 3,
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "move",
    "chkbox1_priority": 4,
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "hide",
    "numberfield_priority": 5,
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "move",
    "switch1_priority": 1
  };

  const MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY = {
    "subwidgets-start": "selecttextfld1",
    "subwidgets-center": "btnchkbox1plaintext1",
    "subwidgets-end": "numberfieldswitch1",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "menu",
    "select:value": "1",
    "textfld1_widget-class": "UX.TextField",
    "textfld1:value": "text Value",
    "textfld1_overflow-behavior": "menu",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn:icon": "Home",
    "btn_overflow-behavior": "menu",
    "chkbox1_widget-class": "UX.Checkbox",
    "chkbox1:value": "true",
    "chkbox1_overflow-behavior": "menu",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "menu",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch1_widget-class": "UX.Switch",
    "switch1:value": "true",
    "switch1_overflow-behavior": "menu",
    "plaintext1_widget-class": "UX.PlainText",
    "plaintext1:value": "Plain text",
    "plaintext1:suffix-text": "Suffix text",
    "plaintext1_overflow-behavior": "menu",
    "plaintext1:prefix-icon": "Home"
  };

  const MOCK_DATA_FOR_SCROLL = {
    "subwidgets-start": "selecttextfield",
    "subwidgets-center": "btncheckbox",
    "subwidgets-end": "numberfieldswitch",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "none",
    "select:value": "1",
    "textfield_widget-class": "UX.TextField",
    "textfield:value": "Value",
    "textfield_overflow-behavior": "none",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "none",
    "checkbox_widget-class": "UX.Checkbox",
    "checkbox:value": "true",
    "checkbox_overflow-behavior": "none",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "none",
    "switch_widget-class": "UX.Switch",
    "switch:value": "true",
    "switch_overflow-behavior": "none"
  };

  const MOCK_DATA_FOR_SCROLL_WITH_MENU = {
    "subwidgets-start": "selecttextfield",
    "subwidgets-center": "btncheckbox",
    "subwidgets-end": "numberfieldswitch",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "none",
    "select:value": "1",
    "textfield_widget-class": "UX.TextField",
    "textfield:value": "Value",
    "textfield_overflow-behavior": "menu",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "none",
    "checkbox_widget-class": "UX.Checkbox",
    "checkbox:value": "true",
    "checkbox_overflow-behavior": "none",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "none",
    "switch_widget-class": "UX.Switch",
    "switch:value": "true",
    "switch_overflow-behavior": "none"
  };

  const MOCK_DATA_FOR_SCROLL_WITH_MENU_FOR_VERTICAL_ORIENTATION = {
    "subwidgets-start": "selecttextfieldbtncheckboxnumberfieldswitch",
    "subwidgets-center": "",
    "subwidgets-end": "",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select_overflow-behavior": "none",
    "select:value": "1",
    "textfield_widget-class": "UX.TextField",
    "textfield:value": "Value",
    "textfield_overflow-behavior": "menu",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "btn_overflow-behavior": "none",
    "checkbox_widget-class": "UX.Checkbox",
    "checkbox:value": "true",
    "checkbox_overflow-behavior": "none",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield_overflow-behavior": "none",
    "switch_widget-class": "UX.Switch",
    "switch:value": "true",
    "switch_overflow-behavior": "none"
  };

  /**
   * Function to determine whether the widget class has been loaded.
   */
  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
  }

  describe("Uniface Mockup tests", function () {

    it("get class " + widgetName, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor definition", function () {

    it('should have a static property structure of type Element', function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal('div');
      expect(structure.styleClass).to.equal('');
      expect(structure.elementQuerySelector).to.equal('');
      expect(structure.attributeDefines).to.be.an('array');
      expect(structure.elementDefines).to.be.an('array');
    });

  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it(`${widgetName}.processLayout() with empty mock properties`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        element = tester.processLayout(MOCK_EMPTY_DEFINITION);
      }).then(function() {
        expect(element).to.have.tagName(tester.uxTagName);
      });
    });

    it(`${widgetName}.processLayout() with just start subwidgets` , function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        element = tester.processLayout(MOCK_START_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function() {
        expect(element);
        expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    it(`${widgetName}.processLayout() with just center subwidgets`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        element = tester.processLayout(MOCK_CENTER_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function() {
        expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    it(`${widgetName}.processLayout() with just end subwidgets`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        element = tester.processLayout(MOCK_END_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function() {
        expect(element);
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
      });
    });

    describe("If subwidgets-start is undefined or empty", function () {
      it("should not contain start subwidgets if subwidgets-start is empty and widget-class not defined for other subwidget section", function () {
        return asyncRun(function() {
          const tester = new umockup.WidgetTester();
          verifyWidgetClass(widgetClass);
          element = tester.processLayout(MOCK_EMPTY_START_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);

        });
      });

      it("should not contain start subwidgets if subwidgets-start is undefined", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        return asyncRun(function() {
          element = tester.processLayout(MOCK_UNDEFINED_START_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element);
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(1);

        });
      });
    });

    describe("If subwidgets-center is undefined or empty", function () {
      it("should not contain center subwidgets if subwidgets-center is empty", function () {
        verifyWidgetClass(widgetClass);
        return asyncRun(function() {
          element = tester.processLayout(MOCK_EMPTY_CENTER_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(1);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        });
      });

      it("should not contain center subwidgets if subwidgets-center is undefined", function () {
        verifyWidgetClass(widgetClass);
        return asyncRun(function() {
          element = tester.processLayout(MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(1);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        });
      });
    });

    describe("If subwidgets-end is undefined or empty", function () {
      it("should not contain end subwidgets if subwidgets-end is empty", function () {
        return asyncRun(function() {
          verifyWidgetClass(widgetClass);
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_EMPTY_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });

      it("should not contain end subwidgets if subwidgets-end is undefined", function () {
        return asyncRun(function() {
          verifyWidgetClass(widgetClass);
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_UNDEFINED_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });
    });

    describe("When the definition.properties does not contain subwidgets id's defined", function () {
      it("should not contain start, center and end subwidgets", function () {
        const tester = new umockup.WidgetTester();
        return asyncRun(function() {
          element = tester.processLayout(MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });
    });

    describe("If subwidgets-start, subwidgets-center and subwidgets-end are defined", function () {

      it("should contain start, center and end subwidgets", function () {
        return asyncRun(function() {
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          verifyWidgetClass(widgetClass);
          expect(element.querySelector(".u-start-section").children.length).to.equal(2);
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(2);
          expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
          expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
        });
      });
    });

    describe("When the definition.properties does not contain subwidgets-start, subwidgets-center and subwidgets-end defined", function () {
      it("should not contain start, center and end subwidgets", function () {
        const tester = new umockup.WidgetTester();
        return asyncRun(function() {
          element = tester.processLayout(MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.be.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.be.equal(0);
          expect(element.querySelector(".u-end-section").children.length).to.be.equal(0);
        });
      });
    });

    describe(`${widgetName} Checks`, function () {

      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout(MOCK_START_CONTROLS_ONLY_DEFINITION);
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

      it("check u-start-section", function () {
        assert(element.querySelector("div.u-start-section"), "Widget misses or has incorrect u-start-section element");
      });

      it("check u-center-section", function () {
        assert(element.querySelector("div.u-start-section"), "Widget misses or has incorrect u-center-section element");
      });

      it("check u-end-section", function () {
        assert(element.querySelector("div.u-end-section"), "Widget misses or has incorrect u-end-section element");
      });

      it("check u-overflow-container", function () {
        assert(element.querySelector("div.u-overflow-container"), "Widget misses or has incorrect u-overflow-container element");
      });
    });
  });

  describe(`${widgetName}.onConnect()`, function () {
    const tester = new umockup.WidgetTester();
    const element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
    const widget = tester.onConnect();
    tester.dataInit();

    it("check element created and connected", function () {
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "Widget is not connected");
    });

    it("should add widgetElement(which is passed as parameter) to widget property of elements object", function () {
      tester.onConnect(element);
      expect(tester.element).to.deep.equal(element);
    });

    it("should add references to subwidget elements", function () {
      let mockSubWidgetIds = new Set(["info", "goto", "size"]);
      tester.onConnect(element);

      mockSubWidgetIds.forEach((subWidgetId) => {
        expect(tester.widget.subWidgets[subWidgetId]).not.to.be.null;
      });
    });
  });

  describe(`${widgetName}.createWidget`, function () {

    it(`${widgetName}.constructor()`, function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(true, widgetClass.defaultValues['class:u-controlbar'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("should have default properties added", function () {
      expect(widgetClass.defaultValues).to.deep.equal(MOCK_CONTROLBAR_DEFAULT_PROPERTIES);
    });

  });

  describe(`${widgetName}.dataInit()`, function () {
    it("should put widget in defined initial state", function () {
      const tester = new umockup.WidgetTester();
      return asyncRun(function() {
        tester.processLayout(MOCK_EMPTY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function() {
        for (let key in widgetClass.defaultValues.classes) {
          expect(widgetClass.defaultValues.classes[key]).to.be.true;
        }
      });
    });
  });

  describe(`${widgetName}.dataUpdate()`, function () {

    describe("When there is change in the controlbar properties", function () {
      let element;
      const tester = new umockup.WidgetTester();

      it("if there is change in any controlbar properties, should be reflected on the widgetElement", function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_DATA);
        }).then(function() {
          expect(element.classList.contains("classC")).to.be.true;
          expect(element.getAttribute("u-orientation")).to.equal("vertical");
          expect(window.getComputedStyle(element)['flex-direction']).to.equal("column");
        });
      });

      it("if disabled is set to true, it should be reflected on the subwidgets with disabled as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataUpdate({
            "html:disabled": "true"
          });
        }).then(function() {
          // check if property delegation is working
          expect(element.querySelector("fluent-number-field").hasAttribute("disabled")).to.be.true;
          expect(element.querySelector(".u-sw-changebutton.neutral").hasAttribute("disabled")).to.be.true;
          expect(element.querySelector("fluent-select").hasAttribute("disabled")).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").hasAttribute("disabled")).to.be.false;
          expect(element.querySelector("fluent-checkbox").hasAttribute("disabled")).to.be.false;
        });
      });

      it("if readonly is set to true, it should be reflected on the subwidgets with readonly as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataUpdate({
            "html:readonly": "true"
          });
        }).then(function() {
          // check if property delegation is working
          expect(element.querySelector("fluent-number-field").hasAttribute("readonly")).to.be.true;
          expect(element.querySelector("fluent-select").hasAttribute("readonly")).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").hasAttribute("readonly")).to.be.false;
          expect(element.querySelector("fluent-checkbox").hasAttribute("readonly")).to.be.false;
        });
      });

      it("if class is set to widget, it should be reflected on the subwidgets with same class as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataUpdate({
            "class:classTest": "true"
          });
        }).then(function() {
          // check if property delegation is working
          expect(element.querySelector("fluent-number-field").classList.contains('classTest')).to.be.true;
          expect(element.querySelector("fluent-select").classList.contains('classTest')).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").classList.contains('classTest')).to.be.false;
          expect(element.querySelector("fluent-checkbox").classList.contains('classTest')).to.be.false;
        });
      });

      it("if there is any change in subwidgets properties and html properties, should be reflected on the subwidgets", function () {
        // dataUpdate deletes the property of object hence creating deepcopy of object for checking
        let updatedData = Object.assign({}, MOCK_CONTROLBAR_CONTROLS_DATA);
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_CONTROLS_DATA);
        }).then(function() {
          // check if there is any change in subwidgets properties
          expect(element.querySelector("fluent-select .u-label-text").textContent).to.equal(updatedData["size:label-text"]);
          expect(element.querySelector("fluent-number-field .u-label-text").hasAttribute('hidden')).to.be.true;
          expect(element.querySelector("fluent-checkbox .u-label-text").hasAttribute('hidden')).to.be.true;

          // check if any change in subwidget's html properties
          expect(element.querySelector("fluent-select").hasAttribute("disabled")).to.be.true;
          expect(String(element.querySelector("fluent-select").hasAttribute('disabled')).toLowerCase()).to.equal(updatedData["size:html:disabled"]);
          expect(String(element.querySelector("fluent-number-field").hasAttribute('hide-step')).toLowerCase()).to.equal(updatedData["goto:html:hide-step"]);
        });
      });

      it("if there is any change in subwidget's valrep properties, should be reflected on the subwidgets", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate({"size:valrep": "1=a10=1025=2550=50100=100"});
        }).then(function() {
          let selectOptionArray = element.querySelectorAll("fluent-option");
          selectOptionArray.forEach(function (node, index) {
            expect(node.textContent).equal(valRepArray[index].representation);
          });
        });
      });

      it("if hidden property is set to be true, it should be reflected", function () {
        return asyncRun(function() {
          tester.dataUpdate(MOCK_HIDDEN_PROPERTY);
        }).then(function() {
          expect(element.hasAttribute("hidden")).to.equal(true);
          expect(window.getComputedStyle(element).display).equal("none");
        });
      });
    });
  });

  describe(`${widgetName}.blockUI()`, function () {
    it("should make the subwidgets readonly/disabled (whatever that is applicable)", function () {
      const tester = new umockup.WidgetTester();
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function() {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
      }).then(function() {
        expect(element.querySelector(".u-start-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-start-section").firstChild.className).contains("readonly");
        expect(element.querySelector(".u-center-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-center-section").firstChild.className).contains("readonly");
        expect(element.querySelector(".u-end-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).contains("u-readonly");
      });
    });
  });

  describe(`${widgetName}.unblockUI()`, function () {
    it("should remove readonly/disabled (whatever that is applicable) from the subwidgets", function () {
      const tester = new umockup.WidgetTester();
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function() {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
        expect(element.querySelector(".u-start-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-center-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).contains("u-blocked");
        conn.unblockUI();
      }).then(function() {
        expect(element.querySelector(".u-start-section").firstChild.className).not.contains("u-blocked");
        expect(element.querySelector(".u-center-section").firstChild.className).not.contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).not.contains("u-blocked");
      });
    });
  });

  describe(`${widgetName} OverFlow tests`, function () {
    it("resize the widget container and expect the widget-resize property to be true and expect widgets to not be removed", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '300px';

      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        node.style.width = '200px';
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector('.u-start-section').children.length).equal(2);
        expect(element.querySelector('.u-center-section').children.length).equal(1);
        expect(element.querySelector('.u-end-section').children.length).equal(2);
        node.style.width = '500px';
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector('.u-start-section').children.length).equal(2);
        expect(element.querySelector('.u-center-section').children.length).equal(1);
        expect(element.querySelector('.u-end-section').children.length).equal(2);
      });
    });

    it("overflow button should be hidden when there is no overflow of subwidgets", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '900px';
      }).then(function() {
        expect(widget.elements.widget.classList.contains("u-overflowed"));
        expect(element.querySelector("fluent-button.u-overflow-button").isConnected).to.be.true;
        expect(element.querySelector("fluent-button.u-overflow-button").hasAttribute("hidden")).to.be.true;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute("hidden")).to.be.true;
      });
    });

    it("overflow button should be visible when there is an overflow of subwidgets", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '300px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-button.u-overflow-button").isConnected).to.be.true;
        expect(element.querySelector("fluent-button.u-overflow-button").hasAttribute("hidden")).to.be.false;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute("hidden")).to.be.true;
      });
    });

    it("when the overflow behavior is set to none and a priority is defined, the subwidgets maintain their positions", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_NONE);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(MOCK_DATA_WITH_OVERFLOW_NONE);
        node = document.querySelector('#widget-container');
        node.style.width = '300px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(widget.elements.widget.classList.contains("u-overflowed"));
        expect(element.querySelector("fluent-button.u-overflow-button").hasAttribute("hidden")).to.be.true;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute("hidden")).to.be.true;

        expect(!element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item"));
        expect(!element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item"));
        expect(!element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item"));
        expect(!element.querySelector("fluent-switch.u-sw-switch1").classList.contains("u-overflown-item"));
        expect(!element.querySelector("fluent-text-field.u-sw-textfld1").classList.contains("u-overflown-item"));

        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("when the overflow behavior is set to hide and priority defined, sub-widgets are hidden when they overflow", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_HIDE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '100px';
      }).then(function() {
        expect(widget.elements.widget.classList.contains("u-overflowed"));
        expect(element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-switch.u-sw-switch1").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").classList.contains("u-overflown-item"));

        expect(element.querySelector("fluent-button.u-overflow-button").hasAttribute("hidden")).to.be.false;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute("hidden")).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("when the overflow behavior is set to menu and priority is defined, sub-widgets always sit in the overflow menu, with or without change in width", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function() {
        expect(widget.elements.widget.classList.contains("u-overflowed"));
        expect(element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item"));
        expect(element.querySelector("fluent-switch.u-sw-switch1").classList.contains("u-overflown-item"));

        expect(element.querySelector("fluent-button.u-overflow-button").hasAttribute("hidden")).to.be.false;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute("hidden")).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;

        expect(element.querySelector(".u-overflow-menu [item-id=select]").classList.contains("u-not-supported"));
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").classList.contains("u-not-supported"));
        expect(!element.querySelector(".u-overflow-menu [item-id=btn]").classList.contains("u-not-supported"));
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").classList.contains("u-not-supported"));
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").classList.contains("u-not-supported"));
      });
    });
  });

  describe("OverFlow tests with priority and overflow not defined", function () {
    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to  900px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '900px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 800px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 600px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '600px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 500px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '500px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 400px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '400px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 50px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITHOUT_OVERFLOW);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        node = document.querySelector('#widget-container');
        node.style.width = '50px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });
  });

  describe("OverFlow tests with priority defined and overflow is set to move", function () {
    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 1000px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '1000px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 800px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 600px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '600px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 400px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '400px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 300px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '300px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 50px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '50px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 50px and widget overflow behavior is updated manually to none", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MOVE_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate({
          "numberfield_overflow-behavior": "none"
        });
        node = document.querySelector('#widget-container');
        node.style.width = '50px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });
  });

  describe("OverFlow tests with different priority and combination of overflow behavior", function () {
    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 1000px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '1000px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 800px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 600px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '600px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).not.to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.true;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 300px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '300px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 50px", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_DIFFERENT_OVERFLOW_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '50px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });
  });

  describe("Check the contents of the overflow menu", function () {
    it("check subwidgets order in overflow menu when overflow-behavior is set to menu", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_AND_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_AND_PRIORITY);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '1200px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-chkbox1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-container").hasAttribute('slot')).to.be.true;
        expect(element.querySelector(".u-overflow-container").getAttribute('slot')).to.be.equal("end");
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;

        expect(element.querySelectorAll("fluent-menu-item")[0].getAttribute('item-id')).to.be.equal("select");
        expect(element.querySelectorAll("fluent-menu-item")[1].getAttribute('item-id')).to.be.equal("textfld1");
        expect(element.querySelectorAll("fluent-menu-item")[2].getAttribute('item-id')).to.be.equal("btn");
        expect(element.querySelectorAll("fluent-menu-item")[3].getAttribute('item-id')).to.be.equal("chkbox1");
        expect(element.querySelectorAll("fluent-menu-item")[4].getAttribute('item-id')).to.be.equal("numberfield");
        expect(element.querySelectorAll("fluent-menu-item")[5].getAttribute('item-id')).to.be.equal("switch1");
      });
    });

    it("should check overflow menu contents, item text and its different states (supported and un-supported widgets) when opened", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let overFlowBtnElement;
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      return asyncRun(function() {
        widget= tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;

        // Simulate click event on overflow button to open the menu.
        overFlowBtnElement = document.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        // Check menu items contents, if the supported subwidget has prefix-icon and suffix text then it should be visible in menu.
        expect(element.querySelector(".u-overflow-menu [item-id=select]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=select]").childNodes[1].textContent).to.equal("ERROR: UX.Select not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").childNodes[1].textContent).to.equal("ERROR: UX.TextField not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").childNodes[1].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["btn:value"]);
        expect(element.querySelector(".u-overflow-menu [item-id=btn]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Home");

        expect(element.querySelector(".u-overflow-menu [item-id=chkbox1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=chkbox1]").childNodes[1].textContent).to.equal("ERROR: UX.Checkbox not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[1].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["plaintext1:value"]);
        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[2].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["plaintext1:suffix-text"]);
        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Home");

        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").childNodes[1].textContent).to.equal("ERROR: UX.NumberField not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").childNodes[1].textContent).to.equal("ERROR: UX.Switch not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("should check overflow menu contents, item text and its different states (supported and un-supported widgets) when closed", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();
      let node = document.querySelector('#widget-container');
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      let data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      return asyncRun(function() {
        widget= tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        expect(widget.data['widget-resize']).to.be.true;
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        // Check menu items contents, if the supported subwidget has prefix-icon and suffix text then it should be visible in menu.
        expect(element.querySelector(".u-overflow-menu [item-id=select]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=select]").childNodes[1].textContent).to.equal("ERROR: UX.Select not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").childNodes[1].textContent).to.equal("ERROR: UX.TextField not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").childNodes[1].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["btn:value"]);
        expect(element.querySelector(".u-overflow-menu [item-id=btn]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Home");

        expect(element.querySelector(".u-overflow-menu [item-id=chkbox1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=chkbox1]").childNodes[1].textContent).to.equal("ERROR: UX.Checkbox not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[1].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["plaintext1:value"]);
        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[2].textContent).to.equal(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY["plaintext1:suffix-text"]);
        expect(element.querySelector(".u-overflow-menu [item-id=plaintext1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Home");

        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").childNodes[1].textContent).to.equal("ERROR: UX.NumberField not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").childNodes[0].getAttribute("class")).to.equal("u-prefix ms-Icon ms-Icon--Blocked");
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").childNodes[1].textContent).to.equal("ERROR: UX.Switch not supported as menu-item!");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });
  });

  describe("Check the scroll behavior of controlbar on overflow of subwidgets", function () {
    let element, node, data, isHorizontalScrollPresent;

    it("check if horizontal scrollbar appears when there is an overflow when all subwidgets have overflow behavior set as 'none'", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL);
      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function () {
        node = document.querySelector('#widget-container');
        node.style.width = '1500px';
        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === false, "Horizontal scrollbar is shown when there is no overflow.");
        node.style.width = '500px';
        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");

        // Change the direction to 'rtl', scrollbar should still be present.
        const bodyDiv = document.querySelector("body");
        bodyDiv?.setAttribute("dir","rtl");
        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow in 'rtl' direction.");

        // Change the direction to 'ltr', scrollbar should still be present.
        bodyDiv?.setAttribute("dir","ltr");
        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow in 'ltr' direction.");

        // Remove the attribute so that the test page goes back to normal.
        bodyDiv?.removeAttribute("dir");
      });
    });

    it("check if horizontal scrollbar appears when there is an overflow when one subwidget has overflow behavior set as 'menu' and the rest have 'none'", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL_WITH_MENU);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL_WITH_MENU);
      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function () {
        node = document.querySelector('#widget-container');
        node.style.width = '500px';

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");

        // Simulate click event on overflow button to open the overflow menu.
        const overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown after opening the menu.");

        // Verify opening the menu does not cause a vertical overflow.
        const isVerticalScrollPresent = element.scrollHeight > element.clientHeight;
        assert(isVerticalScrollPresent === false, "Vertical scrollbar is shown after opening the menu.");
      });
    });

    it("check scrollbar behavior when one subwidget has overflow behavior set as 'menu' and the rest have 'none' with orientation set as 'vertical' with enough space", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL_WITH_MENU);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL_WITH_MENU);
      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate({
          ...data,
          "orientation": "vertical"
        });
      }).then(function () {
        node = document.querySelector('#widget-container');
        node.style.width = '500px';

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === false, "Horizontal scrollbar is shown when there is no overflow.");

        // Simulate click event on overflow button to open the overflow menu.
        const overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === false, "Horizontal scrollbar is shown after opening the menu.");

        // Verify opening the menu does not cause a vertical overflow.
        const isVerticalScrollPresent = element.scrollHeight > element.clientHeight;
        assert(isVerticalScrollPresent === false, "Vertical scrollbar is shown after opening the menu.");
      });
    });

    it("check scrollbar behavior when one subwidget has overflow behavior set as 'menu' and the rest have 'none' with orientation set as 'vertical' with not enough space", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL_WITH_MENU_FOR_VERTICAL_ORIENTATION);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL_WITH_MENU_FOR_VERTICAL_ORIENTATION);
      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate({
          ...data,
          "orientation": "vertical"
        });
      }).then(function () {
        node = document.querySelector('#widget-container');
        node.style.width = '200px';

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");

        // Simulate click event on overflow button to open the overflow menu.
        const overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown after opening the menu.");

        // Verify opening the menu does not cause a vertical overflow.
        const isVerticalScrollPresent = element.scrollHeight > element.clientHeight;
        assert(isVerticalScrollPresent === false, "Vertical scrollbar is shown after opening the menu.");
      });
    });
  });

  describe("Check the opening and closing behavior of overflow menu", function () {
    let element, overFlowBtnElement, node, data;

    it("check overflow menu behavior when overflow button is clicked", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);

      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function () {
        // Overflow menu should be hidden initially.
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;

        // Simulate click event on overflow button to open the overflow menu.
        overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();

        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;

        // Simulate another click event on overflow button to close the overflow menu.
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");

        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-menu-item[item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
      });
    });

    it("check if the overflow menu closes after resize", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);

      return asyncRun(function() {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);

        // Overflow menu should be hidden initially.
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;

        // Simulate click event on overflow button to open the overflow menu.
        overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        // Now resize the controlbar.
        node = document.querySelector('#widget-container');
        node.style.width = '800px';
      }).then(function() {
        // After resize overflow menu should be hidden.
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("check if the overflow menu closes on outside click", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);
      data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_MENU_NO_PRIORITY);

      return asyncRun(function() {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function() {
        // Overflow menu should be hidden initially.
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;

        // Simulate click event on overflow button to open the overflow menu.
        overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        // Simulate a click somewhere outside the overflow menu.
        let startSecElement = element.querySelector("div.u-center-section");
        startSecElement.click();

        // After outside click overflow menu should be hidden.
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;
        expect(element.querySelector(".u-overflow-menu [item-id=btn]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=select]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=numberfield]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=textfld1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector(".u-overflow-menu [item-id=switch1]").hasAttribute('hidden')).to.be.false;
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfld1").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch1").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("check if the overflow menu closes on scrolling", function () {
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL_WITH_MENU);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL_WITH_MENU);
      return asyncRun(function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
        node = document.querySelector('#widget-container');
        node.style.width = '500px';
        const isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");

        // Simulate click event on overflow button to open the overflow menu.
        const overFlowBtnElement = element.querySelector("fluent-button.u-overflow-button");
        overFlowBtnElement.click();
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.false;

        // Scroll to the opposite end and check if menu got closed.
        element.scrollTo({
          "left": element.scrollWidth
        });
      }).then(function () {
        expect(element.querySelector("fluent-menu.u-overflow-menu").hasAttribute('hidden')).to.be.true;
      });
    });
  });

  describe("Mock usefield value to use either field value or property value", function () {
    it("no usefield is defined for any of the subwidget then it should update with property value", function () {
      let element, widget;
      const tester = new umockup.WidgetTester();

      element = tester.processLayout(MOCK_DATA_WITHOUT_USEFIELD_VALUE);
      let data = Object.assign({}, MOCK_DATA_WITHOUT_USEFIELD_VALUE);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function() {
        expect(element.querySelector('.u-start-section').children.length).equal(1);
        expect(element.querySelector('.u-center-section').children.length).equal(1);
        expect(element.querySelector('.u-end-section').children.length).equal(1);
        // Verify select value.
        let selectElementValue = element.querySelector("fluent-select").value;
        let valrep = widget.getFormattedValrep(MOCK_DATA_WITHOUT_USEFIELD_VALUE["select:valrep"]);
        let selectValue = valrep[selectElementValue].value;
        expect(selectValue).equal(MOCK_DATA_WITHOUT_USEFIELD_VALUE["select:value"]);

        // Verify button.
        let buttonValue = document.querySelector("fluent-button .u-text").innerText;
        expect(buttonValue).equal(MOCK_DATA_WITHOUT_USEFIELD_VALUE["btn:value"]);

        // Verify numberfield.
        let numberfieldValue = document.querySelector("fluent-number-field").value;
        expect(numberfieldValue).equal(MOCK_DATA_WITHOUT_USEFIELD_VALUE["numberfield:value"]);

        // Verify getValue
        expect(widget.getValue()).equal('{}');
      });

    });
    it("useField is defined for few of the subwidgets and for others it will be false", function () {
      let element;
      const tester = new umockup.WidgetTester();
      let widget;
      element = tester.processLayout(MOCK_DATA_WITH_USEFIELD_VALUE);
      let data = Object.assign({}, MOCK_DATA_WITH_USEFIELD_VALUE);
      const fieldValue = JSON.parse(data.value);
      return asyncRun(function() {
        widget = tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(data);
      }).then(function() {
        expect(element.querySelector('.u-start-section').children.length).equal(1);
        expect(element.querySelector('.u-center-section').children.length).equal(1);
        expect(element.querySelector('.u-end-section').children.length).equal(1);
        // Verify select value.
        let selectElementValue = element.querySelector("fluent-select").value;
        let valrep = widget.getFormattedValrep(MOCK_DATA_WITH_USEFIELD_VALUE["select:valrep"]);
        let selectValue = valrep[selectElementValue].value;
        expect(selectValue).equal(fieldValue["select"]);

        // Verify button.
        let buttonValue = document.querySelector("fluent-button .u-text").innerText;
        expect(buttonValue).equal(MOCK_DATA_WITH_USEFIELD_VALUE["btn:value"]);
        expect(buttonValue).not.equal(fieldValue["btn"]);

        // Verify numberfield.
        let numberfieldValue = document.querySelector("fluent-number-field").value;
        expect(numberfieldValue).equal(fieldValue["numberfield"]);

        // Verify getValue
        expect(widget.getValue()).equal(JSON.stringify(fieldValue));
      });
    });
  });

  describe("Reset all properties to default", function () {
    it("reset all property", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });
})();
