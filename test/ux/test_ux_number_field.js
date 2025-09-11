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
      expect(structure.tagName).to.equal("fluent-number-field");
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
        expect(element).instanceOf(HTMLElement, `Function processLayout of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-number-field","fluent-button"];
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

      it("check u-prefix", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element.");
      });

      it("check u-suffix", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element.");
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
        assert(widgetClass.defaultValues["class:u-number-field"], "Class is not defined!");
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

  describe("Number field onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: "${value}"`);
      }
    };
    const trigger = "onchange";
    const initialValue = 123;

    before(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });
    });

    beforeEach(async function () {
      await asyncRun(function () {
        tester.dataUpdate({
          "value" : initialValue
        });
      });

      tester.resetTriggerCalled(trigger);
    });

    // Test case for the on change event.
    it("should call the onchange trigger handler when the number field is changed", function () {
      // Simulate a change event by inputting a string.
      const inputValue = "1234";
      tester.userInput(inputValue);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the widget value is the inputValue.
      expect(tester.widget.getValue()).to.equal(inputValue, "Widget value");
    });

    it("Test spin-up button of the number field", async function () {
      expect(tester.widget.getValue()).to.equal("" + initialValue, "Widget value");

      // Simulate a change event by clicking the spin-up button.
      await tester.asyncUserClick(+1);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the widget value is the initialValue + 1.
      expect(tester.widget.getValue()).to.equal("" + (initialValue + 1), "Widget value");
    });

    it("Test spin-down button of the number field", async function () {
      expect(tester.widget.getValue()).to.equal("" + initialValue, "Widget value");

      // Simulate a change event by clicking the spin-up button.
      await tester.asyncUserClick(-1);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the widget value is the initialValue - 1.
      expect(tester.widget.getValue()).to.equal("" + (initialValue - 1), "Widget value");
    });

    it("test the number field widget in read-only mode to verify its value cannot be changed via the up arrow key", async function () {
      expect(tester.widget.getValue()).to.equal("" + initialValue, "Widget value.");
      // Apply readonly property to widget.
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(async function () {
        tester.widget.onchange = sinon.spy();
        // Simulate a arrow up key press event.
        const control = tester.element.shadowRoot.querySelector("#control.control");
        // Create a new KeyboardEvent for Arrow Up.
        const arrowUpEvent = new window.KeyboardEvent("keydown", {
          "key": "ArrowUp",
          "code": "ArrowUp",
          "keyCode": 38,      // Deprecated but still widely used.
          "which": 38,        // Also deprecated, for compatibility.
          "bubbles": true,    // So the event bubbles up through the DOM.
          "cancelable": true
        });
        control.focus();
        // Dispatch the event on the widget.
        control.dispatchEvent(arrowUpEvent);

        // Assert that the onchange trigger handler was not called.
        expect(tester.widget.onchange.called).to.be.false;
        // Expected the widget value is the initial value.
        expect(tester.widget.getValue()).to.equal("" + (initialValue), "Widget value.");
      });
    });

    it("test the number field widget in read-only mode to verify its value cannot be changed via the down arrow key", async function () {
      expect(tester.widget.getValue()).to.equal("" + initialValue, "Widget value.");
      // Apply readonly property to widget.
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(async function () {

        // Simulate a arrow down key press event.
        const control = tester.element.shadowRoot.querySelector("#control.control");
        // Create a new KeyboardEvent for Arrow Up.
        const arrowUpEvent = new window.KeyboardEvent("keydown", {
          "key": "ArrowDown",
          "code": "ArrowDown",
          "keyCode": 40,      // Deprecated but still widely used.
          "which": 40,        // Also deprecated, for compatibility.
          "bubbles": true,    // So the event bubbles up through the DOM.
          "cancelable": true
        });
        control.focus();
        // Dispatch the event on the widget.
        control.dispatchEvent(arrowUpEvent);

        // Assert that the onchange trigger handler was not called.
        expect(tester.widget.onchange.called).to.be.false;
        // Expected the widget value is the initial value.
        expect(tester.widget.getValue()).to.equal("" + (initialValue), "Widget value");
      });
    });

    it("test the number field widget in disabled mode to verify that it does not receive focus", async function () {
      expect(tester.widget.getValue()).to.equal("" + initialValue, "Widget value");
      // Apply disabled property to widget.
      return asyncRun(async function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        // Check for the active focus.
        const control = tester.element.shadowRoot.querySelector("#control.control");
        assert.notStrictEqual(document.activeElement, control, "Number field input should not have focus.");
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
      assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label Text span element should be hidden by default.");
      assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
      assert(element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix Icon span element should be hidden by default.");
      assert(element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix Icon span element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check prefix, suffix icon and text", function () {
      assert.equal(tester.defaultValues["prefix-icon"], "", "Default value of prefix icon should be ''.");
      assert.equal(tester.defaultValues["suffix-icon"], "", "Default value of suffix icon should be ''.");
      assert.equal(tester.defaultValues["prefix-text"], "", "Default value of prefix text should be ''.");
      assert.equal(tester.defaultValues["suffix-text"], "", "Default value of suffix text should be ''.");
      assert.equal(tester.defaultValues["label-position"], "above", "Default value of label-position will be above.");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "", "Default value of attribute value should be ''.");
    });

    it("check delegated property disabled", function () {
      assert.equal(tester.widget.subWidgetDefinitions["changebutton"].delegatedProperties, "html:disabled", "Delegated property html:disabled is not present");
    });

  });

  describe("dataUpdate()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("show apply button", function () {
      let showApplyButton = true;
      let defaultClass = "u-sw-changebutton";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": showApplyButton
        });
      }).then(function () {
        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(buttonElement).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          assert(element.hasAttribute("hidden"), "Failed to show the hidden attribute for button.");
        }
      });
    });

    it("don't show apply button", function () {
      let showApplyButton = false;
      let defaultClass = "u-sw-changebutton";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": showApplyButton
        });
      }).then(function () {
        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(buttonElement).to.have.class(defaultClass, `Widget buttonElement has class ${defaultClass}.`);
        } else {
          assert(buttonElement.hasAttribute("hidden"), "Failed to show the label text.");
        }
      });
    });

    it("apply button icon name", function () {
      let showApplyButton = true;
      let appliedButtonClass = "u-icon ms-Icon ms-Icon--AddHome";
      let buttonIconName = "AddHome";
      let buttonText = "Click Me";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "icon": buttonIconName,
          "changebutton": showApplyButton,
          "changebutton:value": buttonText,
          "changebutton:icon": buttonIconName
        });
      }).then(function () {
        if (showApplyButton) {
          let buttonElement = element.querySelector("span.u-icon.ms-Icon.ms-Icon--AddHome[slot='end']");
          assert.equal(buttonElement.className, appliedButtonClass, `Widget element doesn't has class ${appliedButtonClass}.`);
          let labelText = element.querySelector("span.u-text").innerText;
          assert.equal(labelText, buttonText, "Button text does not match."); // Check for visibility.
        }
      });
    });

    it("show label", function () {
      let numberFieldLabel = "Label";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": numberFieldLabel
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, numberFieldLabel);  // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should position the label before and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position is not set to before.");

        // If u-label-position attribute is added element display is changed.
        let numberFieldStyle = window.getComputedStyle(element, null);
        let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
        assert.equal(displayPropertyValue, "inline-flex");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let alignPropertyValue = labelStyle.getPropertyValue("align-content");
        assert.equal(alignPropertyValue, "center", "Label position below is not center.");
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

    it("set html:placeholder property for number field", function () {
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

    it("set html:readonly property true for number field", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        assert(element.hasAttribute(readOnly), "Failed to show the readonly attribute.");
      });
    });

    it("set html:readonly property false for number field", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        assert(!element.hasAttribute(readOnly), "Failed to hide the readonly attribute.");
      });
    });

    it("set html:disabled property true for number field", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(element.hasAttribute(disabled), "Failed to show the disabled attribute.");
      });
    });

    it("set html:disabled property false for number field", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        assert(!element.hasAttribute(disabled), "Failed to hide the disabled attribute.");
      });
    });

    it("set html:appearance filled property true for number field", function () {
      let appearanceStyle = "filled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(element.hasAttribute("appearance"), "Failed to show the appearance filled attribute.");
        let appearanceStylePropertyText = element.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance filled style ${appearanceStylePropertyText}.`);
      });
    });

    it("set html:appearance outline property true for number field", function () {
      let appearanceStyle = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(element.hasAttribute("appearance"), "Failed to show the appearance outline attribute.");
        let appearanceStylePropertyText = element.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance outline style${appearanceStylePropertyText}.`);
      });
    });

    it("set html:hide-step property true for number field", function () {
      let hideStep = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(element.hasAttribute("hide-step"), "Failed to show the hide-step attribute.");
      });
    });

    it("set html:hide-step property false for number field", function () {
      let hideStep = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(!element.hasAttribute("hide-step"), "Failed to hide the hide-step attribute.");
      });
    });

    it("prefix-text for number field", function () {
      let prefixTextData = "PrefixMe";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        });
      }).then(function () {
        assert("start", element.querySelector("span.u-prefix").getAttribute("slot"), "Slot is not at the start.");
        assert(element.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to hide the slot attribute.");
        assert.equal(element.querySelector("span.u-prefix").innerText, prefixTextData, "Prefix text does not match.");
      });
    });

    it("suffix-text for number field", function () {
      let suffixTextData = "Suffix Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        assert(element.querySelector("span.u-suffix").getAttribute("slot"), "end", "Slot is not at the end.");
        assert(element.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute.");
        assert.equal(element.querySelector("span.u-suffix").innerText, suffixTextData, "The suffix-text does not match.");
      });
    });

    it("prefix-icon button icon", function () {
      let showApplyButton = true;
      let buttonIconName = "AddHome";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": buttonIconName
        });
      }).then(function () {
        if (showApplyButton) {
          assert(element.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to show the slot attribute.");
        }
      });
    });

    it("suffix-icon button icon", function () {
      let showApplyButton = true;
      let buttonIconName = "AddHome";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": buttonIconName
        });
      }).then(function () {
        if (showApplyButton) {
          assert(element.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute.");
        }
      });
    });

    it("set button as subwidget in number field", function () {
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail",
          "changebutton:icon-position": "start",
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("slot"), "start", "Failed to show the slot attribute and value does not match.");
        assert(element.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon class name does not match.");
      });
    });

    it("set button as subwidget in number field with number field disabled as true", function () {
      let disabled = true;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        assert(element.className, "outline u-number-field disabled", "Disabled class is not applied.");
        assert(element.hasAttribute("disabled"), "Failed to show the disabled attribute.");
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth disabled", "Subwidget class name does not match.");
        assert(element.childNodes[4].hasAttribute("disabled"), "Failed to show the disabled attribute.");
      });
    });

    it("set button as subwidget in number field with number field disabled as false", function () {
      let disabled = false;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        assert(element.className, "outline u-number-field", "Disabled class is applied.");
        assert(!element.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert(!element.childNodes[4].hasAttribute("disabled"), "Failed to hide the disabled attribute.");
      });
    });
  });

  describe("showError()", function () {
    let element;
    let minlength = 2;
    let maxlength = 5;

    before(function () {
      tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("setting min and max", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:min": minlength,
          "html:max": maxlength
        });
      }).then(function () {
        expect(element.hasAttribute("max"), "Failed to show the max attribute.");
        expect(element.hasAttribute("min"), "Failed to show the min attribute.");
        assert.equal(element.getAttribute("min"), minlength, `Min is not same ${minlength}.`);
        assert.equal(element.getAttribute("max"), maxlength, `Max is not same ${maxlength}.`);
      });
    });

    it("set invalid value in number field", function () {
      const appliedClassNames = "u-error-icon ms-Icon ms-Icon--AlertSolid";
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(element).to.have.class("u-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(element.childNodes[2].className, appliedClassNames, "Widget element doesn't has correct class names.");
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

    it("hide error: set invalid value in number field", function () {
      const appliedClassNames = "u-error-icon ms-Icon ms-Icon--AlertSolid";
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": "Field Value length mismatch."
        });
        widget.hideError("Field Value length mismatch.");
      }).then(function () {
        expect(element).to.not.have.class("u-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(element.childNodes[2].className, appliedClassNames, "Widget element doesn't has correct class names.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("slot"),  "Slot attribute is not present.");
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
        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement).to.have.class("u-blocked");
        assert(buttonElement.hasAttribute("disabled"), "Failed to disable the subwidget attribute for button.");
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
        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement).not.to.have.class("u-blocked");
        expect(buttonElement.hasAttribute("disabled")).to.be.false;
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
        assert(false, `Failed to reset the properties, exception ${e}`);
      }
    });
  });

})();

