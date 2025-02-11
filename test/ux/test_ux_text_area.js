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
    const element = tester.processLayout();
    const widget = tester.onConnect();

    it("defined mapTrigger() and onchange event", function () {
      widget.mapTrigger("onchange");
      const event = new window.Event("onchange");
      element.dispatchEvent(event);
      assert(widget.elements.widget === element, "Widget is not connected.");
    });
  });

  describe("Text area onchange event", function () {
    let textAreaElement, onChangeSpy;

    beforeEach(function () {
      tester.createWidget();
      textAreaElement = tester.element;

      // Create a spy for the onchange event.
      onChangeSpy = sinon.spy();

      // Add the onchange event listener to the text area Element.
      textAreaElement.addEventListener("onchange", onChangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    // Test case for the on change event.
    it("should call the onchange event handler when the text area is changed", function () {
      // Simulate a onchange event.
      const event = new window.Event("onchange");
      textAreaElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      expect(onChangeSpy.calledOnce).to.be.true;
    });
  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();

    var element;

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
    let widget;
    before(function () {
      widget = tester.createWidget();
      
    });

    it("show label", function () {
      let textAreaLabel = "Label";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": textAreaLabel
        });
      }).then(function () {
        let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, textAreaLabel); // Check for visibility.
        assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("set label position before", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position before is not before.");
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

    it("set label position below", function () {
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

    it("html resize property when set to none", function () {
      let resizeProp = "none";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:resize": "none"
        });
      }).then(function () {
        let resizePropText = widget.elements.widget.getAttribute("resize");
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
        let resizePropText = widget.elements.widget.getAttribute("resize");
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
        let resizePropText = widget.elements.widget.getAttribute("resize");
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
        let resizePropText = widget.elements.widget.getAttribute("resize");
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
        let hiddenPropPresent = widget.elements.widget.hasAttribute("hidden");
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
        let hiddenPropPresent = widget.elements.widget.hasAttribute("hidden");
        assert.equal(hiddenPropPresent, hiddenProp); // Check for visibility.
      });
    });

    it("check default html cols value", function () {
      let defaultColsProp = 20;
      {
        let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, defaultColsProp); // Check for visibility.
        let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, 0);
      }
    });

    it("html cols property negative integer", function () {
      let colsProp = -1;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:cols": colsProp
        });
      }).then(function () {
        let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, colsProp); // Check for visibility.
        let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
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
        let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, colsProp); // Check for visibility.
        let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
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
        let placeHolderTextDOM = widget.elements.widget.getAttribute("placeholder");
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
        assert(widget.elements.widget.hasAttribute(readOnly), "Failed to show the readonly attribute.");
      });
    });

    it("set html:readonly property false for textarea", function () {
      let readOnly = "readOnly";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(readOnly), "Failed to hide the readonly attribute.");
      });
    });

    it("set html:disabled property true for textarea", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute(disabled), "Failed to show the disabled attribute.");
      });
    });

    it("set html:disabled property false for textarea", function () {
      let disabled = "disabled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        assert(!widget.elements.widget.hasAttribute(disabled), "Failed to hide the disabled attribute.");
      });
    });

    it("set html:appearance outline property true for textarea", function () {
      let appearanceStyle = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearanceStyle
        });
      }).then(function () {
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance outline attribute.");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute("appearance");
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
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance filled attribute.");
        let appearanceStylePropertyText = widget.elements.widget.getAttribute("appearance");
        assert.equal(appearanceStyle, appearanceStylePropertyText, `Failed to show appearance filled style${appearanceStylePropertyText}.`);
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

    it("setting minlength and maxlength", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(widget.elements.widget.hasAttribute("maxlength"), "Failed to show the maxlength attribute.");
        expect(widget.elements.widget.hasAttribute("minlength"), "Failed to show the minlength attribute.");
        assert.equal(widget.elements.widget.getAttribute("minlength"), minlength, `Min is not same ${minlength}.`);
        assert.equal(widget.elements.widget.getAttribute("maxlength"), maxlength, `Max is not same ${maxlength}.`);
      });
    });

    it("set invalid value in text area", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(widget.elements.widget).to.have.class("u-invalid");
        assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert.equal(widget.elements.widget.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end does not match.");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title does not match.");
      });
    });

    it("html rows property positive integer", function () {
      let rowsProp = 25;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:rows": rowsProp
        });
      }).then(function () {
        let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, 20);// Check for visibility.
        let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, rowsProp);
      });
    });

    it("html rows property negative integer", function () {
      let rowsProp = -1;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:rows": rowsProp
        });
      }).then(function () {
        let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
        assert.equal(colsText, 20);// Check for visibility.
        let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
        assert.equal(rowsText, rowsProp);
      });
    });
  });

  describe("hideError()", function () {
    let widget;
    before(function () {
      widget = tester.createWidget();
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
        expect(widget.elements.widget).to.not.have.class("u-invalid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(widget.elements.widget.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("slot"), "Slot attribute is not present.");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("title"), "Title attribute is not present.");
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
