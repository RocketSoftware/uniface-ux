(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  // Custom test variables.
  const valRepArray = [
    {
      "value": "1",
      "representation": "option one"
    },
    {
      "value": "2",
      "representation": "option two"
    },
    {
      "value": "3",
      "representation": "option three"
    }
  ];

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
      expect(structure.tagName).to.equal("fluent-radio-group");
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
        const customElementNames = ["fluent-radio-group","fluent-radio"];
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
        assert(element.querySelector("label.u-label-text"), "Widget misses or has incorrect u-label-text element.");
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
        assert(widgetClass.defaultValues["class:u-radio-group"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    it("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "Widget is not connected!");
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
    var element;

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
      assert(element.querySelector("label.u-label-text").hasAttribute("hidden"), "Label text element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "");
    });

    it("check for single unselected radio button placeholder", function () {
      expect(element.querySelector("fluent-radio").getAttribute("aria-checked")).equal("false");
    });

    it("check error message appears when valrep is not defined", function () {
      let errorIconTooltip = element.querySelector(".u-error-icon");
      expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
    });
  });

  describe("dataUpdate()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set html property hidden to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": true
        });
      }).then(function () {
        expect(element.getAttribute("hidden"));
        expect(window.getComputedStyle(element).display).equal("none");
      });
    });

    it("set Uniface label-text", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Test Label"
        });
      }).then(function () {
        expect(element.querySelector("label.u-label-text").innerText).equal("Test Label");
      });
    });

    it("set html property readonly to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        expect(element.getAttribute("readonly"));
        expect(element.getAttribute("aria-readonly")).equal("true");
      });
    });

    it("set html property disabled to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        expect(element.getAttribute("disabled"));
        expect(element.getAttribute("aria-disabled")).equal("true");
      });
    });

    it("set valrep property with default display value as rep", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(index.toString());
          expect(node.querySelector("span").innerText).equal(valRepArray[index].representation);
        });
      });
    });

    it("set valrep property with default display-format as value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "display-format": "val"
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(index.toString());
          expect(node.querySelector("span").innerText).equal(valRepArray[index].value);
        });
      });
    });

    it("set valrep property with default display value as valrep", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "display-format": "valrep"
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(index.toString());
          expect(node.querySelector("span.u-valrep-representation").innerText).equal(valRepArray[index].representation);
          expect(node.querySelector("span.u-valrep-value").innerText).equal(valRepArray[index].value);
        });
      });
    });

    it("set value to 2 and expect the radio button to be checked", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2"
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          if (valRepArray[index].value === "2") {
            expect(node.getAttribute("current-checked")).equal("true");
          } else {
            expect(node.getAttribute("current-checked")).equal("false");
          }
        });
      });
    });

    it("set value to empty string ('') and expect the radio button to be checked", function () {
      let valRepArrayWithEmptyOption = [{
        "value": "",
        "representation": "Empty Option"
      }, ...valRepArray];

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArrayWithEmptyOption,
          "value": ""
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          if (valRepArrayWithEmptyOption[index].value === "") {
            expect(node.getAttribute("current-checked")).equal("true");
          } else {
            expect(node.getAttribute("current-checked")).equal("false");
          }
        });
      });
    });

    it("set layout property to horizontal", function () {
      let valRepArrayLongText = [{
        "value": "0",
        "representation": "Option zero, test horizontal css specification changes when there is more than 25 characters."
      }, ...valRepArray];

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArrayLongText,
          "display-format": "rep",
          "layout": "horizontal"
        });
      }).then(function () {
        expect(element.getAttribute("orientation")).equal("horizontal");
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          let expectedText = valRepArrayLongText[index].representation;
          if (expectedText.length > 25) {
            expect(node.querySelector("fluent-tooltip"));
          } else {
            expect(node.querySelector("fluent-tooltip")).equal(null);
          }
        });
      });
    });

    it("change multiple properties", function () {
      let selectedValue = "2";

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": selectedValue,
          "html:disabled": true,
          "html:readonly": false,
          "class:ClassA": true,
          "label-text": "Test Label",
          "display-format": "val",
          "layout": "horizontal"
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          assert.equal(node.value, index);
          assert.equal(node.textContent, valRepArray[index].value);
          if (selectedValue === valRepArray[index].value) {
            expect(node.getAttribute("current-checked")).equal("true");
          }
        });

        expect(element.querySelector("label.u-label-text").innerText).equal("Test Label");
        expect(element.getAttribute("class")).to.includes("ClassA");
        expect(element.readOnly).equal(false);
        expect(element.getAttribute("aria-readonly")).equal("false");
        expect(element.disabled).equal(true);
        expect(element.getAttribute("aria-disabled")).equal("true");
        expect(element.getAttribute("orientation")).equal("horizontal");
      });
    });
  });

  describe("Ensure setting value to empty clears the selection if empty value is not one of the options", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set a valid initial value and ensure the corresponding element is checked", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2"
        });
      }).then(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          if (valRepArray[index].value === "2") {
            expect(node.getAttribute("current-checked")).equal("true");
          } else {
            expect(node.getAttribute("current-checked")).equal("false");
          }
        });
      });
    });

    it("set value to empty string ('') and ensure there is no checked element", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        expect(element.querySelector("fluent-radio[current-checked=true]")).equal(null);
      });
    });
  });

  describe("Invalid state, user interaction, and set to invalid state", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    beforeEach(async function() {
      await asyncRun(() => {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2"
        });
      });
    });

    it("set invalid initial value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "0"
        });
      }).then(function () {
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
      });
    });

    it("simulate user interaction and select first option", function () {
      return asyncRun(function () {
        const firstRadioOption = document.querySelector("fluent-radio");

        // Simulate click event on radio group widget.
        firstRadioOption.click();
      }).then(function () {
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal("");
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          if (valRepArray[index].value === "1") {
            expect(node.getAttribute("current-checked")).equal("true");
          } else {
            expect(node.getAttribute("current-checked")).equal("false");
          }
        });
      });
    });

    it("now again set the same invalid value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "0"
        });
      }).then(function () {
        const radioOption1 = document.querySelector("fluent-radio");
        // Assertions to check if the radio is in un checked state or not.
        expect(radioOption1.checked).to.be.false;
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
      });
    });
  });

  describe("Radio onchange event", function () {
    let radioElement, onchangeSpy;
    beforeEach(function () {
      tester.createWidget();
      radioElement = tester.element.querySelector("fluent-radio");

      // Create a spy for the onchange event.
      onchangeSpy = sinon.spy();

      // Add the onchange event listener to the radio element.
      radioElement.addEventListener("onchange", onchangeSpy);
      // Add the change event listener to the radio-group element.
      tester.element.addEventListener("change", onchangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    // Test case for the onchange event.
    it("should call the onchange event handler when a radio button is clicked", function () {
      // Simulate a change event.
      const event = new window.Event("onchange");
      radioElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      expect(onchangeSpy.calledOnce).to.be.true;
    });

    // Test case for not firing change event with initial value.
    it("should not invoke the onchange event handler when a radio button has initial value", function () {
      let initialValue = "2";

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": initialValue
        });
      }).then(function () {
        // Assert that the change event handler was called not twice.
        // The change event will be invoked once in onConnect(), but it should not propagate further hence we check calledTwice.
        expect(onchangeSpy.calledTwice).to.be.false;
      });
    });

    // Test case for not firing change event on display-format property changes with initial value.
    it("should not invoke the onchange event handler when display-format is changed with an initial value", function () {
      let initialValue = "2";

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": initialValue
        });
      }).then(function () {
        // Change the display-format property.
        tester.element.setAttribute("display-format", "valrep");
        // Assert that the change event handler was not called twice.
        // The change event will be invoked once in onConnect(), but it should not propagate further hence we check calledTwice.
        expect(onchangeSpy.calledTwice).to.be.false;
      });
    });

    // Test case for not firing change event on layout property changes with initial value.
    it("should not invoke the onchange event handler when layout is changed with an initial value", function () {
      let initialValue = "2";

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": initialValue
        });
      }).then(function () {
        // Change the layout property.
        tester.element.setAttribute("layout", "horizontal");
        // Assert that the change event handler was not called twice.
        // The change event will be invoked once in onConnect(), but it should not propagate further hence we check calledTwice.
        expect(onchangeSpy.calledTwice).to.be.false;
      });
    });

    // Test case for not firing change event on valrep property changes with initial value.
    it("should not invoke the onchange event handler when valrep is changed with an initial value", function () {
      let initialValue = "2";
      const valRepArray2 = [
        {
          "value": "1",
          "representation": "option one"
        },
        {
          "value": "2",
          "representation": "option two"
        },
        {
          "value": "3",
          "representation": "option three"
        },
        {
          "value": "4",
          "representation": "option four"
        }
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": initialValue
        });
      }).then(function () {
        // Update the valrep with new valRepArray2.
        tester.dataUpdate({
          "valrep": valRepArray2
        });
      }).then(function () {
        // Assert that the change event handler was not called thrice.
        // The change event will be invoked twice in onConnect(), but it should not propagate further hence we check calledTwice.
        expect(onchangeSpy.calledThrice).to.be.false;
      });
    });
  });

  describe("showError()", function () {
    let element;
    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("when invalid value is set, should show error and none of the options should be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "random",
          "display-format": "valrep"
        });
      }).then(function () {
        const selectedOption = element.querySelector("fluent-radio[current-checked=true]");
        expect(selectedOption).equal(null);
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        assert.equal(element.querySelector("span.u-error-icon").className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't have class 'u-error-icon ms-Icon ms-Icon--AlertSolid'.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("title"), "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
      });
    });
  });

  describe("hideError()", function () {
    let element;
    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("set error to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "format-error": false,
          "format-error-message": ""
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
      });
    });
  });

  describe("Test blockUI()", function () {
    let element;
    let widget;

    before(function () {
      tester.createWidget();
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
        expect(element.ariaReadOnly).equal("true");
      });
    });
  });

  describe("unblockUI()", function () {
    let element;
    let readonly = "readonly";
    let widget;
    beforeEach(function () {
      tester.createWidget();
      element = tester.element;
      widget = tester.createWidget();
    });

    it("check if the 'u-blocked' class is removed and ensure the widget is not readonly when the unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
        expect(element.readOnly).equal(false);
        expect(element.ariaReadOnly).equal("false");
      });
    });
    it("test unblockUI() when widget has been set in readonly and verify that this is not removed on calling unblockUI()", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
        widget.unblockUI();
      }).then(function () {
        expect(element.hasAttribute(readonly)).to.be.true;
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all property", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset all properties, exception ${e}.`);
      }
    });
  });

})();
