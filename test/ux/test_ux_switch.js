(function () {
  "use strict";

  const asyncRun = umockup.asyncRun;
  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;

  describe("Uniface mockup tests", function () {

    it(`Get class ${widgetName}`, function () {
      const widgetClass = tester.getWidgetClass();
      assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
    });
  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      const widgetClass = tester.getWidgetClass();
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-switch");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
    });

  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      element = tester.processLayout();
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {

      before(function () {
        element = tester.processLayout();
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-switch"];
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

      it("check u-label-text", function () {
        assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element.");
      });

      it("check u-checked-message", function () {
        assert(element.querySelector("span.u-checked-message"), "Widget misses or has incorrect u-checked-message element.");
      });

      it("check u-unchecked-message", function () {
        assert(element.querySelector("span.u-unchecked-message"), "Widget misses or has incorrect u-unchecked-message element.");
      });

      it("check u-error-icon-unchecked", function () {
        assert(element.querySelector("span.u-error-icon-unchecked"), "Widget misses or has incorrect u-error-icon-unchecked element.");
      });
      it("check u-error-icon-checked", function () {
        assert(element.querySelector("span.u-error-icon-checked"), "Widget misses or has incorrect u-error-icon-checked element.");
      });
    });

  });

  describe("Create widget", function () {

    before(function () {
      tester.construct();
    });

    it("constructor()", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        const widgetClass = tester.getWidgetClass();
        assert(widgetClass.defaultValues["class:u-switch"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    it("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").hasAttribute("part"), "Attribute is added to defined slot element.");
      assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").getAttribute("part") === "switch-toggle", "Attribute value is not switch-toggle.");
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "Widget is not connected.");
    });

  });

  describe("mapTrigger()", function () {
    const testData = {
      "onchange" : "change"
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

    let element;

    beforeEach(function () {
      tester.dataInit();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`check class '${defaultClass}'`, function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          expect(element).not.to.have.class(defaultClass, `Widget element has no class ${defaultClass}.`);
        }
      });
    }
  });

  describe("dataUpdate()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set value to 1 and make the switch toggle", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("true");
      });
    });

    it("set value to false and make the switch toggle in unchecked state", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": false
        });
      }).then(function () {
        expect(element).to.not.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("false");
      });
    });

    it("set label to switch", function () {
      let switchLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": switchLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, switchLabelText); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set checked message", function () {
      let switchCheckedText = "On";
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": switchCheckedText,
          "value": 1
        });
      }).then(function () {
        let checkedText = element.querySelector("span.u-checked-message").innerText;
        assert.equal(checkedText, switchCheckedText); // Check for visibility.
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message text.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
        expect(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide unchecked message.");
      });
    });

    it("set unchecked message", function () {
      let switchUnCheckedText = "Off";
      return asyncRun(function () {
        tester.dataUpdate({
          "unchecked-message": switchUnCheckedText,
          "value": 0
        });
      }).then(function () {
        let uncheckedText = element.querySelector("span.u-unchecked-message").innerText;
        assert.equal(uncheckedText, switchUnCheckedText); // Check for visibility.
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text.");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        expect(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message.");
      });
    });
  });

  describe("Switch onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: ${value}!`);
      }
    };
    const triggerSpy = sinon.spy(triggerMap, "onchange");

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });

      triggerSpy.resetHistory();
    });

    // Test case for the onchange trigger.
    it("should call the onchange trigger handler when the checkbox is clicked", function () {
      // Simulate a click event
      tester.userClick();

      // Assert that the click event handler was called once.
      expect(triggerSpy.calledOnce).to.be.true;
      // Expected the value is the 3rd item of valRepArray.
      expect(tester.widget.getValue()).to.equal(true, "Widget value");
    });

  });

  describe("Switch onchange event (old)", function () {
    let element, onchangeSpy;
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: ${value}!`);
      }
    };

    beforeEach(function () {
      tester.createWidget();
      element = tester.element;

      // Create a spy for the onchange event.
      onchangeSpy = sinon.spy(triggerMap, "onchange");

      // Add the onchange event listener to the switch element.
      element.addEventListener("onchange", onchangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      onchangeSpy.restore();
    });

    // Test case for the onchange event.
    it("should call the onchange event handler when the switch is toggled", function () {
      // Simulate a change event.
      const event = new window.Event("onchange");
      element.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      expect(onchangeSpy.calledOnce).to.be.true;
    });
  });

  describe("showError()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set invalid value when switch checked state is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message");
      });
    });
  });

  describe("hideError()", function () {
    let element;
    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set error to false with checked and unchecked messages", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "On",
          "unchecked-message": "Off",
          "value": 1
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        // If there are checked and unchecked messages to be shown, the slots should not be hidden once the error is removed.
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message slot");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message slot");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
      });
    });

    it("set error to false without checked and unchecked messages", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        // If there are no messages to show in the slot, they should still be kept hidden even after the error has been removed
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to keep the unchecked message slot hidden.");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        assert(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to keep the checked message slot hidden.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("");
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });

})();
