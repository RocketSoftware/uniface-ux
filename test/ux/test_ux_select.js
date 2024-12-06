(function () {
  'use strict';

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  // custom test variables
  const valRepArray = [
    {
      value: "1",
      representation: "option one"
    },
    {
      value: "2",
      representation: "option two"
    },
    {
      value: "3",
      representation: "option three"
    }
  ];


  /**
   * Function to determine whether the widget class has been loaded.
   */
  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined!
              Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
  }

  describe("Uniface Mockup tests", function () {

    it("get class " + widgetName, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor definition", function () {

    it('should have a static property structure of type Element', function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal('fluent-select');
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
        assert(widget, "widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues.classes['u-select'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("onConnect", function () {
      const element = tester.processLayout();
      const widget = tester.construct();
      widget.onConnect(element);
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "widget is not connected");
    });
  });

  describe("mapTrigger", function () {
    const widget = tester.onConnect();
    widget.mapTrigger("onchange");
  });

  describe("Data Init", function () {
    const defaultValues = tester.getDefaultValues();
    const classes = defaultValues.classes;
    let element;

    beforeEach(function () {
      tester.dataInit();
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
      assert.notEqual(element.querySelector('span.u-label-text').getAttribute('hidden'), null);
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "");
    });

    it("check error message appears when valrep is not defined", function () {
      let errorIconTooltip = element.querySelector('.u-error-icon');
      expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
    });

  });

  describe("dataUpdate", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("show label", function () {
      let selectFieldLabel = 'Label';
      return asyncRun(function() {
        tester.dataUpdate({
          uniface: {
            "label-text": selectFieldLabel
          }
        });
      }).then(function () {
        let labelElement = element.querySelector("span.u-label-text");
        let labelText = labelElement.innerText;
        expect(selectFieldLabel).equal(labelText);
        assert(!labelElement.hasAttribute("hidden"), "Failed to show the label text");
      });
    });

    it("Set label position before", function () {
      const widget = tester.construct();
      return asyncRun(function() {
        tester.dataUpdate({
          uniface: {
            "label-position": "before"
          }
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'before');
      });
    });

    it("check label position before styles", function () {
      // if u-label-position attribute is added element display is changed
      const widget = tester.construct();
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
      assert.equal(displayPropertyValue, "inline-flex");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let alignPropertyValue = labelStyle.getPropertyValue("align-content");
      assert.equal(alignPropertyValue, "center");
    });

    it("Set label position below", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          uniface: {
            "label-position": "below"
          }
        });
      }).then(function () {
        const widget = tester.construct();
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'below');
      });
    });

    it("check label position below styles", function () {
      // if u-label-position attribute is added element display is changed
      const widget = tester.construct();
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let orderPropertyValue = labelStyle.getPropertyValue("order");
      assert.equal(orderPropertyValue, 2);
    });

    it("reset label and its position", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          uniface: {
            "label-position": uniface.RESET,
            "label-text": uniface.RESET
          }
        });
      }).then(function () {
        const widget = tester.construct();
        let labelElement = widget.elements.widget.querySelector("span.u-label-text");
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'above');
        assert(labelElement.hasAttribute("hidden"), "Failed to hide the label text");
        assert.equal(labelElement.innerText, "");
        assert.equal(labelElement.getAttribute("slot"), "");
      });
    });

    it("check reset label position styles", function () {
      // if u-label-position attribute is added element display is changed
      const widget = tester.construct();
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    it("Set HTML property readonly to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          html: { readonly: true }
        });
      }).then(function () {
        // ux-select is using disabled attribute instead.
        expect(element.getAttribute("disabled"));
      });
    });

    it("Set HTML property disabled to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          html: { disabled: true }
        });
      }).then(function () {
        expect(element.getAttribute("disabled"));
        expect(element.getAttribute("aria-disabled")).equal("true");
      });
    });

    it("Set valrep property with default display value as rep", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          valrep: valRepArray
        });
      }).then(function () {
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].representation);
        });
      });
    });

    it("Set valrep property with default display-format as value", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          valrep: valRepArray,
          uniface: {
            "display-format": "val"
          }
        });
      }).then(function () {
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].value);
        });
      });
    });

    it("Set valrep property with default display value as valrep", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          valrep: valRepArray,
          uniface: {
            "display-format": "valrep"
          }
        });
      }).then(function () {
        let selectOptionArray = element.querySelectorAll("fluent-option");
        selectOptionArray.forEach(function (node, index) {
          let formatValrepText = valRepArray[index].representation + valRepArray[index].value;
          expect(node.textContent).equal(formatValrepText);
        });
      });
    });

    it("Ensure value is set using textContent", function () {
      const valRepArray1 = [
        ...valRepArray,
        {
          value: "<script> alert('XSS attack') </script>",
          representation: "<script> alert('XSS attack') </script>"
        }
      ];
      return asyncRun(function() {
        tester.dataUpdate({
          valrep: valRepArray1,
          value: "<script> alert('XSS attack') </script>",
          uniface: {
            "display-format": "valrep"
          }
        });
      }).then(function () {
        let valStr = "<script> alert('XSS attack') </script>";
        let escapedHtmlValue = valStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        assert.equal(element.querySelector('fluent-option.selected .u-valrep-representation').innerHTML, valStr);
        expect(element.querySelector('fluent-option.selected .u-valrep-value').innerHTML).equal(escapedHtmlValue);
        expect(element.querySelector('fluent-option.selected .u-valrep-value').textContent).equal(valStr);
      });
    });

    it("Set value to 2 and expect the second option to be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          valrep: valRepArray,
          value: "2",
          uniface: {
            "display-format": "rep"
          }
        });
      }).then(function () {
        const selectedValue = element.shadowRoot.querySelector("slot[name=selected-value]");
        expect(selectedValue.textContent).equal("option two");
        // find index of expected value and compare against index of selected option
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArray.findIndex((item) => item.value === "2").toString());
      });
    });

    it("Set value to empty string ('') and expect the empty option to be selected", function () {
      const valRepArrayWithEmpty = [
        {
          value: "",
          representation: ""
        },
        ...valRepArray
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          valrep: valRepArrayWithEmpty,
          value: "",
          uniface: {
            "display-format": "rep"
          }
        });
      }).then(function () {
        const selectedValue = element.shadowRoot.querySelector("slot[name=selected-value]");
        expect(selectedValue.textContent).equal("");
        // find index of expected value and compare against index of selected option
        const selectOption = element.querySelector("fluent-option.selected");
        expect(selectOption.value).equal(valRepArrayWithEmpty.findIndex((item) => item.value === "").toString());
      });
    });
  });

  describe("showError", function () {
    let selectElement;
    beforeEach(function () {
      selectElement = tester.element;
    });

    it("When invalid value is set, should show error and none of the options should be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          valrep: valRepArray,
          value: "random",
          "display-format": "valrep"
        });
      }).then(function () {
        const selectedValue = selectElement.querySelector("fluent-option.selected");
        expect(selectedValue).equal(null);
        expect(selectElement).to.have.class("u-format-invalid");
        assert(!selectElement.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon");
        assert.equal(selectElement.querySelector("span.u-error-icon").className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't have class 'u-error-icon ms-Icon ms-Icon--AlertSolid'");
        assert.equal(selectElement.querySelector("span.u-error-icon").getAttribute("title"), "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
      });
    });
  });

  describe("hideError", function () {
    let selectElement;
    beforeEach(function () {
      selectElement = tester.element;
    });

    it("Set error to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          uniface: {
            "format-error": false,
            "format-error-message": ""
          }
        });
      }).then(function () {
        expect(selectElement).to.not.have.class("u-format-invalid");
        assert(selectElement.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon");
        expect(selectElement.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(selectElement.querySelector("span.u-error-icon").getAttribute("title")).equal("");
      });
    });
  });

  describe('Select onchange event', function () {
    let selectElement, onchangeSpy;
    beforeEach(function () {
      tester.createWidget();
      selectElement = tester.element;

      // Create a spy for the onchange event
      onchangeSpy = sinon.spy();

      // Add the onchange event listener to the select element
      selectElement.addEventListener('onchange', onchangeSpy);
    });

    // Clean up after each test
    afterEach(function () {
      // Restore the spy to its original state
      sinon.restore();
    });

    // Test case for the onchange event
    it('should call the onchange event handler when a select option is clicked', function () {
      // Simulate a change event
      const event = new window.Event('onchange');
      selectElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once
      expect(onchangeSpy.calledOnce).to.be.true;
    });
  });

  describe("dataCleanup", function () {
    let widget;
    before(function () {
      widget = tester.createWidget();
    });

    it("reset all properties", function () {
      try {
        widget.dataCleanup(tester.widgetProperties);
      } catch (e) {
        console.error(e);
        assert(false, "Failed to call dataCleanup(), exception " + e);
      }
    });
  });

})();
