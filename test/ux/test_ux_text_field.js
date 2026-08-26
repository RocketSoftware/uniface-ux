
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

  function getChangeButton(element) {
    return element.querySelector("fluent-button.u-sw-changebutton");
  }

  describe("Uniface mockup tests", function () {

    it(`should load the ${widgetName} widget class`, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
      expect(structure.tagName, "Structure tagName should be 'fluent-text-field'.").to.equal("fluent-text-field");
      expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
      expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
      expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
      expect(structure.hidden, "Structure hidden should be false.").to.equal(false);
    });

  });

  describe("processLayout()", function () {
    let element;

    describe("Checks", function () {

      before(function () {
        element = tester.processLayout();
      });

      it("should be an instance of HTMLElement", function () {
        expect(element, `Function processLayout() of ${widgetName} does not return an HTMLElement.`).instanceOf(HTMLElement);
      });

      it("should register the web components", function () {
        const customElementNames = ["fluent-text-field","fluent-button"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("should have the correct tagName", function () {
        expect(element, `Element should have tagName ${tester.uxTagName}.`).to.have.tagName(tester.uxTagName);
      });

      it("should have the correct id", function () {
        expect(element, `Element should have id ${widgetId}.`).to.have.id(widgetId);
      });

      it("should have a u-label-text element", function () {
        assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element.");
      });

      it("should have a u-prefix element", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element.");
      });

      it("should have a u-suffix element", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element.");
      });

      it("should have a u-error-icon element", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element.");
      });

      it("should have a u-sw-changebutton element", function () {
        assert(element.querySelector("fluent-button.u-sw-changebutton"), "Widget misses or has incorrect u-sw-changebutton element.");
      });

      it("should have a u-icon element", function () {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element.");
      });

      it("should have a u-text element", function () {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element.");
      });

    });

  });

  describe("Create widget", function () {

    before(function () {
      tester.construct();
    });

    it("constructor()", function () {
      const widget = tester.construct();
      expect(widget, "tester.construct() should return a widget instance").to.exist;
      expect(widgetClass.defaultValues, "Widget class should define required default values").to.include.all.keys(
        "class:u-text-field",
        "class:outline",
        "class:u-stretchable",
        "html:appearance",
        "html:disabled",
        "html:hidden",
        "html:readonly",
        "html:size",
        "html:spellcheck",
        "html:tabindex",
        "html:type",
        "label-position",
        "value"
      );
      expect(widgetClass.defaultValues["class:u-text-field"], "class:u-text-field should be registered as a default value.").to.exist;
    });

    describe("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();

      it("should create and connect the element", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });

    it("should render without any console errors or warnings", function () {
      const errorSpy = sinon.spy(console, "error");
      const warnSpy = sinon.spy(console, "warn");
      try {
        tester.createWidget();
      } finally {
        const errorCount = errorSpy.callCount;
        const warnCount = warnSpy.callCount;
        errorSpy.restore();
        warnSpy.restore();
        assert.equal(errorCount, 0, `Expected no console errors during widget render, but got ${errorCount}.`);
        assert.equal(warnCount, 0, `Expected no console warnings during widget render, but got ${warnCount}.`);
      }
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
      it(`should map trigger '${triggerName}' correctly`, function () {
        const triggerMapping = widget.mapTrigger(triggerName);
        assert(triggerMapping, `Trigger '${triggerName}' is not mapped!`);
        assert(triggerMapping.element === tester.element, `Trigger '${triggerName}' is not mapped to correct HTMLElement!`);
        assert(triggerMapping.event_name === testData[triggerName],
          `trigger '${triggerName}' should be mapped to event '${testData[triggerName]}', but got '${triggerMapping.event_name}'!`);
      });
    });

    it("should return undefined for an unknown trigger name", function () {
      const triggerMapping = widget.mapTrigger("nonexistent");
      expect(triggerMapping, "mapTrigger should return undefined for unknown trigger name.").to.be.undefined;
    });

    it("should map trigger 'changebutton_detail' correctly", function () {
      const triggerMapping = widget.mapTrigger("changebutton_detail");
      assert(triggerMapping, "Trigger 'changebutton_detail' is not mapped!");
      assert(triggerMapping.element, "Trigger 'changebutton_detail' should map to a valid HTMLElement.");
      assert(triggerMapping.element.classList.contains("u-sw-changebutton"), "Trigger 'changebutton_detail' should map to the change button element.");
      assert.equal(triggerMapping.event_name, "click", "Trigger 'changebutton_detail' should be mapped to event 'click'.");
    });
  });

  describe("Onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: "${value}"`);
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
        tester.dataUpdate({
          "value" : ""
        });
      });

      tester.resetTriggerCalled(trigger);
    });

    it("should call the onchange trigger handler when the text field is changed", function () {
      const inputValue = "Hello";
      tester.userInput(inputValue);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger), "Onchange trigger should be called once after user input.").to.be.true;
      // Expected the widget value is the inputValue.
      expect(tester.widget.getValue()).to.equal(inputValue, "Widget value");
    });

  });

  describe("Changebutton trigger", function () {
    const triggerMap = {
      "onchange": function () {
        tester.debugLog("Onchange trigger fired.");
      },
      "changebutton_detail": function () {
        tester.debugLog("Changebutton detail trigger fired.");
      }
    };
    const onchangeTrigger = "onchange";
    const detailTrigger = "changebutton_detail";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
        tester.dataUpdate({
          "value": "",
          "changebutton": true,
          "changebutton:value": "Clock"
        });
      });
      tester.resetTriggerCalled(onchangeTrigger);
      tester.resetTriggerCalled(detailTrigger);
    });

    it("should fire the onchange trigger when Enter key is pressed with changebutton enabled", function () {
      let inputValue = "enter test";
      tester.userInput(inputValue);
      expect(tester.calledOnce(onchangeTrigger), "Onchange trigger should fire once after pressing Enter.").to.be.true;
    });

    it("should fire the change event when the change button is clicked", function () {
      let changeButton = tester.element.querySelector("fluent-button.u-sw-changebutton");
      changeButton.click();
      expect(tester.calledOnce(onchangeTrigger), "Onchange trigger should fire once after clicking change button.").to.be.true;
    });

    it("should fire the changebutton detail trigger when the change button is clicked", function () {
      let changeButton = tester.element.querySelector("fluent-button.u-sw-changebutton");
      changeButton.click();
      expect(tester.calledOnce(detailTrigger), "Changebutton detail trigger should fire once after clicking change button.").to.be.true;
    });
  });

  describe("dataInit()", function () {
    const defaultValues = tester.getDefaultValues();
    const classes = tester.getDefaultClasses();
    let element;

    beforeEach(function () {
      return asyncRun(function () {
        tester.dataInit();
      }).then(function () {
        element = tester.element;
        assert(element, "Widget top element is not defined!");
      });
    });

    for (const defaultClass in classes) {
      it(`should apply class '${defaultClass}' correctly`, function () {
        if (classes[defaultClass]) {
          expect(element, `Widget element should have class ${defaultClass}.`).to.have.class(defaultClass);
        } else {
          expect(element, `Widget element should not have class ${defaultClass}.`).not.to.have.class(defaultClass);
        }
      });
    }

    it("should have hidden text and icon spans by default", function () {
      assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span element should be hidden by default.");
      assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("should have a valid widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true, "Widget id should be a non-empty string");
    });

    it("should have default tabindex attributes", function () {
      assert(element.hasAttribute("tabindex"), "Tabindex attribute should be present by default.");
      assert.equal(element.getAttribute("tabindex"), "0", "Default value of tabindex attribute should be '0'.");
    });

    it("should have default size", function () {
      assert.equal(defaultValues["html:size"], "20", "Default value of size should be '20'.");
    });

    it("should have default label-text, label-position, and changebutton values", function () {
      assert.equal(defaultValues["changebutton"], false, "Default value of change button should be false.");
      assert.equal(defaultValues["label-position"], "above", "Default value of label-position should be above.");
      assert.equal(defaultValues["label-text"], undefined, "Default value of label-text should be undefined.");
    });

    it("should have default type attributes", function () {
      assert(element.hasAttribute("type"), "Type attribute should be present by default.");
      assert.equal(element.getAttribute("type"), "text", "Default value of type attribute should be 'text'.");
    });

    it("should have default appearance attributes", function () {
      assert(element.hasAttribute("appearance"), "Appearance attribute should be present by default.");
      assert.equal(element.getAttribute("appearance"), "outline", "Default value of appearance attribute should be 'outline'.");
    });

    it("should have default changebutton icon-position", function () {
      assert.equal(defaultValues["changebutton:icon-position"], "end", "Default value of change button icon-position should be 'end'.");
    });

    it("should have default changebutton tab-index and appearance", function () {
      assert.equal(defaultValues["changebutton:html:tabindex"], "-1", "Default value of change button tab-index should be '-1'.");
      assert.equal(defaultValues["changebutton:html:appearance"], "stealth", "Default value of change button appearance should be 'stealth'.");
    });

    it("should apply default classes to changebutton subwidget", function () {
      const changeButton = getChangeButton(element);
      assert(changeButton, "Change button subwidget should exist by default.");
      expect(changeButton, "Change button should have class 'u-sw-changebutton'.").to.have.class("u-sw-changebutton");
      expect(changeButton, "Change button should have class 'u-button'.").to.have.class("u-button");
      expect(changeButton, "Change button should have class 'u-stretchable'.").to.have.class("u-stretchable");
      expect(changeButton, "Change button should have class 'stealth'.").to.have.class("stealth");
    });

    it("should have empty default value", function () {
      assert.equal(tester.defaultValues.value, "", "Default value of attribute value should be ''.");
    });

    it("should have delegated disabled property for changebutton", function () {
      assert.equal(tester.widget.subWidgetDefinitions["changebutton"].delegatedProperties, "html:disabled", "Delegated property html:disabled is not present.");
    });

  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("should set appearance to filled", function () {
      let appearance = "filled";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = element.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "Appearance is not set to filled.");
        assert(element.hasAttribute("appearance"), "Failed to show the appearance attribute.");
      });
    });

    it("should set appearance to outline", function () {
      let appearance = "outline";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = element.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "Appearance is not set to outline.");
        assert(element.hasAttribute("appearance"), "Failed to show the appearance attribute.");
      });
    });

    it("should set disabled state when html:disabled is true", function () {
      let disabled = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        expect(element, "Disabled class is not applied.").to.have.class("disabled");
        assert(element.hasAttribute("disabled"), "Failed to show the disabled attribute.");
      });
    });

    it("should set disabled state when html:disabled is false", function () {
      let disabled = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        expect(element, "Disabled class should not be applied.").not.to.have.class("disabled");
        assert(!element.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
      });
    });

    it("should set readonly state when html:readonly is true", function () {
      let readonly = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        expect(element, "Readonly class is not applied.").to.have.class("readonly");
        assert(element.hasAttribute("readonly"), "Failed to show the readonly attribute.");
      });
    });

    it("should set readonly state when html:readonly is false", function () {
      let readonly = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        expect(element, "Readonly class should not be applied.").not.to.have.class("readonly");
        assert(!element.hasAttribute("readonly"), "Failed to hide the readonly attribute.");
      });
    });

    it("should set hidden state when html:hidden is true", function () {
      let hidden = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        }
        );
      }).then(function () {
        assert(element.hasAttribute("hidden"), "Failed to show the hidden attribute.");
      });
    });

    it("should set hidden state when html:hidden is false", function () {
      let hidden = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        });
      }).then(function () {
        expect(element, "Hidden class should not be applied.").not.to.have.class("hidden");
        assert(!element.hasAttribute("hidden"), "Failed to hide the hidden attribute.");
      });
    });


    it("should update prefix text", function () {
      let prefixTextData = "prefixTextData";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        }
        );
      }).then(function () {
        const prefixElement = element.querySelector("span.u-prefix");
        assert(prefixElement, "Prefix element is not present.");
        assert.equal(prefixElement.innerText, prefixTextData, "Prefix data does not match.");
      });
    });

    it("should update prefix icon", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "Accounts"
        });
      }).then(function () {
        const prefixElement = element.querySelector("span.u-prefix");
        assert(prefixElement, "Prefix element is not present.");
        expect(prefixElement, "Prefix element should have class 'u-prefix'.").to.have.class("u-prefix");
        expect(prefixElement, "Prefix element should have class 'ms-Icon'.").to.have.class("ms-Icon");
        expect(prefixElement, "Prefix element should have class 'ms-Icon--Accounts'.").to.have.class("ms-Icon--Accounts");
      });
    });

    it("should update suffix text", function () {
      let suffixTextData = "suffixTextData";
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        const suffixElement = element.querySelector("span.u-suffix");
        assert(suffixElement, "Suffix element is not present.");
        assert.equal(suffixElement.innerText, suffixTextData, "Suffix data does not match.");
      });
    });

    it("should update suffix icon", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "Accounts"
        });
      }).then(function () {
        const suffixElement = element.querySelector("span.u-suffix");
        assert(suffixElement, "Suffix element is not present.");
        expect(suffixElement, "Suffix element should have class 'u-suffix'.").to.have.class("u-suffix");
        expect(suffixElement, "Suffix element should have class 'ms-Icon'.").to.have.class("ms-Icon");
        expect(suffixElement, "Suffix element should have class 'ms-Icon--Accounts'.").to.have.class("ms-Icon--Accounts");
      });
    });

    it("should set pattern '.{2,}'", function () {
      let patternText = ".{2,}";
      let placeHolderText = "Please match requested format.";
      let title = "Two or more characters";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:pattern": patternText,
          "html:type": "text",
          "html:title": title,
          "value": 1234
        });
      }).then(function () {
        assert.equal(element.getAttribute("pattern"),patternText, "Failed to show the pattern attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"),placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert.equal(element.getAttribute("title"),title, "Failed to show the title attribute and value does not match.");
        assert(element.hasAttribute("pattern"), "Failed to show the pattern attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set pattern [A-Za-z]{3}", function () {
      let pattern = "[A-Za-z]{3}";
      let placeHolderText = "Please match requested format.";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:pattern": pattern,
          "html:type": "text",
          "value": "abc"
        });
      }).then(function () {
        assert.equal(element.getAttribute("pattern"), pattern, "Failed to show the pattern attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("pattern"), "Failed to show the pattern attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set placeholder", function () {
      let placeHolderText = "Please match requested format.";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:type": "text"
        });
      }).then(function () {
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set type as tel", function () {
      let placeHolderText = "Input Mobile Number";
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "AddPhone",
          "prefix-text": "Call Me",
          "html:placeholder": placeHolderText,
          "html:type": "tel"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "tel", "Failed to show the tel attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"),placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the tel attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set type as email", function () {
      let placeHolderText = "Input Email ID";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PublicEmail",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "email"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "email", "Failed to show the type as email attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the email attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should retain readonly unset when invalid email triggers native validation", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email"
        });
        tester.userInput("invalid");
      }).then(function () {
        expect(element.checkValidity(), "Element validity should be false for invalid email.").to.be.false;
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        // When html validation error is present, the widget should not be set in readonly mode.
        assert(!element.readOnly, "The widget should not be set in readonly mode.");

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();

        // Clear the user input for future test cases.
        tester.userInput("");
      });
    });

    it("should retain readonly unset but allow disabled when invalid email triggers native validation", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email"
        });
        tester.userInput("invalid");
      }).then(function () {
        expect(element.checkValidity(), "Element validity should be false for invalid email.").to.be.false;
        tester.dataUpdate({
          "html:disabled": true,
          "html:readonly": true
        });
      }).then(function () {
        // When html validation error is present, the widget should not be set in readonly mode.
        assert(!element.readOnly, "The widget should not be set in readonly mode.");
        // But it should be possible to set the widget in disabled mode.
        assert(element.disabled, "The widget should be set in disabled mode.");

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
      }).then(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        // The widget should be removed from the disabled mode.
        assert(!element.disabled, "The widget should be removed from the disabled mode.");

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();

        // Clear the user input for future test cases.
        tester.userInput("");
      });
    });

    it("should apply readonly and store invalid email value without throwing an exception when both are set together via dataUpdate", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "html:readonly": true,
          "html:pattern": ".*",
          "value": "not-a-valid-email"
        });
      }).then(function () {
        assert(element.readOnly, "Widget should be set in readonly mode.");
        assert.equal(element.value, "not-a-valid-email", "Invalid email value should be stored on the element.");
      }).then(function () {
        tester.userInput("");
      });
    });

    it("should maintain readonly and store invalid email value without throwing an exception when value is set via dataUpdate while field is readonly", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "html:readonly": true
        });
      }).then(function () {
        tester.dataUpdate({
          "value": "not-a-valid-email"
        });
      }).then(function () {
        assert(element.readOnly, "Widget should be set in readonly mode.");
        assert.equal(element.value, "not-a-valid-email", "Invalid email value should be stored on the element.");
      }).then(function () {
        tester.userInput("");
      });
    });

    it("should apply disabled and store invalid email value without throwing an exception when both are set together via dataUpdate", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "html:disabled": true,
          "html:pattern": ".*",
          "value": "not-a-valid-email"
        });
      }).then(function () {
        assert(element.disabled, "Widget should be set in disabled mode.");
        assert.equal(element.value, "not-a-valid-email", "Invalid email value should be stored on the element.");
      }).then(function () {
        tester.dataUpdate({
          "html:disabled": false,
          "html:type": "text",
          "value": ""
        });
      });
    });

    it("should maintain disabled and store invalid email value without throwing an exception when value is set via dataUpdate while field is disabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "html:disabled": true
        });
      }).then(function () {
        tester.dataUpdate({
          "value": "not-a-valid-email"
        });
      }).then(function () {
        assert(element.disabled, "Widget should be set in disabled mode.");
        assert.equal(element.value, "not-a-valid-email", "Invalid email value should be stored on the element.");
      }).then(function () {
        tester.dataUpdate({
          "html:disabled": false,
          "html:type": "text",
          "value": ""
        });
      });
    });

    it("should set type as password", function () {
      let placeHolderText = "Input Password";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PasswordField",
          "html:placeholder": placeHolderText,
          "html:type": "password"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "password", "Failed to show the type as password attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as password attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set type as url", function () {
      let placeHolderText = "Input url";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "URLBlock",
          "html:placeholder": placeHolderText,
          "html:type": "url"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "url", "Failed to show the tye as url attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as url attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should apply readonly and store invalid url value without throwing an exception when both are set together via dataUpdate", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "url",
          "html:readonly": true,
          "value": "not-a-valid-url"
        });
      }).then(function () {
        assert(element.readOnly, "Widget should be set in readonly mode.");
        assert.equal(element.value, "not-a-valid-url", "Invalid url value should be stored on the element.");
      }).then(function () {
        tester.userInput("");
      });
    });

    it("should maintain readonly and store invalid url value without throwing an exception when value is set via dataUpdate while field is readonly", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "url",
          "html:readonly": true
        });
      }).then(function () {
        tester.dataUpdate({
          "value": "not-a-valid-url"
        });
      }).then(function () {
        assert(element.readOnly, "Widget should be set in readonly mode.");
        assert.equal(element.value, "not-a-valid-url", "Invalid url value should be stored on the element.");
      }).then(function () {
        tester.userInput("");
      });
    });

    it("should apply disabled and store invalid url value without throwing an exception when both are set together via dataUpdate", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "url",
          "html:disabled": true,
          "value": "not-a-valid-url"
        });
      }).then(function () {
        assert(element.disabled, "Widget should be set in disabled mode.");
        assert.equal(element.value, "not-a-valid-url", "Invalid url value should be stored on the element.");
      }).then(function () {
        tester.dataUpdate({
          "html:disabled": false,
          "html:type": "text",
          "value": ""
        });
      });
    });

    it("should maintain disabled and store invalid url value without throwing an exception when value is set via dataUpdate while field is disabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "url",
          "html:disabled": true
        });
      }).then(function () {
        tester.dataUpdate({
          "value": "not-a-valid-url"
        });
      }).then(function () {
        assert(element.disabled, "Widget should be set in disabled mode.");
        assert.equal(element.value, "not-a-valid-url", "Invalid url value should be stored on the element.");
      }).then(function () {
        tester.dataUpdate({
          "html:disabled": false,
          "html:type": "text",
          "value": ""
        });
      });
    });

    it("should set type as date", function () {
      let placeHolderText = "Input date";
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "DateTime",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "date"
          // value: "test@test.com"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "date", "Failed to show the date attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"),placeHolderText ,"Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as date attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("should set type as datetime-local", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "datetime-local"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "datetime-local", "Failed to set the type as datetime-local.");
      });
    });

    it("should set type as datetime-local and apply a valid datetime value", function () {
      let dateTimeValue = "2026-04-23T14:30";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "datetime-local",
          "value": dateTimeValue
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "datetime-local", "Failed to set the type as datetime-local.");
        assert.equal(tester.widget.getValue(), dateTimeValue, "Failed to set the datetime-local value.");
        assert.equal(element.value, dateTimeValue, "Element value should match the set datetime-local value.");
        // Clear the value for subsequent tests.
        tester.dataUpdate({
          "value":""
        });
      });
    });

    it("should set type as time", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "time"
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "time", "Failed to set the type as time.");
      });
    });

    it("should set type as time and apply a valid time value", function () {
      let timeValue = "14:30";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "time",
          "value": timeValue
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "time", "Failed to set the type as time.");
        assert.equal(tester.widget.getValue(), timeValue, "Failed to set the time value.");
        assert.equal(element.value, timeValue, "Element value should match the set time value.");
        // Clear the value for subsequent tests.
        tester.dataUpdate({
          "value": ""
        });
      });
    });

    it("should set a valid time value with seconds (HH:MM:SS)", function () {
      const errorSpy = sinon.spy(console, "error");
      let timeValue = "14:30:45";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "time",
          "value": timeValue
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "time", "Failed to set the type as time.");
        assert.equal(tester.widget.getValue(), timeValue, "Failed to set the time value with seconds.");
        assert.equal(element.value, timeValue, "Element value should match the set time value with seconds.");
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
        tester.dataUpdate({ "value": "" });
      });
    });

    it("should set a valid time value with milliseconds (HH:MM:SS.sss)", function () {
      const errorSpy = sinon.spy(console, "error");
      let timeValue = "14:30:45.500";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "time",
          "value": timeValue
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "time", "Failed to set the type as time.");
        assert.equal(tester.widget.getValue(), timeValue, "Failed to set the time value with milliseconds.");
        assert.equal(element.value, timeValue, "Element value should match the set time value with milliseconds.");
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
        tester.dataUpdate({ "value": "" });
      });
    });

    it("should set a valid datetime-local value with seconds", function () {
      const errorSpy = sinon.spy(console, "error");
      let dateTimeValue = "2026-04-23T14:30:45";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "datetime-local",
          "value": dateTimeValue
        });
      }).then(function () {
        assert.equal(element.getAttribute("type"), "datetime-local", "Failed to set the type as datetime-local.");
        assert.equal(tester.widget.getValue(), dateTimeValue, "Failed to set the datetime-local value with seconds.");
        assert.equal(element.value, dateTimeValue, "Element value should match the set datetime-local value with seconds.");
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
        tester.dataUpdate({ "value": "" });
      });
    });

    it("should apply u-blocked class and produce no errors when blockUI() is called with a time value containing seconds", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "time",
          "value": "14:30:45"
        });
      }).then(function () {
        tester.widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
        tester.widget.unblockUI();
        tester.dataUpdate({ "value": "" });
      });
    });

    it("should log a console warning for an unsupported html:type", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "abc"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:type' invalid value (abc) - Ignored.")), "Console should warn for unsupported html:type values.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should render changebutton subwidget with icon and slot", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail",
          "changebutton:icon-position": "start",
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        const iconElement = changeButton && changeButton.querySelector("span.u-icon");
        assert(changeButton, "Change button is not present.");
        assert(iconElement, "Change button icon is not present.");
        expect(iconElement.getAttribute("slot"), "Failed to show the slot attribute and value does not match.").to.equal("start");
        expect(iconElement, "Change button icon should have class 'u-icon'.").to.have.class("u-icon");
        expect(iconElement, "Change button icon should have class 'ms-Icon'.").to.have.class("ms-Icon");
        expect(iconElement, "Change button icon should have class 'ms-Icon--PublicEmail'.").to.have.class("ms-Icon--PublicEmail");
      });
    });

    it("should update changebutton appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:value": "Click Me",
          "changebutton:html:appearance": "outline"
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert.equal(changeButton.getAttribute("appearance"), "outline", "Change button appearance should be updated to 'outline'.");
      });
    });

    it("should retain changebutton subwidget when changebutton is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": false,
          "changebutton:icon": "PublicEmail"
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        expect(changeButton, "Change button should have class 'u-sw-changebutton'.").to.have.class("u-sw-changebutton");
        assert(changeButton.hidden, "Change button should be hidden when changebutton is false.");
      });
    });

    it("should disable changebutton subwidget when textfield is disabled", function () {
      let disabled = true;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        expect(element, "Disabled class is not applied.").to.have.class("disabled");
        assert(element.hasAttribute("disabled"), "Failed to show the disabled attribute.");
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        expect(changeButton, "Change button should have class 'disabled' when text field is disabled.").to.have.class("disabled");
        assert(changeButton.hasAttribute("disabled"), "Change button should have the disabled attribute.");
      });
    });

    it("should enable changebutton subwidget when textfield is not disabled", function () {
      let disabled = false;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        expect(element, "Disabled class should not be applied.").not.to.have.class("disabled");
        assert(!element.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        expect(changeButton, "Change button should not have class 'disabled' when text field is enabled.").not.to.have.class("disabled");
        assert(!changeButton.hasAttribute("disabled"), "Change button should not have the disabled attribute.");
      });
    });

    it("should enable changebutton after textfield is disabled and re-enabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:value": "Click Me",
          "changebutton:html:disabled": true
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert(changeButton.hasAttribute("disabled"), "Change button should be disabled when set via changebutton:html:disabled.");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:disabled": true
          });
        });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Text field should be disabled before re-enable.");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:disabled": false
          });
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert(!element.hasAttribute("disabled"), "Text field should be re-enabled.");
        assert(!changeButton.hasAttribute("disabled"), "Change button should be enabled after text field is re-enabled.");
      });
    });

    it("should not delegate html:title to changebutton", function () {
      const titleText = "Type value";
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:value": "Click Me",
          "html:title": titleText
        });
      }).then(function () {
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert.equal(element.getAttribute("title"), titleText, "Text field title should be set.");
        assert(!changeButton.hasAttribute("title"), "Change button should not receive title attribute from text field.");
      });
    });

    it("should show label text when label-text is set", function () {
      let textFieldLabel = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, textFieldLabel, "Label text should match the updated value.");
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
      });
    });

    it("should associate label with control for accessibility when label-text is set", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Accessible Label"
        });
      }).then(function () {
        const label = element.shadowRoot.querySelector("label.label");
        const control = element.shadowRoot.querySelector("#control.control");
        assert(label, "Label element is not present.");
        assert(control, "Control element is not present.");
        assert.equal(label.getAttribute("for"), control.id, "Label must be associated with the input control id.");
      });
    });

    it("should retain disabled state when label text is clicked", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Clickable Label",
          "html:disabled": true
        });
      }).then(function () {
        const labelTextElement = element.querySelector("span.u-label-text");
        assert(labelTextElement, "Label text element is not present.");
        assert(element.hasAttribute("disabled"), "Widget should be disabled before label click.");
        labelTextElement.click();
        assert(element.hasAttribute("disabled"), "Widget should remain disabled after label click.");
      });
    });

    it("should retain readonly state when label text is clicked", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Clickable Label",
          "html:readonly": true
        });
      }).then(function () {
        const labelTextElement = element.querySelector("span.u-label-text");
        assert(labelTextElement, "Label text element is not present.");
        assert(element.hasAttribute("readonly"), "Widget should be readonly before label click.");
        labelTextElement.click();
        assert(element.hasAttribute("readonly"), "Widget should remain readonly after label click.");
      });
    });

    it("should position the label before and apply the correct styles", function () {
      let textFieldLabel = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before",
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "before", "Label position should be 'before'.");
        // If u-label-position attribute is added element display is changed.
        let textFieldStyle = window.getComputedStyle(element, null);
        let displayPropertyValue = textFieldStyle.getPropertyValue("display");
        assert.equal(displayPropertyValue, "inline-flex", "Display should be 'inline-flex' when label is before.");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let alignPropertyValue = labelStyle.getPropertyValue("align-content");
        assert.equal(alignPropertyValue, "center", "Label align-content should be 'center' when label is before.");
      });
    });

    it("should position the label below and apply the correct styles", function () {
      let textFieldLabel = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below",
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "below", "Label position should be 'below'.");
        let textFieldStyle = window.getComputedStyle(element, null);
        let flexPropertyValue = textFieldStyle.getPropertyValue("flex-direction");
        assert.equal(flexPropertyValue, "column", "Flex direction should be 'column' when label is below.");
        let labelStyle = window.getComputedStyle(element.shadowRoot.querySelector(".label"), null);
        let orderPropertyValue = labelStyle.getPropertyValue("order");

        assert.equal(orderPropertyValue, 2, "Label order should be 2 when position is below.");
      });
    });

    it("should reset label-text and label-position to defaults when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "above", "Label position should reset to 'above'.");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "", "Label text should reset to empty string.");
      });
    });

    it("should apply default flex-direction after label position reset", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before",
          "label-text": "Label"
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "label-position": uniface.RESET,
            "label-text": uniface.RESET
          });
        });
      }).then(function () {
        let textFieldStyle = window.getComputedStyle(element, null);
        let flexPropertyValue = textFieldStyle.getPropertyValue("flex-direction");
        assert.equal(flexPropertyValue, "column", "Default flex-direction should be 'column' after label reset.");
      });
    });

    it("should set minlength and maxlength attributes", function () {
      let minlength = 2;
      let maxlength = 5;

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(element.hasAttribute("maxlength"), "Failed to show the maxlength attribute.").to.be.true;
        expect(element.hasAttribute("minlength"), "Failed to show the minlength attribute.").to.be.true;
        assert.equal(element.getAttribute("minlength"), minlength, `Min is not same ${minlength}.`);
        assert.equal(element.getAttribute("maxlength"), maxlength, `Max is not same ${maxlength}.`);
      });
    });

    it("should apply disabled state when changebutton is false and html:disabled is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": false,
          "html:disabled": true
        });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Widget should be in disabled state.");
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert(changeButton.hidden, "Change button should be hidden when changebutton is false.");
        assert(changeButton.hasAttribute("disabled"), "Change button should be disabled when text field is disabled.");
      });
    });

    it("should remove disabled state when html:disabled is false with changebutton true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "html:disabled": false
        });
      }).then(function () {
        assert(!element.hasAttribute("disabled"), "Widget should not be in disabled state.");
        const changeButton = getChangeButton(element);
        assert(changeButton, "Change button is not present.");
        assert(!changeButton.hidden, "Change button should be visible when changebutton is true.");
        assert(!changeButton.hasAttribute("disabled"), "Change button should not be disabled.");
      });
    });

    it("should not change state when html:disabled is set to an invalid value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:value": "Clock",
          "html:disabled": false
        });
      }).then(function () {
        let disabledBefore = element.getAttribute("disabled");
        tester.dataUpdate({
          "html:disabled": "xxxx"
        });
        return asyncRun(function () {}).then(function () {
          let disabledAfter = element.getAttribute("disabled");
          assert.equal(disabledBefore, disabledAfter, "Widget should not change its disabled state for invalid value.");
        });
      });
    });

    it("should not change state when html:readonly is set to an invalid value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        let readonlyBefore = element.getAttribute("readonly");
        tester.dataUpdate({
          "html:readonly": "xxxx"
        });
        return asyncRun(function () {}).then(function () {
          let readonlyAfter = element.getAttribute("readonly");
          assert.equal(readonlyBefore, readonlyAfter, "Widget should not change its readonly state for invalid value.");
        });
      });
    });

    it("should apply both disabled and readonly attributes when both are set to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true,
          "html:disabled": true
        });
      }).then(function () {
        assert(element.hasAttribute("disabled"), "Widget should be in disabled state.");
        assert(element.hasAttribute("readonly"), "Widget should be in readonly state.");
      });
    });

    it("should set tabindex to -1 when html:tabindex is set to negative value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:tabindex": -1
        });
      }).then(function () {
        assert.equal(element.getAttribute("tabindex"), "-1", "Tabindex should be set to -1.");
      });
    });

    it("should set the title attribute when html:title is specified", function () {
      let titleText = "This is the title text";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": titleText
        });
      }).then(function () {
        assert.equal(element.getAttribute("title"), titleText, "Title attribute should match the specified value.");
      });
    });

    it("should set the title attribute to empty when html:title is empty", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": ""
        });
      }).then(function () {
        assert.equal(element.getAttribute("title"), "", "Title attribute should be empty.");
      });
    });

    it("should set the spellcheck attribute to true when html:spellcheck is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:spellcheck": true
        });
      }).then(function () {
        assert(element.hasAttribute("spellcheck"), "Spellcheck attribute should be present when html:spellcheck is true.");
        assert(element.spellcheck, "Spellcheck property should be set to true.");
      });
    });

    it("should set the spellcheck attribute to false when html:spellcheck is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:spellcheck": false
        });
      }).then(function () {
        assert(!element.spellcheck, "Spellcheck attribute should be set to false.");
      });
    });

    it("should set the size attribute to 5", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:size": "5"
        });
      }).then(function () {
        assert.equal(element.getAttribute("size"), "5", "Size attribute should be set to 5.");
      });
    });

    it("should set the size attribute to -1", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:size": "-1"
        });
      }).then(function () {
        assert.equal(element.getAttribute("size"), "-1", "Size attribute should be set to -1.");
      });
    });

    it("should log a console warning when html:maxlength is set to -1", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:maxlength": -1
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:maxlength' is not a positive number - Ignored.")), "Console should warn for invalid html:maxlength value.").to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should log a console warning when html:minlength is set to -1", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": -1
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:minlength' is not a positive number - Ignored.")), "Console should warn for invalid html:minlength value.").to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should log a console warning when html:minlength or html:maxlength is set on a non-empty value", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "abcde",
          "html:minlength": 1,
          "html:maxlength": 5
        });
      }).then(function () {
        // Try setting new min/max while value is present.
        tester.dataUpdate({
          "html:minlength": 3,
          "html:maxlength": 7
        });
        return asyncRun(function () {}).then(function () {
          expect(warnSpy.calledWith(sinon.match("cannot be set if control-value is not")), "Console should warn when minlength/maxlength are set while value is non-empty.").to.be.true;
          // Reset value for subsequent tests.
          tester.dataUpdate({ "value": "" });
        });
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should log a console warning when html:maxlength is less than html:minlength", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
        tester.dataUpdate({
          "html:maxlength": 5,
          "html:minlength": 10
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Invalid combination")), "Console should warn when maxlength is less than minlength.").to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should handle setting html:minlength to null after valid min/maxlength", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
        tester.dataUpdate({
          "html:minlength": 2,
          "html:maxlength": 5
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "html:minlength": null
          });
        }).then(function () {
          // Widget should handle null minlength without errors.
          sinon.assert.notCalled(errorSpy);
          expect(element.hasAttribute("minlength"), "minlength attribute should be removed when html:minlength is set to null.").to.be.false;
          expect(element.getAttribute("maxlength"), "maxlength attribute should remain unchanged when only html:minlength is set to null.").to.equal("5");
        });
      }).finally(function () {
        errorSpy.restore();
      });
    });

    it("should handle setting both html:minlength and html:maxlength to null", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "html:minlength": 2,
          "html:maxlength": 5
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "html:minlength": null,
            "html:maxlength": null
          });
        });
      }).then(function () {
        // Widget should handle null min and maxlength without errors.
        sinon.assert.notCalled(errorSpy);
        expect(element.hasAttribute("minlength"), "minlength attribute should be removed when html:minlength is set to null.").to.be.false;
        expect(element.hasAttribute("maxlength"), "maxlength attribute should be removed when html:maxlength is set to null together with html:minlength.").to.be.false;
      }).finally(function () {
        errorSpy.restore();
      });
    });

    it("should not show change button when changebutton is set to empty string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": ""
        });
      }).then(function () {
        let changeButton = element.querySelector("fluent-button.u-sw-changebutton");
        assert(changeButton.hidden, "Change button should be hidden when changebutton is empty.");
      });
    });

    it("should warn when an unsupported property is set", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "dummy-property": "some value"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'dummy-property' - Ignored")),
          "Console should warn about unsupported property 'dummy-property'.").to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should add a custom CSS class when class:name is set to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": true
        });
      }).then(function () {
        assert(element.classList.contains("class-test"), "Element should have custom class 'class-test' applied.");
      });
    });

    it("should remove a custom CSS class when class:name is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": true
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "class:class-test": false
          });
        });
      }).then(function () {
        assert(!element.classList.contains("class-test"), "Element should not have custom class 'class-test' after removal.");
      });
    });

    it("should display the string 'undefined' as label text when label-text is set to 'undefined'", function () {
      let labelText = "undefined";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": labelText
        });
      }).then(function () {
        assert.equal(element.querySelector("span.u-label-text").innerText, labelText, "Label text should display 'undefined'.");
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Label element should be visible.");
      });
    });

    it("should position the label after the element", function () {
      let textFieldLabel = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "after",
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "after", "Label position should be 'after'.");
      });
    });

    it("should log a console warning for an invalid label-position value", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "top"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (top) - Ignored.")), "Console should warn for invalid label-position values.").to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });

    it("should wrap label text when text field width is decreased", function () {
      let longLabel = "This is a very long label of widget and the question is, should it wrap or not";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": longLabel,
          "label-position": "above"
        });

        // Shrink the host element to trigger label wrapping.
        element.style.width = "100px";
      }, 1).then(function () {
        let label = element.querySelector("span.u-label-text");
        let labelWidth = Math.round(label.getBoundingClientRect().width);
        let elementWidth = Math.round(element.getBoundingClientRect().width);
        assert.isAtMost(labelWidth, elementWidth, "Label should not exceed text field width.");
      });
    });
  });

  describe("showError()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("should show error state when error is set to true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(element, "Widget should have class 'u-invalid' when error is shown.").to.have.class("u-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert.equal(element.childNodes[2].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't have class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end does not match.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title does not match.");
      });
    });
  });

  describe("hideError()", function () {
    let widget, element;
    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      verifyWidgetClass(widgetClass);
    });

    it("should hide error state when error is set to false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": ""
        });
      }).then(function () {
        const errorIcon = element.querySelector("span.u-error-icon");
        widget.hideError("");
        expect(element, "Widget should not have class 'u-invalid' after hideError.").to.not.have.class("u-invalid");
        assert(errorIcon, "Error icon is not present.");
        assert(errorIcon.hasAttribute("hidden"), "Failed to show the hidden attribute.");
        expect(errorIcon, "Widget element should keep class 'u-error-icon'.").to.have.class("u-error-icon");
        assert(element.querySelector("span.u-error-icon").hasAttribute("slot"), "The slot attribute is not present.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("title"), "The title attribute is not present.");
      });
    });
  });

  describe("blockUI()", function () {
    let element, widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "changebutton": true,
          "changebutton:value": "Action"
        });
      });
    });

    afterEach(function () {
      widget.unblockUI();
      tester.userInput("");
    });

    it("should apply 'u-blocked' class and set widget to readonly when blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked, "UI blocked state should be true after blockUI.").equal(true);
        assert(element.readOnly, "Failed to set the widget in readonly mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement, "Change button should have class 'u-blocked' after blockUI.").to.have.class("u-blocked");
        assert(buttonElement.disabled, "Failed to set the subwidget changebutton in disabled mode.");

      });
    });

    it("should disable instead of readonly when blockUI() is called with a validation error present", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.userInput("invalid");
      }).then(function () {
        expect(element.control.checkValidity(), "Control validity should be false for invalid email.").to.be.false;
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked, "UI blocked state should be true after blockUI.").equal(true);

        // When html validation error is present, widget should be set in disabled instead of readonly mode for ui-blocking.
        assert(!element.readOnly, "The widget should not be set in readonly mode.");
        assert(element.disabled, "Failed to set the widget in disabled mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement, "Change button should have class 'u-blocked' after blockUI.").to.have.class("u-blocked");
        assert(buttonElement.disabled, "Failed to set the subwidget changebutton in disabled mode.");

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
      }).finally(function () {
        errorSpy.restore();
      });
    });
  });

  describe("unblockUI()", function () {
    let element, widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:value": "Action"
        });
      });
    });

    afterEach(function () {
      widget.unblockUI();
      tester.userInput("");
    });

    it("should remove 'u-blocked' class and readonly state when unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not removed.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked, "UI blocked state should be false after unblockUI.").equal(false);
        assert(!element.readOnly, "Failed to remove the widget from readonly mode.");
        assert(!element.disabled, "Failed to remove the widget from disabled mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement, "Change button should not have class 'u-blocked' after unblockUI.").not.to.have.class("u-blocked");
        assert(!buttonElement.disabled, "Failed to remove the subwidget changebutton from disabled mode.");
      });
    });

    it("should retain readonly mode after unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true
        });
        widget.blockUI();
        widget.unblockUI();
      }).then(function () {
        assert(element.readOnly, "Failed to retain the widget in readonly mode after unblockUI().");
      });
    });

    it("should retain explicit changebutton disabled state after unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton:html:disabled": true
        });
        widget.blockUI();
        widget.unblockUI();
      }).then(function () {
        const buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        assert(buttonElement, "Change button is not present.");
        assert(buttonElement.disabled, "Change button should remain disabled after unblockUI() when explicitly disabled.");
      });
    });
  });

  describe("unblockUI() with validation error present", function () {
    let element, widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email",
          "changebutton": true,
          "changebutton:value": "Action"
        });
        tester.userInput("invalid");
      }).then(function () {
        expect(element.control.checkValidity(), "Control validity should be false for invalid email.").to.be.false;
      });
    });

    afterEach(function () {
      // Clear the user input for future test cases.
      tester.userInput("");
      widget.unblockUI();
    });

    it("should remove 'u-blocked' class and disabled state when unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not removed.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked, "UI blocked state should be false after unblockUI.").equal(false);
        assert(!element.disabled, "Failed to remove the widget from disabled mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement, "Change button should not have class 'u-blocked' after unblockUI.").not.to.have.class("u-blocked");
        assert(!buttonElement.disabled, "Failed to remove the subwidget changebutton from disabled mode.");
      });
    });

    it("should retain disabled mode after unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
        widget.blockUI();
        widget.unblockUI();
      }).then(function () {
        assert(element.disabled, "Failed to retain the widget in disabled mode after unblockUI().");
        const buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        assert(buttonElement, "Change button is not present.");
        assert(buttonElement.disabled, "Change button should remain disabled after unblockUI() when text field is explicitly disabled.");
      });
    });
  });

  describe("validate()", function () {
    let widget;

    before(function () {
      widget = tester.createWidget();

    });

    afterEach(function () {
      // Clear input for subsequent tests.
      tester.userInput("");
    });

    it("should return validation error for invalid email input", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email"
        });
        tester.userInput("random text");
      }).then(function () {
        let validationMessage = widget.validate();
        const expectedValidationMessage = tester.element.control.validationMessage;
        assert.equal(validationMessage, expectedValidationMessage,
          "Validation message should match the native email validation message.");
      });
    });

    it("should return validation error when value is less than minlength", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "text",
          "value": ""
        });
        tester.dataUpdate({
          "html:minlength": 2,
          "html:maxlength": 10
        });
        tester.userInput("a");
      }).then(function () {
        let validationMessage = widget.validate();
        const expectedValidationMessage = "Please lengthen this text to 2 characters or more (you are currently using 1 characters).";
        assert.equal(validationMessage, expectedValidationMessage,
          "Validation message should match the expected minlength validation message.");
      });
    });
  });

  describe("Reset properties", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("should reset newer properties to initial values when initial values exist", function () {
      const initialValues = {
        "html:spellcheck": true,
        "html:disabled": true,
        "label-text": "Initial label",
        "changebutton": true,
        "changebutton:value": "Initial action",
        "changebutton:icon": "Clock",
        "changebutton:icon-position": "start"
      };

      return asyncRun(function () {
        tester.dataInit(null, null, null, initialValues);
      })
        .then(function () {
          return asyncRun(function () {
            tester.dataUpdate({
              "html:spellcheck": false,
              "html:disabled": false,
              "label-text": "Updated label",
              "changebutton": false,
              "changebutton:value": "Updated action",
              "changebutton:icon": "PublicEmail",
              "changebutton:icon-position": "end"
            });
          });
        })
        .then(function () {
          const changeButton = element.querySelector("fluent-button.u-sw-changebutton");
          const labelElement = element.querySelector("span.u-label-text");
          const textElement = changeButton.querySelector("span.u-text");
          const iconElement = changeButton.querySelector("span.u-icon");
          assert(changeButton.hidden, "Change button should be hidden before reset after setting changebutton to false.");
          expect(element.spellcheck, "Spellcheck should reflect the updated value before reset.").to.be.false;
          assert(!element.hasAttribute("disabled"), "Text field should reflect updated html:disabled=false before reset.");
          assert(labelElement, "Label text element should be present.");
          expect(labelElement.innerText, "Label text should reflect the updated value before reset.").to.equal("Updated label");
          assert(!labelElement.hasAttribute("hidden"), "Label text should be visible when updated before reset.");
          expect(textElement.innerText, "Change button text should reflect the updated value before reset.").to.equal("Updated action");
          assert(iconElement.classList.contains("ms-Icon--PublicEmail"), "Change button icon should reflect the updated icon before reset.");
          expect(iconElement.getAttribute("slot"), "Change button icon slot should reflect the updated value before reset.").to.equal("end");
        })
        .then(function () {
          return asyncRun(function () {
            tester.resetWidget();
          });
        })
        .then(function () {
          const changeButton = element.querySelector("fluent-button.u-sw-changebutton");
          const labelElement = element.querySelector("span.u-label-text");
          assert(!changeButton.hidden, "Change button should be visible after reset to initial values.");
          expect(element.spellcheck, "Spellcheck should be reset to its initial value.").to.be.true;
          assert(element.hasAttribute("disabled"), "Text field should be reset to initial html:disabled=true.");
          assert(labelElement, "Label text element should be present after reset.");
          expect(labelElement.innerText, "Label text should be reset to its initial value.").to.equal("Initial label");
          assert(!labelElement.hasAttribute("hidden"), "Label text should be visible after reset to initial value.");
        });
    });

    it("should reset newer properties to defaults when no initial values exist", function () {
      return asyncRun(function () {
        tester.dataInit(null, null, null, {});
      })
        .then(function () {
          return asyncRun(function () {
            tester.dataUpdate({
              "html:spellcheck": true,
              "html:disabled": true,
              "label-text": "Updated label",
              "changebutton": true,
              "changebutton:value": "Updated action",
              "changebutton:icon": "Clock",
              "changebutton:icon-position": "start"
            });
          });
        })
        .then(function () {
          const changeButton = element.querySelector("fluent-button.u-sw-changebutton");
          const labelElement = element.querySelector("span.u-label-text");
          assert(element.hasAttribute("disabled"), "Text field should reflect updated html:disabled=true before reset.");
          assert(labelElement, "Label text element should be present before reset.");
          expect(labelElement.innerText, "Label text should reflect updated value before reset.").to.equal("Updated label");
          assert(!labelElement.hasAttribute("hidden"), "Label text should be visible before reset.");
          assert(!changeButton.hidden, "Change button should be visible before reset after setting changebutton to true.");
          expect(element.spellcheck, "Spellcheck should reflect the updated value before reset.").to.be.true;
        })
        .then(function () {
          return asyncRun(function () {
            tester.resetWidget();
          });
        })
        .then(function () {
          const labelElement = element.querySelector("span.u-label-text");
          expect(element.spellcheck, "Spellcheck should be reset to its default value.").to.be.false;
          assert(!element.hasAttribute("disabled"), "Text field should be reset to default html:disabled=false.");
          assert(labelElement, "Label text element should exist after reset.");
          expect(labelElement.innerText, "Label text should be reset to default empty value.").to.equal("");
          assert(labelElement.hasAttribute("hidden"), "Label text should be hidden after reset to default values.");
        });
    });

    it("should reset only selected newer properties and leave the others unchanged", function () {
      const initialValues = {
        "html:spellcheck": true,
        "html:disabled": true,
        "label-text": "Initial label",
        "changebutton": true,
        "changebutton:value": "Initial action",
        "changebutton:icon-position": "start"
      };

      return asyncRun(function () {
        tester.dataInit(null, null, null, initialValues);
      })
        .then(function () {
          return asyncRun(function () {
            tester.dataUpdate({
              "html:spellcheck": false,
              "html:disabled": false,
              "label-text": "Updated label",
              "changebutton": false,
              "changebutton:value": "Updated action",
              "changebutton:icon": "Clock",
              "changebutton:icon-position": "end"
            });
          });
        })
        .then(function () {
          const changeButton = element.querySelector("fluent-button.u-sw-changebutton");
          const labelElement = element.querySelector("span.u-label-text");
          const textElement = changeButton.querySelector("span.u-text");
          const iconElement = changeButton.querySelector("span.u-icon");
          expect(element.spellcheck, "Spellcheck should reflect updated value before selected reset.").to.be.false;
          assert(!element.hasAttribute("disabled"), "Text field should reflect updated html:disabled=false before selected reset.");
          assert(labelElement, "Label text element should be present before selected reset.");
          expect(labelElement.innerText, "Label text should reflect updated value before selected reset.").to.equal("Updated label");
          assert(!labelElement.hasAttribute("hidden"), "Label text should be visible before selected reset.");
          assert(changeButton.hidden, "Change button should reflect updated changebutton=false before selected reset.");
          expect(textElement.innerText, "Change button text should reflect updated value before selected reset.").to.equal("Updated action");
          expect(iconElement.getAttribute("slot"), "Change button icon slot should reflect updated value before selected reset.").to.equal("end");
          assert(iconElement.classList.contains("ms-Icon--Clock"), "Change button icon should reflect updated icon before selected reset.");
        })
        .then(function () {
          return asyncRun(function () {
            tester.resetWidget(["html:spellcheck", "changebutton", "changebutton:value"]);
          });
        })
        .then(function () {
          const changeButton = element.querySelector("fluent-button.u-sw-changebutton");
          const labelElement = element.querySelector("span.u-label-text");
          const textElement = changeButton.querySelector("span.u-text");
          const iconElement = changeButton.querySelector("span.u-icon");
          expect(element.spellcheck, "Spellcheck should be reset to its initial value.").to.be.true;
          assert(!element.hasAttribute("disabled"), "Text field disabled state should remain unchanged when html:disabled is not part of selected reset.");
          assert(labelElement, "Label text element should exist after selected reset.");
          expect(labelElement.innerText, "Label text should remain unchanged when label-text is not part of selected reset.").to.equal("Updated label");
          assert(!labelElement.hasAttribute("hidden"), "Label text visibility should remain unchanged when label-text is not part of selected reset.");
          assert(!changeButton.hidden, "Change button visibility should be reset to its initial value.");
          expect(textElement.innerText, "Change button text should be reset to its initial value.").to.equal("Initial action");
          expect(iconElement.getAttribute("slot"), "Change button icon slot should remain unchanged when it is not reset.").to.equal("end");
        });
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
          "value": "Before reuse",
          "label-text": "Reusable label",
          "html:disabled": true,
          "html:spellcheck": true,
          "html:appearance": "filled",
          "html:tabindex": -1,
          "class:class-test": true
        });
      }).then(function () {
        // Step 2: Verify properties are applied before reuse.
        const labelElement = element.querySelector("span.u-label-text");
        expect(tester.widget.getValue(), "Value should match before reuse.").to.equal("Before reuse");
        expect(labelElement.innerText, "Label text should match before reuse.").to.equal("Reusable label");
        assert(!labelElement.hasAttribute("hidden"), "Label text should be visible before reuse.");
        expect(element.hasAttribute("disabled"), "Text field should be disabled before reuse.").to.be.true;
        expect(element.spellcheck, "Spellcheck should be true before reuse.").to.be.true;
        expect(element.getAttribute("appearance"), "Appearance should be filled before reuse.").to.equal("filled");
        expect(element.getAttribute("tabindex"), "Tabindex should be -1 before reuse.").to.equal("-1");
        expect(element.classList.contains("class-test"), "Text field should have class-test before reuse.").to.be.true;

        // Step 3: Simulate Uniface widget reuse by re-initializing to defaults.
        return asyncRun(function () {
          tester.dataInit();
        });
      }).then(function () {
        // Step 4: Verify all tested properties are reset to defaults.
        const labelElement = element.querySelector("span.u-label-text");
        expect(tester.widget.getValue(), "Value should reset to default empty string after reuse.").to.equal("");
        expect(labelElement.innerText, "Label text should reset to default empty value after reuse.").to.equal("");
        assert(labelElement.hasAttribute("hidden"), "Label text should be hidden after reuse.");
        expect(element.hasAttribute("disabled"), "Text field should not be disabled after reuse.").to.be.false;
        expect(element.spellcheck, "Spellcheck should reset to false after reuse.").to.be.false;
        expect(element.classList.contains("class-test"), "Text field should retain class-test after dataInit-only reuse simulation.").to.be.true;
        expect(element.getAttribute("appearance"), "Appearance should reset to default outline after reuse.").to.equal("outline");
        expect(element.getAttribute("tabindex"), "Tabindex should reset to default 0 after reuse.").to.equal("0");
      });
    });
  });

})();
