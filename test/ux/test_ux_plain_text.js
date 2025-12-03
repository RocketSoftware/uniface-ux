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
    beforeEach(function () {
      tester.onConnect();
    });

    it("Check there is no 'onchange' trigger is mapped", function () {
      const triggerMapping = tester.widget.mapTrigger("onchange");
      assert(!triggerMapping, "Trigger 'onchange' should not be mapped!");
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

    it("should warn when unsupported html:disabled property is provided", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'html:disabled' - Ignored."))).to.be.true;
        warnSpy.restore();
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
        assert.equal(element.querySelector("span.u-prefix").innerText, prefixTextData, "Prefix text does not match.");
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
        assert.equal(element.querySelector("span.u-suffix").innerText, suffixTextData, "Suffix text does not match.");
      });
    });

    it("plaintext-format property when set to multi-line with prefix & suffix text with label", function () {

      let plainTextFormat = "multi-line";
      let prefixTextData = "prefixTextData";
      let suffixTextData = "suffixTextData";
      let val1 = `First1 Line Once you have all the widgets ready, the rest was mostly about setting the css styles. First Line Once you have all the widgets ready, the rest was mostly about setting the css styles.First Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                      Second1 Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles`;
      let p1Text = "First1 Line Once you have all the widgets ready, the rest was mostly about setting the css styles. First Line Once you have all the widgets ready, the rest was mostly about setting the css styles.First Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      let p2Text = "Second1 Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val1,
          "plaintext-format": plainTextFormat,
          "prefix-text": prefixTextData,
          "suffix-text": suffixTextData,
          "label-text": "Test Label"
        });
      }).then(function () {
        const span = element.querySelector("span.u-control");
        const children = span.childNodes;
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, "Test Label");
        assert.equal(element.querySelector("span.u-control").className,"u-control" , "The class name u-control is not present.");
        assert(children[0].textContent, p1Text, "First line content mismatch.");
        assert(children[1].nodeName, "BR", "Second node should be <br>.");
        assert(children[2].textContent, p2Text, "Second line content mismatch.");
        assert.equal(element.querySelector("span.u-prefix").innerText, prefixTextData, "Prefix text does not match.");
        assert.equal(element.querySelector("span.u-suffix").innerText, suffixTextData, "Suffix text does not match.");
      });
    });

    it("label-text set to empty string with simple value", function () {
      let val = "This is demo plaintext";

      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "label-text": ""
        });
      }).then(function () {
        // Verify the value is set correctly.
        let value = widget.data.value;
        assert.equal(value, val, "Value should be set correctly.");

        // Verify label element is hidden when label-text is empty.
        const labelElement = element.querySelector("span.u-label-text");
        assert(labelElement, "Label element should exist.");
        assert(labelElement.hasAttribute("hidden"), "Label element should have hidden attribute when label-text is empty.");

        // Verify label has no visible text content.
        assert.equal(labelElement.innerText, "", "Label should have no text content when empty.");

        // Verify control element displays the value correctly.
        const controlSpan = element.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");
        assert.equal(controlSpan.textContent, val, "Control span should display the value.");
      });
    });

    it("label-text with simple value", function () {
      let labelText = "Label";
      let val = "This is demo plaintext";
      // Reset to default state first.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "value": val,
            "label-text": labelText
          });
        });
      }).then(function () {
        // Get fresh element reference.
        const currentElement = tester.element;

        // Verify the value is set correctly.
        let value = widget.data.value;
        assert.equal(value, val, "Value should be set correctly.");

        // Verify value is displayed in control span.
        let textData = currentElement.querySelector("span.u-control").textContent;
        assert.equal(textData, val, "The value should be displayed in control span.");

        // Verify label element is visible and displays correct text.
        const labelElement = currentElement.querySelector("span.u-label-text");
        assert(labelElement, "Label element should exist.");
        assert.equal(labelElement.hasAttribute("hidden"), false, "Label element should not have hidden attribute when label-text is set.");
        assert.equal(labelElement.innerText, labelText, "Label should display the correct text.");

        // Verify prefix and suffix are hidden (not set in this test).
        const prefixElement = currentElement.querySelector("span.u-prefix");
        const suffixElement = currentElement.querySelector("span.u-suffix");
        assert(prefixElement.hasAttribute("hidden"), "Prefix should be hidden when not set.");
        assert(suffixElement.hasAttribute("hidden"), "Suffix should be hidden when not set.");

        // Verify error icon is hidden (no error).
        assert(currentElement.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden when there's no error.");
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

    it("plaintext-format property when set to multi-line with prefix & suffix icon with label", function () {
      let plainTextFormat = "multi-line";
      let val = `First Line Once you have all the widgets ready, the rest was mostly about setting the css styles. First Line Once you have all the widgets ready, the rest was mostly about setting the css styles.First Line Once you have all the widgets ready, the rest was mostly about setting the css styles
                      Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles`;
      let p1Text = "First Line Once you have all the widgets ready, the rest was mostly about setting the css styles. First Line Once you have all the widgets ready, the rest was mostly about setting the css styles.First Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      let p2Text = "Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles. Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles.Second Line Once you have all the widgets ready, the rest was mostly about setting the css styles";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat,
          "prefix-icon": "Accounts",
          "suffix-icon": "Home",
          "label-text": "Test Label"
        });
      }).then(function () {
        const span = element.querySelector("span.u-control");
        const children = span.childNodes;
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, "Test Label");
        assert.equal(element.querySelector("span.u-control").className,"u-control" , "The class name u-control class is not present.");
        assert(children[0].textContent, p1Text, "First line content mismatch.");
        assert(children[1].nodeName, "BR", "Second node should be <br>.");
        assert(children[2].textContent, p2Text, "Second line content mismatch.");
        assert.equal(element.childNodes[1].className, "u-prefix ms-Icon ms-Icon--Accounts", "Widget element doesn't have class u-prefix ms-Icon ms-Icon--Accounts.");
        assert.equal(element.childNodes[4].className, "u-suffix ms-Icon ms-Icon--Home", "Widget element doesn't have class u-suffix ms-Icon ms-Icon--Home.");
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

    it("plaintext-format multi-paragraphs with label-text", function () {
      let plainTextFormat = "multi-paragraphs";
      let labelText = "Label";
      let val = "This is the first line.\nThis is the second line.\nThis is the third line.";

      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": plainTextFormat,
          "label-text": labelText
        });
      }).then(function () {
        // Verify label is displayed.
        const labelElement = element.querySelector("span.u-label-text");
        assert(labelElement, "Label element should exist.");
        assert.equal(labelElement.innerText, labelText, "Label text does not match.");
        assert(!labelElement.hasAttribute("hidden"), "Label should be visible.");

        // Verify multi-paragraphs format: should create 3 paragraph elements.
        const controlSpan = element.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");

        const paragraphs = controlSpan.querySelectorAll("p.u-paragraph");
        assert.equal(paragraphs.length, 3, "Should have 3 paragraphs.");

        // Verify each paragraph has correct class.
        paragraphs.forEach(p => {
          assert(p.classList.contains("u-paragraph"), "Each paragraph should have u-paragraph class.");
        });

        // Verify paragraph content.
        assert.equal(paragraphs[0].textContent, "This is the first line.", "First paragraph content mismatch.");
        assert.equal(paragraphs[1].textContent, "This is the second line.", "Second paragraph content mismatch.");
        assert.equal(paragraphs[2].textContent, "This is the third line.", "Third paragraph content mismatch.");

        // Verify first paragraph has correct class name.
        assert.equal(paragraphs[0].className, "u-paragraph", "u-paragraph class name is not present.");

        // Verify control span contains only paragraph elements (no text nodes or other elements).
        assert.equal(controlSpan.children.length, 3, "Control should have exactly 3 child elements (paragraphs).");

        // Verify all children are paragraph elements.
        Array.from(controlSpan.children).forEach(child => {
          assert.equal(child.tagName, "P", "All children should be <p> elements.");
        });

        // Verify label and paragraphs are both visible.
        assert(!labelElement.hasAttribute("hidden"), "Label should remain visible with multi-paragraphs.");
        assert(!controlSpan.hasAttribute("hidden"), "Control span with paragraphs should be visible.");
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

    it("prefix-text and suffix-text with string literal 'undefined' as value", function () {
      let prefixText = "Text before PLAINTEXT";
      let suffixText = "Text after PLAINTEXT";
      let val = "undefined"; // String literal "undefined", not the undefined type.

      // Reset to default state first to ensure clean slate.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "value": val,
            "prefix-text": prefixText,
            "suffix-text": suffixText
          });
        });
      }).then(function () {
        // Get fresh element reference.
        const currentElement = tester.element;

        // Verify the value is set correctly (as string "undefined", not empty).
        let value = widget.data.value;
        assert.equal(value, val, "Value should be the string 'undefined'.");

        // Verify value is displayed in control span as literal text "undefined".
        let textData = currentElement.querySelector("span.u-control").textContent;
        assert.equal(textData, "undefined", "The literal string 'undefined' should be displayed.");

        // Verify prefix text is displayed.
        const prefixElement = currentElement.querySelector("span.u-prefix");
        assert(prefixElement, "Prefix element should exist.");
        assert.equal(prefixElement.innerText, prefixText, "Prefix text does not match.");
        assert.equal(prefixElement.hasAttribute("hidden"), false, "Prefix should be visible.");

        // Verify suffix text is displayed.
        const suffixElement = currentElement.querySelector("span.u-suffix");
        assert(suffixElement, "Suffix element should exist.");
        assert.equal(suffixElement.innerText, suffixText, "Suffix text does not match.");
        assert.equal(suffixElement.hasAttribute("hidden"), false, "Suffix should be visible.");

        // Verify control element displays the literal text.
        const controlSpan = currentElement.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");
        assert.equal(controlSpan.textContent, val, "Control span should display the literal string 'undefined'.");
      });
    });

    it("prefix-icon and suffix-icon with prefix-text and suffix-text (icon priority test)", function () {
      let prefixIcon = "Work";
      let suffixIcon = "Work";
      let prefixText = "Text before PLAINTEXT";
      let suffixText = "Text after PLAINTEXT";
      let val = "undefined"; // String literal "undefined".

      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "prefix-icon": prefixIcon,
          "prefix-text": prefixText,
          "suffix-icon": suffixIcon,
          "suffix-text": suffixText
        });
      }).then(function () {
        // Verify the value is displayed correctly.
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "undefined", "The literal string 'undefined' should be displayed.");

        // Verify prefix icon is displayed (icon takes precedence over text).
        const prefixElement = element.querySelector("span.u-prefix");
        assert(prefixElement, "Prefix element should exist.");
        assert.equal(prefixElement.className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix should display as icon, not text.");
        assert(!prefixElement.hasAttribute("hidden"), "Prefix icon should be visible.");

        // Verify prefix is rendered as icon (no text content when icon is set).
        assert.equal(prefixElement.innerText, "", "Prefix should be an icon with no text content (icon takes precedence).");

        // Verify suffix icon is displayed (icon takes precedence over text).
        const suffixElement = element.querySelector("span.u-suffix");
        assert(suffixElement, "Suffix element should exist.");
        assert.equal(suffixElement.className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix should display as icon, not text.");
        assert(!suffixElement.hasAttribute("hidden"), "Suffix icon should be visible.");

        // Verify suffix is rendered as icon (no text content when icon is set).
        assert.equal(suffixElement.innerText, "", "Suffix should be an icon with no text content (icon takes precedence).");

        // Verify value is displayed correctly.
        const controlSpan = element.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");
        assert.equal(controlSpan.textContent, val, "Control span should display the literal string 'undefined'.");

        // Verify that when both icon and text are set, icon wins (priority behavior).
        // This is important because users might accidentally set both.
        assert(!prefixElement.textContent.includes(prefixText), "Prefix text should not be displayed when icon is set.");
        assert(!suffixElement.textContent.includes(suffixText), "Suffix text should not be displayed when icon is set.");
      });
    });

    it("plaintext-format valrep-text with HTML in representation, prefix-text and suffix-text", function () {
      let plainTextFormat = "valrep-text";
      let prefixText = "This is prefix text";
      let suffixText = "This is suffix text";
      let valRepWithHtml = [
        {
          "value": "1",
          "representation": "One"
        },
        {
          "value": "2",
          "representation": "Two"
        },
        {
          "value": "3",
          "representation": "<b>This is three in bold text</b>"
        }
      ];
      let expectedText = "<b>This is three in bold text</b> (3)";

      return asyncRun(function () {
        // Reset to default state first.
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "valrep": valRepWithHtml,
            "value": "3",
            "plaintext-format": plainTextFormat,
            "prefix-text": prefixText,
            "suffix-text": suffixText
          });
        });
      }).then(function () {
        // Verify error icon is hidden (valid valrep match).
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden for valid valrep.");

        // Verify prefix text is displayed.
        assert.equal(element.querySelector("span.u-prefix").innerText, prefixText, "Prefix text does not match.");
        assert(!element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix should be visible.");

        // Verify suffix text is displayed.
        assert.equal(element.querySelector("span.u-suffix").innerText, suffixText, "Suffix text does not match.");
        assert(!element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix should be visible.");

        // Verify valrep-text format: should display as plain text "representation (value)".
        let textData = element.querySelector("span.u-control").innerText;
        assert.equal(textData, expectedText, "The valrep-text formatting with HTML in representation does not match.");

        // Verify HTML is treated as plain text (not rendered).
        let controlContent = element.querySelector("span.u-control").textContent;
        assert(controlContent.includes("<b>"), "HTML tags should be displayed as plain text, not rendered.");
        assert(controlContent.includes("</b>"), "HTML closing tags should be displayed as plain text.");

        // Verify no HTML elements were created inside control span.
        let boldElements = element.querySelector("span.u-control").querySelectorAll("b");
        assert.equal(boldElements.length, 0, "HTML should not be rendered; no <b> elements should exist.");
      });
    });

    it("plaintext-format valrep-text with HTML in representation, prefix-icon and suffix-icon", function () {
      let plainTextFormat = "valrep-text";
      let prefixIcon = "Work";
      let suffixIcon = "Work";
      let valRepWithHtml = [
        {
          "value": "1",
          "representation": "One"
        },
        {
          "value": "2",
          "representation": "Two"
        },
        {
          "value": "3",
          "representation": "<b>This is three in bold text</b>"
        }
      ];
      let expectedText = "<b>This is three in bold text</b> (3)";

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepWithHtml,
          "value": "3",
          "plaintext-format": plainTextFormat,
          "prefix-icon": prefixIcon,
          "suffix-icon": suffixIcon
        });
      }).then(function () {
        // Verify error icon is hidden (valid valrep match).
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden for valid valrep.");

        // Verify prefix icon is displayed with correct CSS classes.
        assert.equal(element.querySelector("span.u-prefix").className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix icon should be visible.");

        // Verify suffix icon is displayed with correct CSS classes.
        assert.equal(element.querySelector("span.u-suffix").className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix icon should be visible.");

        // Verify valrep-text format: should display as plain text "representation (value)".
        let textData = element.querySelector("span.u-control").innerText;
        assert.equal(textData, expectedText, "The valrep-text formatting with HTML in representation does not match.");

        // Verify HTML is treated as plain text (not rendered).
        let controlContent = element.querySelector("span.u-control").textContent;
        assert(controlContent.includes("<b>"), "HTML tags should be displayed as plain text, not rendered.");
        assert(controlContent.includes("</b>"), "HTML closing tags should be displayed as plain text.");

        // Verify no HTML elements were created inside control span.
        let boldElements = element.querySelector("span.u-control").querySelectorAll("b");
        assert.equal(boldElements.length, 0, "HTML should not be rendered; no <b> elements should exist.");

        // Verify icons are rendered, not text (icons take precedence).
        assert.equal(element.querySelector("span.u-prefix").innerText, "", "Prefix should be an icon with no text content.");
        assert.equal(element.querySelector("span.u-suffix").innerText, "", "Suffix should be an icon with no text content.");
      });
    });

    it("plaintext-format multi-paragraphs with prefix-icon and suffix-icon, then switch to first-line", function () {
      let prefixIcon = "Work";
      let suffixIcon = "Work";
      let val = "This is the first line.\nThis is the second line.\nThis is the fourth line.";
      let firstLineExpected = "This is the first line....";

      // Step 1: Set multi-paragraphs format with icons.
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-paragraphs",
          "prefix-icon": prefixIcon,
          "suffix-icon": suffixIcon
        });
      }).then(function () {
        // Verify prefix icon is displayed.
        assert.equal(element.querySelector("span.u-prefix").className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix icon should be visible.");

        // Verify suffix icon is displayed.
        assert.equal(element.querySelector("span.u-suffix").className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix icon should be visible.");

        // Verify multi-paragraphs format: should create 3 paragraph elements.
        const paragraphs = element.querySelectorAll("p.u-paragraph");
        assert.equal(paragraphs.length, 3, "Should have 3 paragraphs.");
        assert.equal(paragraphs[0].textContent, "This is the first line.", "First paragraph content mismatch.");
        assert.equal(paragraphs[1].textContent, "This is the second line.", "Second paragraph content mismatch.");
        assert.equal(paragraphs[2].textContent, "This is the fourth line.", "Third paragraph content mismatch.");

        // Verify each paragraph has correct class.
        paragraphs.forEach(p => {
          assert(p.classList.contains("u-paragraph"), "Each paragraph should have u-paragraph class.");
        });

        // Step 2: Switch to first-line format.
        return asyncRun(function () {
          tester.dataUpdate({
            "plaintext-format": "first-line"
          });
        });
      }).then(function () {
        // Verify prefix icon is still displayed.
        assert.equal(element.querySelector("span.u-prefix").className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon should persist after format change.");
        assert(!element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix icon should remain visible.");

        // Verify suffix icon is still displayed.
        assert.equal(element.querySelector("span.u-suffix").className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon should persist after format change.");
        assert(!element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix icon should remain visible.");

        // Verify paragraphs are removed (DOM cleanup).
        const paragraphsAfter = element.querySelectorAll("p.u-paragraph");
        assert.equal(paragraphsAfter.length, 0, "All paragraph elements should be removed after switching format.");

        // Verify first-line format: should show first line with ellipsis.
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, firstLineExpected, "Should display first line with ellipsis after format switch.");

        // Verify control element contains plain text, not paragraph elements.
        const controlSpan = element.querySelector("span.u-control");
        assert.equal(controlSpan.children.length, 0, "Control span should contain text nodes only, no child elements.");
      });
    });

    it("should display multi-paragraphs with label-text, prefix-icon, and suffix-icon", function () {
      const multiLineValue = "This is the first line.\nThis is the second line.\nThis is the third line.";
      const plainTextFormat = "multi-paragraphs";
      const labelText = "Label";
      const prefixIcon = "Home";
      const suffixIcon = "IncomingCall";

      // Reset to defaults first to avoid state pollution.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "value": multiLineValue,
            "plaintext-format": plainTextFormat,
            "label-text": labelText,
            "prefix-icon": prefixIcon,
            "suffix-icon": suffixIcon
          });
        });
      }).then(function () {
        const currentElement = tester.element;

        // Verify label is displayed with correct text.
        const label = currentElement.querySelector("span.u-label-text");
        assert.equal(label.textContent, labelText, "Label text should match.");
        assert.equal(label.hasAttribute("hidden"), false, "Label should be visible.");

        // Verify prefix icon is displayed with correct CSS classes.
        const prefixSpan = currentElement.querySelector("span.u-prefix");
        assert.equal(prefixSpan.className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon CSS classes do not match.");
        assert.equal(prefixSpan.hasAttribute("hidden"), false, "Prefix icon should be visible.");

        // Verify control contains 3 paragraphs.
        const control = currentElement.querySelector("span.u-control");
        const paragraphs = control.querySelectorAll("p");
        assert.equal(paragraphs.length, 3, "Should have 3 paragraphs for multi-paragraphs format.");

        // Verify paragraph content.
        assert.equal(paragraphs[0].textContent, "This is the first line.", "First paragraph content should match.");
        assert.equal(paragraphs[1].textContent, "This is the second line.", "Second paragraph content should match.");
        assert.equal(paragraphs[2].textContent, "This is the third line.", "Third paragraph content should match.");

        // Verify suffix icon is displayed with correct CSS classes.
        const suffixSpan = currentElement.querySelector("span.u-suffix");
        assert.equal(suffixSpan.className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon CSS classes do not match.");
        assert.equal(suffixSpan.hasAttribute("hidden"), false, "Suffix icon should be visible.");

        // Verify error icon is hidden.
        const errorIcon = currentElement.querySelector("span.u-error-icon");
        assert.equal(errorIcon.hasAttribute("hidden"), true, "Error icon should be hidden.");
      });
    });

    it("plaintext-format multi-paragraphs with prefix-text and suffix-text", function () {
      const multiLineValue = "This is the first line.\n\n\nThis is the second line.\n\nThis is the third line.\n\n\n";
      const plainTextFormat = "multi-paragraphs";
      const prefixText = "This is the prefix text.";
      const suffixText = "This is the suffix text.";

      // Reset to defaults first to avoid state pollution.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "value": multiLineValue,
            "plaintext-format": plainTextFormat,
            "prefix-text": prefixText,
            "suffix-text": suffixText
          });
        });
      }).then(function () {
        const currentElement = tester.element;

        // Verify prefix text is displayed.
        const prefixSpan = currentElement.querySelector("span.u-prefix");
        assert.equal(prefixSpan.textContent, prefixText, "Prefix text should match.");
        assert.equal(prefixSpan.hasAttribute("hidden"), false, "Prefix text should be visible.");

        // Verify control contains paragraphs (multi-paragraphs splits on double newlines).
        const control = currentElement.querySelector("span.u-control");
        const paragraphs = control.querySelectorAll("p");
        assert.isAtLeast(paragraphs.length, 1, "Should have at least 1 paragraph for multi-paragraphs format.");

        // Verify suffix text is displayed.
        const suffixSpan = currentElement.querySelector("span.u-suffix");
        assert.equal(suffixSpan.textContent, suffixText, "Suffix text should match.");
        assert.equal(suffixSpan.hasAttribute("hidden"), false, "Suffix text should be visible.");

        // Verify error icon is hidden.
        const errorIcon = currentElement.querySelector("span.u-error-icon");
        assert.equal(errorIcon.hasAttribute("hidden"), true, "Error icon should be hidden.");

        // Verify prefix and suffix don't have icon classes.
        assert.isFalse(prefixSpan.className.includes("ms-Icon"), "Prefix should not have icon classes.");
        assert.isFalse(suffixSpan.className.includes("ms-Icon"), "Suffix should not have icon classes.");
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

        assert.equal(element.querySelector("span.u-control").children[0].className, "u-valrep-representation", "u-valrep-representation class name is not present.");
        assert.equal(element.querySelector("span.u-control").children[1].className, "u-valrep-value u-value", "u-valrep-value u-value class name is not present.");

        let textData = element.childNodes[2].innerText;
        assert.equal(textData, val, "The plain text formatting valrep-html data does not match."); // Check for visibility.
      });
    });

    it("plaintext-format valrep-html with HTML in representation, prefix-icon and suffix-icon", function () {
      let plainTextFormat = "valrep-html";
      let prefixIcon = "Work";
      let suffixIcon = "Work";
      let valRepWithHtml = [
        {
          "value": "1",
          "representation": "One"
        },
        {
          "value": "2",
          "representation": "Two"
        },
        {
          "value": "3",
          "representation": "<b>This is three in bold text</b>"
        }
      ];
      let expectedTextContent = "This is three in bold text 3"; // HTML is rendered, so innerText shows plain content.

      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepWithHtml,
          "value": "3",
          "plaintext-format": plainTextFormat,
          "prefix-icon": prefixIcon,
          "suffix-icon": suffixIcon
        });
      }).then(function () {
        // Verify error icon is hidden (valid valrep match).
        expect(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden for valid valrep.");

        // Verify prefix icon is displayed with correct CSS classes.
        assert.equal(element.querySelector("span.u-prefix").className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-prefix").hasAttribute("hidden"), "Prefix icon should be visible.");

        // Verify suffix icon is displayed with correct CSS classes.
        assert.equal(element.querySelector("span.u-suffix").className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon CSS classes do not match.");
        assert(!element.querySelector("span.u-suffix").hasAttribute("hidden"), "Suffix icon should be visible.");

        // Verify valrep-html format: should create two spans (representation + value).
        const controlSpan = element.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");
        assert.equal(controlSpan.children.length, 2, "Control should have 2 child spans (representation + value).");

        // Verify representation span has correct class and HTML content.
        const repSpan = controlSpan.querySelector("span.u-valrep-representation");
        assert(repSpan, "Representation span should exist.");
        assert.equal(repSpan.className, "u-valrep-representation", "Representation span class name is not present.");
        assert.equal(repSpan.innerHTML, "<b>This is three in bold text</b>", "Representation should contain HTML markup.");

        // Verify value span has correct class and text content.
        const valueSpan = controlSpan.querySelector("span.u-valrep-value");
        assert(valueSpan, "Value span should exist.");
        assert.equal(valueSpan.className, "u-valrep-value u-value", "Value span class name is not present.");
        assert.equal(valueSpan.textContent, "3", "Value span should display '3'.");

        // Verify HTML is actually rendered (bold tag exists in DOM).
        const boldElement = repSpan.querySelector("b");
        assert(boldElement, "HTML <b> tag should be rendered in representation span.");
        assert.equal(boldElement.textContent, "This is three in bold text", "Bold element should contain the text.");

        // Verify complete text content (HTML rendered, shows plain text from innerText).
        let textData = controlSpan.innerText;
        assert.equal(textData, expectedTextContent, "The valrep-html formatting with HTML should render correctly.");

        // Verify icons are rendered without text content.
        assert.equal(element.querySelector("span.u-prefix").innerText, "", "Prefix should be an icon with no text content.");
        assert.equal(element.querySelector("span.u-suffix").innerText, "", "Suffix should be an icon with no text content.");
      });
    });

    it("plaintext-format valrep-html with HTML in representation, prefix-text and suffix-text", function () {
      let plainTextFormat = "valrep-html";
      let prefixText = "This is prefix text";
      let suffixText = "This is suffix text";
      let valRepWithHtml = [
        {
          "value": "1",
          "representation": "One"
        },
        {
          "value": "2",
          "representation": "Two"
        },
        {
          "value": "3",
          "representation": "<b>This is three in bold text</b>"
        }
      ];
      let expectedTextContent = "This is three in bold text 3"; // HTML is rendered, so innerText shows plain content.

      // Reset to default state first to ensure clean slate.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "valrep": valRepWithHtml,
            "value": "3",
            "plaintext-format": plainTextFormat,
            "prefix-text": prefixText,
            "suffix-text": suffixText
          });
        });
      }).then(function () {
        // Get fresh element reference.
        const currentElement = tester.element;

        // Verify error icon is hidden (valid valrep match).
        expect(currentElement.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be hidden for valid valrep.");

        // Verify prefix text is displayed.
        const prefixElement = currentElement.querySelector("span.u-prefix");
        assert(prefixElement, "Prefix element should exist.");
        assert.equal(prefixElement.innerText, prefixText, "Prefix text does not match.");
        assert.equal(prefixElement.hasAttribute("hidden"), false, "Prefix should be visible.");

        // Verify suffix text is displayed.
        const suffixElement = currentElement.querySelector("span.u-suffix");
        assert(suffixElement, "Suffix element should exist.");
        assert.equal(suffixElement.innerText, suffixText, "Suffix text does not match.");
        assert.equal(suffixElement.hasAttribute("hidden"), false, "Suffix should be visible.");

        // Verify valrep-html format: should create two spans (representation + value).
        const controlSpan = currentElement.querySelector("span.u-control");
        assert(controlSpan, "Control span should exist.");
        assert.equal(controlSpan.children.length, 2, "Control should have 2 child spans (representation + value).");

        // Verify representation span has correct class and HTML content.
        const repSpan = controlSpan.querySelector("span.u-valrep-representation");
        assert(repSpan, "Representation span should exist.");
        assert.equal(repSpan.className, "u-valrep-representation", "Representation span class name is not present.");
        assert.equal(repSpan.innerHTML, "<b>This is three in bold text</b>", "Representation should contain HTML markup.");

        // Verify value span has correct class and text content.
        const valueSpan = controlSpan.querySelector("span.u-valrep-value");
        assert(valueSpan, "Value span should exist.");
        assert.equal(valueSpan.className, "u-valrep-value u-value", "Value span class name is not present.");
        assert.equal(valueSpan.textContent, "3", "Value span should display '3'.");

        // Verify HTML is actually rendered (bold tag exists in DOM).
        const boldElement = repSpan.querySelector("b");
        assert(boldElement, "HTML <b> tag should be rendered in representation span.");
        assert.equal(boldElement.textContent, "This is three in bold text", "Bold element should contain the text.");

        // Verify complete text content (HTML rendered, shows plain text from innerText).
        let textData = controlSpan.innerText;
        assert.equal(textData, expectedTextContent, "The valrep-html formatting with HTML should render correctly.");

        // Verify prefix and suffix are text (not icons).
        assert(!prefixElement.className.includes("ms-Icon"), "Prefix should be text, not icon.");
        assert(!suffixElement.className.includes("ms-Icon"), "Suffix should be text, not icon.");
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
        assert.equal(element.getAttribute("slot"), slotProp); // Check for visibility.
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

    it("html:tabindex property should not be applied to plaintext element", function () {
      let val = "This is demo plaintext";
      const warnSpy = sinon.spy(console, "warn");
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "html:tabindex": "1"
        });
      }).then(function () {
        // Verify value is displayed correctly.
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, val, "The value should be displayed in control span.");

        // Verify tabindex attribute is NOT applied (plaintext doesn't support tabindex).
        assert(!element.hasAttribute("tabindex"), "PlainText element should not have tabindex attribute.");
        assert.equal(element.getAttribute("tabindex"), null, "tabindex should be null.");

        // Verify the element is not focusable.
        // PlainText is a display-only widget and should not receive focus.
        const isFocusable = element.tabIndex >= 0;
        assert.equal(isFocusable, false, "PlainText element should not be focusable.");

        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'html:tabindex' - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("ensure value is set using textContent", function () {
      let val = "<img src='x' onError={alert('XSS attack')}/>";
      // Calling mock dataUpdate() to have widgetProperties and then call widget dataUpdate().
      return asyncRun(function () {
        tester.dataUpdate({
          "plaintext-format": "value-only",
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

  describe(`${widgetName} getValueFormatted() function test`, function () {
    it("getValueFormatted() should return correct formatted values with plaintext-format as valrep-html", function () {
      let formattedData;
      let returnedFormattedVal = {
        "primaryHtmlText": "<b>This is test valrep html</b>",
        "secondaryPlainText": "One",
        "prefixIcon": "",
        "prefixText": "Prefix-Text",
        "suffixIcon": "Home"
      };
      let props = {
        "id": 0.191159463627403,
        "class:u-plain-text": true,
        "html:hidden": false,
        "html:slot": "",
        "html:maxlength": null,
        "html:minlength": null,
        "html:readonly": null,
        "prefix-icon": "",
        "prefix-text": "Prefix-Text",
        "valrep": [
          {
            "value": "One",
            "representation": "<b>This is test valrep html</b>"
          }
        ],
        "plaintext-format": "valrep-html",
        "value": "One",
        "suffix-icon": "Home",
        "suffix-text": "",
        "format-error": false,
        "format-error-message": "",
        "error": false,
        "error-message": ""
      };
      formattedData = widgetClass.getValueFormatted(props);
      assert.equal(JSON.stringify(formattedData), JSON.stringify(returnedFormattedVal));
    });

    it("getValueFormatted() should return correct formatted values with plaintext-format as valrep-text", function () {
      let formattedData;
      let returnedFormattedVal = {
        "primaryPlainText": "This is test valrep html",
        "secondaryPlainText": "One",
        "prefixIcon": "",
        "prefixText": "Prefix-Text",
        "suffixIcon": "Home"
      };
      let props = {
        "id": 0.191159463627403,
        "class:u-plain-text": true,
        "html:hidden": false,
        "html:slot": "",
        "html:maxlength": null,
        "html:minlength": null,
        "html:readonly": null,
        "prefix-icon": "",
        "prefix-text": "Prefix-Text",
        "valrep": [
          {
            "value": "One",
            "representation": "This is test valrep html"
          }
        ],
        "plaintext-format": "valrep-text",
        "value": "One",
        "suffix-icon": "Home",
        "suffix-text": "",
        "format-error": false,
        "format-error-message": "",
        "error": false,
        "error-message": ""
      };
      formattedData = widgetClass.getValueFormatted(props);
      assert.equal(JSON.stringify(formattedData), JSON.stringify(returnedFormattedVal));
    });

    it("getValueFormatted() should return correct formatted values with plaintext-format as representation-only", function () {
      let formattedData;
      let returnedFormattedVal = {
        "primaryHtmlText": "This is test valrep html",
        "prefixIcon": "Home",
        "suffixIcon": "Home"
      };
      let props = {
        "id": 0.191159463627403,
        "class:u-plain-text": true,
        "html:hidden": false,
        "html:slot": "",
        "html:maxlength": null,
        "html:minlength": null,
        "html:readonly": null,
        "prefix-icon": "Home",
        "prefix-text": "PrefixText",
        "valrep": [
          {
            "value": "One",
            "representation": "This is test valrep html"
          }
        ],
        "plaintext-format": "representation-only",
        "value": "One",
        "suffix-icon": "Home",
        "suffix-text": "SuffixText",
        "format-error": false,
        "format-error-message": "",
        "error": false,
        "error-message": ""
      };
      formattedData = widgetClass.getValueFormatted(props);
      assert.equal(JSON.stringify(formattedData), JSON.stringify(returnedFormattedVal));
    });

    it("getValueFormatted() should return correct formatted values with plaintext-format as value-only", function () {
      let formattedData;
      let returnedFormattedVal = {
        "primaryPlainText": "One",
        "prefixIcon": "Home",
        "suffixIcon": "Home"
      };
      let props = {
        "id": 0.191159463627403,
        "class:u-plain-text": true,
        "html:hidden": false,
        "html:slot": "",
        "html:maxlength": null,
        "html:minlength": null,
        "html:readonly": null,
        "prefix-icon": "Home",
        "prefix-text": "PrefixText",
        "valrep": [
          {
            "value": "One",
            "representation": "This is test value only"
          }
        ],
        "plaintext-format": "value-only",
        "value": "One",
        "suffix-icon": "Home",
        "suffix-text": "SuffixText",
        "format-error": false,
        "format-error-message": "",
        "error": false,
        "error-message": ""
      };
      formattedData = widgetClass.getValueFormatted(props);
      assert.equal(JSON.stringify(formattedData), JSON.stringify(returnedFormattedVal));
    });

    it("getValueFormatted() should return correct formatted values with plaintext-format as valrep-html and format-error as true", function () {
      let formattedData;
      let returnedFormattedVal = {
        "primaryPlainText": "ERROR",
        "secondaryPlainText": "OneTwoThree",
        "errorMessage": "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.",
        "prefixIcon": "Home",
        "suffixIcon": "Home"
      };

      let props = {
        "id": 0.191159463627403,
        "class:u-plain-text": true,
        "html:hidden": false,
        "html:slot": "",
        "html:maxlength": null,
        "html:minlength": null,
        "html:readonly": null,
        "prefix-icon": "Home",
        "prefix-text": "PrefixText",
        "valrep": [
          {
            "value": "One",
            "representation": "<b>This is test value only</b>"
          }
        ],
        "plaintext-format": "valrep-html",
        "value": "OneTwoThree",
        "suffix-icon": "Home",
        "suffix-text": "SuffixText",
        "format-error": true,
        "format-error-message": "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.",
        "error": false,
        "error-message": ""
      };
      formattedData = widgetClass.getValueFormatted(props);
      assert.equal(JSON.stringify(formattedData), JSON.stringify(returnedFormattedVal));
    });
  });

  describe("Format Error Tests for Valrep Formats", function () {
    let widget, element;
    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });
    it("plaintext-format valrep-html with invalid value should show error", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "999", // Invalid value not in valrep.
          "plaintext-format": "valrep-html"
        });
      }).then(function () {
        let value = widget.data.value;
        assert.equal(value, "999", "Value is not the same.");
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be visible.");
        // Should display value with special styling.
        assert.equal(element.querySelector("span.u-valrep-value").textContent, "999");
      });
    });

    it("plaintext-format valrep-text with invalid value should show error", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "invalid",
          "plaintext-format": "valrep-text"
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be visible.");

        // Changed: check control's text content instead of span.
        const control = element.querySelector("span.u-control");
        assert.equal(control.textContent, "(invalid)", "Invalid value should be displayed with parentheses.");

        // Verify no span exists.
        assert.isNull(element.querySelector("span.u-valrep-value"), "Should not have span for invalid value.");
      });
    });

    it("plaintext-format value-only with invalid value should show error", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "xyz",
          "plaintext-format": "value-only"
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be visible.");
        // Should display raw value without special styling.
        assert.equal(element.querySelector("span.u-control").textContent, "xyz");
      });
    });

    it("plaintext-format representation-only with invalid value should show empty content", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "notfound",
          "plaintext-format": "representation-only"
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Error icon should be visible.");
        // Should show nothing (only error icon appears).
        assert.equal(element.querySelector("span.u-control").textContent, "");
      });
    });

    it("plaintext-format first-line with multi-line value should show first line with ellipsis", function () {
      let val = "First line here\nSecond line\nThird line";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "first-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "First line here...", "Should display first line with ellipsis.");
      });
    });

    it("plaintext-format first-line with single-line value should not show ellipsis", function () {
      let val = "Only one line";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "first-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "Only one line", "Should display without ellipsis.");
      });
    });

    it("plaintext-format single-line with newlines should replace with spaces", function () {
      let val = "Line1\nLine2\nLine3";
      let expected = "Line1 Line2 Line3";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "single-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, expected, "Newlines should be replaced with spaces.");
      });
    });

    it("plaintext-format multi-line with CRLF should handle correctly", function () {
      let val = "Line1\r\nLine2\r\nLine3";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-line"
        });
      }).then(function () {
        const span = element.querySelector("span.u-control");
        const children = span.childNodes;
        assert.equal(children[0].textContent, "Line1", "First line mismatch.");
        assert.equal(children[1].nodeName, "BR", "Should have BR element.");
        assert.equal(children[2].textContent, "Line2", "Second line mismatch.");
        assert.equal(children[3].nodeName, "BR", "Should have BR element.");
        assert.equal(children[4].textContent, "Line3", "Third line mismatch.");
      });
    });

    it("plaintext-format multi-line with empty value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "plaintext-format": "multi-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "", "Empty value should render as empty.");
      });
    });

    it("plaintext-format with null value should be handled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": null,
          "plaintext-format": "single-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "", "Null value should render as empty string.");
      });
    });

    it("plaintext-format with undefined value should be handled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": undefined,
          "plaintext-format": "first-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "", "Undefined value should render as empty string.");
      });
    });

    it("plaintext-format with numeric value should convert to string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 12345,
          "plaintext-format": "single-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "12345", "Numeric value should be converted to string.");
      });
    });

    it("plaintext-format with boolean value should convert to string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": true,
          "plaintext-format": "single-line"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "true", "Boolean value should be converted to string.");
      });
    });

    it("plaintext-format value-only with valrep should only show value", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "2",
          "plaintext-format": "value-only"
        });
      }).then(function () {
        let textData = element.querySelector("span.u-control").textContent;
        assert.equal(textData, "2", "Should only show value, not representation.");
      });
    });

    it("plaintext-format multi-paragraphs with single line should create one paragraph", function () {
      let val = "Single paragraph text";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-paragraphs"
        });
      }).then(function () {
        assert.equal(element.querySelector("span.u-control").childElementCount, 1, "Should have 1 paragraph.");
        assert.equal(element.querySelector("p.u-paragraph").textContent, val);
      });
    });

    it("plaintext-format multi-line with single line should not have br elements", function () {
      let val = "Single line only";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-line"
        });
      }).then(function () {
        const span = element.querySelector("span.u-control");
        const brElements = span.querySelectorAll("br");
        assert.equal(brElements.length, 0, "Should have no BR elements for single line.");
        assert.equal(span.textContent, val);
      });
    });

    it("plaintext-format representation-only should escape HTML in representation", function () {
      let maliciousValrep = [
        {
          "value": "1",
          "representation": "<script>alert('XSS')</script>"
        }
      ];
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": maliciousValrep,
          "value": "1",
          "plaintext-format": "representation-only"
        });
      }).then(function () {
        // innerHTML is used for representation, but should not execute scripts.
        const span = element.querySelector("span.u-valrep-representation");
        assert(span, "Representation span should exist.");
      });
    });

    it("plaintext-format multi-line should use textContent for security", function () {
      let val = "<img src='x' onerror='alert(1)'/>\n<script>alert('XSS')</script>";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-line"
        });
      }).then(function () {
        const span = element.querySelector("span.u-control");
        // Should be text nodes, not HTML elements.
        expect(span.querySelector("img")).to.be.null;
        expect(span.querySelector("script")).to.be.null;
      });
    });

    it("plaintext-format multi-paragraphs should use textContent for security", function () {
      let val = "<img src='x' onerror='alert(1)'/>\n<b>Bold attempt</b>";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-paragraphs"
        });
      }).then(function () {
        const paragraphs = element.querySelectorAll("p.u-paragraph");
        expect(paragraphs[0].querySelector("img")).to.be.null;
        expect(paragraphs[1].querySelector("b")).to.be.null;
        expect(paragraphs[0].textContent).to.include("<img");
        expect(paragraphs[1].textContent).to.include("<b>");
      });
    });

    it("valrep-html should have correct CSS classes for spans", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "valrep": valRepArray,
          "value": "3",
          "plaintext-format": "valrep-html"
        });
      }).then(function () {
        const repSpan = element.querySelector("span.u-valrep-representation");
        const valueSpan = element.querySelector("span.u-valrep-value");
        assert(repSpan, "Representation span should exist.");
        assert(valueSpan, "Value span should exist.");
        assert(valueSpan.classList.contains("u-value"), "Value span should have u-value class.");
      });
    });

    it("multi-paragraphs should have u-paragraph class on each paragraph", function () {
      let val = "Para1\nPara2\nPara3";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": val,
          "plaintext-format": "multi-paragraphs"
        });
      }).then(function () {
        const paragraphs = element.querySelectorAll("p.u-paragraph");
        assert.equal(paragraphs.length, 3);
        paragraphs.forEach(p => {
          assert(p.classList.contains("u-paragraph"), "Each paragraph should have u-paragraph class.");
        });
      });
    });

    it("plaintext-format valrep-text with invalid value and prefix-icon, suffix-icon", function () {
      const invalidValue = "99";
      const plainTextFormat = "valrep-text";
      const prefixIcon = "Work";
      const suffixIcon = "Work";

      // Reset to defaults first to avoid state pollution.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "valrep": valRepArray,
            "value": invalidValue,
            "plaintext-format": plainTextFormat,
            "prefix-icon": prefixIcon,
            "suffix-icon": suffixIcon
          });
        });
      }).then(function () {
        const currentElement = tester.element;

        // Verify element has invalid format class.
        expect(currentElement).to.have.class("u-format-invalid");

        // Verify error icon is visible for invalid valrep.
        const errorIcon = currentElement.querySelector("span.u-error-icon");
        assert.equal(errorIcon.hasAttribute("hidden"), false, "Error icon should be visible for invalid value.");

        // Verify prefix icon is displayed with correct CSS classes.
        const prefixSpan = currentElement.querySelector("span.u-prefix");
        assert.equal(prefixSpan.className, `u-prefix ms-Icon ms-Icon--${prefixIcon}`, "Prefix icon CSS classes do not match.");
        assert.equal(prefixSpan.hasAttribute("hidden"), false, "Prefix icon should be visible.");

        // Verify invalid value is displayed.
        const control = currentElement.querySelector("span.u-control");
        assert.equal(control.textContent, `(${invalidValue})`, "Invalid value should be displayed with parentheses.");

        // Verify no span.u-valrep-value exists (plain text instead).
        const valrepValue = currentElement.querySelector("span.u-valrep-value");
        assert.isNull(valrepValue, "Should not have valrep-value span for invalid valrep-text format.");

        // Verify suffix icon is displayed with correct CSS classes.
        const suffixSpan = currentElement.querySelector("span.u-suffix");
        assert.equal(suffixSpan.className, `u-suffix ms-Icon ms-Icon--${suffixIcon}`, "Suffix icon CSS classes do not match.");
        assert.equal(suffixSpan.hasAttribute("hidden"), false, "Suffix icon should be visible.");
      });
    });

    it("plaintext-format valrep-text with invalid value and prefix-text, suffix-text", function () {
      const invalidValue = "99";
      const plainTextFormat = "valrep-text";
      const prefixText = "This is suffix text";
      const suffixText = "This is prefix text";

      // Reset to defaults first to avoid state pollution.
      return asyncRun(function () {
        tester.dataUpdate(tester.getDefaultValues());
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "valrep": valRepArray,
            "value": invalidValue,
            "plaintext-format": plainTextFormat,
            "prefix-text": prefixText,
            "suffix-text": suffixText
          });
        });
      }).then(function () {
        const currentElement = tester.element;

        // Verify element has invalid format class.
        expect(currentElement).to.have.class("u-format-invalid");

        // Verify error icon is visible for invalid valrep.
        const errorIcon = currentElement.querySelector("span.u-error-icon");
        assert.equal(errorIcon.hasAttribute("hidden"), false, "Error icon should be visible for invalid value.");

        // Verify prefix text is displayed.
        const prefixSpan = currentElement.querySelector("span.u-prefix");
        assert.equal(prefixSpan.textContent, prefixText, "Prefix text should match.");
        assert.equal(prefixSpan.hasAttribute("hidden"), false, "Prefix text should be visible.");

        // Verify invalid value is displayed with parentheses (plain text, no span).
        const control = currentElement.querySelector("span.u-control");
        assert.equal(control.textContent, `(${invalidValue})`, "Invalid value should be displayed with parentheses.");

        // Verify no span.u-valrep-value exists (implementation uses plain text).
        const valrepValue = currentElement.querySelector("span.u-valrep-value");
        assert.isNull(valrepValue, "Should not have valrep-value span for invalid valrep-text format.");

        // Verify suffix text is displayed.
        const suffixSpan = currentElement.querySelector("span.u-suffix");
        assert.equal(suffixSpan.textContent, suffixText, "Suffix text should match.");
        assert.equal(suffixSpan.hasAttribute("hidden"), false, "Suffix text should be visible.");

        // Verify prefix and suffix don't have icon classes.
        assert.isFalse(prefixSpan.className.includes("ms-Icon"), "Prefix should not have icon classes.");
        assert.isFalse(suffixSpan.className.includes("ms-Icon"), "Suffix should not have icon classes.");
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
          "error-message": ""
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
