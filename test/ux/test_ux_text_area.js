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

    it(`Get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });
  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-text-area");
      expect(structure.styleClass).to.equal("");
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
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
        expect(element).instanceOf(HTMLElement, `Function processLayout of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-text-area"];
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

      it("check u-error-icon", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element.");
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
        assert(widgetClass.defaultValues["class:u-text-area"], "Class is not defined!");
        assert(widgetClass.defaultValues["class:u-stretchable"], "class:u-stretchable should be registered as default value");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      it("check that the element is created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected.");
      });
    });

    it("should render without any console errors or warnings", function () {
      const errorSpy = sinon.spy(console, "error");
      const warnSpy = sinon.spy(console, "warn");
      try {
        tester.createWidget();
      } finally {
        const errorCount = errorSpy.callCount;
        const warnCount = warnSpy.callCount;
        errorSpy.restore();
        warnSpy.restore();
        assert.equal(errorCount, 0,
          `Expected no console errors during widget render, but got ${errorCount}.`);
        assert.equal(warnCount, 0,
          `Expected no console warnings during widget render, but got ${warnCount}.`);
      }
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

  describe("Text area onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: "${value}"`);
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
        tester.dataUpdate({
          "value" : ""
        });
      });

      tester.resetTriggerCalled(trigger);
    });

    // Test case for change event by user input.
    it("should call the onchange trigger handler when the text area is changed", function () {
      // Simulate a change event.
      const inputValue = "Hello,\nworld";
      tester.userInput(inputValue);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the widget value is the inputValue.
      expect(tester.widget.getValue()).to.equal(inputValue, "Widget value");
    });

    it("should not call the onchange trigger handler when the text area is disabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        // Verify the widget is in a state where user input cannot fire the trigger.
        assert(tester.element.disabled, "Element should be disabled, preventing user input.");
        expect(tester.calledOnce(trigger), "Onchange trigger should not fire when the widget is disabled.").to.be.false;
      });
    });

    it("should not call the onchange trigger handler when the text area is readonly", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        // Verify the widget is in a state where user input cannot fire the trigger.
        assert(tester.element.readOnly, "Element should be readonly, preventing user input.");
        expect(tester.calledOnce(trigger), "Onchange trigger should not fire when the widget is readonly.").to.be.false;
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

    it("check 'hidden' attributes", function () {
      assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label text span element should be hidden by default.");
      assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
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
    });

    it("show label", function () {
      let textAreaLabel = "Label";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": textAreaLabel
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, textAreaLabel); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should set the widget value and reflect it via getValue()", function () {
      const inputValue = "Hello World";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": inputValue
        });
      }).then(function () {
        assert.equal(tester.widget.getValue(), inputValue, "Widget getValue() should return the set value.");
      });
    });

    it("should clear the widget value when value is set to empty string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        assert.equal(tester.widget.getValue(), "", "Widget getValue() should return empty string after clearing.");
      });
    });

    it("should warn when an unsupported property is set", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "dummy-property": "some value"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'dummy-property' - Ignored")),
          "Console should warn about unsupported property 'dummy-property'.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should add a custom CSS class when class:name is set to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": true
        });
      }).then(function () {
        assert(element.classList.contains("class-test"), "Element should have custom class 'class-test' applied.");
      });
    });

    it("should remove a custom CSS class when class:name is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": true
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "class:class-test": false
          });
        });
      }).then(function () {
        assert(!element.classList.contains("class-test"), "Element should not have custom class 'class-test' after removal.");
      });
    });

    it("should wrap label text when textarea size in decreased and label position is above", function () {
      const labelText = "This is a very long label of widget and the question is, should it wrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function() {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "above"
        });

        // Shrink textarea to trigger resize logic.
        textAreaControl.style.width = "100px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });

    });

    it("should unwrap label text when textarea size in increased and label position is above", function () {
      const labelText = "This is a very long label of widget and the question is, should it unwrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function() {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "above"
        });

        // Expand textarea to trigger resize logic.
        textAreaControl.style.width = "500px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.equal(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });
    });

    it("should wrap label text when textarea is resized horizontally and label position is above", function () {
      const labelText = "This is a very long label of widget and the question is, should it wrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function() {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "above",
          "html:resize": "horizontal"
        });

        // Shrink textarea to trigger resize logic.
        textAreaControl.style.width = "50px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });
    });

    it("should wrap label text when textarea size is decreased and label position is below", function () {
      const labelText = "This is a very long label of widget and the question is, should it wrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "below"
        });

        // Shrink textarea to trigger resize logic.
        textAreaControl.style.width = "100px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });
    });

    it("should unwrap label text when textarea size in increased and label position is below", function () {
      const labelText = "This is a very long label of widget and the question is, should it unwrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function() {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "below"
        });

        // Expand textarea to trigger resize logic.
        textAreaControl.style.width = "500px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.equal(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });
    });

    it("should wrap label text when textarea is resized horizontally and label position is below", function () {
      const labelText = "This is a very long label of widget and the question is, should it wrap or not";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function() {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "below",
          "html:resize": "horizontal"
        });

        // Shrink textarea to trigger resize logic.
        textAreaControl.style.width = "50px";
      }, 1).then(function() {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const textAreaControlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, textAreaControlWidth, "Label should not exceed textarea width.");
        const textAreaElement = document.querySelector("fluent-text-area");
        const fluentTextAreaWidth = Math.round(textAreaElement.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, textAreaControlWidth, "Fluent text-area width should be equal to textarea control width.");
      });
    });

    it("should position the label before and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position before is not before.");
        // If u-label-position attribute is added element display is changed.
        let numberFieldStyle = window.getComputedStyle(element, null);
        let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
        assert.equal(displayPropertyValue, "inline-flex");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let alignPropertyValue = labelStyle.getPropertyValue("align-content");
        assert.equal(alignPropertyValue, "center", "Label position below is not center.");
      });
    });

    it("should position the label after and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label",
          "label-position": "after"
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "after", "Label position attribute should be 'after'.");
        // label-position after uses inline-flex layout.
        let elementStyle = window.getComputedStyle(element, null);
        let displayPropertyValue = elementStyle.getPropertyValue("display");
        assert.equal(displayPropertyValue, "inline-flex", "Element display should be 'inline-flex' when label-position is 'after'.");
        // Label should be visible.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be visible when label-position is 'after'.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "Label", "Label text should be 'Label'.");
      });
    });

    it("should show the label when label-text is set to the string 'null'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "null"
        });
      }).then(function () {
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be visible when label-text is the string 'null'.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "null", "Label text should be the string 'null'.");
      });
    });

    it("should hide the label when label-text is set to JS null", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": null
        });
      }).then(function () {
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be hidden when label-text is null.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "", "Label text should be empty when label-text is null.");
      });
    });

    it("should position the label below and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "below", "Label position below is not below.");
        // If u-label-position attribute is added element display is changed.
        let numberFieldStyle = window.getComputedStyle(element, null);
        let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
        assert.equal(flexPropertyValue, "column");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let orderPropertyValue = labelStyle.getPropertyValue("order");
        assert.equal(orderPropertyValue, 2, "Label position below is not in order.");
      });
    });

    it("reset label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "above");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "", "Text is not empty.");
      });
    });

    it("check reset label position styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(element, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    it("html resize property when set to none", function () {
      let resizeProp = "none";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "none"
        });
      }).then(function () {
        let resizePropText = element.getAttribute("resize");
        assert.equal(resizePropText, resizeProp); // Check for visibility.
      });
    });

    it("html resize property when set to both", function () {
      let resizeProp = "both";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": resizeProp
        });
      }).then(function () {
        let resizePropText = element.getAttribute("resize");
        assert.equal(resizePropText, resizeProp); // Check for visibility.
      });
    });

    it("html resize property when set to horizontal", function () {
      let resizeProp = "horizontal";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": resizeProp
        });
      }).then(function () {
        let resizePropText = element.getAttribute("resize");
        assert.equal(resizePropText, resizeProp); // Check for visibility.
      });
    });

    it("html resize property when set to vertical", function () {
      let resizeProp = "vertical";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": resizeProp
        });
      }).then(function () {
        let resizePropText = element.getAttribute("resize");
        assert.equal(resizePropText, resizeProp); // Check for visibility.
      });
    });

    it("should apply CSS resize style to inner textarea when html:resize is set to both", function () {
      // Verifies the resize attribute propagates into the actual computed CSS on the inner textarea.control.
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "both"
        });
      }).then(function () {
        const innerTextarea = element.shadowRoot.querySelector("textarea.control");
        const computedResize = window.getComputedStyle(innerTextarea).getPropertyValue("resize");
        assert.equal(computedResize, "both",
          "CSS resize on the inner textarea should be 'both' when html:resize is set to 'both'.");
      });
    });

    it("should apply CSS resize style to inner textarea when html:resize is set to horizontal", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "horizontal"
        });
      }).then(function () {
        const innerTextarea = element.shadowRoot.querySelector("textarea.control");
        const computedResize = window.getComputedStyle(innerTextarea).getPropertyValue("resize");
        assert.equal(computedResize, "horizontal",
          "CSS resize on the inner textarea should be 'horizontal' when html:resize is set to 'horizontal'.");
      });
    });

    it("should apply CSS resize style to inner textarea when html:resize is set to vertical", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "vertical"
        });
      }).then(function () {
        const innerTextarea = element.shadowRoot.querySelector("textarea.control");
        const computedResize = window.getComputedStyle(innerTextarea).getPropertyValue("resize");
        assert.equal(computedResize, "vertical",
          "CSS resize on the inner textarea should be 'vertical' when html:resize is set to 'vertical'.");
      });
    });

    it("should apply CSS resize none to inner textarea when html:resize is set to none", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "none"
        });
      }).then(function () {
        const innerTextarea = element.shadowRoot.querySelector("textarea.control");
        const computedResize = window.getComputedStyle(innerTextarea).getPropertyValue("resize");
        assert.equal(computedResize, "none",
          "CSS resize on the inner textarea should be 'none' when html:resize is set to 'none'.");
      });
    });

    it("should reflect a simulated horizontal drag as a changed rendered width", function () {
      // Verifies that setting a px width on the control (simulating a user drag) actually changes
      // the rendered size — confirming the manual resize mechanism works end-to-end.
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "both"
        });
        textAreaControl.style.width = "300px"; // Start from a known wide width.
      }, 1).then(function () {
        const widthBefore = textAreaControl.getBoundingClientRect().width;
        textAreaControl.style.width = "80px"; // Simulate drag to a narrow width.
        return asyncRun(function () {}, 1).then(function () {
          const widthAfter = textAreaControl.getBoundingClientRect().width;
          assert.isBelow(widthAfter, widthBefore,
            "Simulated horizontal drag should reduce the rendered width of the textarea control.");
          assert.equal(widthAfter, 80,
            "Rendered width should equal the manually set value of 80px.");
          // Restore so subsequent tests are not affected.
          textAreaControl.style.width = "100%";
        });
      });
    });

    it("should reflect a simulated vertical drag as a changed rendered height", function () {
      // Verifies that setting a px height on the control (simulating a user drag) actually changes
      // the rendered size — confirming vertical manual resize works end-to-end.
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "both"
        });
        textAreaControl.style.height = ""; // Start from default.
      }, 1).then(function () {
        const heightBefore = textAreaControl.getBoundingClientRect().height;
        textAreaControl.style.height = "200px"; // Simulate drag to a taller height.
        return asyncRun(function () {}, 1).then(function () {
          const heightAfter = textAreaControl.getBoundingClientRect().height;
          assert.isAbove(heightAfter, heightBefore,
            "Simulated vertical drag should increase the rendered height of the textarea control.");
          assert.equal(heightAfter, 200,
            "Rendered height should equal the manually set value of 200px.");
          // Restore so subsequent tests are not affected.
          textAreaControl.style.height = "";
        });
      });
    });

    it("html hidden property when set to true", function () {
      let hiddenProp = true;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hiddenProp
        });
      }).then(function () {
        let hiddenPropPresent = element.hasAttribute("hidden");
        assert.equal(hiddenPropPresent, hiddenProp); // Check for visibility
      });
    });

    it("html hidden property when set to false", function () {
      let hiddenProp = false;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hiddenProp
        });
      }).then(function () {
        let hiddenPropPresent = element.hasAttribute("hidden");
        assert.equal(hiddenPropPresent, hiddenProp); // Check for visibility.
      });
    });

    it("should set the title attribute when html:title is set", function () {
      const titleText = "This is the title text";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": titleText
        });
      }).then(function () {
        assert.equal(element.getAttribute("title"), titleText, `Title attribute should be '${titleText}'.`);
      });
    });

    it("should clear the title attribute when html:title is set to empty string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": ""
        });
      }).then(function () {
        assert.equal(element.getAttribute("title"), "", "Title attribute should be empty.");
      });
    });

    it("should set tabindex to a positive value when html:tabindex is positive", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:tabindex": 1
        });
      }).then(function () {
        assert.equal(element.getAttribute("tabindex"), "1", "Tabindex attribute should be '1'.");
      });
    });

    it("should set tabindex to a negative value when html:tabindex is negative", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:tabindex": -1
        });
      }).then(function () {
        assert.equal(element.getAttribute("tabindex"), "-1", "Tabindex attribute should be '-1'.");
      });
    });

    it("check default html cols value", function () {
      return asyncRun(function () {
      }).then(function () {
        let defaultColsProp = 20;
        let colsText = element.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, defaultColsProp); // Check for visibility.
        let rowsText = element.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, 0);
      });
    });

    it("html cols property negative integer", function () {
      let colsProp = -1;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:cols": colsProp
        });
      }).then(function () {
        let colsText = element.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, colsProp); // Check for visibility.
        let rowsText = element.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, 0);
      });
    });

    it("html cols property positive integer", function () {
      let colsProp = 25;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:cols": colsProp
        });
      }).then(function () {
        let colsText = element.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, colsProp); // Check for visibility.
        let rowsText = element.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, 0);
      });
    });

    it("should not change rendered width after manual resize when html:cols is updated", function () {
      // Simulates: user manually drags the textarea smaller, then html:cols is set via property update.
      // The user-dragged px width must win — cols must not override the rendered size.
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      const manualWidth = "120px";
      return asyncRun(function () {
        // Simulate a user drag by setting a px width on the control directly.
        textAreaControl.style.width = manualWidth;
      }, 1).then(function () {
        const widthBeforeCols = textAreaControl.getBoundingClientRect().width;
        return asyncRun(function () {
          tester.dataUpdate({
            "html:cols": 15
          });
        }, 1).then(function () {
          const widthAfterCols = textAreaControl.getBoundingClientRect().width;
          assert.equal(
            Math.round(widthAfterCols),
            Math.round(widthBeforeCols),
            "Setting html:cols after a manual resize must not change the rendered width of the textarea."
          );
        });
      });
    });

    it("should not change rendered height after manual resize when html:rows is updated", function () {
      // Simulates: user manually drags the textarea smaller, then html:rows is set via property update.
      // The user-dragged px height must win — rows must not override the rendered size.
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      const manualHeight = "80px";
      return asyncRun(function () {
        // Simulate a user drag by setting a px height on the control directly.
        textAreaControl.style.height = manualHeight;
      }, 1).then(function () {
        const heightBeforeRows = textAreaControl.getBoundingClientRect().height;
        return asyncRun(function () {
          tester.dataUpdate({
            "html:rows": 25
          });
        }, 1).then(function () {
          const heightAfterRows = textAreaControl.getBoundingClientRect().height;
          assert.equal(
            Math.round(heightAfterRows),
            Math.round(heightBeforeRows),
            "Setting html:rows after a manual resize must not change the rendered height of the textarea."
          );
          // Restore height so subsequent tests are not affected.
          textAreaControl.style.height = "";
        });
      });
    });

    it("should wrap label text according to the manually resized width, not the cols value", function () {
      // After a user drags the textarea to a narrow width, the label wrapping must follow
      // the actual rendered width — not the intrinsic width implied by html:cols.
      const labelText = "This is a very long label of widget and the question is, will it wrap or not?";
      const textAreaControl = element.shadowRoot.querySelector("textarea.control");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": labelText,
          "label-position": "above",
          "html:cols": 15
        });
        // Simulate narrow manual resize — narrower than cols=15 would naturally produce.
        textAreaControl.style.width = "80px";
      }, 1).then(function () {
        const label = element.querySelector("span.u-label-text");
        const labelWidth = Math.round(label.getBoundingClientRect().width);
        const controlWidth = Math.round(textAreaControl.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, controlWidth,
          "Label width must not exceed the manually resized control width, regardless of html:cols.");
        const fluentTextAreaWidth = Math.round(element.getBoundingClientRect().width);
        assert.equal(fluentTextAreaWidth, controlWidth,
          "fluent-text-area host width must equal the manually resized control width.");
      });
    });

    it("set html:placeholder property for textarea", function () {
      let placeHolderText = "Input the Number";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:placeholder": placeHolderText
        });
      }).then(function () {
        let placeHolderTextDOM = element.getAttribute("placeholder");
        assert.equal(placeHolderTextDOM, placeHolderText, `Failed to show placeholder text, ${placeHolderText}.`);
      });
    });

    it("set html:readonly property true for textarea", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        assert(element.hasAttribute(readOnly), "Failed to show the readonly attribute.");
      });
    });

    it("set html:readonly property false for textarea", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        assert(!element.hasAttribute(readOnly), "Failed to hide the readonly attribute.");
      });
    });

    it("set html:disabled property true for textarea", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(element.hasAttribute(disabled), "Failed to show the disabled attribute.");
      });
    });

    it("set html:disabled property false for textarea", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        assert(!element.hasAttribute(disabled), "Failed to hide the disabled attribute.");
      });
    });

    it("should apply both disabled and readonly when both are true, with disabled taking precedence", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true,
          "html:readonly": true
        });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Element should have the disabled attribute.");
        assert(element.hasAttribute("readOnly"), "Element should have the readonly attribute.");
      });
    });

    it("should reset html:disabled to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Element should be disabled before reset.");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:disabled": uniface.RESET
          });
        });
      }).then(function () {
        assert(!element.hasAttribute("disabled"), "Element should not be disabled after reset.");
      });
    });

    it("should reset html:readonly to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        assert(element.hasAttribute("readOnly"), "Element should be readonly before reset.");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:readonly": uniface.RESET
          });
        });
      }).then(function () {
        assert(!element.hasAttribute("readOnly"), "Element should not be readonly after reset.");
      });
    });

    it("should reset html:hidden to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": true
        });
      }).then(function () {
        assert(element.hasAttribute("hidden"), "Element should be hidden before reset.");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:hidden": uniface.RESET
          });
        });
      }).then(function () {
        assert(!element.hasAttribute("hidden"), "Element should not be hidden after reset.");
      });
    });

    it("set html:appearance outline property true for textarea", function () {
      let appearanceStyle = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(element.hasAttribute("appearance"), "Failed to show the appearance outline attribute.");
        let appearanceStylePropertyText = element.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance outline style, ${appearanceStylePropertyText}.`);
      });
    });

    it("set html:appearance filled property true for textarea", function () {
      let appearanceStyle = "filled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(element.hasAttribute("appearance"), "Failed to show the appearance filled attribute.");
        let appearanceStylePropertyText = element.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance filled style${appearanceStylePropertyText}.`);
      });
    });

    it("should warn and retain previous appearance when html:appearance is set to an invalid value", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "filled"
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "html:appearance": "invalid-value"
          });
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:appearance' invalid value (invalid-value) - Ignored.")),
          "Console should warn about invalid html:appearance value.").to.be.true;
        assert.equal(element.getAttribute("appearance"), "filled", "Appearance should retain previous value after invalid update.");
        warnSpy.restore();
      });
    });

    it("should warn when html:resize is set to an invalid value", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "diagonal"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:resize' invalid value (diagonal) - Ignored.")),
          "Console should warn about invalid html:resize value.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should warn when label-position is set to an invalid value", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label",
          "label-position": "top"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (top) - Ignored.")),
          "Console should warn about invalid label-position value.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should set spellcheck to true when html:spellcheck is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:spellcheck": true
        });
      }).then(function () {
        assert(element.hasAttribute("spellcheck"), "Spellcheck attribute should be present when html:spellcheck is true.");
      });
    });

    it("should set spellcheck to false when html:spellcheck is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:spellcheck": false
        });
      }).then(function () {
        assert(!element.hasAttribute("spellcheck"), "Spellcheck attribute should not be present when html:spellcheck is false.");
      });
    });

    it("set html:rows property positive integer", function () {
      let rowsProp = 25;
      let colsProp = 20;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:rows": rowsProp,
          "html:cols": colsProp
        });
      }).then(function () {
        let colsText = element.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, 20);// Check for visibility.
        let rowsText = element.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, rowsProp);
      });
    });

    it("set html:rows property negative integer", function () {
      let rowsProp = -1;
      let colsProp = 20;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:rows": rowsProp,
          "html:cols": colsProp
        });
      }).then(function () {
        let colsText = element.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, 20);// Check for visibility.
        let rowsText = element.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, rowsProp);
      });
    });

    it("set minlength and maxlength and check if the attributes have been applied properly", function () {
      const minlength = 2;
      const maxlength = 5;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(element.hasAttribute("maxlength"), "Failed to show the maxlength attribute.");
        expect(element.hasAttribute("minlength"), "Failed to show the minlength attribute.");
        assert.equal(element.getAttribute("minlength"), minlength, `Min is not same ${minlength}.`);
        assert.equal(element.getAttribute("maxlength"), maxlength, `Max is not same ${maxlength}.`);
      });
    });

    it("set minlength and maxlength and check if warning is shown when minlength is greater than maxlength", function () {
      const minlength = 15;
      const maxlength = 5;
      const warnSpy = sinon.spy(console, "warn");

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Invalid combination of 'html:minlength' (html:minlength) and 'html:maxlength' (html:maxlength) - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("set maxlength to an invalid value and check if warning is generated", function () {
      const maxlength = -1;
      const warnSpy = sinon.spy(console, "warn");

      return asyncRun(function () {
        tester.dataUpdate({
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:maxlength' is not a positive number - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("set minlength to an invalid value and check if warning is generated", function () {
      const minlength = -1;
      const warnSpy = sinon.spy(console, "warn");

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:minlength' is not a positive number - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("set minlength and maxlength and check if validation passes when the value is within the limits", function () {
      const minlength = 5;
      const maxlength = 15;
      const inputValue = "Hello World";
      const expectedValidationMessage = "";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set minlength and check if validation passes when the value has same number of characters as minlength", function () {
      const minlength = 5;
      const inputValue = "Hello";
      const expectedValidationMessage = "";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set maxlength and check if validation passes when the value has same number of characters as maxlength", function () {
      const maxlength = 5;
      const inputValue = "Hello";
      const expectedValidationMessage = "";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:maxlength": maxlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set minlength and check if proper validation message is generated when value has lesser number of characters than minlength", function () {
      const minlength = 5;
      const inputValue = "abcd";
      const expectedValidationMessage = "Please lengthen this text to 5 characters or more (you are currently using 4 characters).";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set minlength > 0 and check if validation message is generated when value is empty", function () {
      const minlength = 5;
      const inputValue = "";
      const expectedValidationMessage = "Please lengthen this text to 5 characters or more (you are currently using 0 characters).";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set maxlength and check if proper validation message is generated when value has more number of characters than maxlength", function () {
      const maxlength = 5;
      const inputValue = "abcdef";
      const expectedValidationMessage = "Please shorten this text to 5 characters or less (you are currently using 6 characters).";

      return asyncRun(function () {
        tester.dataUpdate({
          "html:maxlength": maxlength
        });
        tester.userInput(inputValue);
      }).then(function () {
        expect(tester.widget.getValue()).to.equal(inputValue);
        const validationMessage = tester.widget.validate();
        assert.equal(validationMessage, expectedValidationMessage);
      });
    });

    it("set minlength and maxlength when value is not empty and check if warning is generated", function () {
      const minlength = 5;
      const maxlength = 15;
      const inputValue = "Hello World";
      const warnSpy = sinon.spy(console, "warn");
      tester.userInput(inputValue);

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:minlength' or 'html:maxlength' cannot be set if control-value is not \"\" - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });
  });

  describe("html:resize auto behavior", function () {
    // These tests verify the CSS-driven auto resize behavior introduced by the stretch fix.
    // When resize="auto" the correct CSS resize direction is determined by the classes
    // present on the direct uf-layout parent (u-h-align-stretch / u-v-align-stretch).
    // Each test builds a minimal DOM tree, runs an assertion, then tears the tree down.

    let element;

    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
    });

    afterEach(function () {
      // Detach the widget (and any layout wrapper) after each test to avoid
      // polluting subsequent tests with stale DOM state.
      const wrapper = element.parentElement;
      if (wrapper && wrapper !== document.body) {
        wrapper.remove();
      } else {
        element.remove();
      }
    });

    // -------------------------------------------------------------------------
    // 1. The resize attribute is set on the DOM element (setAsAttribute: true)
    // -------------------------------------------------------------------------

    it("should set resize attribute to 'auto' on the element when html:resize is 'auto'", function () {
      // Verifies that AttributeChoice uses setAttribute() so [resize="auto"] CSS selectors work.
      document.body.appendChild(element);
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "auto"
        });
      }).then(function () {
        assert.equal(
          element.getAttribute("resize"), "auto",
          "The resize attribute must be present on the DOM element so CSS selectors can match it."
        );
      });
    });

    // -------------------------------------------------------------------------
    // 2. CSS auto → resize: both (no stretch parent)
    // -------------------------------------------------------------------------

    it("should apply CSS resize 'both' to inner textarea when resize='auto' and no stretch parent", function () {
      // Widget is a direct child of a plain div — no uf-layout stretch classes present.
      const wrapper = document.createElement("div");
      wrapper.appendChild(element);
      document.body.appendChild(wrapper);
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "auto"
        });
      }).then(function () {
        const innerTextarea = element.shadowRoot.querySelector("textarea.control");
        const computedResize = window.getComputedStyle(innerTextarea).getPropertyValue("resize");
        assert.equal(computedResize, "both",
          "When resize='auto' and no stretch parent, CSS should set resize: both.");
      });
    });

    // -------------------------------------------------------------------------
    // Note: Tests for resize='auto' CSS behavior that depend on uf-layout parent
    // classes (u-h-align-stretch, u-v-align-stretch) live in test_layout.js —
    // that file has the full uf-layout + fluent-text-area integration context.
    // -------------------------------------------------------------------------
  });

  describe("showError()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("set invalid value in text area", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(element).to.have.class("u-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert.equal(element.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end does not match.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title does not match.");
      });
    });
  });

  describe("hideError()", function () {
    let widget, element;
    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("hide error: set invalid value in text area", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": "Field Value length mismatch."
        });
        widget.hideError("Field Value length mismatch.");
      }).then(function () {
        expect(element).to.not.have.class("u-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(element.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("slot"), "Slot attribute is not present.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("title"), "Title attribute is not present.");
      });
    });
  });

  describe("blockUI()", function () {
    let element,widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    it("check if the 'u-blocked' class is applied and ensure the widget is readOnly when the blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
        expect(element.readOnly).equal(true);
      });
    });
  });

  describe("unblockUI()", function () {
    let element,widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    beforeEach(function () {
      widget.blockUI();
    });

    it("check if the 'u-blocked' class is removed and ensure the widget is not readonly when the unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
        expect(element.readOnly).equal(false);
      });
    });

    it("check if the readonly mode is retained when the unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
        widget.unblockUI();
      }).then(function () {
        expect(element.hasAttribute("readonly")).to.be.true;
      });
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

  describe("Widget reuse", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should reset all field properties and value to defaults when reused", function () {
      // Step 1: Apply a representative set of non-default properties.
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Some text",
          "html:title": "Tooltip text",
          "label-text": "This is a label",
          "html:disabled": true,
          "class:class-test": true
        });
      }).then(function () {
        // Step 2: Verify all properties are applied before reuse.
        assert.equal(tester.widget.getValue(), "Some text", "Value should be 'Some text' before reuse.");
        assert.equal(element.getAttribute("title"), "Tooltip text", "Title should be 'Tooltip text' before reuse.");
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be visible before reuse.");
        assert(element.hasAttribute("disabled"), "Element should be disabled before reuse.");
        assert(element.classList.contains("class-test"), "Element should have class 'class-test' before reuse.");
        // Step 3: Simulate Uniface widget reuse — clean up the current occurrence, then re-initialize with defaults.
        tester.dataCleanup();
        return asyncRun(function () {
          tester.dataInit();
        });
      }).then(function () {
        // Step 4: Verify all field properties are reset to defaults after reuse.
        assert.equal(tester.widget.getValue(), "", "Value should be reset to '' after reuse.");
        assert(!element.hasAttribute("disabled"), "Element should not be disabled after reuse.");
        assert(!element.hasAttribute("title"), "Title attribute should be removed after reuse.");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be hidden after reuse.");
        assert(!element.classList.contains("class-test"), "Custom class 'class-test' should be removed after reuse.");
      });
    });
  });

})();
