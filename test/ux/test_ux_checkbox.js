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
      expect(structure.tagName).to.equal("fluent-checkbox");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.hidden).to.equal(false);
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

      it("check import of web component", function () {
        const customElementNames = ["fluent-checkbox"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been imported!`);
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
        assert(widgetClass.defaultValues["class:u-checkbox"], "Class is not defined!");
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

    it("verify mapTrigger() and onchange event", function () {
      widget.mapTrigger("click");
      const event = new window.Event("click");
      element.dispatchEvent(event);
      assert(widget.elements.widget === element, "Widget is not connected.");
    });

  });

  describe("Checkbox onchange event", function () {
    let checkBoxElement, onchangeSpy;
    beforeEach(function () {

      tester.createWidget();
      checkBoxElement = tester.element;
      // Create a spy for the onchange event.
      onchangeSpy = sinon.spy();

      // Add the onchange event listener to the checkbox Element.
      checkBoxElement.addEventListener("onchange", onchangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    // Test case for the onchange event.
    it("should call the onchange event handler when the checkbox is clicked", function () {
      // Simulate an onchange event.
      const event = new window.Event("onchange");
      checkBoxElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      expect(onchangeSpy.calledOnce).to.be.true;
    });
  });


  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    beforeEach(function () {
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
      assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label text span element should be hidden by default.");
      assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check tri-state, tabindex, hidden , disabled, readonly, and title", function () {

      assert.equal(tester.defaultValues["html:tabindex"], 0, "Default value of html:tabindex should be 0.");
      assert.equal(tester.defaultValues["html:title"], undefined, "Default value of html:title should be undefined.");
      assert.equal(tester.defaultValues["html:disabled"], false, "Default value of disabled should be false.");
      assert.equal(tester.defaultValues["html:readonly"], false, "Default value of readonly should be false.");
      assert.equal(tester.defaultValues["html:hidden"], false, "Default value of hidden should be false.");
      assert.equal(tester.defaultValues["tri-state"], false, "Default value of label-position will be above.");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, null, "Default value of attribute value should be null.");
    });
  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set value to 1 and make the checkbox toggle", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("true");
      });
    });

    it("set value to false and make the switch checkbox in unchecked state", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": false
        });
      }).then(function () {
        expect(element).to.not.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("false");
      });
    });

    it("set value to '' and make the checkbox in indeterminate state", function () {
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

    it("set label to checkbox", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, checkBoxLabelText); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set checkbox html title", function () {
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

    it("set label to checkbox and set value to true", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1,
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, checkBoxLabelText); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set label to checkbox and set value to false", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 0,
          "label-text": checkBoxLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, checkBoxLabelText); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set label to checkbox and set value to true then change to indeterminate", function () {
      let checkBoxLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1,
          "label-text": checkBoxLabelText
        });

        tester.dataUpdate({
          "value": "",
          "label-text": "Changed Label Text"
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, "Changed Label Text"); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label-text.");
      });
    });
  });

  describe("showError()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set invalid value when checkbox checked state is false", function () {
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
  });

  describe("hideError()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set error to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": ""
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide hidden attribute.");
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