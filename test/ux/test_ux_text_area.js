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
})();
