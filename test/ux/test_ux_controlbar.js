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
    "first:widget-class": "UX.Button"
  };

  const MOCK_CENTER_CONTROLS_ONLY_DEFINITION = {
    "subwidgets-center": "second",
    "second:widget-class": "UX.Select"
  };

  const MOCK_END_CONTROLS_ONLY_DEFINITION = {
    "subwidgets-end": "first",
    "first:widget-class": "UX.TextField"
  };


  const MOCK_CONTROLBAR_DEFAULT_PROPERTIES = {
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
    "goto:widget-class": "UX.NumberField",
    "size:widget-class": "UX.Select"
  };

  const MOCK_EMPTY_CENTER_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "",
    "subwidgets-end": "size",
    "info:widget-class": "UX.RadioGroup",
    "size:widget-class": "UX.Select"
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
    "info:widget-class": "UX.PlainText",
    "goto:widget-class": "UX.NumberField",
    "size:widget-class": "UX.Select",
    "first:widget-class": "UX.Button",
    "checkbox1:widget-class": "UX.Checkbox"
  };


  const MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-end": "size",
    "info:widget-class": "UX.PlainText",
    "size:widget-class": "UX.Select"
  };


  const MOCK_EMPTY_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "goto",
    "subwidgets-end": "",
    "info:widget-class": "UX.PlainText",
    "goto:widget-class": "UX.NumberField"
  };

  const MOCK_UNDEFINED_END_CONTROLS_DEFINITION = {
    "subwidgets-start": "info",
    "subwidgets-center": "goto",
    "info:widget-class": "UX.PlainText",
    "goto:widget-class": "UX.NumberField"
  };

  const MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION = {
    "info:widget-class": "UX.PlainText",
    "goto:widget-class": "UX.NumberField",
    "size:widget-class": "UX.Select"
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
      return asyncRun(function() {
        element = tester.processLayout(MOCK_EMPTY_DEFINITION);
      }).then(function() {
        expect(element).to.have.tagName(tester.uxTagName);
      });
    });

    it("processLayout with just start subwidgets", function () {
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

    it("processLayout with just center subwidgets", function () {
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

    it("processLayout with just end subwidgets", function () {
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

    describe("if subwidgets-start is undefined or empty", function () {
      it("should not contain start subwidgets if subwidgets-start is empty", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        return asyncRun(function() {
          element = tester.processLayout(MOCK_EMPTY_START_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
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
        });
      });
    });

    describe("if subwidgets-center is undefined or empty", function () {
      it("should not contain center subwidgets if subwidgets-center is empty", function () {
        verifyWidgetClass(widgetClass);
        return asyncRun(function() {
          element = tester.processLayout(MOCK_EMPTY_CENTER_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
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
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        });
      });
    });

    describe("if subwidgets-end is undefined or empty", function () {
      it("should not contain end subwidgets if subwidgets-end is empty", function () {
        return asyncRun(function() {
          verifyWidgetClass(widgetClass);
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_EMPTY_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function() {
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
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });
    });

    describe("when the definition.properties does not contain subwidgets id's defined", function () {
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

    describe("if subwidgets-start, subwidgets-center and subwidgets-end are defined", function () {
      let element;
      beforeEach(function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      });

      it("should contain start, center and end subwidgets", function () {
        verifyWidgetClass(widgetClass);
        expect(element.querySelector(".u-start-section").children.length).to.equal(2);
        expect(element.querySelector(".u-center-section").children.length).to.equal(1);
        expect(element.querySelector(".u-end-section").children.length).to.equal(2);
        expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
      });
    });

    describe("when the definition.properties does not contain subwidgets-start, subwidgets-center and subwidgets-end defined", function () {
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

    it("references to subwidget elements should be added", function () {
      let mockSubWidgetIds = new Set(["info", "goto", "size"]);
      tester.onConnect(element);

      mockSubWidgetIds.forEach((subWidgetId) => {
        expect(tester.widget.subWidgets[subWidgetId]).not.to.be.null;
      });
    });
  });

  describe("createWidget", function () {

    it("constructor", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(true,widgetClass.defaultValues['class:u-controlbar'], "Class is not defined");
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
  describe("dataUpdate()", function () {
    describe("when there is change in the controlbar properties", function () {
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

      it("if there is any change in subwidgets properties and html properties, should be reflected on the subwidgets", function () {
        // dataUpdate deletes theproperty of object hence creating deepcopy of object for checking
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
    });
  });
  describe("blockUI()", function () {
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

  describe("unblockUI()", function () {
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
  describe("dataCleanup()", function () {
    describe("reset all properties to default", function() {
      it("reset all property", function() {
        try {
          tester.dataUpdate(tester.getDefaultValues());
        } catch (e) {
          console.error(e);
          assert(false, "Failed to call dataCleanup(), exception " + e);
        }
      });
    });
  });
})();
