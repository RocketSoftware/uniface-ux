(function () {
  'use strict';

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  const MOCK_EMPTY_DEFINITION = { properties: {} };

  const MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };
  const MOCK_START_CONTROLS_ONLY_DEFINITION = {
    properties: {
      "subwidgets-start": "first",
      "first:widget-class": "UX.Button"
    }
  };
  const MOCK_CENTER_CONTROLS_ONLY_DEFINITION = {
    properties: {
      "subwidgets-center": "second",
      "second:widget-class": "UX.Select"
    }
  };
  const MOCK_END_CONTROLS_ONLY_DEFINITION = {
    properties: {
      "subwidgets-end": "first",
      "first:widget-class": "UX.TextField"
    }
  };

  const MOCK_CONTROLBAR_DEFAULT_PROPERTIES = {
    classes: {
      "u-controlbar": true
    },
    uniface: {
      orientation: "horizontal",
      "widget-resize": false
    },
    value: null
  };

  const MOCK_EMPTY_START_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "",
      "subwidgets-center": "size",
      "subwidgets-end": "goto",
      "info:widget-class": "UX.RadioGroup",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };
  const MOCK_UNDEFINED_START_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-center": "goto",
      "subwidgets-end": "size",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };
  const MOCK_EMPTY_CENTER_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "info",
      "subwidgets-center": "",
      "subwidgets-end": "size",
      "info:widget-class": "UX.RadioGroup",
      "size:widget-class": "UX.Select"
    }
  };
  const valRepArray = [
    {
      value: "1",
      representation: "a"
    },
    {
      value: "10",
      representation: "10"
    },
    {
      value: "25",
      representation: "25"
    },
    {
      value: "50",
      representation: "50"
    },
    {
      value: "100",
      representation: "100"
    }
  ];

  const MOCK_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "info",
      "subwidgets-center": "goto",
      "subwidgets-end": "sizefirst",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select",
      "first:widget-class": "UX.Button"
    }
  };


  const MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "info",
      "subwidgets-end": "size",
      "info:widget-class": "UX.PlainText",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_EMPTY_END_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "info",
      "subwidgets-center": "goto",
      "subwidgets-end": "",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField"
    }
  };

  const MOCK_UNDEFINED_END_CONTROLS_DEFINITION = {
    properties: {
      "subwidgets-start": "info",
      "subwidgets-center": "goto",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField"
    }
  };
  const MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };
  const MOCK_CONTROLBAR_DATA = {
    uniface: {
      orientation: "vertical"
    },
    style: {
      padding: "10px"
    },
    classes: {
      classC: "true"
    }
  };

  const MOCK_CONTROLBAR_CONTROLS_DATA = {
    uniface: {
      "size:html:disabled": "true",
      "goto:html:hide-step": "true",
      "size:style:min-width": "100px",
      "goto:style:margin": "5px",
      "size:class:classA": "true",
      "goto:class:classB": "true",
      "size:label-text": "Label",
      "first:html:appearance": "accent",
      "first:value": "Go",
      "size:valrep": "1=a10=1025=2550=50100=100"
    }
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

  describe(widgetName + ".processLayout", function () {
    let element;

    it("processLayout with empty mock properties", function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_EMPTY_DEFINITION);
      expect(element).to.have.tagName(tester.uxTagName);
    });

    it("processLayout with just start controls", function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_START_CONTROLS_ONLY_DEFINITION);
      tester.onConnect();
      tester.dataInit();
      expect(element);
      expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
    });

    it("processLayout with just center controls", function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_CENTER_CONTROLS_ONLY_DEFINITION);
      tester.onConnect();
      tester.dataInit();
      expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
    });

    it("processLayout with just end controls", function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_END_CONTROLS_ONLY_DEFINITION);
      tester.onConnect();
      tester.dataInit();
      expect(element);
      expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
    });

    describe("if subwidgets-start is undefined or empty", function () {
      it("should not contain start controls if subwidgets-start is empty", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_EMPTY_START_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
      });

      it("should not contain start controls if subwidgets-start is undefined", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_UNDEFINED_START_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element);
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
      });
    });

    describe("if subwidgets-center is undefined or empty", function () {
      it("should not contain center controls if subwidgets-center is empty", function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout(MOCK_EMPTY_CENTER_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
      });

      it("should not contain center controls if subwidgets-center is undefined", function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout(MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
      });
    });

    describe("if subwidgets-end is undefined or empty", function () {
      it("should not contain end controls if subwidgets-end is empty", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_EMPTY_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });

      it("should not contain end controls if subwidgets-end is undefined", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_UNDEFINED_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    describe("when the definition.properties does not contain control id's defined", function () {
      it("should not contain start, center and end controls", function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    describe("if subwidgets-start, subwidgets-center and subwidgets-end are defined", function () {
      beforeEach(function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      });

      it("should contain start, center and end controls", function () {
        verifyWidgetClass(widgetClass);
        expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
      });
    });

    describe("when the definition.properties does not contain control id's defined", function () {
      it("should not contain start, center and end controls", function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    describe("when the definition.properties does not contain control-start, control-center and control-end defined", function () {
      it("should not contain start, center and end controls", function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
        expect(element.querySelector(".u-start-section").children.length).to.be.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.be.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.be.equal(0);
      });
    });

    describe("Checks", function () {

      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout(MOCK_START_CONTROLS_ONLY_DEFINITION);
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, "Function processLayout of " + widgetName + " does not return an HTMLElement.");
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

  describe("onConnect", function () {
    const tester = new umockup.WidgetTester();
    const element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
    const widget = tester.onConnect();
    tester.dataInit();

    it("check element created and connected", function () {
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "widget is not connected");
    });

    it("should add widgetElement(which is passed as parameter) to widget property of elements object", function () {
      tester.onConnect(element);
      expect(tester.element).to.deep.equal(element);
    });

    it("refernces to control elements should be added", function () {
      let mockControlIds = new Set(["info", "goto", "size"]);
      tester.onConnect(element);

      mockControlIds.forEach((controlId) => {
        expect(tester[controlId]).not.to.be.null;
      });
    });
  });

  describe("createWidget", function () {

    it("constructor", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues.classes['u-controlbar'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("should have default properties added", function () {
      expect(widgetClass.defaultValues).to.deep.equal(MOCK_CONTROLBAR_DEFAULT_PROPERTIES);
    });

  });

  describe("dataInit()", function () {
    it("should put widget in defined initial state", function () {
      const tester = new umockup.WidgetTester();
      tester.processLayout(MOCK_EMPTY_DEFINITION);
      tester.onConnect();
      tester.dataInit();
      for (let key in widgetClass.defaultValues.classes) {
        expect(widgetClass.defaultValues.classes[key]).to.be.true;
      }
    });
  });
  describe("dataUpdate()", function () {
    describe("when there is change in the controlbar properties", function () {
      let element;
      const tester = new umockup.WidgetTester();

      it("if there is change in any class properties, should be reflected on the widgetElement", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_DATA);
        }).then(function() {
          for (let key in MOCK_CONTROLBAR_DATA.classes) {
            expect(element.classList.contains(key)).to.be.true;
          }
        });
      });

      it("if there is any change in control's uniface properties, should be reflected on the control", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_DATA);
        }).then(function() {
          for (let key in MOCK_CONTROLBAR_DATA.uniface) {
            let [...subKeys] = key.split(":");
            if (subKeys[0] === "label-text") {
              expect(element.querySelector(".u-label-text").textContent).to.equal(MOCK_CONTROLBAR_CONTROLS_DATA.uniface[key]);
            }
          }
        });
      });

      it("if there is any change in control's html properties, should be reflected on the control", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_CONTROLS_DATA);
        }).then(function() {
          for (let key in MOCK_CONTROLBAR_CONTROLS_DATA.uniface) {
            let [ ...subKeys] = key.split(":");
            if (subKeys[0] === "html") {
              let selectArray = element.querySelectorAll("fluent-select");
              expect(selectArray[0].hasAttribute("disabled")).to.be.true;
            }
          }
        });
      });

      it("if there is any change in control's val properties, should be reflected on the control", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function() {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate({"uniface":{"size:valrep": "1=a10=1025=2550=50100=100"}});
        }).then(function() {
          for (let key in MOCK_CONTROLBAR_CONTROLS_DATA.uniface) {
            let [...subKeys] = key.split(":");
            if (subKeys[0] === "class") {
              let selectOptionArray = element.querySelectorAll("fluent-option");
              selectOptionArray.forEach(function (node, index) {
                expect(node.textContent).equal(valRepArray[index].representation);
              });
            }
          }
        });
      });

      it("if there is any change in control's valrep property, should be reflected on the control", function () {
        tester.onConnect(element);
        tester.dataInit();
        tester.dataUpdate(MOCK_CONTROLBAR_CONTROLS_DATA);

        for (let key in MOCK_CONTROLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, subKeys] = key.split(":");
          if (subKeys[0] === "valrep") {
            let formattedValrep = umockup.getFormattedValrep(MOCK_CONTROLBAR_CONTROLS_DATA.uniface[key]);
            let listboxOptions = umockup[mainKey].element.querySelectorAll("fluent-option");
            Array.from(listboxOptions).forEach((option, i) => {
              expect(option.value).to.equal(formattedValrep[i].value);
              expect(option.querySelector(".u-valrep-representation").textContent).to.equal(formattedValrep[i].representation);
            });
          }
        }
      });
    });
  });
  describe("dataCleanup()", function () {
    describe("reset all properties to default", function() {
      let widget;
      before(function () {
        widget = tester.createWidget();
      });

      it("reset all property", function() {
        try {
          tester.dataUpdate(tester.getDefaultValues());
        } catch (e) {
          console.error(e);
          assert(false, "Failed to call dataCleanup(), exception " + e);
        }
      });

      it("dataCleanUp reset all properties", function () {
        try {
          widget.dataCleanup(tester.widgetProperties);
        } catch (e) {
          console.error(e);
          assert(false, "Failed to call dataCleanup(), exception " + e);
        }
      });
    });
  });
  describe("blockUI()", function () {
    it("should make the controls readonly/disabled (whatever that is applicable)", function () {
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function() {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
      }).then(function() {
        expect(element.querySelector(".u-start-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).contains("u-blocked");

      });
    });
  });

  describe("unblockUI()", function () {
    it("should remove readonly/disabled (whatever that is applicable) from the controls", function () {
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function() {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
        conn.unblockUI();
      }).then(function() {
        expect(element.querySelector(".u-start-section").firstChild.className).not.contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).not.contains("u-blocked");
      });
    });
  });
})();
