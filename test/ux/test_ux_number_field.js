(function () {
  'use strict';

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

  describe("Uniface Mockup tests", function () {

    it("Get class " + widgetName, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor definition", function () {

    it('should have a static property structure of type Element', function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal('fluent-number-field');
      expect(structure.styleClass).to.equal('');
      expect(structure.elementQuerySelector).to.equal('');
      expect(structure.attributeDefines).to.be.an('array');
      expect(structure.elementDefines).to.be.an('array');
      expect(structure.triggerDefines).to.be.an('array');
    });

  });

  describe(widgetName + ".processLayout", function () {
    let element;

    it("processLayout", function () {
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
        expect(element).instanceOf(HTMLElement, "Function processLayout of " + widgetName + " does not return an HTMLElement.");
      });

      it("check tagName", function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });

      it("check id", function () {
        expect(element).to.have.id(widgetId);
      });

      it("check u-label-text", function () {
        assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element");
      });

      it("check u-prefix", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element");
      });

      it("check u-suffix", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element");
      });

      it("check u-error-icon", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element");
      });
    });

  });

  describe("Create widget", function () {

    before(function () {
      verifyWidgetClass(widgetClass);
      tester.construct();
    });

    it("constructor", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues['class:u-number-field'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    describe("onConnect", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      it("check element created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "widget is not connected");
      });
    });
  });

  describe("mapTrigger", function () {
    const element = tester.processLayout();
    const widget = tester.onConnect();
    widget.mapTrigger("onchange");
    const event = new window.Event('onchange');
    element.dispatchEvent(event);
    assert(widget.elements.widget === element, "widget is not connected");
  });

  describe('Number Field onchange event', function () {
    let numberElement, onChangeSpy;

    beforeEach(function () {
      tester.createWidget();
      numberElement = tester.element;

      // Create a spy for the onchange event
      onChangeSpy = sinon.spy();

      // Add the onchange event listener to the number field element
      numberElement.addEventListener('onchange', onChangeSpy);
    });

    // Clean up after each test
    afterEach(function () {
      // Restore the spy to its original state
      sinon.restore();
    });

    // Test case for the on change event
    it('should call the onchange event handler when the number field is changed', function () {
      // Simulate a onchange event
      const event = new window.Event('onchange');
      numberElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once
      expect(onChangeSpy.calledOnce).to.be.true;
    });

  });

  // Data Init
  describe("Data Init", function () {
    const classes = tester.getDefaultClasses();

    let element;

    beforeEach(function () {
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it("check class '" + defaultClass + "'", function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, "widget element has class " + defaultClass);
        } else {
          expect(element).not.to.have.class(defaultClass, "widget element has no class " + defaultClass);
        }
      });
    }

    it("check 'hidden' attributes", function () {
      assert(element.querySelector('span.u-label-text').hasAttribute('hidden'), "Label Text span element should be hidden by default");
      assert(element.querySelector('span.u-error-icon').hasAttribute('hidden'), "Icon span element should be hidden by default");
      assert(element.querySelector('span.u-prefix').hasAttribute('hidden'), "Prefix Icon span element should be hidden by default");
      assert(element.querySelector('span.u-suffix').hasAttribute('hidden'), "Suffix Icon span element should be hidden by default");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check prefix, suffix icon and text", function () {
      assert.equal(tester.defaultValues["prefix-icon"], '', "Default value of prefix icon should be ''");
      assert.equal(tester.defaultValues["suffix-icon"], '', "Default value of suffix icon should be ''");
      assert.equal(tester.defaultValues["prefix-text"], '', "Default value of prefix text should be ''");
      assert.equal(tester.defaultValues["suffix-text"], '', "Default value of suffix text should be ''");
      assert.equal(tester.defaultValues["label-position"], 'above', "Default value of label-position will be above");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, '', "Default value of attribute value should be ''");
    });

  });

  describe("dataUpdate", function () {
    let widget;

    before(function () {
      widget = tester.createWidget();
    });

    it("show apply button", function () {
      let showApplyButton = true;
      let defaultClass = "u-sw-changebutton";
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": showApplyButton
        });
      }).then(function () {
        let element = widget.elements.widget.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(element).to.have.class(defaultClass, "widget element has class " + defaultClass);
        } else {
          assert(element.hasAttribute("hidden"), "Failed to show the hidden attribute for button");
        }
      });
    });

    it("don't show apply button", function () {
      let showApplyButton = false;
      let defaultClass = "u-sw-changebutton";
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": showApplyButton
        });
      }).then(function () {
        let element = widget.elements.widget.querySelector("fluent-button.u-sw-changebutton");
        if (showApplyButton) {
          expect(element).to.have.class(defaultClass, "widget element has class " + defaultClass);
        } else {
          assert(element.hasAttribute("hidden"), "Failed to show the label text");
        }
      });
    });

    it("apply button icon name", function () {
      let showApplyButton = true;
      let appliedButtonClass = "u-icon ms-Icon ms-Icon--AddHome";
      let buttonIconName = "AddHome";
      let buttonText = "Click Me";
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
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
          assert.equal(element.className, appliedButtonClass, "widget element doesn't has class " + appliedButtonClass);
          let labelText = widget.elements.widget.querySelector("span.u-text").innerText;
          assert.equal(labelText, buttonText, "Button Text does not match");  // Check for visibility
        }
      });
    });

    it("show label", function () {
      let numberFieldLabel = 'Label';
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": numberFieldLabel
        });
      }).then(function () {
        let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, numberFieldLabel);  // Check for visibility
        assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text");
      });
    });

    it("Set label position before", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'before', "Label position before is not before");
      });
    });

    it("check label position before styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
      assert.equal(displayPropertyValue, "inline-flex");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let alignPropertyValue = labelStyle.getPropertyValue("align-content");
      assert.equal(alignPropertyValue, "center", "Label position below is not center");
    });

    it("Set label position below", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'below', "Label position below is not below");
      });
    });

    it("check label position below styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let orderPropertyValue = labelStyle.getPropertyValue("order");
      assert.equal(orderPropertyValue, 2, "Labelposition below is not in order");
    });

    it("reset label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'above');
        assert(widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text");
        assert.equal(widget.elements.widget.querySelector("span.u-label-text").innerText, "", "Text is not empty");
      });
    });

    it("check reset label position styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    // html:placeholder property
    it("Set html:placeholder property for numberField", function () {
      let placeHolderText = "Input the Number";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:placeholder": placeHolderText
        });
      }).then(function () {
        let placeHolderTextDOM = widget.elements.widget.getAttribute('placeholder');
        assert.equal(placeHolderTextDOM, placeHolderText, "Failed to show placeholder text" + placeHolderText);
      });
    });

    // html:readonly property
    it("Set html:readonly property true for numberField", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute(readOnly), "Failed to show the readonly attribute");
      });
    });

    // html:readonly property false
    it("Set html:readonly property false for numberField", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(readOnly), "Failed to hide the readonly attribute");
      });
    });

    // html:disabled property
    it("Set html:disabled property true for numberField", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute(disabled), "Failed to show the disabled attribute");
      });
    });

    // html:disabled property false
    it("Set html:disabled property false for numberField", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(disabled), "Failed to hide the disabled attribute");
      });
    });

    // html:appearance outfill property
    it("Set html:appearance outline property true for numberField", function () {
      let appearanceStyle = "filled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute('appearance'), "Failed to show the appearance outfill attribute");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute('appearance');
        assert.equal(appearanceStyle, appearanceStylePropertyText, "Failed to show appearance outfill style" + appearanceStylePropertyText);
      });
    });

    // html:appearance filled property
    it("Set html:appearance filled property true for numberField", function () {
      let appearanceStyle = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute('appearance'), "Failed to show the appearance filled attribute");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute('appearance');
        assert.equal(appearanceStyle, appearanceStylePropertyText, "Failed to show appearance filled style" + appearanceStylePropertyText);
      });
    });

    // html:hide-step true property
    it("Set html:hide-step property true for numberField", function () {
      let hideStep = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute('hide-step'), "Failed to show the hide-step attribute");
      });
    });

    // html:hide-step false property
    it("Set html:hide-step property false for numberField", function () {
      let hideStep = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hide-step": hideStep
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute('hide-step'), "Failed to hide the hide-step attribute");
      });
    });

    // prefix-text property for number Field
    it("Prefix Text for numberField", function () {
      let prefixTextData = "PrefixMe";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        });
      }).then(function () {
        assert('start', widget.elements.widget.querySelector("span.u-prefix").getAttribute("slot"), "Slot is not at the start");
        assert(widget.elements.widget.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to hide the slot attribute");
        assert.equal(widget.elements.widget.querySelector("span.u-prefix").innerText, prefixTextData, "Prefix Text does not match");
      });
    });

    // suffix-text property for number Field
    it("Suffix Text for numberField", function () {
      let suffixTextData = "Suffix Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        assert(widget.elements.widget.querySelector("span.u-suffix").getAttribute("slot"), 'end', "Slot is not at the end");
        assert(widget.elements.widget.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute");
        assert.equal(widget.elements.widget.querySelector("span.u-suffix").innerText, suffixTextData, "Suffix Text does not match");
      });
    });

    it("prefix-icon button icon", function () {
      let showApplyButton = true;
      let buttonIconName = "AddHome";
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": buttonIconName
        });
      }).then(function () {
        if (showApplyButton) {
          assert(widget.elements.widget.querySelector("span.u-prefix").hasAttribute("slot"), "Failed to show the slot attribute");
        }
      });
    });

    it("suffix-icon button icon", function () {
      let showApplyButton = true;
      let buttonIconName = "AddHome";
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": buttonIconName
        });
      }).then(function () {
        if (showApplyButton) {
          assert(widget.elements.widget.querySelector("span.u-suffix").hasAttribute("slot"), "Failed to show the slot attribute");
        }
      });
    });
  });

  describe("showError", function () {
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
        expect(widget.elements.widget.hasAttribute("max"), "Failed to show the max attribute");
        expect(widget.elements.widget.hasAttribute("min"), "Failed to show the min attribute");
        assert.equal(widget.elements.widget.getAttribute("min"), minlength, "Min is not same " + minlength);
        assert.equal(widget.elements.widget.getAttribute("max"), maxlength, "Max is not same " + maxlength);
      });
    });

    it("Set invalid value in number Field", function () {
      const appliedClassNames = "u-error-icon ms-Icon ms-Icon--AlertSolid";
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(widget.elements.widget).to.have.class("u-invalid");
        assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
        assert(widget.elements.widget.childNodes[2].className, appliedClassNames, "widget element doesn't has correct class names");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end does not match");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title doesnot match");
      });
    });
  });

  describe("hideError", function () {
    let widget;

    before(function () {
      widget = tester.createWidget();
      verifyWidgetClass(widgetClass);
    });

    it("Hide Error Set invalid value in number Field", function () {
      const appliedClassNames = "u-error-icon ms-Icon ms-Icon--AlertSolid";
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": "Field Value length mismatch."
        });
        widget.hideError("Field Value length mismatch.");
      }).then(function () {
        expect(widget.elements.widget).to.not.have.class("u-invalid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
        assert(widget.elements.widget.childNodes[2].className, appliedClassNames, "widget element doesn't has correct class names");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("slot"), "slot attribute is not present");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("title"), "title attribute is not present");
      });
    });

  });

})();
