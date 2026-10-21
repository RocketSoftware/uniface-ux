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
    it(`should get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });
  });

  describe("Uniface static structure constructor() definition", function () {
    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-checkbox");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.hidden).to.equal(false);
      expect(structure.childWorkers).to.be.an("array");
    });
  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("should process the layout and return an element with the correct tag name", function () {
      verifyWidgetClass(widgetClass);
      element = tester.processLayout();
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {
      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout();
      });

      it("should return an instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("should register the web component", function () {
        const customElementNames = ["fluent-checkbox"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("should have the expected tag name", function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });

      it("should have the widget id", function () {
        expect(element).to.have.id(widgetId);
      });

      it("should have the u-label-text element", function () {
        assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element.");
      });

      it("should have the u-error-icon element", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element.");
      });
    });
  });

  describe("Create widget", function () {
    before(function () {
      verifyWidgetClass(widgetClass);
      tester.construct();
    });

    it("should construct the widget with its default class", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues["class:u-checkbox"], "Class is not defined!");
        expect(widgetClass.defaultValues["class:u-stretchable"], "Checkbox should not have class:u-stretchable as a default value").to.not.be.ok;
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      it("should create and connect the element", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });
  });

  describe("mapTrigger()", function () {
    const testData = {
      "onchange": "valuechange"
    };
    let widget;

    beforeEach(function () {
      widget = tester.onConnect();
    });

    Object.keys(testData).forEach((triggerName) => {
      it(`should map trigger '${triggerName}'`, function () {
        const triggerMapping = widget.mapTrigger(triggerName);
        assert(triggerMapping, `Trigger '${triggerName}' is not mapped!`);
        assert(triggerMapping.element === tester.element, `Trigger '${triggerName}' is not mapped to correct HTMLElement!`);
        assert(triggerMapping.event_name === testData[triggerName],
          `trigger '${triggerName}' should be mapped to event '${testData[triggerName]}', but got '${triggerMapping.event_name}'!`);
      });
    });
  });

  describe("Checkbox onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: ${value}!`);
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });

      tester.resetTriggerCalled(trigger);
    });

    // Test case for the onchange trigger.
    it("should call the onchange trigger handler when the checkbox is clicked", function () {
      // Simulate a click event
      tester.element.click();

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the value is true.
      expect(tester.widget.getValue()).to.equal(true, "Widget value");
    });

  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`should apply the default for class ${defaultClass}`, function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          expect(element).not.to.have.class(defaultClass, `Widget element has no class ${defaultClass}.`);
        }
      });
    }

    it("should hide the label text and error icon by default", function () {
      assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label text span element should be hidden by default.");
      assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("should have a widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("should have the default values for label-position, tri-state, tabindex, hidden, disabled, readonly and title", function () {
      assert.equal(tester.defaultValues["html:tabindex"], 0, "Default value of html:tabindex should be 0.");
      assert.equal(tester.defaultValues["html:title"], undefined, "Default value of html:title should be undefined.");
      assert.equal(tester.defaultValues["html:disabled"], false, "Default value of disabled should be false.");
      assert.equal(tester.defaultValues["html:readonly"], false, "Default value of readonly should be false.");
      assert.equal(tester.defaultValues["html:hidden"], false, "Default value of hidden should be false.");
      assert.equal(tester.defaultValues["tri-state"], false, "Default value of tri-state.");
      assert.equal(tester.defaultValues["label-text"], undefined, "Default value of label-text should be undefined.");
      assert.equal(tester.defaultValues["label-position"], "after", "Default value of label-position should be after.");
    });

    it("should have null as the default value", function () {
      assert.equal(tester.defaultValues.value, null, "Default value of the widget should be null.");
    });
  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should check the checkbox when value is set to 1", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("true");
      });
    });

    it("should uncheck the checkbox when value is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": false
        });
      }).then(function () {
        expect(element).to.not.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("false");
      });
    });

    it("should make the checkbox indeterminate when value is set to ''", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        expect(element).to.not.have.class("checked");
        expect(element).to.have.class("u-checkbox");
        expect(element).to.have.class("indeterminate");
        expect(element.getAttribute("current-checked")).equal("false");
      });
    });

    it("should show the label text", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        const labelElement = element.querySelector("span.u-label-text");
        let labelText = labelElement.innerText;
        assert.equal(labelText, checkBoxLabelText);
        assert(!labelElement.hasAttribute("hidden"), "Failed to show the label text.");

        // Checking the visual order of elements.
        const label = labelElement.getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".control").getBoundingClientRect();
        expect(label.right).to.be.greaterThan(control.right);

        // Checking the value of style property 'order' for label-text.
        const computedStyles = window.getComputedStyle(labelElement);
        expect(computedStyles.order).to.equal("2");
      });
    });

    it("should set the html title", function () {
      let checkBoxTitle = "On";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": checkBoxTitle,
          "value": 1
        });
      }).then(function () {
        assert(element.hasAttribute("title"), "Failed to show the title attribute.");
        expect(element.getAttribute("title")).equal(checkBoxTitle);
      });
    });

    it("should show the label text when value is true", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1,
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, checkBoxLabelText);
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should show the label text when value is false", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 0,
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, checkBoxLabelText);
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should update the label text when value changes from true to indeterminate", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1,
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "value": "",
            "label-text": "Changed Label Text"
          });
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, "Changed Label Text");
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label-text.");
      });
    });

    it("should position the label before and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "before"
        });
      }).then(function () {
        const controlElement = element.shadowRoot.querySelector(".control");
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position is not set to before.");

        // Checking the visual order of elements.
        const label = element.querySelector("span.u-label-text").getBoundingClientRect();
        const control = controlElement.getBoundingClientRect();
        expect(control.right).to.be.greaterThan(label.right);

        // Checking the value of style property 'order' for checkbox control.
        const computedStyles = window.getComputedStyle(controlElement);
        expect(computedStyles.order).to.equal("2");
      });
    });

    it("should reset the label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "after");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "", "Label text is not empty.");
      });
    });

    it("should show a console warning for invalid label-position above", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "above"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (above) - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("should show a console warning for invalid label-position below", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (below) - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("should go into error state when the value is invalid", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
        assert.equal(element.querySelector("span.u-error-icon").className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("title"), "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator."); // Check for visibility.
      });
    });

    it("should show the error icon on the correct side when label-position is 'before'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "before",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
        assert.equal(element.querySelector("span.u-error-icon").className, "u-error-icon ms-Icon ms-Icon--AlertSolid");

        // Checking the visual order of elements.
        const controlElement = element.shadowRoot.querySelector(".control");
        const label = element.querySelector(".u-label-text").getBoundingClientRect();
        const error = element.querySelector("span.u-error-icon").getBoundingClientRect();
        const control = controlElement.getBoundingClientRect();
        expect(control.right).to.be.greaterThan(label.right);
        expect(error.right).to.be.greaterThan(label.right);

        // Checking the value of style property 'order' for checkbox control.
        const computedStyles = window.getComputedStyle(controlElement);
        expect(computedStyles.order).to.equal("2");
      });
    });

    it("should show the error icon on the correct side when label-position is 'after'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
        assert.equal(element.querySelector("span.u-error-icon").className, "u-error-icon ms-Icon ms-Icon--AlertSolid");

        // Checking the visual order of elements.
        const labelElement = element.querySelector(".u-label-text");
        const errorElement = element.querySelector("span.u-error-icon");
        const label = labelElement.getBoundingClientRect();
        const error = errorElement.getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".control").getBoundingClientRect();
        expect(label.right).to.be.greaterThan(control.right);
        expect(label.right).to.be.greaterThan(error.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(labelElement);
        expect(computedStylesLabel.order).to.equal("2");
        // Checking the value of style property 'order' for erronIcon.
        const computedStylesError = window.getComputedStyle(labelElement);
        expect(computedStylesError.order).to.equal("2");
      });
    });

    it("should clear the error state when a valid value is set", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide hidden attribute.");
      });
    });
  });

  describe("blockUI()", function () {
    let element, widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    it("should apply the 'u-blocked' class and make the widget readonly when blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
        expect(element.readOnly).equal(true);
        expect(element.ariaReadOnly).equal("true");
      });
    });
  });

  describe("unblockUI()", function () {
    let element, widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    beforeEach(function () {
      widget.blockUI();
    });

    it("should remove the 'u-blocked' class and make the widget not readonly when unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
        expect(element.readOnly).equal(false);
        expect(element.ariaReadOnly).equal("false");
      });
    });

    it("should retain the readonly mode when unblockUI() is called", function () {
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

  describe("Checkbox state toggling by click", function () {
    let widget;

    beforeEach(function () {
      widget = tester.createWidget();
    });

    it("should toggle between checked and unchecked on click when tri-state is not set", function () {
      const expected = [true, false, true, false];
      for (const value of expected) {
        tester.element.click();
        expect(widget.getValue()).equal(value, "Widget value after click.");
      }
    });

    it("should toggle through the indeterminate state on click when tri-state is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "tri-state": true });
      }).then(function () {
        const expected = [true, false, "", true];
        for (const value of expected) {
          tester.element.click();
          expect(widget.getValue()).equal(value, "Widget value after click.");
        }
      });
    });

    it("should remove the error state when the widget is clicked", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "value": "A" });
      }).then(function () {
        expect(tester.element).to.have.class("u-format-invalid");
        tester.element.click();
        expect(tester.element).to.not.have.class("u-format-invalid");
        assert(tester.element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden.");
        expect(widget.getValue()).equal(true, "Widget value after click.");
      });
    });
  });

  describe("dataUpdate() with html and class properties", function () {
    let element;

    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("should apply the disabled state", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:disabled": true });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Widget should be in disabled state.");
        expect(element.ariaDisabled).equal("true");
      });
    });

    it("should remove the disabled state", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:disabled": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:disabled": false });
        });
      }).then(function () {
        assert(!element.hasAttribute("disabled"), "Widget should not be in disabled state.");
        expect(element.ariaDisabled).equal("false");
      });
    });

    it("should apply the readonly state", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:readonly": true });
      }).then(function () {
        assert(element.hasAttribute("readonly"), "Widget should be in readonly state.");
        expect(element.ariaReadOnly).equal("true");
      });
    });

    it("should remove the readonly state", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:readonly": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:readonly": false });
        });
      }).then(function () {
        assert(!element.hasAttribute("readonly"), "Widget should not be in readonly state.");
        expect(element.ariaReadOnly).equal("false");
      });
    });

    it("should remove the readonly state when html:readonly is reset", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:readonly": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:readonly": uniface.RESET });
        });
      }).then(function () {
        assert(!element.hasAttribute("readonly"), "Widget should not be in readonly state after reset.");
        expect(element.ariaReadOnly).equal("false");
      });
    });

    it("should apply the hidden attribute", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:hidden": true });
      }).then(function () {
        assert(element.hasAttribute("hidden"), "Widget should be hidden.");
      });
    });

    it("should remove the hidden attribute when html:hidden is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:hidden": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:hidden": false });
        });
      }).then(function () {
        assert(!element.hasAttribute("hidden"), "Widget should not be hidden.");
      });
    });

    it("should remove the hidden attribute when html:hidden is reset", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:hidden": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:hidden": uniface.RESET });
        });
      }).then(function () {
        assert(!element.hasAttribute("hidden"), "Widget should not be hidden after reset.");
      });
    });

    it("should apply a positive tabindex", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:tabindex": 1 });
      }).then(function () {
        expect(element.getAttribute("tabindex")).equal("1");
      });
    });

    it("should apply a negative tabindex", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:tabindex": -1 });
      }).then(function () {
        expect(element.getAttribute("tabindex")).equal("-1");
      });
    });

    it("should remove the title when html:title is set to an empty string", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:title": "Title" });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:title": "" });
        });
      }).then(function () {
        expect(element.getAttribute("title")).equal("", "Title should be empty.");
      });
    });

    it("should apply a css class", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "class:class-test": true });
      }).then(function () {
        expect(element).to.have.class("class-test");
      });
    });

    it("should remove a css class when its value is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "class:class-test": true });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "class:class-test": false });
        });
      }).then(function () {
        expect(element).to.not.have.class("class-test");
      });
    });

    it("should apply several css classes at once", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-one": true,
          "class:class-two": true,
          "class:class-three": true
        });
      }).then(function () {
        expect(element).to.have.class("class-one");
        expect(element).to.have.class("class-two");
        expect(element).to.have.class("class-three");
      });
    });

    it("should show a console warning for an unsupported property", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({ "dummy-property": "some value" });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'dummy-property' - Ignored"))).to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });
  });

  describe("dataUpdate() with value and label-text properties", function () {
    let element, widget;

    beforeEach(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    it("should check the checkbox when value is the string 'ON'", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "value": "ON" });
      }).then(function () {
        expect(element.getAttribute("current-checked")).equal("true");
        expect(widget.getValue()).equal(true, "Widget value.");
      });
    });

    it("should uncheck the checkbox when value is the string 'off'", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "value": "off" });
      }).then(function () {
        expect(element.getAttribute("current-checked")).equal("false");
        expect(widget.getValue()).equal(false, "Widget value.");
      });
    });

    it("should make the checkbox indeterminate and retain the label when value changes from 1 to null", function () {
      let labelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({ "value": 1,
                            "label-text": labelText });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "value": null });
        });
      }).then(function () {
        expect(element).to.have.class("indeterminate");
        expect(element.getAttribute("current-checked")).equal("false");
        expect(element.querySelector("span.u-label-text").innerText).equal(labelText);
      });
    });

    it("should go into error state when value is an invalid string", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "value": "not true" });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        expect(element.getAttribute("current-checked")).equal("false");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
      });
    });

    it("should hide the label when label-text is set to null", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "label-text": "Label" });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "label-text": null });
        });
      }).then(function () {
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        expect(element.querySelector("span.u-label-text").innerText, "Label text should be empty after clearing.").to.equal("");
      });
    });
  });

  describe("Checkbox onchange trigger when editing is not allowed", function () {
    const triggerMap = {
      "onchange": function () {
        tester.debugLog("Onchange trigger has been called.");
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });

      tester.resetTriggerCalled(trigger);
    });

    it("should not call the onchange trigger when the widget is disabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:disabled": true });
      }).then(function () {
        tester.element.click();
        expect(tester.countOfTriggerCalled(trigger)).to.equal(0, "Trigger should not be called when the widget is disabled.");
      });
    });

    it("should not call the onchange trigger when the widget is readonly", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:readonly": true });
      }).then(function () {
        tester.element.click();
        expect(tester.countOfTriggerCalled(trigger)).to.equal(0, "Trigger should not be called when the widget is readonly.");
      });
    });

    it("should not call the onchange trigger when the widget is blocked", function () {
      return asyncRun(function () {
        tester.widget.blockUI();
      }).then(function () {
        tester.element.click();
        expect(tester.countOfTriggerCalled(trigger)).to.equal(0, "Trigger should not be called when the widget is blocked.");
      });
    });
  });

  describe("Reset properties", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("should reset all properties and values to initial values if initial values exist", function () {
      const initialValues = {
        "value": true,
        "html:tabindex": 1,
        "html:title": "Title text",
        "html:hidden": true,
        "html:readonly": true,
        "label-text": "Initial label",
        "label-position": "before"
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": false,
                "html:tabindex": 0,
                "html:title": "Title",
                "html:hidden": false,
                "html:readonly": false,
                "label-text": "Changed label",
                "label-position": "after"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.getAttribute("current-checked"), "Checkbox should be unchecked.").to.equal("false");
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element.hasAttribute("hidden"), "Checkbox should not be hidden.").to.be.false;
            expect(element.hasAttribute("readonly"), "Checkbox should not be readonly.").to.be.false;
            expect(element.querySelector("span.u-label-text").innerText, "Label should be 'Changed label'.").to.equal("Changed label");
            expect(element.getAttribute("u-label-position"), "Label position should be 'after'.").to.equal("after");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to initial values.
            return asyncRun(function () {
              tester.resetWidget(Object.keys(initialValues));
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to initial values.
            expect(element.getAttribute("current-checked"), "Checkbox should be checked.").to.equal("true");
            expect(element.getAttribute("tabindex"), "Tabindex should be '1'.").to.equal("1");
            expect(element.getAttribute("title"), "Title should be 'Title text'.").to.equal("Title text");
            expect(element.hasAttribute("hidden"), "Checkbox should be hidden.").to.be.true;
            expect(element.hasAttribute("readonly"), "Checkbox should be readonly.").to.be.true;
            expect(element.querySelector("span.u-label-text").innerText, "Label should be 'Initial label'.").to.equal("Initial label");
            expect(element.getAttribute("u-label-position"), "Label position should be 'before'.").to.equal("before");
          })
      );
    });

    it("should reset all properties and values to default values if no initial values exist", function () {
      const initialValues = {};

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": true,
                "html:tabindex": 1,
                "html:title": "Title",
                "html:hidden": true,
                "html:readonly": true,
                "label-text": "Label",
                "label-position": "before"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.getAttribute("current-checked"), "Checkbox should be checked.").to.equal("true");
            expect(element.getAttribute("tabindex"), "Tabindex should be '1'.").to.equal("1");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element.hasAttribute("hidden"), "Checkbox should be hidden.").to.be.true;
            expect(element.hasAttribute("readonly"), "Checkbox should be readonly.").to.be.true;
            expect(element.querySelector("span.u-label-text").innerText, "Label should be 'Label'.").to.equal("Label");
            expect(element.getAttribute("u-label-position"), "Label position should be 'before'.").to.equal("before");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to default values.
            return asyncRun(function () {
              tester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to default values.
            expect(element, "Checkbox should be indeterminate.").to.have.class("indeterminate");
            expect(element.getAttribute("current-checked"), "Checkbox should not be checked.").to.equal("false");
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be null.").to.equal(null);
            expect(element.hasAttribute("hidden"), "Checkbox should not be hidden.").to.be.false;
            expect(element.hasAttribute("readonly"), "Checkbox should not be readonly.").to.be.false;
            expect(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be hidden.").to.be.true;
            expect(element.querySelector("span.u-label-text").innerText, "Label should be empty.").to.equal("");
            expect(element.getAttribute("u-label-position"), "Label position should be 'after'.").to.equal("after");
          })
      );
    });

    it("should reset specific properties and values to initial values that have initial values and leave others unchanged", function () {
      const initialValues = {
        "value": true,
        "label-position": "before"
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": false,
                "html:tabindex": 1,
                "html:title": "Title",
                "html:readonly": true,
                "label-text": "Label",
                "label-position": "after"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.getAttribute("current-checked"), "Checkbox should be unchecked.").to.equal("false");
            expect(element.getAttribute("tabindex"), "Tabindex should be '1'.").to.equal("1");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element.hasAttribute("readonly"), "Checkbox should be readonly.").to.be.true;
            expect(element.querySelector("span.u-label-text").innerText, "Label should be 'Label'.").to.equal("Label");
            expect(element.getAttribute("u-label-position"), "Label position should be 'after'.").to.equal("after");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset value and label-position properties to initial values.
            return asyncRun(function () {
              tester.resetWidget(["value", "label-position"]);
            });
          })
          .then(function () {
            // Step 5: Verify reset properties ('value', 'label-position') are restored to initial values; others remain unchanged.
            expect(element.getAttribute("current-checked"), "Checkbox should be checked after reset.").to.equal("true");
            expect(element.getAttribute("u-label-position"), "Label position should be reset to 'before'.").to.equal("before");
            expect(element.getAttribute("tabindex"), "Tabindex should remain '1' (not reset).").to.equal("1");
            expect(element.getAttribute("title"), "Title should remain 'Title' (not reset).").to.equal("Title");
            expect(element.hasAttribute("readonly"), "Checkbox should remain readonly (not reset).").to.be.true;
            expect(element.querySelector("span.u-label-text").innerText, "Label should remain 'Label' (not reset).").to.equal("Label");
          })
      );
    });
  });

  describe("Widget reuse", function () {
    let element;

    it("should reset all properties and values to defaults when reused", function () {
      tester.createWidget();
      element = tester.element;
      // Step 1: Apply a representative set of properties.
      return asyncRun(function () {
        tester.dataUpdate({
          "value": true,
          "label-text": "This is a label",
          "label-position": "before",
          "html:disabled": true,
          "class:class-test": true
        });
      }).then(function () {
        // Step 2: Verify all properties are applied before reuse.
        expect(element.getAttribute("current-checked"), "Checkbox should be checked before reuse.").to.equal("true");
        expect(element.querySelector("span.u-label-text").innerText, "Label should be 'This is a label' before reuse.").to.equal("This is a label");
        expect(element.getAttribute("u-label-position"), "Label position should be 'before' before reuse.").to.equal("before");
        expect(element.hasAttribute("disabled"), "Checkbox should be disabled before reuse.").to.be.true;
        expect(element.classList.contains("class-test"), "Checkbox should have 'class-test' class before reuse.").to.be.true;
        // Step 3: Simulate Uniface widget reuse — clean up the current occurrence, then re-initialize with defaults.
        tester.dataCleanup();
        return asyncRun(function () {
          tester.dataInit();
        });
      }).then(function () {
        // Step 4: Verify all properties and value are reset to defaults after reuse.
        expect(element, "Checkbox should be indeterminate after reuse.").to.have.class("indeterminate");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label should be hidden after reuse.");
        expect(element.querySelector("span.u-label-text").innerText, "Label should be empty after reuse.").to.equal("");
        expect(element.getAttribute("u-label-position"), "Label position should be 'after' after reuse.").to.equal("after");
        expect(element.hasAttribute("disabled"), "Checkbox should not be disabled after reuse.").to.be.false;
        expect(element.classList.contains("class-test"), "Checkbox should not have 'class-test' class after reuse.").to.be.false;
      });
    });
  });

  describe("Reset all properties", function () {
    it("should reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset the properties, exception ${e}`);
      }
    });
  });
})();