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
      expect(structure.attributeDefines).to.be.an("array");
      expect(structure.elementDefines).to.be.an("array");
      expect(structure.triggerDefines).to.be.an("array");
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
    const element = tester.processLayout();
    const widget = tester.onConnect();
    widget.mapTrigger("onchange");
    const event = new window.Event("onchange");
    element.dispatchEvent(event);
    assert(widget.elements.widget === element, "Widget is not connected!");
  });

  describe("Number field onchange event", function () {
    let numberElement, onChangeSpy;

    beforeEach(function () {
      tester.createWidget();
      numberElement = tester.element;

      // Create a spy for the onchange event.
      onChangeSpy = sinon.spy();

      // Add the onchange event listener to the number field element.
      numberElement.addEventListener("onchange", onChangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    // Test case for the on change event.
    it("should call the onchange event handler when the number field is changed", function () {
      // Simulate a onchange event.
      const event = new window.Event("onchange");
      numberElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      expect(onChangeSpy.calledOnce).to.be.true;
    });

  });

  // dataInit()
  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();

    let element;

    beforeEach(function () {
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
      assert.equal(tester.widget.subWidgets["changebutton"].delegatedProperties, "html:disabled", "Delegated property html:disabled is not present");
    });

  });

  describe("dataUpdate()", function () {
    let widget;

    before(function () {
      widget = tester.createWidget();
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
        let element = widget.elements.widget.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
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
        let element = widget.elements.widget.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          assert(element.hasAttribute("hidden"), "Failed to show the label text.");
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
          let element = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--AddHome[slot='end']");
          assert.equal(element.className, appliedButtonClass, `Widget element doesn't has class ${appliedButtonClass}.`);
          let labelText = widget.elements.widget.querySelector("span.u-text").innerText;
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
        let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, numberFieldLabel);  // Check for visibility.
        assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set label-position before", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position is not set to before.");
      });
    });

    it("check label position before styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
      assert.equal(displayPropertyValue, "inline-flex");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector(".label"), null);
      let alignPropertyValue = labelStyle.getPropertyValue("align-content");
      assert.equal(alignPropertyValue, "center", "Label position below is not center.");
    });

    it("set label-position below", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute("u-label-position");
        assert.equal(labelPosition, "below", "Label position below is not below.");
      });
    });

    it("check label position below styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector(".label"), null);
      let orderPropertyValue = labelStyle.getPropertyValue("order");
      assert.equal(orderPropertyValue, 2, "Label position below is not in order.");
    });

    it("reset label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute("u-label-position");
        assert.equal(labelPosition, "above");
        assert(widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(widget.elements.widget.querySelector("span.u-label-text").innerText, "", "Text is not empty.");
      });
    });

    it("check reset label position styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    // html:placeholder property.
    it("set html:placeholder property for number field", function () {
      let placeHolderText = "Input the Number";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:placeholder": placeHolderText
        });
      }).then(function () {
        let placeHolderTextDOM = widget.elements.widget.getAttribute("placeholder");
        assert.equal(placeHolderTextDOM, placeHolderText, `Failed to show placeholder text, ${placeHolderText}.`);
      });
    });

    // html:readonly property.
    it("set html:readonly property true for number field", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute(readOnly), "Failed to show the readonly attribute.");
      });
    });

    // html:readonly property false.
    it("set html:readonly property false for number field", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(readOnly), "Failed to hide the readonly attribute.");
      });
    });

    // html:disabled property.
    it("set html:disabled property true for number field", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute(disabled), "Failed to show the disabled attribute.");
      });
    });

    // html:disabled property false.
    it("set html:disabled property false for number field", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(disabled), "Failed to hide the disabled attribute.");
      });
    });

    // html:appearance outfill property.
    it("set html:appearance outline property true for number field", function () {
      let appearanceStyle = "filled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance outfill attribute.");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance outfill style ${appearanceStylePropertyText}.`);
      });
    });

    // html:appearance filled property.
    it("set html:appearance filled property true for number field", function () {
      let appearanceStyle = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance filled attribute.");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance filled style${appearanceStylePropertyText}.`);
      });
    });

    // html:hide-step true property.
    it("set html:hide-step property true for number field", function () {
      let hideStep = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute("hide-step"), "Failed to show the hide-step attribute.");
      });
    });

    // html:hide-step false property.
    it("set html:hide-step property false for number field", function () {
      let hideStep = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute("hide-step"), "Failed to hide the hide-step attribute.");
      });
    });

    // prefix-text property for number field.
    it("prefix-text for number field", function () {
      let prefixTextData = "PrefixMe";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        });
      }).then(function () {
        assert("start", widget.elements.widget.querySelector("span.u-prefix").getAttribute("slot"), "Slot is not at the start.");
        assert(widget.elements.widget.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to hide the slot attribute.");
        assert.equal(widget.elements.widget.querySelector("span.u-prefix").innerText, prefixTextData, "Prefix text does not match.");
      });
    });

    // suffix-text property for number field.
    it("suffix-text for number field", function () {
      let suffixTextData = "Suffix Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        assert(widget.elements.widget.querySelector("span.u-suffix").getAttribute("slot"), "end", "Slot is not at the end.");
        assert(widget.elements.widget.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute.");
        assert.equal(widget.elements.widget.querySelector("span.u-suffix").innerText, suffixTextData, "The suffix-text does not match.");
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
          assert(widget.elements.widget.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to show the slot attribute.");
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
          assert(widget.elements.widget.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute.");
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
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute("slot"), "start", "Failed to show the slot attribute and value does not match.");
        assert(widget.elements.widget.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value does not match.");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon class name does not match.");
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
        assert(widget.elements.widget.className, "outline u-number-field disabled", "Disabled class is not applied.");
        assert(widget.elements.widget.hasAttribute("disabled"), "Failed to show the disabled attribute.");
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth disabled", "Subwidget class name does not match.");
        assert(widget.elements.widget.childNodes[4].hasAttribute("disabled"), "Failed to show the disabled attribute.");
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
        assert(widget.elements.widget.className, "outline u-number-field", "Disabled class is applied.");
        assert(!widget.elements.widget.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert(!widget.elements.widget.childNodes[4].hasAttribute("disabled"), "Failed to hide the disabled attribute.");
      });
    });
  });

  describe("showError()", function () {
    let widget;
    let minlength = 2;
    let maxlength = 5;

    before(function () {
      widget = tester.createWidget();
      verifyWidgetClass(widgetClass);
    });

    it("setting min and max", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:min": minlength,
          "html:max": maxlength
        });
      }).then(function () {
        expect(widget.elements.widget.hasAttribute("max"), "Failed to show the max attribute.");
        expect(widget.elements.widget.hasAttribute("min"), "Failed to show the min attribute.");
        assert.equal(widget.elements.widget.getAttribute("min"), minlength, `Min is not same ${minlength}.`);
        assert.equal(widget.elements.widget.getAttribute("max"), maxlength, `Max is not same ${maxlength}.`);
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
        expect(widget.elements.widget).to.have.class("u-invalid");
        assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(widget.elements.widget.childNodes[2].className, appliedClassNames, "Widget element doesn't has correct class names.");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end does not match.");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title does not match.");
      });
    });
  });

  describe("hideError()", function () {
    let widget;

    before(function () {
      widget = tester.createWidget();
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
        expect(widget.elements.widget).to.not.have.class("u-invalid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(widget.elements.widget.childNodes[2].className, appliedClassNames, "Widget element doesn't has correct class names.");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("slot"),  "Slot attribute is not present.");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("title"), "Title attribute is not present.");
      });
    });

  });

})();
