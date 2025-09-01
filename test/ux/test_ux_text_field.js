
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
      expect(structure.tagName).to.equal("fluent-text-field");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
    });

  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
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
        const customElementNames = ["fluent-text-field","fluent-button"];
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

      it("check u-prefix", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element.");
      });

      it("check u-suffix", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element.");
      });

      it("check u-error-icon", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element.");
      });

      it("check u-sw-changebutton", function () {
        assert(element.querySelector("fluent-button.u-sw-changebutton"), "Widget misses or has incorrect u-sw-changebutton element.");
      });

      it("check u-icon", function () {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element.");
      });

      it("check u-text", function () {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element.");
      });

    });

  });

  describe("Create widget", function () {

    before(function () {
      tester.construct();
    });

    it("constructor()", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        const widgetClass = tester.getWidgetClass();
        assert(widgetClass.defaultValues["class:u-text-field"], "Class is not defined!");
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

  describe("Text field onchange trigger", function () {
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

    // Test case for the change event by user input.
    it("should call the onchange trigger handler when the text field is changed", function () {
      // Simulate a change event.
      const inputValue = "Hello";
      tester.userInput(inputValue);

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the widget value is the inputValue.
      expect(tester.widget.getValue()).to.equal(inputValue, "Widget value");
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
      it(`check class '${defaultClass}'`, function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          expect(element).not.to.have.class(defaultClass, `Widget element has no class ${defaultClass}.`);
        }
      });
    }

    it("check 'hidden' attributes", function () {
      assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span element should be hidden by default.");
      assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check 'tabindex' attributes", function () {
      assert(element.hasAttribute("tabindex"), "Tabindex attribute should be present by default.");
      assert.equal(element.getAttribute("tabindex"), "0", "Default value of tabindex attribute should be 'outline'.");
    });

    it("check 'size'", function () {
      assert.equal(defaultValues["html:size"], "20", "Default value of size should be '20'.");
    });

    it("check label-text, label-position, changebutton", function () {
      assert.equal(defaultValues["changebutton"], false, "Default value of change button should be false.");
      assert.equal(defaultValues["label-position"], "above", "Default value of label-position should be above.");
      assert.equal(defaultValues["label-text"], undefined, "Default value of label-text should be undefined.");
    });

    it("check type attributes", function () {
      assert(element.hasAttribute("type"), "Type attribute should be present by default.");
      assert.equal(element.getAttribute("type"), "text", "Default value of type attribute should be 'text'.");
    });

    it("check appearance attributes", function () {
      assert(element.hasAttribute("appearance"), "Appearance attribute should be present by default.");
      assert.equal(element.getAttribute("appearance"), "outline", "Default value of appearance attribute should be 'outline'.");
    });

    it("check changebutton icon-position", function () {
      assert.equal(defaultValues["changebutton:icon-position"], "end", "Default value of change button icon-position should be 'end'.");
    });

    it("check changebutton tab-index, appearance", function () {
      assert.equal(defaultValues["changebutton:html:tabindex"], "-1", "Default value of change button tab-index should be '-1'.");
      assert.equal(defaultValues["changebutton:html:appearance"], "stealth", "Default value of change button appearance should be 'stealth'.");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, "", "Default value of attribute value should be ''.");
    });

    it("check delegated property disabled", function () {
      assert.equal(tester.widget.subWidgetDefinitions["changebutton"].delegatedProperties, "html:disabled", "Delegated property html:disabled is not present.");
    });

  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("set appearance set to filled", function () {
      let appearance = "filled";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = element.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "Appearance is not set to filled."); // Check for visibility.
        assert(element.hasAttribute("appearance"), "Failed to show the appearance attribute.");
      });
    });

    it("set appearance set to outline", function () {
      let appearance = "outline";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = element.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "Appearance is not set to outline."); // Check for visibility.
        assert(element.hasAttribute("appearance"), "Failed to show the appearance attribute.");
      });
    });

    it("set disabled to true", function () {
      let disabled = true;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        assert(element.className, "outline u-text-field disabled", "Disabled class is not applied.");
        assert(element.hasAttribute("disabled"), "Failed to show the disabled attribute.");
      });
    });

    it("set disabled to false", function () {
      let disabled = false;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        assert(element.className, "outline u-text-field", "Disabled class is applied.");
        assert(!element.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
      });
    });

    it("set readonly to true", function () {
      let readonly = true;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        assert(element.className, "outline u-text-field readonly", "The readonly class is not applied.");
        assert(element.hasAttribute("readonly"), "Failed to show the readonly attribute.");
      });
    });

    it("set readonly to false", function () {
      let readonly = false;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        assert(element.className, "outline u-text-field", "The readonly class is applied.");
        assert(!element.hasAttribute("readonly"), "Failed to hide the readonly attribute.");
      });
    });

    it("set hidden to true", function () {
      let hidden = true;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        }
        );
      }).then(function () {
        assert(element.className, "outline u-text-field hidden", "Hidden class is not applied.");
        assert(element.hasAttribute("hidden"), "Failed to show the hidden attribute.");
      });
    });

    it("set hidden to false", function () {
      let hidden = false;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        });
      }).then(function () {
        assert(element.className, "outline u-text-field", "Hidden class is applied.");
        assert(!element.hasAttribute("hidden"), "Failed to hide the hidden attribute.");
      });
    });


    it("prefix text property", function () {
      let prefixTextData = "prefixTextData";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        }
        );
      }).then(function () {
        assert.equal(element.innerText, prefixTextData, "Prefix data does not match."); // Check for visibility.
      });
    });

    it("prefix icon property", function () {
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(element.childNodes[1].className, "u-prefix ms-Icon ms-Icon--Accounts", "Widget element doesn't has class u-prefix ms-Icon ms-Icon--Accounts.");
      });
    });

    it("suffix text property", function () {
      let suffixTextData = "suffixTextData";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        assert.equal(element.innerText, suffixTextData, "Suffix data does not match."); // Check for visibility.
      });
    });

    it("suffix icon property", function () {
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(element.childNodes[3].className, "u-suffix ms-Icon ms-Icon--Accounts", "Widget element doesn't has class u-suffix ms-Icon ms-Icon--Accounts.");
      });
    });

    it("set pattern '.{2,}'", function () {
      let patternText = ".{2,}";
      let placeHolderText = "Please match requested format.";
      let title = "Two or more characters";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
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

    it("set pattern [A-Za-z]{3}", function () {
      let pattern = "[A-Za-z]{3}";
      let placeHolderText = "Please match requested format.";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
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
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("pattern"), pattern, "Failed to show the pattern attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("pattern"), "Failed to show the pattern attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set placeholder in text field", function () {
      let placeHolderText = "Please match requested format.";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:type": "text"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set type as tel in text field", function () {
      let placeHolderText = "Input Mobile Number";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "AddPhone",
          "prefix-text": "Call Me",
          "html:placeholder": placeHolderText,
          "html:type": "tel"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("type"), "tel", "Failed to show the tel attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"),placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the tel attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set type as email in text field", function () {
      let placeHolderText = "Input Email ID";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PublicEmail",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "email"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("type"), "email", "Failed to show the type as email attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the email attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set invalid email in text field to cause html validation error and then try to set the field in readonly mode", function () {
      const warnSpy = sinon.spy(console, "warn");
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email"
        });
        tester.userInput("invalid");
      }).then(function () {
        expect(element.checkValidity()).to.be.false;
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        // When html validation error is present, the widget should not be set in readonly mode.
        assert(!element.readOnly, "The widget has been set in readonly mode.");
        // Note: The actual error message is not checked as part of the test case as the html validation error message is browser dependent.
        expect(warnSpy.calledWith(sinon.match("Unable to set the widget in readonly mode as invalid value present"))).to.be.true;
        warnSpy.restore();

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();

        // Clear the user input for future test cases.
        tester.userInput("");
      });
    });

    it("set type as password in text field", function () {
      let placeHolderText = "Input Password";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PasswordField",
          "html:placeholder": placeHolderText,
          "html:type": "password"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("type"), "password", "Failed to show the type as password attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as password attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set type as url in text field", function () {
      let placeHolderText = "Input url";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "URLBlock",
          "html:placeholder": placeHolderText,
          "html:type": "url"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("type"), "url", "Failed to show the tye as url attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as url attribute.");
        assert(element.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set type as date in text field", function () {
      let placeHolderText = "Input date";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "DateTime",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "date"
          // value: "test@test.com"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.getAttribute("type"), "date", "Failed to show the date attribute and value does not match.");
        assert.equal(element.getAttribute("placeholder"),placeHolderText ,"Failed to show the placeHolderText attribute and value does not match.");
        assert(element.hasAttribute("type"), "Failed to show the type as date attribute.");
        assert(element.hasAttribute("placeholder"),"Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set button as subwidget in text field", function () {
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail",
          "changebutton:icon-position": "start",
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("slot"), "start", "Failed to show the slot attribute and value does not match.");
        assert(element.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon class name does not match.");
      });
    });

    it("set button as subwidget in text field with change button icon", function () {
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail",
          "changebutton:icon-position" : "start",
          "changebutton:value":"Click Me"
        });
      }).then(function () {
        const event = new window.Event("hover");
        element.dispatchEvent(event);
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("slot"), "start", "Failed to show the slot attribute and value does not match.");
        assert(element.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value does not match.");
        assert.equal(element.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon class name does not match.");
      });
    });

    it("set button as subwidget in textField with change button icon as false", function () {
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": false,
          "changebutton:icon": "PublicEmail"
        });
      }).then(function () {
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert(element.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value does not match.");
      });
    });

    it("set button as subwidget in textField with textfield disabled as true", function () {
      let disabled = true;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        assert(element.className, "outline u-text-field disabled", "Disabled class is not applied.");
        assert(element.hasAttribute("disabled"), "Failed to show the disabled attribute.");
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth disabled", "Subwidget class name does not match.");
        assert(element.childNodes[4].hasAttribute("disabled"), "Failed to show the disabled attribute.");
      });
    });

    it("set button as subwidget in textField with textfield disabled as false", function () {
      let disabled = false;
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled,
          "changebutton": true,
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        assert(element.className, "outline u-text-field", "Disabled class is applied.");
        assert(!element.hasAttribute("disabled"), "Failed to hide the disabled attribute.");
        assert.equal(element.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget class name does not match.");
        assert(!element.childNodes[4].hasAttribute("disabled"), "Failed to hide the disabled attribute.");
      });
    });

    it("show label", function () {
      let textFieldLabel = "Label";
      // Calling mock dataUpdate() to have updated widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, textFieldLabel); // Check for visibility.
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");
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
      let textFieldLabel = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below",
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "below");
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
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "above");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "");
      });
    });

    it("check reset label position styles", function () {
      // If u-label-position attribute is added element display is changed.
      let numberFieldStyle = window.getComputedStyle(element, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });

    it("setting minlength and maxlength", function () {
      let minlength = 2;
      let maxlength = 5;

      return asyncRun(function () {
        tester.dataUpdate({
          "html:minlength": minlength,
          "html:maxlength": maxlength
        });
      }).then(function () {
        expect(element.hasAttribute("maxlength"), "Failed to show the maxlength attribute.");
        expect(element.hasAttribute("minlength"), "Failed to show the minlength attribute.");
        assert.equal(element.getAttribute("minlength"), minlength, `Min is not same ${minlength}.`);
        assert.equal(element.getAttribute("maxlength"), maxlength, `Max is not same ${maxlength}.`);
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

    it("set invalid value in text field", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(element).to.have.class("u-invalid");
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
    it("hide error: set invalid value in text field", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": ""
        });
      }).then(function () {
        widget.hideError("");
        expect(element).to.not.have.class("u-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(element.childNodes[2].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("slot"), "The slot attribute is not present.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("title"), "The title attribute is not present.");
      });
    });
  });

  describe("getValueFormatted()", function () {
    let widget, properties, valueProperty;
    before(function () {
      widget = tester.createWidget();
      properties = widget.data;
    });

    it("verify single line value matches primaryPlainText returned by getValueFormatted()", function () {
      valueProperty = "Single line value";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": valueProperty
        });
      }).then(function () {
        let valueFormatted = widgetClass.getValueFormatted(properties);
        assert.equal(valueFormatted.primaryPlainText, valueProperty);
      });
    });

    it("verify the value returned by getValueFormatted() doesn't include the line breaks", function () {
      valueProperty = "testing value with multiple lines: line 1, line 2";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": valueProperty
        });
      }).then(function () {
        const expectedValue = "testing value with multiple lines: line 1, line 2";
        let valueFormatted = widgetClass.getValueFormatted(properties);
        assert.equal(valueFormatted.primaryPlainText, expectedValue);
      });
    });
  });

  describe("blockUI()", function () {
    let element, widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    it("check if the 'u-blocked' class is applied and ensure the widget is readOnly when the blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
        assert(element.readOnly, "Failed to set the widget in readonly mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement).to.have.class("u-blocked");
        assert(buttonElement.disabled, "Failed to disable the subwidget changebutton.");
        // Clear the ui-blocking for future test cases.
        widget.unblockUI();
      });
    });

    it("set invalid email in text field to cause html validation error and then call blockUI()", function () {
      const errorSpy = sinon.spy(console, "error");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:type": "email"
        });
        tester.userInput("invalid");
      }).then(function () {
        expect(element.checkValidity()).to.be.false;
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
        // When html validation error is present, widget should be set in disabled instead of readonly mode for ui-blocking.
        assert(!element.readOnly, "The widget has been set in readonly mode.");
        assert(element.disabled, "Failed to set the widget in disabled mode.");

        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement).to.have.class("u-blocked");
        assert(buttonElement.disabled, "Failed to disable the subwidget changebutton.");

        // Verify no errors are present.
        sinon.assert.notCalled(errorSpy);
        errorSpy.restore();
        // Clear the user input and ui-blocking for future test cases.
        tester.userInput("");
        widget.unblockUI();
      });
    });
  });

  describe("unblockUI()", function () {
    let element,widget;

    before(async function () {
      widget = tester.createWidget();
      element = tester.element;
      widget.blockUI();
    });

    it("check if the 'u-blocked' class is removed and ensure the widget is not readonly when the unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
        expect(element.readOnly).equal(false);
        let buttonElement = element.querySelector("fluent-button.u-sw-changebutton");
        expect(buttonElement).not.to.have.class("u-blocked");
        expect(buttonElement.hasAttribute("disabled")).to.be.false;
      });
    });

    it("check if the readonly mode is retained when the unblockUI() is called", function () {
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

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });

})();
