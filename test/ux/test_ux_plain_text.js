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

    it(`Get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("span");
      expect(structure.styleClass).to.equal("");
      expect(structure.isSetter).to.equal(true);
      expect(structure.hidden).to.equal(false);
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
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("check tagName", function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });

      it("check id", function () {
        expect(element).to.have.id(widgetId);
      });

      it("check u-prefix", function () {
        assert(element.querySelector("span.u-prefix"), "Widget misses or has incorrect u-prefix element.");
      });

      it("check u-suffix", function () {
        assert(element.querySelector("span.u-suffix"), "Widget misses or has incorrect u-suffix element.");
      });

      it("check u-control", function () {
        assert(element.querySelector("span.u-control"), "Widget misses or has incorrect u-control element.");
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
        assert(widgetClass.defaultValues["class:u-plain-text"], "Class is not defined!");
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

    it("defined mapTrigger() and onchange event", function () {
      widget.mapTrigger("onchange");
      const event = new window.Event("onchange");
      element.dispatchEvent(event);
      assert(widget.elements.widget === element, "Widget is not connected.");
    });
  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    var element;

    before(function () {
      tester.createWidget();
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
      assert(element.querySelector("span.u-prefix").hasAttribute("hidden"), "PlainText span.u-prefix element should be hidden by default.");
      assert(element.querySelector("span.u-control").hasAttribute("hidden"), "PlainText span.u-control element should be hidden by default.");
      assert(element.querySelector("span.u-suffix").hasAttribute("hidden"), "PlainText span.u-suffix element should be hidden by default.");
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
    let widget, element;
    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    it("empty initial value", function () {
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () { // check result
        let value = widget.data.value;
        assert.equal(value, "", "Value is not the same."); // Check for visibility.
      });
    });

    it("prefix-text property", function () {
      let prefixTextData = "prefixTextData";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-text": prefixTextData
        });
      }).then(function () {
        assert.equal(element.innerText, prefixTextData, "Prefix data does not match."); // Check for visibility.
      });

    });

    it("prefix-icon property", function () {
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "prefix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(element.childNodes[1].className, "u-prefix ms-Icon ms-Icon--Accounts", "Widget element doesn't have class u-prefix ms-Icon ms-Icon--Accounts.");
      });
    });

    it("suffix-text property", function () {
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

    it("suffix-icon property", function () {
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "suffix-icon": "Accounts"
        });
      }).then(function () {
        assert.equal(element.childNodes[4].className, "u-suffix ms-Icon ms-Icon--Accounts", "Widget element doesn't have class u-suffix ms-Icon ms-Icon--Accounts.");
      });
    });

    it("plaintext-format property when set to first-line", function () {
      let plainTextFormat = "first-line";
      let val = "Once you have all the widgets ready, the rest was mostly about setting the css styles";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting for the first-line data does not match.");// Check for visibility.
      });
    });

    it("plaintext-format property when set to single-line", function () {
      let plainTextFormat = "single-line";
      let val = "Single Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting for the single-line data does not match."); // Check for visibility.
      });
    });

    it("plaintext-format property when set to multi-line", function () {
      let plainTextFormat = "multi-line";
      let val = `Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                      Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles`;
      let innerHtml = `Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                      Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Multi Line Once you have all the widgets ready, the rest was mostly about setting the css styles`;
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        assert.equal(element.querySelector("span.u-control").className,"u-control" ,"u-control class name is not present.");
        assert.equal(innerHtml, element.childNodes[2].innerHTML,"The plain text formatting for the multi-line data does not match."); // Check for visibility.
      });
    });

    it("plaintext-format property when set to multi-paragraphs", function () {
      let plainTextFormat = "multi-paragraphs";
      let val = `Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                        Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                        Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                        Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                        Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                        Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles`;
      let p1Text = "Multi paragraphs Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles Single Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css stylesSingle Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        assert.equal(element.querySelector("span.u-control").children[0].className,"u-paragraph" ,"u-paragraph classname is not present.");
        assert.equal(element.childNodes[2].childElementCount, 6, "Paragraph count does not match.");
        assert.equal(element.querySelectorAll("p.u-paragraph")[0].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");// Check for visibility.
        assert.equal(element.querySelectorAll("p.u-paragraph")[1].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");
        assert.equal(element.querySelectorAll("p.u-paragraph")[2].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");
        assert.equal(element.querySelectorAll("p.u-paragraph")[3].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");
        assert.equal(element.querySelectorAll("p.u-paragraph")[4].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");
        assert.equal(element.querySelectorAll("p.u-paragraph")[5].innerText, p1Text, "The plain text formatting multi-paragraphs data does not match.");
      });

    });

    it("plaintext-format property when set to representation-only", function () {
      let plainTextFormat = "representation-only";
      let val = "option one";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": 1,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide unchecked message.");
        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting representation-only data does not match."); // Check for visibility.
      });

    });

    it("plaintext-format property when set to valrep-text", function () {
      let plainTextFormat = "valrep-text";
      let val = "option one (1)";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": 1,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide error icon.");
        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting valrep-text data does not match."); // Check for visibility.
      });

    });

    it("plaintext-format property when set to valrep-html", function () {
      let plainTextFormat = "valrep-html";
      let val = "option one 1";
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": 1,
          "plaintext-format": plainTextFormat
        });
      }).then(function () {
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide error icon.");

        assert.equal(element.querySelector("span.u-control").children[0].className, "u-valrep-rep", "u-valrep-rep class name is not present.");
        assert.equal(element.querySelector("span.u-control").children[1].className, "u-valrep-value", "u-valrep-value class name is not present.");

        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting valrep-html data does not match."); // Check for visibility.
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
        let hiddenPropPresent = element.hasAttribute("hidden");
        assert.equal(hiddenPropPresent, hiddenProp, "Failed to hide the hidden attribute."); // Check for visibility.
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
        let hiddenPropPresent = element.hasAttribute("hidden");
        assert.equal(hiddenPropPresent, hiddenProp, "Failed to show the hidden attribute."); // Check for visibility.
      });

    });

    it("set html:title property for changed title for plaintext", function () {
      let title = "changedTitleText";
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": title
        });
      }).then(function () {
        let titleProperty = window.getComputedStyle(element, null);
        assert(element.hasAttribute("title"), titleProperty, "Failed to hide the title attribute.");
        assert.equal(element.getAttribute("title"), title); // Check for visibility.
      });
    });


    it("html slot property when set to end", function () {
      let slotProp = "end";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:slot": slotProp
        });
      }).then(function () {
        let slotPropPresent = element.hasAttribute("slot");
        assert(element.hasAttribute("slot"), slotPropPresent, "Failed to hide the slot attribute.");
        assert.equal(element.getAttribute("slot"), slotProp); // Check for visibility
      });

    });

    it("html slot property when set to start", function () {
      let slotProp = "start";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "html:slot": slotProp
        });
      }).then(function () {
        let slotPropPresent = element.hasAttribute("slot");
        assert(element.hasAttribute("slot"), slotPropPresent, "Failed to hide the slot attribute.");
        assert.equal(element.getAttribute("slot"), slotProp);
      });
    });

    it("ensure value is set using textContent", function () {
      let val = "<img src='x' onError={alert('XSS attack')}/>";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val
        });
      }).then(function () {
        let escapedHtmlValue = val
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        expect(element.childNodes[2].innerHTML).to.equal(escapedHtmlValue);
        expect(element.childNodes[2].textContent).to.equal(val);
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

    it("setting error in plain text", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "format-error": true,
          "format-error-message": "Fake Validation Error"
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert.equal(element.childNodes[3].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid.");
        expect(element.querySelector("span.u-error-icon").hasAttribute("slot"), "Slot end does not match.");
        assert.equal(element.querySelector("span.u-error-icon").getAttribute("title"), "Fake Validation Error", "Error title does not match.");
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
    it("hide error, set invalid value in plain text", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "error": false,
          "error-message": "Field Value length mismatch."
        });
      }).then(function () {
        widget.hideError("Field Value length mismatch.");
        expect(element).to.not.have.class("u-invalid");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute.");
        assert(element.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid", "Widget element doesn't has class u-error-icon, ms-Icon, ms-Icon--AlertSolid.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("slot"), "The slot attribute is not present.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("title"), "The title attribute is not present.");
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
