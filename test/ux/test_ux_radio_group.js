(function () {
  'use strict';

  /**
     * Default timeout for waiting for DOM rendering (in milliseconds)
     */
  const defaultAsyncTimeout = 100; // ms

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();

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
      expect(structure.tagName).to.equal('fluent-radio-group');
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
        assert(element.querySelector("label.u-label-text"), "Widget misses or has incorrect u-label-text element");
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
        assert(widgetClass.defaultValues.classes['u-radio-group'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("On Connect", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
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
    var element;

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
      assert(element.querySelector('label.u-label-text').hasAttribute('hidden'), "Label Text element should be hidden by default");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "");
    });

    it("check for single unselected radio button placeholder", function () {
      expect(element.querySelector('fluent-radio').getAttribute("aria-checked")).equal("false");
    });

    it("check error message appears when valrep is not defined", function () {
      let errorIconTooltip = element.querySelector('.u-error-icon');
      expect(errorIconTooltip.getAttribute("title")).equal("ERROR: Unable to show representation of value");
    });
  });

  describe("Data Update", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("Set Uniface label text", function (done) {
      tester.dataUpdate({
        uniface: {
          "label-text": "Test Label",
        },
      });

      setTimeout(function () {
        expect(element.querySelector("label.u-label-text").innerText).equal("Test Label");
        done();
      }, defaultAsyncTimeout);
    });

    it("Set HTML property readonly to true", function (done) {
      tester.dataUpdate({
        html: { readonly: true }
      });

      setTimeout(function () {
        expect(element.getAttribute("readonly"));
        expect(element.getAttribute("aria-readonly")).equal("true");
        done();
      }, defaultAsyncTimeout);
    });

    it("Set HTML property disabled to true", function (done) {
      tester.dataUpdate({
        html: { disabled: true }
      });

      setTimeout(function () {
        expect(element.getAttribute("disabled"));
        expect(element.getAttribute("aria-disabled")).equal("true");
        done();
      }, defaultAsyncTimeout);
    });

    it("Set valrep property with default display value as rep", function (done) {
      tester.dataUpdate({
        valrep: valRepArray
      });

      setTimeout(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(valRepArray[index].value);
          expect(node.querySelector("span").innerText).equal(valRepArray[index].representation);
        });
        done();
      }, defaultAsyncTimeout);
    });

    it("Set valrep property with default display-format as value", function (done) {
      tester.dataUpdate({
        valrep: valRepArray,
        uniface: {
          "display-format": "val"
        }
      });

      setTimeout(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(valRepArray[index].value);
          expect(node.querySelector("span").innerText).equal(valRepArray[index].value);
        });
        done();
      }, defaultAsyncTimeout);
    });

    it("Set valrep property with default display value as valrep", function (done) {
      tester.dataUpdate({
        valrep: valRepArray,
        uniface: {
          "display-format": "valrep"
        }
      });

      setTimeout(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          expect(node.value).equal(valRepArray[index].value);
          expect(node.querySelector("span.u-valrep-representation").innerText).equal(valRepArray[index].representation);
          expect(node.querySelector("span.u-valrep-value").innerText).equal(valRepArray[index].value);
        });
        done();
      }, defaultAsyncTimeout);
    });

    it("Set value to 2 and expect the radio button to be checked", function (done) {
      tester.dataUpdate({
        valrep: valRepArray,
        value: "2",
      });
      setTimeout(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          if(valRepArray[index].value === "2") {
            expect(node.getAttribute("current-checked")).equal("true");
          } else {
            expect(node.getAttribute("current-checked")).equal("false");
          }
        });
        done();
      }, defaultAsyncTimeout);
    });

    it("Set layout property to horizontal", function (done) {
      let valRepArrayLongText = [ {
        value: "0",
        representation: "Option zero, test horizontal css specification changes when there is more than 25 characters."
      }, ...valRepArray];

      tester.dataUpdate({
        valrep: valRepArrayLongText,
        uniface: {
          "display-format": "rep",
          "layout": "horizontal"
        }
      });

      setTimeout(function () {
        expect(element.getAttribute("orientation")).equal("horizontal");
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          let expectedText = valRepArrayLongText[index].representation;
          if(expectedText.length > 25) {
            expect(node.querySelector("fluent-tooltip"));
          } else {
            expect(node.querySelector("fluent-tooltip")).equal(null);
          }
        });
        done();
      }, defaultAsyncTimeout);
    });

    it("Change multiple properties", function (done) {
      let selectedValue = "2";
      tester.dataUpdate({
        valrep: valRepArray,
        value: selectedValue,
        html: {
          "disabled": true,
          "readonly": false
        },
        classes: { "ClassA": true },
        uniface: {
          "label-text": "Test Label",
          "display-format": "val",
          "layout": "horizontal"
        },
      });

      setTimeout(function () {
        let radioButtonArray = element.querySelectorAll("fluent-radio");
        radioButtonArray.forEach(function (node, index) {
          assert.equal(node.value, valRepArray[index].value);
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
        done();
      }, defaultAsyncTimeout);
    });
  });

  describe('Radio onchange event', function () {
    let radioElement, onchangeSpy, widget;
    beforeEach(function () {

      widget = tester.createWidget();
      radioElement = tester.element.querySelector("fluent-radio");

      // Create a spy for the onchange event
      onchangeSpy = sinon.spy();

      // Add the onchange event listener to the radio element
      radioElement.addEventListener('onchange', onchangeSpy);
    });

    // Clean up after each test
    afterEach(function () {
      // Restore the spy to its original state
      sinon.restore();
    });

    // Test case for the onchange event
    it('should call the onchange event handler when a radio button is clicked', function () {
      // Simulate a change event
      const event = new window.Event('onchange');
      radioElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once
      expect(onchangeSpy.calledOnce).to.be.true;
    });
  });

  describe("Show Error", function () {
    it("not required", function () { });
  });

  describe("Hide Error", function () {
    it("not required", function () { });
  });

  describe("reset all properties", function () {
    it("reset all property", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, "Failed to reset all properties, exception " + e);
      }
    });
  });

})();
