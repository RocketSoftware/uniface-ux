(function () {
  "use strict";

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
    "subwidgets-start": "checkboxinfo",
    "subwidgets-center": "goto",
    "subwidgets-end": "sizefirst",
    "info_widget-class": "UX.PlainText",
    "goto_widget-class": "UX.NumberField",
    "size_widget-class": "UX.Select",
    "first_widget-class": "UX.Button",
    "checkbox_widget-class": "UX.Checkbox",
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

  const MOCK_HIDDEN_PROPERTY = {
    "html:hidden": "true"
  };

  const MOCK_DATA_FOR_OVERFLOW_COMMON = {
    "subwidgets-start": "selecttextfield",
    "subwidgets-center": "btncheckbox",
    "subwidgets-end": "numberfieldswitch",
    "select_widget-class": "UX.Select",
    "select:valrep": "1=a10=1025=2550=50100=100",
    "select:value": "1",
    "textfield_widget-class": "UX.TextField",
    "textfield:value": "text Value",
    "btn_widget-class": "UX.Button",
    "btn:value": "Button",
    "checkbox_widget-class": "UX.Checkbox",
    "checkbox:value": "true",
    "numberfield_widget-class": "UX.NumberField",
    "numberfield:value": "",
    "numberfield:changebutton": "true",
    "numberfield:changebutton:icon": "Home",
    "numberfield:changebutton:value": "Apply",
    "numberfield:html:placeholder": "Enter number to jump",
    "switch_widget-class": "UX.Switch",
    "switch:value": "true"
  };

  const MOCK_DATA_WITH_OVERFLOW_NONE = {
    "select_overflow-behavior": "none",
    "textfield_overflow-behavior": "none",
    "btn_overflow-behavior": "none",
    "checkbox_overflow-behavior": "none",
    "numberfield_overflow-behavior": "none",
    "switch_overflow-behavior": "none"
  };

  const MOCK_DATA_WITH_OVERFLOW_HIDE_AND_NONE = {
    "select_overflow-behavior": "hide",
    "textfield_overflow-behavior": "hide",
    "btn_overflow-behavior": "hide",
    "checkbox_overflow-behavior": "hide",
    "numberfield_overflow-behavior": "none",
    "switch_overflow-behavior": "none"
  };

  const MOCK_DATA_WITH_OVERFLOW_HIDE_AND_NO_PRIORITY = {
    "select_overflow-behavior": "hide",
    "textfield_overflow-behavior": "hide",
    "btn_overflow-behavior": "hide",
    "checkbox_overflow-behavior": "hide",
    "numberfield_overflow-behavior": "hide",
    "switch_overflow-behavior": "hide"
  };

  const MOCK_DATA_WITH_OVERFLOW_HIDE_AND_PRIORITY = {
    "select_overflow-behavior": "hide",
    "select_priority": 6,
    "textfield_overflow-behavior": "hide",
    "textfield_priority": 5,
    "btn_overflow-behavior": "hide",
    "btn_priority": 4,
    "checkbox_overflow-behavior": "hide",
    "checkbox_priority": 3,
    "numberfield_overflow-behavior": "hide",
    "numberfield_priority": 1,
    "switch_overflow-behavior": "hide",
    "switch_priority": 2
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
    "textfield_overflow-behavior": "hide",
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
    it(`get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });
  });

  describe("Uniface static structure constructor definition", function () {
    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("div");
      expect(structure.styleClass).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
    });
  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it(`${widgetName}.processLayout() with empty mock properties`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function () {
        element = tester.processLayout(MOCK_EMPTY_DEFINITION);
      }).then(function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });
    });

    it(`${widgetName}.processLayout() with just start subwidgets`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function () {
        element = tester.processLayout(MOCK_START_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function () {
        expect(element);
        expect(element.querySelector(".u-start-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    it(`${widgetName}.processLayout() with just center subwidgets`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function () {
        element = tester.processLayout(MOCK_CENTER_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function () {
        expect(element.querySelector(".u-center-section").children.length).not.to.equal(0);
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).to.equal(0);
      });
    });

    it(`${widgetName}.processLayout() with just end subwidgets`, function () {
      verifyWidgetClass(widgetClass);
      const tester = new umockup.WidgetTester();
      return asyncRun(function () {
        element = tester.processLayout(MOCK_END_CONTROLS_ONLY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function () {
        expect(element);
        expect(element.querySelector(".u-start-section").children.length).to.equal(0);
        expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        expect(element.querySelector(".u-end-section").children.length).not.to.equal(0);
      });
    });

    describe("If subwidgets-start is undefined or empty", function () {
      it("should not contain start subwidgets if subwidgets-start is empty and widget-class not defined for other subwidget section", function () {
        return asyncRun(function () {
          const tester = new umockup.WidgetTester();
          verifyWidgetClass(widgetClass);
          element = tester.processLayout(MOCK_EMPTY_START_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });

      it("should not contain start subwidgets if subwidgets-start is undefined", function () {
        verifyWidgetClass(widgetClass);
        const tester = new umockup.WidgetTester();
        return asyncRun(function () {
          element = tester.processLayout(MOCK_UNDEFINED_START_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
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
        return asyncRun(function () {
          element = tester.processLayout(MOCK_EMPTY_CENTER_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(1);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        });
      });

      it("should not contain center subwidgets if subwidgets-center is undefined", function () {
        verifyWidgetClass(widgetClass);
        return asyncRun(function () {
          element = tester.processLayout(MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(1);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
        });
      });
    });

    describe("If subwidgets-end is undefined or empty", function () {
      it("should not contain end subwidgets if subwidgets-end is empty", function () {
        return asyncRun(function () {
          verifyWidgetClass(widgetClass);
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_EMPTY_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });

      it("should not contain end subwidgets if subwidgets-end is undefined", function () {
        return asyncRun(function () {
          verifyWidgetClass(widgetClass);
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_UNDEFINED_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-center-section").children.length).to.equal(1);
          expect(element.querySelector(".u-start-section").children.length).to.equal(1);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });
    });

    describe("When the definition.properties does not contain subwidgets id's defined", function () {
      it("should not contain start, center and end subwidgets", function () {
        const tester = new umockup.WidgetTester();
        return asyncRun(function () {
          element = tester.processLayout(MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
          expect(element.querySelector(".u-start-section").children.length).to.equal(0);
          expect(element.querySelector(".u-center-section").children.length).to.equal(0);
          expect(element.querySelector(".u-end-section").children.length).to.equal(0);
        });
      });
    });

    describe("If subwidgets-start, subwidgets-center and subwidgets-end are defined", function () {
      it("should contain start, center and end subwidgets", function () {
        return asyncRun(function () {
          const tester = new umockup.WidgetTester();
          element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
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
        return asyncRun(function () {
          element = tester.processLayout(MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION);
          tester.onConnect();
          tester.dataInit();
        }).then(function () {
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
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
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
    });

  });

  describe(`${widgetName}.onConnect()`, function () {
    const tester = new umockup.WidgetTester();
    const element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
    const widget = tester.onConnect();
    tester.dataInit();

    it("check element created and connected", function () {
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "Widget is not connected!");
    });

    it("should add widgetElement (which is passed as parameter) to widget property of elements object", function () {
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
        assert(true, widgetClass.defaultValues["class:u-controlbar"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    it("should have default properties added", function () {
      assert.equal(widgetClass.defaultValues["class:u-controlbar"], true, "Default value of class:u-controlbar should be true.");
      assert.equal(widgetClass.defaultValues["html:hidden"], false, "Default value of hidden should be false.");
      assert.equal(widgetClass.defaultValues["orientation"], "horizontal", "Default value of orientation should be horizontal.");
      assert.equal(widgetClass.defaultValues["widget-resize"], false, "Default value of widget-resize should be false.");
      assert.equal(widgetClass.defaultValues["value"], "", "Default value should be ''.");
      assert.equal(widgetClass.defaultValues["error"], "false", "Default value of error should be false.");
      assert.equal(widgetClass.defaultValues["error-message"], "", "Default value of error-message should be ''.");
      assert.equal(widgetClass.defaultValues["html:disabled"], "false", "Default value of html:disabled should be false.");
      assert.equal(widgetClass.defaultValues["html:readonly"], "false", "Default value of html:readonly should be false.");
      assert.equal(widgetClass.defaultValues["html:minlength"], null, "Default value of html:minlength should be null.");
      assert.equal(widgetClass.defaultValues["html:maxlength"], null, "Default value of html:maxlength should be null.");
    });
  });

  describe(`${widgetName}.dataInit()`, function () {
    it("should put widget in defined initial state", function () {
      const tester = new umockup.WidgetTester();
      return asyncRun(function () {
        tester.processLayout(MOCK_EMPTY_DEFINITION);
        tester.onConnect();
        tester.dataInit();
      }).then(function () {
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
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_DATA);
        }).then(function () {
          expect(element.classList.contains("classC")).to.be.true;
          expect(element.getAttribute("u-orientation")).to.equal("vertical");
          expect(window.getComputedStyle(element)["flex-direction"]).to.equal("column");
          expect(element.getAttribute("role")).to.equal("toolbar");
          expect(!element.getAttribute("tabindex"));
        });
      });

      it("if there is change in any controlbar properties, should be reflected on the widgetElement", function () {
        const tester = new umockup.WidgetTester();
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_DATA);
        }).then(function () {
          expect(element.classList.contains("classC")).to.be.true;
          expect(element.getAttribute("u-orientation")).to.equal("vertical");
          expect(window.getComputedStyle(element)["flex-direction"]).to.equal("column");
          expect(element.getAttribute("role")).to.equal("toolbar");
          expect(!element.getAttribute("tabindex"));
        });
      });

      it("if disabled is set to true, it should be reflected on the subwidgets with disabled as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataUpdate({
            "html:disabled": "true"
          });
        }).then(function () {
          // Check if property delegation is working.
          expect(element.querySelector("fluent-number-field").hasAttribute("disabled")).to.be.true;
          expect(element.querySelector(".u-sw-changebutton.neutral").hasAttribute("disabled")).to.be.true;
          expect(element.querySelector("fluent-select").hasAttribute("disabled")).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").hasAttribute("disabled")).to.be.false;
          expect(element.querySelector("fluent-checkbox").hasAttribute("disabled")).to.be.false;
          expect(warnSpy.notCalled).to.be.true;
          warnSpy.restore(); // Restore the original console.warn.
        });
      });

      it("if readonly is set to true, it should be reflected on the subwidgets with readonly as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataUpdate({
            "html:readonly": "true"
          });
        }).then(function () {
          // Check if property delegation is working.
          expect(element.querySelector("fluent-number-field").hasAttribute("readonly")).to.be.true;
          expect(element.querySelector("fluent-select").hasAttribute("readonly")).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").hasAttribute("readonly")).to.be.false;
          expect(element.querySelector("fluent-checkbox").hasAttribute("readonly")).to.be.false;
          expect(warnSpy.notCalled).to.be.true;
          warnSpy.restore(); // Restore the original console.warn.
        });
      });

      it("if class is set to widget, it should be reflected on the subwidgets with same class as delegated property", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataUpdate({
            "class:classTest": "true"
          });
        }).then(function () {
          // Check if property delegation is working.
          expect(element.querySelector("fluent-number-field").classList.contains("classTest")).to.be.true;
          expect(element.querySelector("fluent-select").classList.contains("classTest")).to.be.false;
          expect(element.querySelector(".u-sw-first.u-controlbar-item.neutral").classList.contains("classTest")).to.be.false;
          expect(element.querySelector("fluent-checkbox").classList.contains("classTest")).to.be.false;
        });
      });

      it("if there is any change in subwidgets properties and html properties, should be reflected on the subwidgets", function () {
        // dataUpdate() deletes the property of object hence creating a deep copy of object for checking.
        let updatedData = Object.assign({}, MOCK_CONTROLBAR_CONTROLS_DATA);
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate(MOCK_CONTROLBAR_CONTROLS_DATA);
        }).then(function () {
          // Check if there is any change in properties of the subwidgets.
          expect(element.querySelector("fluent-select .u-label-text").textContent).to.equal(updatedData["size:label-text"]);
          expect(element.querySelector("fluent-number-field .u-label-text").hasAttribute("hidden")).to.be.true;
          expect(element.querySelector("fluent-checkbox .u-label-text").hasAttribute("hidden")).to.be.true;

          // Check if there is any change in html properties of the subwidgets.
          expect(element.querySelector("fluent-select").hasAttribute("disabled")).to.be.true;
          expect(String(element.querySelector("fluent-select").hasAttribute("disabled")).toLowerCase()).to.equal(updatedData["size:html:disabled"]);
          expect(String(element.querySelector("fluent-number-field").hasAttribute("hide-step")).toLowerCase()).to.equal(
            updatedData["goto:html:hide-step"]
          );
        });
      });

      it("if there is any change in subwidget's valrep properties, should be reflected on the subwidgets", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate({ "size:valrep": "1=a10=1025=2550=50100=100" });
        }).then(function () {
          let selectOptionArray = element.querySelectorAll("fluent-option");
          selectOptionArray.forEach(function (node, index) {
            expect(node.textContent).equal(valRepArray[index].representation);
          });
        });
      });

      it("if hidden property is set to be true, it should be reflected", function () {
        return asyncRun(function () {
          tester.dataUpdate(MOCK_HIDDEN_PROPERTY);
        }).then(function () {
          expect(element.hasAttribute("hidden")).to.equal(true);
          expect(window.getComputedStyle(element).display).equal("none");
        });
      });

      it("if invalid property name is passed, warning should be generated", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataUpdate({
            "html:hiden": "true"
          });
        }).then(function () {
          expect(warnSpy.calledWith(sinon.match("setProperties(data): Widget does not support property 'html:hiden' - Ignored."))).to.be.true;
          warnSpy.restore();
        });
      });

      it("set tabindex to some value, warning should get generated in the browser console and tabindex should be ignored", function () {
        element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          tester.onConnect(element);
          tester.dataInit();
          tester.dataUpdate({
            "tabindex": 100
          });
        }).then(function () {
          expect(!element.getAttribute("tabindex"));
          expect(warnSpy.calledWith(sinon.match("setProperties(data): Widget does not support property 'tabindex' - Ignored."))).to.be.true;
          warnSpy.restore();
        });
      });
    });
  });

  describe(`${widgetName}.blockUI()`, function () {
    it("should make the subwidgets readonly/disabled (wherever that is applicable)", function () {
      const tester = new umockup.WidgetTester();
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function () {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
      }).then(function () {
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
    it("should remove readonly/disabled (wherever that is applicable) from the subwidgets", function () {
      const tester = new umockup.WidgetTester();
      let element = tester.processLayout(MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      return asyncRun(function () {
        let conn = tester.onConnect(element);
        tester.dataInit();
        conn.blockUI();
        expect(element.querySelector(".u-start-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-center-section").firstChild.className).contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).contains("u-blocked");
        conn.unblockUI();
      }).then(function () {
        expect(element.querySelector(".u-start-section").firstChild.className).not.contains("u-blocked");
        expect(element.querySelector(".u-center-section").firstChild.className).not.contains("u-blocked");
        expect(element.querySelector(".u-end-section").firstChild.className).not.contains("u-blocked");
      });
    });
  });

  describe(`${widgetName} OverFlow tests`, function () {
    let element, tester, data, widget, node, warnSpy;

    before(function () {
      tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_OVERFLOW_COMMON);
      data = Object.assign({}, MOCK_DATA_FOR_OVERFLOW_COMMON);
      widget = tester.onConnect(element);
      tester.dataInit();
      tester.dataUpdate(data);
      node = document.querySelector("#widget-container");
    });

    it("resize the widget container and expect the widget-resize property to be true and for the widgets to not be removed", function () {
      return asyncRun(function () {
        node.style.width = "200px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector(".u-start-section").children.length).equal(2);
        expect(element.querySelector(".u-center-section").children.length).equal(2);
        expect(element.querySelector(".u-end-section").children.length).equal(2);
      });
    });

    it("when the overflow behavior is set to none for all subwidgets, the subwidgets should maintain their positions", function () {
      return asyncRun(function () {
        tester.dataUpdate(MOCK_DATA_WITH_OVERFLOW_NONE);
        node = document.querySelector("#widget-container");
        node.style.width = "100px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-switch.u-sw-switch").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-text-field.u-sw-textfield").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").classList.contains("u-overflown-item")).to.be.false;
      });
    });

    it("when the overflow behavior is set to hide for all sub-widgets, they should be hidden when no space is available", function () {
      return asyncRun(function () {
        data = Object.assign({}, MOCK_DATA_WITH_OVERFLOW_HIDE_AND_PRIORITY);
        tester.dataUpdate(data);
        node = document.querySelector("#widget-container");
        node.style.width = "100px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-switch.u-sw-switch").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-text-field.u-sw-textfield").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").classList.contains("u-overflown-item")).to.be.true;
      });
    });

    it("when the overflow behavior is set to hide for some widgets and none for others, sub-widgets with none overflow behavior should not get hidden", function () {
      return asyncRun(function () {
        warnSpy = sinon.spy(console, "warn");
        tester.dataUpdate(MOCK_DATA_WITH_OVERFLOW_HIDE_AND_NONE);
        node = document.querySelector("#widget-container");
        node.style.width = "100px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-button.u-sw-btn").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-switch.u-sw-switch").classList.contains("u-overflown-item")).to.be.false;
        expect(element.querySelector("fluent-text-field.u-sw-textfield").classList.contains("u-overflown-item")).to.be.true;
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").classList.contains("u-overflown-item")).to.be.true;
        expect(warnSpy.notCalled).to.be.true;
        warnSpy.restore(); // Restore the original console.warn.
      });
    });

    it("when the overflow behavior is set to 'move', a warning should be shown", function () {
      return asyncRun(function () {
        warnSpy = sinon.spy(console, "warn");
        tester.dataUpdate({
          "select_overflow-behavior": "move"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("setProperties: Property 'select_overflow-behavior' is given invalid value '(move)' - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("when the overflow behavior is set to 'menu', a warning should be shown", function () {
      return asyncRun(function () {
        warnSpy = sinon.spy(console, "warn");
        tester.dataUpdate({
          "select_overflow-behavior": "menu"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("setProperties: Property 'select_overflow-behavior' is given invalid value '(menu)' - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("when the overflow behavior is set to any invalid value, a warning should be shown", function () {
      return asyncRun(function () {
        warnSpy = sinon.spy(console, "warn");
        tester.dataUpdate({
          "select_overflow-behavior": "random"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("setProperties: Property 'select_overflow-behavior' is given invalid value '(random)' - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("when the priority is set to any invalid value, a warning should be shown", function () {
      return asyncRun(function () {
        warnSpy = sinon.spy(console, "warn");
        tester.dataUpdate({
          "select_priority": "random"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("setProperties: Property 'select_priority' is given invalid value '(random)' - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });
  });

  describe("OverFlow tests with priority not defined and overflow behavior as hide", function () {
    let element, tester, data, widget, node;

    // Using beforeEach instead of before to increase the time between execution of each it() block.
    // If the widget is resized rapidly again and again, the ResizeObserver will throw "ResizeObserver loop completed with undelivered notifications" exception and tests will fail.
    beforeEach(function () {
      tester = new umockup.WidgetTester();
      data = {
        ...MOCK_DATA_FOR_OVERFLOW_COMMON,
        ...MOCK_DATA_WITH_OVERFLOW_HIDE_AND_NO_PRIORITY
      };
      element = tester.processLayout(data);
      widget = tester.onConnect(element);
      tester.dataInit();
      tester.dataUpdate(data);
      node = document.querySelector("#widget-container");
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to  1000px", function () {
      return asyncRun(function () {
        node.style.width = "1000px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 930px", function () {
      return asyncRun(function () {
        node.style.width = "930px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 800px", function () {
      return asyncRun(function () {
        node.style.width = "800px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 560px", function () {
      return asyncRun(function () {
        node.style.width = "560px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 500px", function () {
      return asyncRun(function () {
        node.style.width = "500px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 400px", function () {
      return asyncRun(function () {
        node.style.width = "400px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 50px", function () {
      return asyncRun(function () {
        node.style.width = "50px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
      });
    });
  });

  describe("OverFlow tests with priority defined and overflow behavior as hide", function () {
    let element, tester, data, widget, node;

    // Using beforeEach instead of before to increase the time between execution of each it() block.
    // If the widget is resized rapidly again and again, the ResizeObserver will throw "ResizeObserver loop completed with undelivered notifications" exception and tests will fail.
    beforeEach(function () {
      tester = new umockup.WidgetTester();
      data = {
        ...MOCK_DATA_FOR_OVERFLOW_COMMON,
        ...MOCK_DATA_WITH_OVERFLOW_HIDE_AND_PRIORITY
      };
      element = tester.processLayout(data);
      widget = tester.onConnect(element);
      tester.dataInit();
      tester.dataUpdate(data);
      node = document.querySelector("#widget-container");
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to  1000px", function () {
      return asyncRun(function () {
        node.style.width = "1000px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 900px", function () {
      return asyncRun(function () {
        node.style.width = "900px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 600px", function () {
      return asyncRun(function () {
        node.style.width = "600px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 450px", function () {
      return asyncRun(function () {
        node.style.width = "450px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 400px", function () {
      return asyncRun(function () {
        node.style.width = "400px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).not.to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 350px", function () {
      return asyncRun(function () {
        node.style.width = "350px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).not.to.includes("u-overflown-item");
      });
    });

    it("should properly handle subwidget visibility and overflow behavior when widget resize property is set to 300px", function () {
      return asyncRun(function () {
        node.style.width = "300px";
      }, 1).then(function () {
        expect(widget.data["widget-resize"]).to.be.true;
        expect(element.querySelector("fluent-select.u-sw-select").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-text-field.u-sw-textfield").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-button.u-sw-btn").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-checkbox.u-sw-checkbox").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-switch.u-sw-switch").getAttribute("class")).to.includes("u-overflown-item");
        expect(element.querySelector("fluent-number-field.u-sw-numberfield").getAttribute("class")).to.includes("u-overflown-item");
      });
    });
  });

  describe("Check the scroll behavior of controlbar on overflow of subwidgets", function () {
    let element, node, data, isHorizontalScrollPresent, tester;

    before(function () {
      tester = new umockup.WidgetTester();
      element = tester.processLayout(MOCK_DATA_FOR_SCROLL);
      data = Object.assign({}, MOCK_DATA_FOR_SCROLL);
      tester.onConnect(element);
      tester.dataInit();
      tester.dataUpdate(data);
    });

    it("check if horizontal scrollbar appears when there is an overflow when all subwidgets have overflow behavior set as 'none'", function () {
      node = document.querySelector("#widget-container");
      node.style.width = "1500px";
      isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
      assert(isHorizontalScrollPresent === false, "Horizontal scrollbar is shown when there is no overflow.");
      node.style.width = "500px";
      isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
      assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");

      // Change the direction to 'rtl', scrollbar should still be present.
      const bodyElement = document.querySelector("body");
      bodyElement?.setAttribute("dir", "rtl");
      isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
      assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow in 'rtl' direction.");

      // Change the direction to 'ltr', scrollbar should still be present.
      bodyElement?.setAttribute("dir", "ltr");
      isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
      assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow in 'ltr' direction.");

      // Remove the attribute so that the test page goes back to normal.
      bodyElement?.removeAttribute("dir");
    });

    it("check scrollbar behavior when one subwidget has overflow behavior set as 'hide' and the rest have 'none' with orientation set as 'vertical' with enough space", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "textfield_overflow-behavior": "hide",
          "orientation": "vertical"
        });
      }).then(function () {
        node = document.querySelector("#widget-container");
        node.style.width = "500px";

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === false, "Horizontal scrollbar is shown when there is no overflow.");
      });
    });

    it("check scrollbar behavior when one subwidget has overflow behavior set as 'hide' and the rest have 'none' with orientation set as 'vertical' with not enough space", function () {
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
        node = document.querySelector("#widget-container");
        node.style.width = "200px";

        isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
        assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");
      });
    });

    describe("Check the dropdown menu behavior of select widget on scroll", function () {
      let selectElement;

      // Moving the scrolling related code to a separate block to add an additional delay.
      before(function () {
        node = document.querySelector("#widget-container");
        node.style.width = "500px";
        selectElement = element.querySelector(".u-select");
        // Expect the select drodpown to be closed by default.
        expect(selectElement.open).to.be.false;

        return asyncRun(function () {
          // Simulate a click event to open the dropdown.
          selectElement.click();
        }).then(function () {
          expect(selectElement.open).to.be.true;
          // Scroll to the opposite end to close the dropdown.
          element.scrollTo({
            "left": element.scrollWidth
          });
        });
      });


      it("check if opened select dropdown closes on scrolling", function () {
        return asyncRun(function () {
          const isHorizontalScrollPresent = element.scrollWidth > element.clientWidth;
          assert(isHorizontalScrollPresent === true, "Horizontal scrollbar is not shown when there is an overflow.");
        }).then(function () {
          // After the scrolling, expect the select dropdown to be closed.
          expect(selectElement.open).to.be.false;
        });
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
