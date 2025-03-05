(function () {
  'use strict';

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  // Custom test variables
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
      expect(structure.tagName).to.equal('fluent-listbox');
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
        assert(widgetClass.defaultValues['class:u-listbox'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("onConnect", function () {
      const element = tester.processLayout();
      const widget = tester.construct();
      tester.onConnect();
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "widget is not connected");
    });
  });

  describe("mapTrigger()", function () {
    const widget = tester.onConnect();
    widget.mapTrigger("onchange");
  });

  describe("dataInit()", function () {
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

    it("check size attribute", function () {
      assert.equal(tester.defaultValues.size, undefined ,"Widget misses or has incorrect u-size element");
    });
  });

  describe("dataUpdate()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("show label", function () {
      let listboxLabel = 'Label';
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": listboxLabel
        });
      }).then(function () {
        let labelElement = element.querySelector("span.u-label-text");
        let labelText = labelElement.innerText;
        expect(listboxLabel).equal(labelText);
        assert(!labelElement.hasAttribute("hidden"), "Failed to show the label text");
      });
    });

    it("reset label", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": uniface.RESET
        });
      }).then(function () {
        const widget = tester.construct();
        let labelElement = widget.elements.widget.querySelector("span.u-label-text");
        assert(labelElement.hasAttribute("hidden"), "Failed to hide the label text");
        assert.equal(labelElement.innerText, "");
        assert.equal(labelElement.getAttribute("slot"), "");
      });
    });

    it("set HTML property readonly to true", function () {
      // Adding Label element
      let listboxLabel = 'Label';
      return asyncRun(function() {
        tester.dataUpdate({
          "html:readonly": true,
          "label-text": listboxLabel
        });
      }).then(function () {
        let labelElement = element.querySelector("span.u-label-text");
        let labelText = labelElement.innerText;
        expect(labelText).equal(listboxLabel);
        expect(Boolean(element.getAttribute("readonly"))).to.be.true;
        expect(window.getComputedStyle(element).cursor).equal("not-allowed");
        expect(window.getComputedStyle(labelElement).cursor).equal("not-allowed");
      });
    });

    it("set HTML property readonly to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        expect(!element.getAttribute("readonly"));
        expect(window.getComputedStyle(element).cursor).equal("auto");
      });
    });

    it("set HTML property disabled to true", function () {
      let listboxLabel = 'Label';
      return asyncRun(function() {
        tester.dataUpdate({
          "html:disabled": true,
          "label-text": listboxLabel
        });
      }).then(function () {
        expect(element.getAttribute("disabled"));
        expect(window.getComputedStyle(element).cursor).equal("not-allowed");
        let labelElement = element.querySelector("span.u-label-text");
        expect(window.getComputedStyle(labelElement).cursor).equal("not-allowed");
      });
    });

    it("set HTML property disabled to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        expect(!element.getAttribute("disabled"));
        expect(window.getComputedStyle(element).cursor).equal("auto");
      });
    });

    it("set HTML property hidden to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:hidden": true
        });
      }).then(function () {
        expect(element.getAttribute("hidden"));
        expect(window.getComputedStyle(element).display).equal("none");
      });
    });

    it("set HTML property hidden to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:hidden": false
        });
      }).then(function () {
        expect(!element.getAttribute("hidden"));
        expect(window.getComputedStyle(element).display).equal("inline-flex");
      });
    });

    it("set HTML property title", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:title": "On"
        });
      }).then(function () {
        expect(element.getAttribute("title"));
        expect(element.title).equal("On");
      });
    });

    it("set HTML property tabindex to -1 ", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": -1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(-1);
      });
    });

    it("set HTML property tabindex to 0", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": 0
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(0);
      });
    });

    it("set HTML property tabindex to 1", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": 1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(1);
      });
    });

    it("set valrep property with default display-format as rep", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "valrep": valRepArray
        });
      }).then(function () {
        let listBoxArray = element.querySelectorAll("fluent-option");
        listBoxArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].representation);
        });
      });
    });

    it("set valrep property with display-format as value", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "valrep": valRepArray,
          "display-format": "val"
        });
      }).then(function () {
        let listBoxArray = element.querySelectorAll("fluent-option");
        listBoxArray.forEach(function (node, index) {
          expect(node.textContent).equal(valRepArray[index].value);
        });
      });
    });

    it("set valrep property with display-format as valrep", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "valrep": valRepArray,
          "display-format": "valrep"
        });
      }).then(function () {
        let listBoxArray = element.querySelectorAll("fluent-option");
        listBoxArray.forEach(function (node, index) {
          let formatValrepText = valRepArray[index].representation + valRepArray[index].value;
          expect(node.textContent).equal(formatValrepText);
        });
      });
    });

    it("set selection to 2 and expect the second option to be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2",
          "display-format": "rep"
        });
      }).then(function () {
        const selectedOption = element.querySelector(".u-option.selected");
        const selectedIndex = valRepArray.findIndex((item) => item.value === "2");
        expect(selectedOption?.value).equal(selectedIndex?.toString());
        expect(selectedOption?.textContent).equal(valRepArray[selectedIndex]?.representation);
      });
    });

    it("update valrep and expect the selection to be retained", function () {
      const valRepArrayWithExtraOptions = [
        {
          "value": "0",
          "representation": "option zero"
        },
        ...valRepArray
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArrayWithExtraOptions
        });
      }).then(function () {
        const selectedOption = element.querySelector(".u-option.selected");
        const selectedIndex = valRepArrayWithExtraOptions.findIndex((item) => item.value === "2");
        expect(selectedOption?.value).equal(selectedIndex?.toString());
        expect(selectedOption?.textContent).equal(valRepArrayWithExtraOptions[selectedIndex]?.representation);
      });
    });

    it("set selection to an invalid value and expect error to be shown and nothing to be selected", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "random"
        });
      }).then(function () {
        const selectedOption = element.querySelector(".u-option.selected");
        expect(selectedOption).equal(null);

        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("error");
        expect(element.childNodes[1].className).equal("u-error-icon ms-Icon ms-Icon--AlertSolid");
      });
    });

    it("set value to empty string ('') when there is no empty option and expect the selection to be cleared with no error", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "",
          "display-format": "rep"
        });
      }).then(function () {
        const selectedOption = element.querySelector(".u-option.selected");
        expect(selectedOption).equal(null);

        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(element.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });

    it("set value to empty string ('') when there is an empty option and expect the empty option to be selected with no error", function () {
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
        const selectedOption = element.querySelector(".u-option.selected");
        const selectedIndex = valRepArrayWithEmpty.findIndex((item) => item.value === "");
        expect(selectedOption?.value).equal(selectedIndex?.toString());
        expect(selectedOption?.textContent).equal(valRepArrayWithEmpty[selectedIndex]?.representation);

        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(element.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });
  });

  describe("Update selection through user interaction", function () {
    let widget, element;
    before(function () {
      widget = tester.createWidget();
      tester.bindUpdatorsEventToElement();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
      tester.dataUpdate({
        "valrep": valRepArray,
        "display-format": "rep"
      });
    });

    // This test case will fail when run individually, fix for that yet to be done.
    it("simulate user interaction and select first option", function () {
      return asyncRun(function () {
        // Programmatically select an option and dispatch the change event.
        const firstOption = element.querySelector("fluent-option");
        firstOption.selected = true;
        const event = new window.Event("change");
        element.dispatchEvent(event);
      }).then(function () {
        const returnedValue = widget.getValue();
        const selectedOption = element.querySelector(".u-option.selected");

        expect(selectedOption?.value).equal("0");
        expect(returnedValue).to.equal(valRepArray[0].value);
        expect(selectedOption?.textContent).equal(valRepArray[0]?.representation);
      });
    });

    it("set an invalid option and expect error to be shown", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "0"
        });
      }).then(function () {
        const selectedOption = element.querySelector(".u-option.selected");
        expect(selectedOption).equal(null);

        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("error");
        expect(element.childNodes[1].className).equal("u-error-icon ms-Icon ms-Icon--AlertSolid");
      });
    });

    // This test case will fail when run individually, fix for that yet to be done.
    it("simulate user interaction again to select the same valid option and expect the error to be removed", function () {
      return asyncRun(function () {
        // Programmatically select an option and dispatch the change event.
        const firstOption = element.querySelector("fluent-option");
        firstOption.selected = true;
        const event = new window.Event("change");
        element.dispatchEvent(event);
      }).then(function () {
        const returnedValue = widget.getValue();
        const selectedOption = element.querySelector(".u-option.selected");

        expect(selectedOption?.value).equal("0");
        expect(returnedValue).to.equal(valRepArray[0].value);
        expect(selectedOption?.textContent).equal(valRepArray[0]?.representation);

        expect(element).to.not.have.class("u-format-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(element.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });
  });

  describe("Check listbox scroll based on size", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set the size = no of valrep element then scroll bar should not be visible with display-format as valrep", function () {
      let size = 3;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "valrep"
        });
      }).then(function () {
        const slotElement = element?.shadowRoot?.querySelector('slot:not([name])');
        const optionElement = element.querySelectorAll('fluent-option');
        const computedStyleOption = window.getComputedStyle(optionElement[0]);
        const computedStyleSlot = slotElement ? window.getComputedStyle(slotElement) : null;
        const optionHeight = parseFloat(computedStyleOption.height);
        const borderHeight = parseFloat(computedStyleOption.borderTopWidth) + parseFloat(computedStyleOption.borderBottomWidth);
        const slotPaddingTop = computedStyleSlot ? parseFloat(computedStyleSlot.paddingTop) : 0;
        const slotPaddingBottom = (size >= optionElement.length) ? (computedStyleSlot ? parseFloat(computedStyleSlot.paddingBottom) : 0) : 0;
        const padding = slotPaddingTop + slotPaddingBottom;
        const totalHeight = optionHeight * valRepArray.length + borderHeight + padding;
        expect(parseFloat(element.getAttribute('u-size'))).equal(size);
        let maxHeightSlotInPixel = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('max-height');
        let overflowBehavior = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('overflow-y');
        expect(parseFloat(maxHeightSlotInPixel)).equal(totalHeight);
        expect(overflowBehavior).equal("auto");
      });
    });

    it("set the size < no of valrep element then scroll bar should be visible with display-format as rep", function () {
      let size = 1;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "rep"
        });
      }).then(function () {
        const slotElement = element?.shadowRoot?.querySelector('slot:not([name])');
        const optionElement = element.querySelectorAll('fluent-option');
        const computedStyleOption = window.getComputedStyle(optionElement[0]);
        const computedStyleSlot = slotElement ? window.getComputedStyle(slotElement) : null;
        const optionHeight = parseFloat(computedStyleOption.height);
        const borderHeight = parseFloat(computedStyleOption.borderTopWidth) + parseFloat(computedStyleOption.borderBottomWidth);
        const slotPaddingTop = computedStyleSlot ? parseFloat(computedStyleSlot.paddingTop) : 0;
        const slotPaddingBottom = (size >= optionElement.length) ? (computedStyleSlot ? parseFloat(computedStyleSlot.paddingBottom) : 0) : 0;
        const padding = slotPaddingTop + slotPaddingBottom;
        const totalHeight = optionHeight * valRepArray.length + borderHeight + padding;
        expect(parseFloat(element.getAttribute('u-size'))).equal(size);
        let maxHeightSlotInPixel = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('max-height');
        let overflowBehavior = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('overflow-y');
        expect(totalHeight).to.be.greaterThan(parseFloat(maxHeightSlotInPixel));
        expect(overflowBehavior).equal("auto");
        const expectedHeight = optionHeight * size + borderHeight + padding;
        assert(expectedHeight, maxHeightSlotInPixel);
      });
    });

    it("set the size > no of valrep element then scroll bar should not be visible with display-format as rep", function () {
      let size = 4;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "rep"
        });
      }).then(function () {
        const slotElement = element?.shadowRoot?.querySelector('slot:not([name])');
        const optionElement = element.querySelectorAll('fluent-option');
        const computedStyleOption = window.getComputedStyle(optionElement[0]);
        const computedStyleSlot = slotElement ? window.getComputedStyle(slotElement) : null;
        const optionHeight = parseFloat(computedStyleOption.height);
        const borderHeight = parseFloat(computedStyleOption.borderTopWidth) + parseFloat(computedStyleOption.borderBottomWidth);
        const slotPaddingTop = computedStyleSlot ? parseFloat(computedStyleSlot.paddingTop) : 0;
        const slotPaddingBottom = (size >= optionElement.length) ? (computedStyleSlot ? parseFloat(computedStyleSlot.paddingBottom) : 0) : 0;
        const padding = slotPaddingTop + slotPaddingBottom;
        const totalHeight = optionHeight * valRepArray.length + borderHeight + padding;
        expect(parseFloat(element.getAttribute('u-size'))).equal(size);
        let maxHeightSlotInPixel = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('max-height');
        let overflowBehavior = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('overflow-y');
        expect(parseFloat(maxHeightSlotInPixel)).greaterThan(totalHeight);
        expect(overflowBehavior).equal("auto");
      });
    });

    it("set the size as negative then scroll bar should not be visible and size should be ignored with display-format as valrep", function () {
      let size = -2;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "valrep"
        });
      }).then(function () {
        // We can not check max-height and overflow-y here since the code exits in case of  negative size value.
        expect(!element.hasAttribute('u-size'));
      });
    });

    it("set the size as 0 then scroll bar should not be visible and size should be ignored with display-format as val", function () {
      let size = 0;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "val"
        });
      }).then(function () {
        // We can not check max-height and overflow-y here since the code exits in case of negative/zero size value.
        expect(!element.hasAttribute('u-size'));
      });
    });

    it("set size as 2 and increase the font size then scroll bar should be visible with display-format as valrep", function () {
      let size = 2;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "valrep"
        });
      }).then(function () {
        const slotElement = element?.shadowRoot?.querySelector('slot:not([name])');
        const optionElement = element.querySelectorAll('fluent-option');
        const computedStyleOption = window.getComputedStyle(optionElement[0]);
        const computedStyleSlot = slotElement ? window.getComputedStyle(slotElement) : null;
        const optionHeight = parseFloat(computedStyleOption.height);
        const borderHeight = parseFloat(computedStyleOption.borderTopWidth) + parseFloat(computedStyleOption.borderBottomWidth);
        const slotPaddingTop = computedStyleSlot ? parseFloat(computedStyleSlot.paddingTop) : 0;
        const slotPaddingBottom = (size >= optionElement.length) ? (computedStyleSlot ? parseFloat(computedStyleSlot.paddingBottom) : 0) : 0;
        const padding = slotPaddingTop + slotPaddingBottom;
        const totalHeight = optionHeight * valRepArray.length + borderHeight + padding;
        optionElement.forEach(setCustomFontSize);
        function setCustomFontSize(optionElement){
          optionElement.style.fontSize = "35px";
        }
        expect(parseFloat(element.getAttribute('u-size'))).equal(size);
        let maxHeightSlotInPixel = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('max-height');
        let overflowBehavior = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('overflow-y');
        expect(totalHeight).to.be.greaterThan(parseFloat(maxHeightSlotInPixel));
        expect(overflowBehavior).equal("auto");
      });
    });

    it("set the size as undefined then scroll bar should not be visible with display-format as rep", function () {
      let size = undefined;
      return asyncRun(function () {
        tester.dataUpdate({
          "size": size,
          "valrep": valRepArray,
          "value": "2",
          "display-format": "rep"
        });
      }).then(function () {
        expect(!element.hasAttribute('u-size'));
        let maxHeightSlotInPixel = window.getComputedStyle(element.shadowRoot.querySelector('slot:not([name])'),null).getPropertyValue('max-height');
        expect(maxHeightSlotInPixel).equal("none");
      });
    });
  });

  describe("Listbox onchange event", function () {
    let element, onchangeSpy;
    beforeEach(function () {
      tester.createWidget();
      element = tester.element;

      // Create a spy for the onchange event.
      onchangeSpy = sinon.spy();

      // Add the onchange event listener to the select element.
      element.addEventListener("onchange", onchangeSpy);
    });

    // Clean up after each test.
    afterEach(function () {
      // Restore the spy to its original state.
      sinon.restore();
    });

    it("should call the onchange event handler when an onchange event is fired", function () {
      // Simulate a change event.
      const event = new window.Event("onchange");
      element.dispatchEvent(event);

      // Assert that the onchange event handler was called once.
      sinon.assert.calledOnce(onchangeSpy);
    });
  });

  describe("Error Visualization", function () {
    let widget, element;
    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("clear the format error and expect no error to be shown", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "format-error": false,
          "format-error-message": ""
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(element.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });

    it("call the showError() method and expect validation error to be shown", function () {
      return asyncRun(function () {
        widget.showError("Validation Error");
      }).then(function () {
        expect(element).to.have.class("u-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("Validation Error");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("error");
        expect(element.childNodes[1].className).equal("u-error-icon ms-Icon ms-Icon--AlertSolid");
      });
    });

    it("call the hideError() method and expect validation error to be removed", function () {
      return asyncRun(function () {
        widget.hideError();
      }).then(function () {
        expect(element).to.not.have.class("u-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(element.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(element.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, "Failed to reset all properties, exception " + e);
      }
    });
  });

})();