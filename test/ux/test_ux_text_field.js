
(function () {
  'use strict';

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

  describe("Uniface Mockup tests", function () {

    it("Get class " + widgetName, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor definition", function () {

    it('should have a static property structure of type Element', function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal('fluent-text-field');
      expect(structure.styleClass).to.equal('');
      expect(structure.elementQuerySelector).to.equal('');
      expect(structure.attributeDefines).to.be.an('array');
      expect(structure.elementDefines).to.be.an('array');
      expect(structure.triggerDefines).to.be.an('array');
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
    });

  });

  describe(widgetName + ".processLayout", function () {
    let element;

    it("processLayout", function () {
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

      it("check u-prefix", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element");
      });

      it("check u-suffix", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element");
      });

      it("check u-error-icon", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element");
      });

      it("check u-sw-changebutton", function () {
        assert(element.querySelector("fluent-button.u-sw-changebutton"), "Widget misses or has incorrect u-sw-changebutton element");
      });

      it("check u-icon", function () {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
      });

      it("check u-text", function () {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
      });

    });

  });

  describe("Create widget", function () {

    before(function () {
      tester.construct();
    });

    it("constructor", function () {
      try {
        const widget = tester.construct();
        assert(widget, "widget is not defined!");
        const widgetClass = tester.getWidgetClass();
        assert(widgetClass.defaultValues['class:u-text-field'], "Class is not defined");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });

    it("onConnect", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "widget is not connected");
    });

  });

  describe("mapTrigger", function () {
    const element = tester.processLayout();
    const widget = tester.onConnect();

    it("mapTrigger", function () {
      widget.mapTrigger("onchange");
      const event = new window.Event('onchange');
      element.dispatchEvent(event);
      assert(widget.elements.widget === element, "widget is not connected");
    });

  });

  describe('Text Field onchange event', function () {
    let textFieldElement, onChangeSpy;

    beforeEach(function () {
      tester.createWidget();
      textFieldElement = tester.element;

      // Create a spy for the onchange event
      onChangeSpy = sinon.spy();

      // Add the onchange event listener to the number field element
      textFieldElement.addEventListener('onchange', onChangeSpy);
    });

    // Clean up after each test
    afterEach(function () {
      // Restore the spy to its original state
      sinon.restore();
    });

    // Test case for the on change event
    it('should call the onchange event handler when the Text Field  is changed', function () {
      // Simulate a onchange event
      const event = new window.Event('onchange');
      textFieldElement.dispatchEvent(event);

      // Assert that the onchange event handler was called once
      expect(onChangeSpy.calledOnce).to.be.true;
    });

  });

  describe("Data Init", function () {
    const defaultValues = tester.getDefaultValues();
    const classes = Object.keys(defaultValues).reduce((accumulator, key) => {
      if (key.startsWith("class:")) {
        let newKey = key.replace("class:", "");
        accumulator[newKey] = defaultValues[key];
      }
      return accumulator;
    }, {});
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
      assert(element.querySelector('span.u-text').hasAttribute('hidden'), "Text span element should be hidden by default");
      assert(element.querySelector('span.u-icon').hasAttribute('hidden'), "Icon span element should be hidden by default");
    });

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check 'tabindex' attributes", function () {
      assert(element.hasAttribute('tabindex'), "tabindex element should be present by default");
      assert.equal(element.getAttribute('tabindex'), "0", "tabindex element should be outline by default");
    });

    it("check 'size'", function () {
      assert.equal(defaultValues["html:size"], '20', "Default value of size should be '20'");
    });

    it("check label-text, label-position ,changebutton", function () {
      assert.equal(defaultValues["changebutton"], false, "Default value of change button should be false");
      assert.equal(defaultValues["label-position"], 'above', "Default value of label-position will be above");
      assert.equal(defaultValues["label-text"], undefined, "Default value of label-text will be undefined");
    });

    it("check type attributes", function () {
      assert(element.hasAttribute('type'), "Text span element should be hidden by default");
      assert.equal(element.getAttribute('type'), "text", "Type element should be text by default");
    });

    it("check appearance attributes", function () {
      assert(element.hasAttribute('appearance'), "appearance element should be present by default");
      assert.equal(element.getAttribute('appearance'), "outline", "appearance element should be outline by default");
    });

    it("check changebutton icon-position", function () {
      assert.equal(defaultValues["changebutton:icon-position"], 'end', "Default value of change button icon-position should be end");
    });

    it("check changebutton tab-index, appearance", function () {
      assert.equal(defaultValues["changebutton:html:tabindex"], "-1", "Default value of change button tab-index should be -1");
      assert.equal(defaultValues["changebutton:html:appearance"], "stealth", "Default value of change button appearance should be stealth");
    });

    it("check value", function () {
      assert.equal(tester.defaultValues.value, '', "Default value of attribute value should be ''");
    });

  });

  describe("dataUpdate", function () {
    let widget;
    before(function () {
      widget = tester.createWidget();
    });

    it("set appearance set to filled", function () {
      let appearance = 'filled';
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = widget.elements.widget.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "appearance is not set to filled");//Check for visibility
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance attribute");
      });
    });

    it("set appearance set to outline", function () {
      let appearance = 'outline';
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": appearance
        });
      }).then(function () {
        let appearanceVal = widget.elements.widget.getAttribute("appearance");
        assert.equal(appearanceVal, appearance, "appearance is not set to outline");//Check for visibility
        assert(widget.elements.widget.hasAttribute("appearance"), "Failed to show the appearance attribute");
      });
    });

    it("set disabled to true", function () {
      let disabled = true;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field disabled", "Disabled class is not applied");
        assert(widget.elements.widget.hasAttribute("disabled"), "Failed to show the disabled attribute");
      });
    });

    it("set disabled to false", function () {
      let disabled = false;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": disabled
        });
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field", "Disabled class is applied");
        assert(!widget.elements.widget.hasAttribute("disabled"), "Failed to hide the disabled attribute");
      });
    });

    it("set readonly to true", function () {
      let readonly = true;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field readonly", "readonly class is not applied");
        assert(widget.elements.widget.hasAttribute("readonly"), "Failed to show the readonly attribute");
      });
    });

    it("set readonly to false", function () {
      let readonly = false;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": readonly
        });
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field", "readonly class is applied");
        assert(!widget.elements.widget.hasAttribute("readonly"), "Failed to hide the readonly attribute");
      });
    });

    it("set hidden to true", function () {
      let hidden = true;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        }
        );
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field hidden", "hidden class is not applied");
        assert(widget.elements.widget.hasAttribute("hidden"), "Failed to show the hidden attribute");
      });
    });

    it("set hidden to false", function () {
      let hidden = false;
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": hidden
        });
      }).then(function () {
        assert(widget.elements.widget.className, "outline u-text-field", "hidden class is applied");
        assert(!widget.elements.widget.hasAttribute("hidden"), "Failed to hide the hidden attribute");
      });
    });


    it("prefix text property", function () {
      let prefixTextData = 'prefixTextData';
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        }
        );
      }).then(function () {
        assert.equal(widget.elements.widget.innerText, prefixTextData, "Prefix data does not match");//Check for visibility
      });
    });

    it("prefix icon property", function () {
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(widget.elements.widget.childNodes[1].className, "u-prefix ms-Icon ms-Icon--Accounts", "widget element doesn't has class u-prefix ms-Icon ms-Icon--Accounts");
      });
    });

    it("suffix text property", function () {
      let suffixTextData = 'suffixTextData';
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-text": suffixTextData
        });
      }).then(function () {
        assert.equal(widget.elements.widget.innerText, suffixTextData, "Suffix data does not match");//Check for visibility
      });
    });

    it("suffix icon property", function () {
      // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(widget.elements.widget.childNodes[3].className, "u-suffix ms-Icon ms-Icon--Accounts", "widget element doesn't has class u-suffix ms-Icon ms-Icon--Accounts");
      });
    });

    it("set pattern '.{2,}'", function () {
      let patternText = ".{2,}";
      let placeHolderText = "Please match requested format.";
      let title = "Two or more characters";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:pattern": patternText,
          "html:type": "text",
          "html:title": title,
          value: 1234
        });
      }).then(function () {
        //const event = new window.Event('hover');
        //widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("pattern"), patternText, "Failed to show the pattern attribute and value doesnot match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert.equal(widget.elements.widget.getAttribute("title"), title, "Failed to show the title attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("pattern"), "Failed to show the pattern attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set pattern [A-Za-z]{3}", function () {
      let pattern = "[A-Za-z]{3}";
      let placeHolderText = "Please match requested format.";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          value: ""
        });
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:pattern": pattern,
          "html:type": "text",
          value: "abc"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("pattern"), pattern, "Failed to show the pattern attribute and value doesnot match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("pattern"), "Failed to show the pattern attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set placeholder in textField", function () {
      let placeHolderText = "Please match requested format.";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          value: ""
        });
        tester.dataUpdate({
          "html:placeholder": placeHolderText,
          "html:type": "text"
          //value: "Value input"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        //assert.equal(widget.elements.widget.getAttribute("pattern"),pattern ,"Failed to show the pattern attribute and value doesnot match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        //assert(widget.elements.widget.hasAttribute("pattern"), "Failed to show the pattern attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set type as tel in textField", function () {
      let placeHolderText = "Input Mobile Number";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "AddPhone",
          "prefix-text": "Call Me",
          "html:placeholder": placeHolderText,
          "html:type": "tel"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("type"), "tel", "Failed to show the tel attribute and value does not match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("type"), "Failed to show the tel attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set type as email in textField", function () {
      let placeHolderText = "Input Email ID";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PublicEmail",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "email",
          //value: "test@test.com"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("type"), "email", "Failed to show the type as email attribute and value does not match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("type"), "Failed to show the email attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set type as password in textField", function () {
      let placeHolderText = "Input Password";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "PasswordField",
          //"suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "password"
          //value: "test@test.com"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("type"), "password", "Failed to show the type as password attribute and value does not match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("type"), "Failed to show the type as password attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set type as url in textField", function () {
      let placeHolderText = "Input url";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "URLBlock",
          //"suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "url"
          //value: "test@test.com"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("type"), "url", "Failed to show the tye as url attribute and value does not match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("type"), "Failed to show the type as url attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set type as date in textField", function () {
      let placeHolderText = "Input date";
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "DateTime",
          "suffix-text": "Customer Email Address",
          "html:placeholder": placeHolderText,
          "html:type": "date"
          //value: "test@test.com"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.getAttribute("type"), "date", "Failed to show the date attribute and value does not match");
        assert.equal(widget.elements.widget.getAttribute("placeholder"), placeHolderText, "Failed to show the placeHolderText attribute and value doesnot match");
        assert(widget.elements.widget.hasAttribute("type"), "Failed to show the type as date attribute");
        assert(widget.elements.widget.hasAttribute("placeholder"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("set button as subwidget in textField", function () {
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail",
          "changebutton:icon-position": "start",
          "changebutton:value": "Click Me"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget Class name doesnot match");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute('slot'), "start", "Failed to show the slot  attribute and value does not match");
        assert(widget.elements.widget.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value doesnot match");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon Class name doesnot match");
      });
    });

    it("set button as subwidget in textField with change button icon", function () {
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": true,
          "changebutton:icon": "PublicEmail"
          //"changebutton:icon-position" : "start",
          //"changebutton:value":"Click Me"
        });
      }).then(function () {
        const event = new window.Event('hover');
        widget.elements.widget.dispatchEvent(event);
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget Class name doesnot match");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute('slot'), "start", "Failed to show the slot  attribute and value does not match");
        assert(widget.elements.widget.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value doesnot match");
        assert.equal(widget.elements.widget.childNodes[4].childNodes[0].getAttribute("class"), "u-icon ms-Icon ms-Icon--PublicEmail", "Subwidget icon Class name doesnot match");
      });
    });

    it("set button as subwidget in textField with change button icon as false", function () {
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "changebutton": false,
          "changebutton:icon": "PublicEmail"
        });
      }).then(function () {
        assert.equal(widget.elements.widget.childNodes[4].getAttribute("class"), "u-sw-changebutton u-button stealth", "Subwidget Class name doesnot match");
        assert(widget.elements.widget.childNodes[4].childNodes[0].hasAttribute("slot"), "Failed to show the placeHolderText attribute and value doesnot match");
      });
    });

    it("show label", function () {
      let textFieldLabel = 'Label';
      // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": textFieldLabel
        });
      }).then(function () {
        let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, textFieldLabel);//Check for visibility
        assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text");
      });
    });

    it("Set label position before", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "before"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'before');
      });
    });

    it("check label position before styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
      assert.equal(displayPropertyValue, "inline-flex");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let alignPropertyValue = labelStyle.getPropertyValue("align-content");
      assert.equal(alignPropertyValue, "center");
    });

    it("Set label position below", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'below');
      });
    });

    it("check label position below styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
      let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
      let orderPropertyValue = labelStyle.getPropertyValue("order");
      assert.equal(orderPropertyValue, 2);
    });

    it("reset label and its position", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": uniface.RESET,
          "label-text": uniface.RESET
        });
      }).then(function () {
        let labelPosition = widget.elements.widget.getAttribute('u-label-position');
        assert.equal(labelPosition, 'above');
        assert(widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text");
        assert.equal(widget.elements.widget.querySelector("span.u-label-text").innerText, "");
      });
    });

    it("check reset label position styles", function () {
      // if u-label-position attribute is added element display is changed
      let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
      let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
      assert.equal(flexPropertyValue, "column");
    });
  });

  describe("showError", function () {
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
        expect(widget.elements.widget.hasAttribute("maxlength"), "Failed to show the maxlength attribute");
        expect(widget.elements.widget.hasAttribute("minlength"), "Failed to show the minlength attribute");
        assert.equal(widget.elements.widget.getAttribute("minlength"), minlength, "Min is not same" + minlength);
        assert.equal(widget.elements.widget.getAttribute("maxlength"), maxlength, "Max is not same" + maxlength);
      });
    });

    it("Set invalid value in text field", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          error: true,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        expect(widget.elements.widget).to.have.class("u-invalid");
        assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
        assert.equal(widget.elements.widget.childNodes[2].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot"), "end", "Slot end  does not match");
        assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.", "Error title doesnot match");
      });
    });
  });

  describe("hideError", function () {
    let widget, element;
    before(function () {
      widget = tester.createWidget();
      element = tester.createWidget().element;
      verifyWidgetClass(widgetClass);
    });
    it("Hide Error Set invalid value in text field", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          error: false,
          "error-message": ""
        });
      }).then(function () {
        widget.hideError("");
        expect(widget.elements.widget).to.not.have.class("u-invalid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
        assert(widget.elements.widget.childNodes[2].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("slot"), "slot attribute is not present");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("title"), "title attribute is not present");
      });
    });
  });

  describe("getValueFormatted", function () {
    let widget, properties, valueProperty;
    before(function () {
      widget = tester.createWidget();
      properties = tester.widget.data;
    });

    it("Verify single line value matches primaryPlainText returned by getValueFormatted", function () {
      valueProperty = "Single line value";
      return asyncRun(function () {
        tester.dataUpdate({
          value: valueProperty
        });
      }).then(function () {
        let valueFormatted = widgetClass.getValueFormatted(properties);
        assert.equal(valueFormatted.primaryPlainText, valueProperty);
      });
    });

    it("Verify the value returned by getValueFormatted doesn't include the line breaks", function () {
      valueProperty = `testing value with multiple lines: line 1, line 2`;
      return asyncRun(function () {
        tester.dataUpdate({
          value: valueProperty
        });
      }).then(function () {
        const expectedValue = "testing value with multiple lines: line 1, line 2";
        let valueFormatted = widgetClass.getValueFormatted(properties);
        assert.equal(valueFormatted.primaryPlainText, expectedValue);
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, "Failed to reset the properties, exception " + e);
      }
    });
  });

})();
