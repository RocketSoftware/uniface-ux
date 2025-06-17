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
      expect(structure.tagName).to.equal("fluent-select");
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
        element = tester.processLayout();
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-option", "fluent-select"];
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
        assert(widgetClass.defaultValues["class:u-select"], "Class is not defined!");
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
      assert.notEqual(element.querySelector("span.u-label-text").getAttribute("hidden"), null);
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "");
    });

    it("check error message appears when valrep is not defined", function () {
      let errorIconTooltip = element.querySelector(".u-error-icon");
      expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
    });

  });

  describe("dataUpdate()", function () {
    let element;
    let selectFieldLabel = "Label";

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("show label", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": selectFieldLabel
        });
      }).then(function () {
        let labelElement = element.querySelector("span.u-label-text");
        let labelText = labelElement.innerText;
        expect(selectFieldLabel).equal(labelText);
        assert(!labelElement.hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should position the label before and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before",
          "label-text": selectFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "before");
        // If u-label-position attribute is added element display is changed.
        let numberFieldStyle = window.getComputedStyle(element, null);
        let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
        assert.equal(displayPropertyValue, "inline-flex");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let alignPropertyValue = labelStyle.getPropertyValue("align-content");
        assert.equal(alignPropertyValue, "center");
      });
    });

    it("should position the label below and apply the correct styles", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below",
          "label-text": selectFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "below");
        // If u-label-position attribute is added element display is changed.
        let numberFieldStyle = window.getComputedStyle(element, null);
        let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
        assert.equal(flexPropertyValue, "column");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let orderPropertyValue = labelStyle.getPropertyValue("order");
        assert.equal(orderPropertyValue, 2);
      });
    });

    it("reset label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelElement = element.querySelector("span.u-label-text");
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "above");
        assert(labelElement.hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(labelElement.innerText, "");
        assert.equal(labelElement.getAttribute("slot"), "");
      });
    });

    it("check reset label position styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(element, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    it("set html property readonly to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        // ux-select is using disabled attribute instead.
        expect(element.getAttribute("disabled"));
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
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].representation);
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
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].value);
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
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          let formatValrepText = valRepArray[index].representation + valRepArray[index].value;
          expect(node.textContent).equal(formatValrepText);
        });
      });
    });

    it("ensure value is set using textContent", function () {
      const valRepArray1 = [
        ...valRepArray,
        {
          "value": "<script> alert('XSS attack') </script>",
          "representation": "<script> alert('XSS attack') </script>"
        }
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray1,
          "value": "<script> alert('XSS attack') </script>",
          "display-format": "valrep"
        });
      }).then(function () {
        let valStr = "<script> alert('XSS attack') </script>";
        let escapedHtmlValue = valStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        assert.equal(element.querySelector("fluent-option.selected .u-valrep-representation").innerHTML, valStr);
        expect(element.querySelector("fluent-option.selected .u-valrep-value").innerHTML).equal(escapedHtmlValue);
        expect(element.querySelector("fluent-option.selected .u-valrep-value").textContent).equal(valStr);
      });
    });

    it("set value to 2 and expect the second option to be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2",
          "display-format": "rep"
        });
      }).then(function () {
        const selectedValue = element.shadowRoot.querySelector("slot[name=selected-value]");
        expect(selectedValue.textContent).equal("option two");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "2").toString());
      });
    });

    it("set value to empty string ('') and expect the empty option to be selected", function () {
      const valRepArrayWithEmpty = [
        {
          "value": "",
          "representation": ""
        },
        ...valRepArray
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArrayWithEmpty,
          "value": "",
          "display-format": "rep"
        });
      }).then(function () {
        const selectedValue = element.shadowRoot.querySelector("slot[name=selected-value]");
        expect(selectedValue.textContent).equal("");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArrayWithEmpty.findIndex((item) => item.value === "").toString());
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
        const selectedValue = element.querySelector("fluent-option.selected");
        expect(selectedValue).equal(null);
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

  describe("Invalid state, user interaction and again set to invalid state", function () {
    let element;
    before(async function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");

      await asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "0"
        });
      });
    });

    it("set invalid initial value", function () {
      return asyncRun(function () {
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal(
          "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator."
        );
      });
    });

    it("simulate user interaction and select first option", function () {
      return asyncRun(async function () {
        // Simulate click event on select widget.
        await tester.asyncUserClick(1);
      }).then(async function () {
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal("");
        const selectedValue = element.shadowRoot.querySelector("slot[name=selected-value]");
        expect(selectedValue.textContent).equal("option one");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "1").toString());
      });
    });

    it("now again set the same invalid value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "0"
        });
      }).then(function () {
        const selectOption1 = document.querySelector("fluent-option");
        // Assertions to check if the select is in selected state or not.
        expect(selectOption1.selected).to.be.false;
        let errorIconTooltip = element.querySelector(".u-error-icon");
        expect(errorIconTooltip.getAttribute("title")).equal(
          "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator."
        );
      });
    });
  });

  describe("Set valrep, display-format to val and set a initial value, user interaction and check values in selected element", function () {
    let element;
    before(async function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");

      await asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "1",
          "display-format": "val"
        });
      });
    });

    it("set valrep and initial value to 1", function () {
      return asyncRun(function () {
        const selectedValue = element.querySelector("div[slot=selected-value]");
        expect(selectedValue.textContent).equal("1");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "1").toString());
      });
    });

    it("simulate user interaction and select second option", function () {
      return asyncRun(async function () {
        // Simulate user click on the first list item
        await tester.asyncUserClick(2);
      }).then(async function () {
        const selectedValue = element.querySelector("div[slot=selected-value]");
        expect(selectedValue.textContent).equal("2");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "2").toString());
      });
    });
  });

  describe("Set placeholder and change the value with user interaction", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    beforeEach(async function () {
      await asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "display-format": "val",
          "placeholder-text": "Select",
          "show-placeholder": true
        });
      });
    });

    it("set placeholder with no initial value and expect placeholder to be shown", function () {
      return asyncRun(function () {
        const selectedValue = element.querySelector("div[slot=selected-value]");
        expect(selectedValue.textContent).equal("Select");
      });
    });

    it("simulate user interaction and select third option, placeholder slot should be null", function () {
      return asyncRun(async function () {
        // Simulate click event on select widget.
        await tester.asyncUserClick(2);
      }).then(function () {
        const selectedValue = element.querySelector("div[slot=selected-value]");
        expect(selectedValue.textContent).equal("2");
        // Find index of expected value and compare against index of selected option.
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "2").toString());
        const placeholderSlot = selectedValue.querySelector(".u-placeholder");
        expect(placeholderSlot).equal(null);
      });
    });
  });

  describe("Select onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: "${value}".`);
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
        tester.dataUpdate({
          "valrep" : valRepArray,
          "value" : "1"
        });
      });

      tester.resetTriggerCalled(trigger);
    });

    // Test case for the onchange trigger.
    it("should call the onchange trigger handler when the checkbox is clicked", function () {
      // Simulate a click event
      tester.userClick(2);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the value is the 3rd item of valRepArray.
      expect(tester.widget.getValue()).to.equal("2", "Widget value");
    });

  });

  describe("blockUI()", function () {
    let element,widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    it("check if the 'u-readonly' and 'u-blocked' class is applied when the blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-readonly is not applied").to.have.class("u-readonly");
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
      });
    });
  });

  describe("unblockUI()", function () {
    let element,widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    beforeEach(function () {
      widget.blockUI();
    });

    it("check if the 'u-readonly' and 'u-blocked' class is removed when the unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-readonly is not applied").not.to.have.class("u-readonly");
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
      });
    });

    it("check if the readonly mode is retained when the unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-readonly is not applied").to.have.class("u-readonly");
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, `Failed to reset the properties, exception ${e}`);
      }
    });
  });

})();
