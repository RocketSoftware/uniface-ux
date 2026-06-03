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

    it(`should load the ${widgetName} widget class`, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      const structure = widgetClass.structure;
      expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
      expect(structure.tagName, "Structure tagName should be 'fluent-button'.").to.equal("fluent-button");
      expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
      expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
      expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
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

      it("should register the web component", function () {
        const customElementNames = ["fluent-button"];
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

      it("should have a u-text element", function () {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element.");
      });

      it("should have a u-icon element", function () {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element.");
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
        "class:u-button",
        "class:neutral",
        "class:u-stretchable",
        "html:appearance",
        "html:disabled",
        "html:hidden",
        "html:maxlength",
        "html:minlength",
        "html:readonly",
        "html:tabindex",
        "html:title",
        "icon",
        "icon-position",
        "value"
      );
      expect(widgetClass.defaultValues["class:u-button"], "Class is not defined!").to.exist;
      expect(widgetClass.defaultValues["class:u-stretchable"], "class:u-stretchable should be registered as a default value.").to.exist;
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
      "detail" : "click"
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
  });

  describe("Detail trigger", function () {
    const trigger = "detail";
    const triggerMap = {};
    triggerMap[trigger] = function () {
      console.log(`Detail trigger has been called at ${new Date().toLocaleTimeString()}!`);
    };

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });
      tester.resetTriggerCalled(trigger);
    });

    // Simulate a click event.
    it("should call the detail trigger handler when the button is clicked", function () {
      tester.userClick();
      expect(tester.calledOnce(trigger), "Detail trigger should be called once after click.").to.be.true;
    });

    // NOTE: Keyboard trigger tests (SPACEBAR and ENTER) are not automated because the
    // keyboard-to-click translation is handled by the browser for button elements, not by
    // the widget code. The umockup/jsdom test environment does not reproduce this behavior.

    it("should not call the detail trigger when the button is disabled", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        // Simulate a click event.
        tester.element.click();
        expect(tester.countOfTriggerCalled(trigger)).to.equal(0, "The detail trigger should not be called when disabled.");
      });
    });

    it("should reset trigger map", function () {
      tester.resetMapTriggers();
      tester.userClick();
      expect(tester.calledOnce(trigger), "Detail trigger should not be called after trigger map is reset.").to.be.false;
    });
  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    beforeEach(function () {
      tester.dataInit();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`should apply default class '${defaultClass}' correctly`, function () {
        if (classes[defaultClass]) {
          expect(element, `Widget element should have class ${defaultClass}.`).to.have.class(defaultClass);
        } else {
          expect(element, `Widget element should not have class ${defaultClass}.`).not.to.have.class(defaultClass);
        }
      });
    }

    it("should have a valid widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true, "Widget id should be a non-empty string.");
    });

    it("should not be hidden by default", function () {
      expect(element.hasAttribute("hidden"), "Button element should not be hidden by default.").to.be.false;
    });

    it("should have text span hidden by default", function () {
      assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span element should be hidden by default.");
    });

    it("should have empty text span content by default", function () {
      expect(element.querySelector("span.u-text").innerText, "Text span should have empty content by default.").to.equal("");
    });

    it("should have icon span hidden by default", function () {
      assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span element should be hidden by default.");
    });

    it("should have no icon classes on icon span by default", function () {
      expect(element.querySelector("span.u-icon").classList.contains("ms-Icon"), "Icon span should not have ms-Icon class by default.").to.be.false;
    });

    it("should have correct default values for 'icon' and 'icon-position'", function () {
      assert.equal(tester.defaultValues["icon"], "", "Default value of icon should be ''.");
      assert.equal(tester.defaultValues["icon-position"], "start", "Default value of icon-position will be start.");
    });

    it("should have empty default value", function () {
      assert.equal(tester.defaultValues.value, "", "Default value of attribute value should be ''.");
    });

    it("should not be disabled by default", function () {
      expect(element.hasAttribute("disabled"), "Button should not be disabled by default.").to.be.false;
    });

    it("should have no title by default", function () {
      expect(element.getAttribute("title"), "Button should have no title attribute by default.").to.equal(null);
    });

    it("should have tabindex '0' by default", function () {
      expect(element.getAttribute("tabindex"), "Button should have tabindex '0' by default.").to.equal("0");
    });

    it("should have 'neutral' appearance by default", function () {
      expect(element, "Button should have 'neutral' appearance class by default.").to.have.class("neutral");
    });

  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should update the button text", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display the updated button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon element should be hidden.");
      });
    });

    it("should hide text span when value is cleared after being set", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Click Me"
        });
      }).then(function () {
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be visible.");
        return asyncRun(function () {
          tester.dataUpdate({
            "value": ""
          });
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span should be hidden after clearing.");
        expect(element.querySelector("span.u-text").innerText, "Text span should have empty content after clearing.").to.equal("");
      });
    });

    it("should reset value to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "value": "Click Me" });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text should be set to 'Click Me'.").to.equal("Click Me");
        return asyncRun(function () {
          tester.dataUpdate({ "value": uniface.RESET });
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span should be hidden after reset.");
        expect(element.querySelector("span.u-text").innerText, "Text span should be empty after reset.").to.equal("");
      });
    });

    it("should disable the button when html:disabled is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
      }).then(function () {
        expect(element.hasAttribute("disabled"), "Button should have disabled attribute set.").to.be.true;
      });
    });

    it("should enable the button when html:disabled is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": false
        });
      }).then(function () {
        expect(element.hasAttribute("disabled"), "Button should not have disabled attribute.").to.be.false;
      });
    });

    it("should reset html:disabled to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:disabled": true });
      }).then(function () {
        expect(element.hasAttribute("disabled"), "Button should be disabled before reset.").to.be.true;
        return asyncRun(function () {
          tester.dataUpdate({ "html:disabled": uniface.RESET });
        });
      }).then(function () {
        expect(element.hasAttribute("disabled"), "Button should not be disabled after reset.").to.be.false;
      });
    });

    it("should hide the button when html:hidden is true", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": true
        });
      }).then(function () {
        expect(element.hasAttribute("hidden"), "Button should have hidden attribute set.").to.be.true;
      });
    });

    it("should show the button when html:hidden is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:hidden": false
        });
      }).then(function () {
        expect(element.hasAttribute("hidden"), "Button should not have hidden attribute.").to.be.false;
      });
    });

    it("should reset html:hidden to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:hidden": true });
      }).then(function () {
        expect(element.hasAttribute("hidden"), "Button should be hidden before reset.").to.be.true;
        return asyncRun(function () {
          tester.dataUpdate({ "html:hidden": uniface.RESET });
        });
      }).then(function () {
        expect(element.hasAttribute("hidden"), "Button should not be hidden after reset.").to.be.false;
      });
    });

    it("should set tabindex to '1'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:tabindex": 1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"), "Button tabindex should be '1'.").equal("1");
      });
    });

    it("should set tabindex to '-1'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:tabindex": -1
        });
      }).then(function () {
        expect(element.getAttribute("tabindex"), "Button tabindex should be '-1'.").equal("-1");
      });
    });

    it("should set the title attribute", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": "This is the title text"
        });
      }).then(function () {
        expect(element.getAttribute("title"), "Button title should be set to 'This is the title text'.").equal("This is the title text");
      });
    });

    it("should set the title attribute to empty string", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:title": ""
        });
      }).then(function () {
        expect(element.getAttribute("title"), "Button title should be empty string.").equal("");
      });
    });

    it("should apply 'accent' appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "accent"
        });
      }).then(function () {
        expect(element, "Button should have 'accent' CSS class.").to.have.class("accent");
        expect(element.getAttribute("appearance"), "Button appearance attribute should be 'accent'.").equal("accent");
      });
    });

    it("should apply 'neutral' appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "neutral"
        });
      }).then(function () {
        expect(element, "Button should have 'neutral' CSS class.").to.have.class("neutral");
        expect(element.getAttribute("appearance"), "Button appearance attribute should be 'neutral'.").equal("neutral");
      });
    });

    it("should apply 'outline' appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "outline"
        });
      }).then(function () {
        expect(element, "Button should have 'outline' CSS class.").to.have.class("outline");
        expect(element.getAttribute("appearance"), "Button appearance attribute should be 'outline'.").equal("outline");
      });
    });

    it("should apply 'lightweight' appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "lightweight"
        });
      }).then(function () {
        expect(element, "Button should have 'lightweight' CSS class.").to.have.class("lightweight");
        expect(element.getAttribute("appearance"), "Button appearance attribute should be 'lightweight'.").equal("lightweight");
      });
    });

    it("should apply 'stealth' appearance", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "stealth"
        });
      }).then(function () {
        expect(element, "Button should have 'stealth' CSS class.").to.have.class("stealth");
        expect(element.getAttribute("appearance"), "Button appearance attribute should be 'stealth'.").equal("stealth");
      });
    });

    it("should replace appearance class when switching appearances", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "accent"
        });
      }).then(function () {
        expect(element, "Button should have 'accent' class initially.").to.have.class("accent");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:appearance": "stealth"
          });
        });
      }).then(function () {
        expect(element, "Button should have 'stealth' class after switch.").to.have.class("stealth");
        expect(element.classList.contains("accent"), "Button should not have 'accent' class after switch.").to.be.false;
      });
    });

    it("should retain previous appearance when an invalid value is set", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "outline"
        });
      }).then(function () {
        expect(element, "Button should have 'outline' class.").to.have.class("outline");
        return asyncRun(function () {
          tester.dataUpdate({
            "html:appearance": "invalid"
          });
        }).then(function () {
          expect(element, "Button should retain 'outline' class after invalid appearance.").to.have.class("outline");
          expect(element.getAttribute("appearance"), "Button appearance attribute should remain 'outline'.").equal("outline");
        });
      });
    });

    it("should warn when appearance value is invalid", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearance": "primary"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'html:appearance' invalid value (primary) - Ignored.")), "Console should warn about invalid appearance value.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should reset html:appearance to default when RESET is passed", function () {
      return asyncRun(function () {
        tester.dataUpdate({ "html:appearance": "accent" });
      }).then(function () {
        expect(element, "Button should have 'accent' class before reset.").to.have.class("accent");
        return asyncRun(function () {
          tester.dataUpdate({ "html:appearance": uniface.RESET });
        });
      }).then(function () {
        expect(element, "Button should have 'neutral' class after reset.").to.have.class("neutral");
        expect(element.classList.contains("accent"), "Button should not have 'accent' class after reset.").to.be.false;
      });
    });

    it("should apply a custom CSS class", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": true
        });
      }).then(function () {
        expect(element.classList.contains("class-test"), "Button should have custom class 'class-test'.").to.be.true;
      });
    });

    it("should remove a custom CSS class", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-test": false
        });
      }).then(function () {
        expect(element.classList.contains("class-test"), "Button should not have custom class 'class-test'.").to.be.false;
      });
    });

    it("should apply multiple custom CSS classes simultaneously", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "class:class-a": true,
          "class:class-b": true
        });
      }).then(function () {
        expect(element.classList.contains("class-a"), "Button should have custom class 'class-a'.").to.be.true;
        expect(element.classList.contains("class-b"), "Button should have custom class 'class-b'.").to.be.true;
      });
    });

    it("should show text and icon with default icon-position", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in default slot position.").equal(tester.defaultValues["icon-position"]);
      });
    });

    it("should place icon in start slot when icon-position is 'start'", function () {
      let buttonText = "Click Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "icon-position": "start",
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in 'start' slot.").equal("start");
      });
    });

    it("should place icon in end slot when icon-position is 'end'", function () {
      let buttonText = "Button";
      let iconPosition = "end";
      return asyncRun(function () {
        tester.dataUpdate({
          "icon-position": iconPosition,
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in 'end' slot.").equal(iconPosition);
      });
    });

    it("should place icon in the last selected slot when text and icon are set", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in last selected slot position.").equal(tester.widget.data["icon-position"]);
      });
    });

    it("should use default icon-position when an invalid value is provided", function () {
      let buttonText = "Button";
      return asyncRun(function () {
        tester.dataUpdate({
          "icon-position": "stat",
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should display button text.").equal(buttonText);
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in default slot when invalid position is provided.").equal(tester.defaultValues["icon-position"]);
      });
    });

    it("should apply icon classes for an unrecognized icon name", function () {
      let buttonText = "Click Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Profile"
        });
      }).then(function () {
        let iconEl = element.querySelector("span.u-icon");
        assert(!iconEl.hasAttribute("hidden"), "Icon element should not be hidden.");
        expect(iconEl.classList.contains("ms-Icon"), "Icon should have ms-Icon class.").to.be.true;
        expect(iconEl.classList.contains("ms-Icon--Profile"), "Icon should have ms-Icon--Profile class.").to.be.true;
      });
    });

    it("should apply icon classes with icon-position 'start' for an unrecognized icon", function () {
      let buttonText = "Click Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Profile",
          "icon-position": "start"
        });
      }).then(function () {
        let iconEl = element.querySelector("span.u-icon");
        assert(!iconEl.hasAttribute("hidden"), "Icon element should not be hidden.");
        expect(iconEl.getAttribute("slot"), "Icon slot should be 'start'.").equal("start");
        expect(iconEl.classList.contains("ms-Icon"), "Icon should have ms-Icon class.").to.be.true;
        expect(iconEl.classList.contains("ms-Icon--Profile"), "Icon should have ms-Icon--Profile class.").to.be.true;
      });
    });

    it("should apply icon classes with icon-position 'end' for an unrecognized icon", function () {
      let buttonText = "Click Me";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Profile",
          "icon-position": "end"
        });
      }).then(function () {
        let iconEl = element.querySelector("span.u-icon");
        assert(!iconEl.hasAttribute("hidden"), "Icon element should not be hidden.");
        expect(iconEl.getAttribute("slot"), "Icon slot should be 'end'.").equal("end");
        expect(iconEl.classList.contains("ms-Icon"), "Icon should have ms-Icon class.").to.be.true;
        expect(iconEl.classList.contains("ms-Icon--Profile"), "Icon should have ms-Icon--Profile class.").to.be.true;
      });
    });

    it("should show icon-only button when value is empty", function () {
      let buttonText = "";
      return asyncRun(function () {
        tester.dataUpdate({
          "value": buttonText,
          "icon": "Home"
        });
      }).then(function () {
        expect(element.querySelector("span.u-text").innerText, "Text span should be empty.").equal(buttonText);
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be empty for icon-only button.").equal("");
      });
    });

    it("should show icon-only button with no slot when icon-position is 'start'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "icon": "AlertSolid",
          "icon-position": "start"
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be hidden.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon should be visible.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be empty for icon-only button.").equal("");
      });
    });

    it("should show icon-only button with no slot when icon-position is 'end'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "icon": "AlertSolid",
          "icon-position": "end"
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be hidden.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon should be visible.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be empty for icon-only button.").equal("");
      });
    });

    it("should show icon-only button with no slot when icon-position is invalid", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "icon": "AlertSolid",
          "icon-position": "below"
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be hidden.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon should be visible.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be empty for icon-only button.").equal("");
      });
    });

    it("should show icon element for unrecognized icon with no text", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "",
          "icon": "Profile"
        });
      }).then(function () {
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be hidden.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon element should not be hidden.");
        expect(element.querySelector("span.u-icon").classList.contains("ms-Icon"), "Icon should have ms-Icon class.").to.be.true;
        expect(element.querySelector("span.u-icon").classList.contains("ms-Icon--Profile"), "Icon should have ms-Icon--Profile class.").to.be.true;
      });
    });

    it("should replace old icon classes when icon is changed", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Click Me",
          "icon": "Home"
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "icon": "AlertSolid"
          });
        });
      }).then(function () {
        let iconEl = element.querySelector("span.u-icon");
        expect(iconEl.classList.contains("ms-Icon--Home"), "Icon should not have ms-Icon--Home class after change.").to.be.false;
        expect(iconEl.classList.contains("ms-Icon--AlertSolid"), "Icon should have ms-Icon--AlertSolid class after change.").to.be.true;
        expect(iconEl.classList.contains("ms-Icon"), "Icon should have ms-Icon class.").to.be.true;
      });
    });

    it("should hide icon and remove icon classes when icon is cleared", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Click Me",
          "icon": "Home"
        });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "icon": ""
          });
        });
      }).then(function () {
        let iconEl = element.querySelector("span.u-icon");
        assert(iconEl.hasAttribute("hidden"), "Icon should be hidden after clearing.");
        expect(iconEl.classList.contains("ms-Icon"), "Icon should not have ms-Icon class after clearing.").to.be.false;
        expect(iconEl.classList.contains("ms-Icon--Home"), "Icon should not have ms-Icon--Home class after clearing.").to.be.false;
      });
    });

    it("should reset icon slot to '' when text is removed while icon remains", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Click Me",
          "icon": "Home",
          "icon-position": "start"
        });
      }).then(function () {
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon should be in 'start' slot initially.").equal("start");
        return asyncRun(function () {
          tester.dataUpdate({
            "value": ""
          });
        });
      }).then(function () {
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon should remain visible.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be reset to empty when text is removed.").equal("");
      });
    });

    it("should warn when an unsupported property with typo is used", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:appearence": "accent"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'html:appearence' - Ignored")), "Console should warn about unsupported property with typo.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should warn when unsupported property 'label-text' is used", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "some value"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'label-text' - Ignored")), "Console should warn about unsupported property 'label-text'.").to.be.true;
        warnSpy.restore();
      });
    });

    it("should not warn for supported but unused properties", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "html:readonly": true,
          "html:minlength": 5,
          "html:maxlength": 100
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("html:readonly")), "Console should not warn about html:readonly.").to.be.false;
        expect(warnSpy.calledWith(sinon.match("html:minlength")), "Console should not warn about html:minlength.").to.be.false;
        expect(warnSpy.calledWith(sinon.match("html:maxlength")), "Console should not warn about html:maxlength.").to.be.false;
        warnSpy.restore();
      });
    });
  });

  describe("getValue()", function () {
    let widget;

    before(function () {
      tester.createWidget();
      widget = tester.widget;
    });

    it("should return empty string by default", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        expect(widget.getValue(), "getValue should return empty string by default.").to.equal("");
      });
    });

    it("should return the current button text", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Click Me"
        });
      }).then(function () {
        expect(widget.getValue(), "getValue should return 'Click Me'.").to.equal("Click Me");
      });
    });

    it("should return updated value after change", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": "Submit"
        });
      }).then(function () {
        expect(widget.getValue(), "getValue should return 'Submit' after update.").to.equal("Submit");
      });
    });
  });

  describe("blockUI()", function () {
    let element,widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    it("should apply 'u-blocked' class and disable the widget", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked, "Widget uiblocked flag should be true.").equal(true);
        expect(element.disabled, "Widget disabled property should be true.").equal(true);
      });
    });
  });

  describe("unblockUI()", function () {
    let element,widget;

    before(function () {
      element = tester.element;
      widget = tester.createWidget();
    });

    beforeEach(function () {
      widget.blockUI();
    });

    it("should remove 'u-blocked' class and enable the widget", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(element.disabled, "Widget disabled property should be false.").equal(false);
        expect(widget.data.uiblocked, "Widget uiblocked flag should be false.").equal(false);
      });
    });

    it("should retain disabled state after unblockUI()", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
        widget.unblockUI();
      }).then(function () {
        expect(element.hasAttribute("disabled"), "Button should remain disabled after unblockUI when html:disabled was true.").to.be.true;
      });
    });
  });

  describe("Reset properties", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("should reset all properties and values to initial values if initial values exist", function () {
      const initialValues = {
        "value": "Abc",
        "html:tabindex": 1,
        "html:title": "Title text",
        "html:appearance": "accent",
        "html:hidden": true,
        "html:disabled": true
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": "Xyz",
                "html:tabindex": 0,
                "html:title": "Title",
                "html:appearance": "outline",
                "html:hidden": false,
                "html:disabled": true
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector("span.u-text").innerText, "Text should be 'Xyz'.").to.equal("Xyz");
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element, "Button should have 'outline' class.").to.have.class("outline");
            expect(element.getAttribute("appearance"), "Appearance should be 'outline'.").to.equal("outline");
            expect(element.hasAttribute("hidden"), "Button should not be hidden.").to.be.false;
            expect(element.hasAttribute("disabled"), "Button should be disabled.").to.be.true;
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to initial values.
            return asyncRun(function () {
              tester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to initial values.
            expect(element.querySelector("span.u-text").innerText, "Text should be 'Abc'.").to.equal("Abc");
            expect(element.getAttribute("tabindex"), "Tabindex should be '1'.").to.equal("1");
            expect(element.getAttribute("title"), "Title should be 'Title text'.").to.equal("Title text");
            expect(element, "Button should have 'accent' class.").to.have.class("accent");
            expect(element.getAttribute("appearance"), "Appearance should be 'accent'.").to.equal("accent");
            expect(element.hasAttribute("hidden"), "Button should be hidden.").to.be.true;
            expect(element.hasAttribute("disabled"), "Button should be disabled.").to.be.true;
          })
      );
    });

    it("should reset all properties and values to default values if no initial values exist", function () {
      const initialValues = {};

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": "Xyz",
                "html:tabindex": 0,
                "html:title": "Title",
                "html:appearance": "outline",
                "html:hidden": false,
                "html:disabled": true
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector("span.u-text").innerText, "Text should be 'Xyz'.").to.equal("Xyz");
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element, "Button should have 'outline' class.").to.have.class("outline");
            expect(element.getAttribute("appearance"), "Appearance should be 'outline'.").to.equal("outline");
            expect(element.hasAttribute("hidden"), "Button should not be hidden.").to.be.false;
            expect(element.hasAttribute("disabled"), "Button should be disabled.").to.be.true;
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to default values.
            return asyncRun(function () {
              tester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to default values.
            expect(element.querySelector("span.u-text").hasAttribute("hidden"), "Text should be hidden.").to.be.true;
            expect(element.querySelector("span.u-text").innerText, "Text should be empty.").to.equal("");
            expect(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon should be hidden.").to.be.true;
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be null.").to.equal(null);
            expect(element.classList.contains("neutral"), "Button should have 'neutral' class.").to.be.true;
            expect(element.getAttribute("appearance"), "Appearance should be 'neutral'.").to.equal("neutral");
            expect(element.hasAttribute("hidden"), "Button should not be hidden.").to.be.false;
            expect(element.hasAttribute("disabled"), "Button should not be disabled.").to.be.false;
          })
      );
    });

    it("should reset specific properties and values to initial values that have initial values and leave others unchanged", function () {
      const initialValues = {
        "value": "Abc",
        "html:appearance": "accent"
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          tester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              tester.dataUpdate({
                "value": "Xyz",
                "html:tabindex": 0,
                "html:title": "Title",
                "html:appearance": "outline",
                "html:hidden": false,
                "html:disabled": true
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector("span.u-text").innerText, "Text should be 'Xyz'.").to.equal("Xyz");
            expect(element.getAttribute("tabindex"), "Tabindex should be '0'.").to.equal("0");
            expect(element.getAttribute("title"), "Title should be 'Title'.").to.equal("Title");
            expect(element, "Button should have 'outline' class.").to.have.class("outline");
            expect(element.getAttribute("appearance"), "Appearance should be 'outline'.").to.equal("outline");
            expect(element.hasAttribute("hidden"), "Button should not be hidden.").to.be.false;
            expect(element.hasAttribute("disabled"), "Button should be disabled.").to.be.true;
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset value and html:appearance properties to initial values.
            return asyncRun(function () {
              tester.resetWidget(["value", "html:appearance"]);
            });
          })
          .then(function () {
            // Step 5: Verify reset properties ('value', 'html:appearance') are restored to initial values; others remain unchanged.
            expect(element.querySelector("span.u-text").innerText, "Text should be 'Abc' after reset.").to.equal("Abc");
            expect(element.getAttribute("tabindex"), "Tabindex should remain '0' (not reset).").to.equal("0");
            expect(element.getAttribute("title"), "Title should remain 'Title' (not reset).").to.equal("Title");
            expect(element, "Button should have 'accent' class after reset.").to.have.class("accent");
            expect(element.getAttribute("appearance"), "Appearance should be reset to 'accent'.").to.equal("accent");
            expect(element.hasAttribute("hidden"), "Button should not be hidden after reset.").to.be.false;
            expect(element.hasAttribute("disabled"), "Button should remain disabled (not reset).").to.be.true;
          })
      );
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
          "value": "Go",
          "icon": "IncomingCall",
          "icon-position": "end",
          "html:appearance": "accent",
          "html:disabled": true,
          "class:class-test": true
        });
      }).then(function () {
        // Step 2: Verify all properties are applied before reuse.
        expect(element.querySelector("span.u-text").innerText, "Text should be 'Go' before reuse.").to.equal("Go");
        assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Text span should be visible before reuse.");
        assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span should be visible before reuse.");
        expect(element.querySelector("span.u-icon").getAttribute("slot"), "Icon slot should be 'end' before reuse.").to.equal("end");
        expect(element, "Button should have 'accent' class before reuse.").to.have.class("accent");
        expect(element.hasAttribute("disabled"), "Button should be disabled before reuse.").to.be.true;
        expect(element.classList.contains("class-test"), "Button should have 'class-test' class before reuse.").to.be.true;
        // Step 3: Simulate Uniface widget reuse — clean up the current occurrence, then re-initialize with defaults.
        tester.dataCleanup();
        return asyncRun(function () {
          tester.dataInit();
        });
      }).then(function () {
        // Step 4: Verify all properties and value are reset to defaults after reuse.
        assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Text span should be hidden after reuse.");
        expect(element.querySelector("span.u-text").innerText, "Text should be empty after reuse.").to.equal("");
        assert(element.querySelector("span.u-icon").hasAttribute("hidden"), "Icon span should be hidden after reuse.");
        expect(element, "Button should have 'neutral' class after reuse.").to.have.class("neutral");
        expect(element.classList.contains("accent"), "Button should not have 'accent' class after reuse.").to.be.false;
        expect(element.hasAttribute("disabled"), "Button should not be disabled after reuse.").to.be.false;
        expect(element.classList.contains("class-test"), "Button should not have 'class-test' class after reuse.").to.be.false;
      });
    });
  });
})();
