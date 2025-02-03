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

  });

  describe("dataUpdate", function () {
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

    it("Set HTML property readonly to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:readonly": true
        });
      }).then(function () {
        expect(element.getAttribute("readonly"));
        expect(window.getComputedStyle(element).cursor).equal("not-allowed");
      });
    });

    it("Set HTML property readonly to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:readonly": false
        });
      }).then(function () {
        expect(!element.getAttribute("readonly"));
        expect(window.getComputedStyle(element).cursor).equal("auto");
      });
    });

    it("Set HTML property disabled to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        expect(element.getAttribute("disabled"));
        expect(window.getComputedStyle(element).cursor).equal("not-allowed");
      });
    });

    it("Set HTML property disabled to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        expect(!element.getAttribute("disabled"));
        expect(window.getComputedStyle(element).cursor).equal("auto");
      });
    });

    it("Set HTML property hidden to true", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:hidden": true
        });
      }).then(function () {
        expect(element.getAttribute("hidden"));
        expect(window.getComputedStyle(element).display).equal("none");
      });
    });

    it("Set HTML property hidden to false", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:hidden": false
        });
      }).then(function () {
        expect(!element.getAttribute("hidden"));
        expect(window.getComputedStyle(element).display).equal("inline-flex");
      });
    });

    it("Set HTML property title", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:title": "On"
        });
      }).then(function () {
        expect(element.getAttribute("title"));
        expect(element.title).equal("On");
      });
    });

    it("Set HTML property tabindex to -1 ", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": -1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(-1);
      });
    });

    it("Set HTML property tabindex to 0", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": 0
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(0);
      });
    });

    it("Set HTML property tabindex to 1", function () {
      return asyncRun(function() {
        tester.dataUpdate({
          "html:tabindex": 1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"));
        expect(element.tabIndex).equal(1);
      });
    });

    it("Set valrep property with default display-format as rep", function () {
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

    it("Set valrep property with display-format as value", function () {
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

    it("Set valrep property with display-format as valrep", function () {
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
  });

  describe("showError()", function () {
    let widget;
    before(function () {
      widget = tester.createWidget();
      verifyWidgetClass(widgetClass);
    });

    it("call the showError() method and check if error is properly visualized", function () {
      return asyncRun(function () {
        widget.showError("Validation Error");
      }).then(function () {
        expect(widget.elements.widget).to.have.class("u-invalid");
        assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");
        expect(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title")).equal("Validation Error");
        expect(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot")).equal("error");
        expect(widget.elements.widget.childNodes[1].className).equal("u-error-icon ms-Icon ms-Icon--AlertSolid");
      });
    });
  });

  describe("hideError()", function () {
    let widget;
    before(function () {
      widget = tester.createWidget();
      verifyWidgetClass(widgetClass);
    });

    it("call the hideError() method and check if error is removed", function () {
      return asyncRun(function () {
        widget.hideError();
      }).then(function () {
        expect(widget.elements.widget).to.not.have.class("u-invalid");
        assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title")).equal("");
        expect(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot")).equal("");
        expect(widget.elements.widget.childNodes[1].classList.contains("ms-Icon")).to.be.false;
        expect(widget.elements.widget.childNodes[1].classList.contains("ms-Icon--AlertSolid")).to.be.false;
      });
    });
  });

  describe("dataCleanup", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, "Failed to call dataCleanup(), exception " + e);
      }
    });
  });

})();