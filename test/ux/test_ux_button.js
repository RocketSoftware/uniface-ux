(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  /**
   * Function to determine whether the widget class has been loaded.
   */
  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined!
          Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
  }

  describe("Uniface mockup tests", function () {

    it(`get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-button");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
    });

  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      verifyWidgetClass(widgetClass);
      element = tester.processLayout();
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {

      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout();
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-button"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("check tagName", function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });

      it("check id", function () {
        expect(element).to.have.id(widgetId);
      });

      it("check u-text", function () {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element.");
      });

      it("check u-icon", function () {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element.");
      });

    });

  });

  describe("Create widget", function () {

    before(function () {
      verifyWidgetClass(widgetClass);
      tester.construct();
    });

    it("constructor()", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues["class:u-button"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();

      it("check that the element is created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });

  });

  describe("mapTrigger()", function () {
    const testData = {
      // triggerName : eventName
      "detail" : "click"
    };
    let widget;

    beforeEach(function () {
      widget = tester.onConnect();
    });

    Object.keys(testData).forEach((triggerName) => {
      it(`Test mapping of trigger '${triggerName}'`, function () {
        const triggerMapping = widget.mapTrigger(triggerName);
        assert(triggerMapping, `Trigger '${triggerName}' is not mapped!`);
        assert(triggerMapping.element === tester.element, `Trigger '${triggerName}' is not mapped to correct HTMLElement!`);
        assert(triggerMapping.event_name === testData[triggerName],
          `trigger '${triggerName}' should be mapped to event '${testData[triggerName]}', but got '${triggerMapping.event_name}'!`);
      });
    });
  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    var element;

    beforeEach(function () {
      tester.dataInit();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`check class ${defaultClass}`, function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          expect(element).not.to.have.class(defaultClass, `Widget element has no class ${defaultClass}.`);
        }
      });
    }

    it("check 'hidden' attributes", function () {
      assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span element should be hidden by default.");
      assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check 'icon' and 'icon-position'", function () {
      assert.equal(tester.defaultValues["icon"], "", "Default value of icon should be ''.");
      assert.equal(tester.defaultValues["icon-position"], "start", "Default value of icon-position will be start.");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "", "Default value of attribute value should be ''.");
    });

  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("update button text", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon element should be hidden.");
      });
    });

    it("update button text, icon and icon-position to default", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot")).equal(tester.defaultValues["icon-position"]);
      });
    });

    it("update icon-position to end", function () {
      let buttonText = "Button";
      let iconPosition = "end";
      return asyncRun(function () {
        tester.dataUpdate({
          "icon-position": iconPosition,
          "value": buttonText
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot")).equal(iconPosition);
      });
    });

    it("update icon only button", function () {
      let buttonText = "";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot")).equal("");
      });
    });

    it("update button text and icon will move to last selected slot", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot")).equal(tester.widget.data["icon-position"]);
      });
    });

    it("if icon-position is other than start and end then it should allot default slot to icon", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "icon-position": "stat"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText).equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot")).equal(tester.defaultValues["icon-position"]);
      });
    });

  });

  describe("Button click event", function () {
    let testTriggers;

    beforeEach(function () {
      testTriggers = {
        "detail" : sinon.spy()
      };
      tester.createWidget(testTriggers);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    // Test case for the click event.
    it("should call the detail trigger handler when the button is clicked", function () {
      // Simulate a click event
      const triggerName = "detail";
      tester.dispatchEventFor(triggerName);

      // Assert that the click event handler was called once.
      expect(testTriggers[triggerName].calledOnce).to.be.true;
    });

  });

  describe("showError()", function () {
    it("not required", function () { });
  });

  describe("hideError()", function () {
    it("not required", function () { });
  });

  describe("Test SlottedButtonText class", function () {
    verifyWidgetClass(widgetClass);
    let styleClass = "u-text";
    let elementQuerySelector = ".u-text";
    let instance;

    beforeEach(function () {
      instance = new widgetClass.SlottedButtonText(widgetClass, styleClass, elementQuerySelector);
    });

    it("should initialize with the correct properties", function () {
      expect(instance.widgetClass).to.equal(widgetClass);
    });

    it("should register default value", function () {
      expect(instance.widgetClass.defaultValues.value).equal("");
    });

    it("should generate and return layout correctly", function () {
      const layout = instance.getLayout();
      expect(layout).to.be.an.instanceof(HTMLElement);
      expect(layout.tagName.toLowerCase()).to.equal("span");
      expect(layout.classList.contains(styleClass)).to.be.true;
    });

    it("should refresh correctly and modify the element text and the icon if an icon is added to the button", function () {
      const widgetInstance = {
        ...widgetClass,
        "data": {
          "icon": "",
          "icon-position": "start",
          "value": ""
        },
        "elements": tester.construct().elements,
        "getTraceDescription": function () {
          return "description";
        }
      };

      instance.refresh(widgetInstance);
      const element = widgetInstance.elements.widget;
      expect(element.querySelector("span.u-text").hasAttribute("hidden")).to.be.true;
      expect(element.querySelector("span.u-text").innerText).equal("");
    });
  });

  describe("Test SlottedButtonIcon class", function () {
    verifyWidgetClass(widgetClass);
    let styleClass = "u-icon";
    let elementQuerySelector = ".u-icon";
    let instance;

    beforeEach(function () {
      instance = new widgetClass.SlottedButtonIcon(widgetClass, styleClass, elementQuerySelector);
    });

    it("should initialize with the correct properties", function () {
      expect(instance.widgetClass).to.equal(widgetClass);
    });

    it("should register default values for icon properties", function () {
      expect(instance.widgetClass.defaultValues.icon).equal("");
      expect(instance.widgetClass.defaultValues["icon-position"]).equal("start");
    });

    it("should generate and return layout correctly", function () {
      const layout = instance.getLayout();
      expect(layout).to.be.an.instanceof(HTMLElement);
      expect(layout.tagName.toLowerCase()).to.equal("span");
      expect(layout.classList.contains(styleClass)).to.be.true;
    });

    it("should refresh correctly and modify the element text and the icon if an icon is added to the button", function () {
      const widgetInstance = {
        ...widgetClass,
        "data": {
          "icon": "",
          "icon-position": "start",
          "value": ""
        },
        "elements": tester.construct().elements,
        "getTraceDescription": function () {
          return "description";
        }
      };

      instance.refresh(widgetInstance);
      const element = widgetInstance.elements.widget;
      expect(element.querySelector("span.u-icon").hasAttribute("hidden")).to.be.true;
      expect(element.querySelector("span.u-icon").getAttribute("slot")).equal("");
    });

    it("test add icon class functionality in slotted icon element", function () {
      const widgetInstance = {
        ...widgetClass,
        "data": {
          "icon": "Home",
          "value": ""
        },

        "elements": tester.construct().elements,
        "getTraceDescription": function () {
          return "description";
        }
      };

      instance.refresh(widgetInstance);
      const element = widgetInstance.elements.widget;
      const mockIconClasses = ["ms-Icon", "ms-Icon--Home"];
      expect(element.querySelector("span.u-icon").hasAttribute("hidden")).to.be.false;
      expect(element.querySelector("span.u-icon").getAttribute("slot")).equal("");
      expect([...element.querySelector("span.u-icon").classList].includes(...mockIconClasses)).to.equal(true);
    });

    it("test delete icon class functionality in slotted icon element", function () {
      const widgetInstance = {
        ...widgetClass,
        "data": {
          "icon": "",
          "value": ""
        },
        "elements": tester.construct().elements,
        "getTraceDescription": function () {
          return "description";
        }
      };

      instance.refresh(widgetInstance);
      const element = widgetInstance.elements.widget;
      expect(element.querySelector("span.u-icon").hasAttribute("hidden")).to.be.true;
      expect(element.querySelector("span.u-icon").getAttribute("slot")).equal("");
      expect(element.querySelector("span.u-icon").classList.contains("ms-Icon")).to.be.false;
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });

})();
