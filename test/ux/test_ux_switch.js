(function () {
  "use strict";

  const asyncRun = umockup.asyncRun;
  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;

  describe("Uniface mockup tests", function () {
    it(`Get class ${widgetName}`, function () {
      const widgetClass = tester.getWidgetClass();
      assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
    });
  });

  describe("Uniface static structure constructor() definition", function () {
    it("should have a static property structure of type Element", function () {
      const widgetClass = tester.getWidgetClass();
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("fluent-switch");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
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
        expect(element).instanceOf(HTMLElement, `Function processLayout of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["fluent-switch"];
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

      it("check u-checked-message", function () {
        assert(element.querySelector("span.u-checked-message"), "Widget misses or has incorrect u-checked-message element.");
      });

      it("check u-unchecked-message", function () {
        assert(element.querySelector("span.u-unchecked-message"), "Widget misses or has incorrect u-unchecked-message element.");
      });

      it("check u-error-icon", function () {
        assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element.");
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
        assert(widgetClass.defaultValues["class:u-switch"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    it("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();
      assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").hasAttribute("part"), "Attribute is added to defined slot element.");
      assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").getAttribute("part") === "switch-toggle", "Attribute value is not switch-toggle.");
      assert(element, "Target element is not defined!");
      assert(widget.elements.widget === element, "Widget is not connected.");
    });
  });

  describe("mapTrigger()", function () {
    let widget;
    const testData = {
      "onchange": "change"
    };

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

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    beforeEach(function () {
      tester.dataInit();
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

    it("check default values of label-text and label-position", function () {
      assert.equal(tester.defaultValues["label-text"], "", "Default value of label-text should be empty.");
      assert.equal(tester.defaultValues["label-position"], "before", "Default value of label-position should be before.");
    });
  });

  describe("dataUpdate()", function () {
    let element;
    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set value to 1 and make the switch toggle", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": 1
        });
      }).then(function () {
        expect(element).to.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("true");
      });
    });

    it("set value to false and make the switch toggle in unchecked state", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": false
        });
      }).then(function () {
        expect(element).to.not.have.class("checked");
        expect(element.getAttribute("current-checked")).equal("false");
      });
    });

    it("set label to switch", function () {
      let switchLabelText = "Label";
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": switchLabelText
        });
      }).then(function () {
        let labelText = element.querySelector("span.u-label-text").innerText;
        assert.equal(labelText, switchLabelText);
        assert(!element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text.");

        // Checking the visual order of elements.
        const label = element.querySelector("span.u-label-text").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(widget.right).to.be.greaterThan(label.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("1");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
      });
    });

    it("set label-position after", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after"
        });
      }).then(function () {
        let labelPosition = element.getAttribute("u-label-position");
        assert.equal(labelPosition, "after", "Label position is not set to after.");

        // Checking the visual order of elements.
        const label = element.querySelector("span.u-label-text").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(label.right).to.be.greaterThan(widget.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("3");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("1");
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
        assert.equal(labelPosition, "before");
        assert(element.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text.");
        assert.equal(element.querySelector("span.u-label-text").innerText, "", "Label text is not empty.");
      });
    });

    it("show console warning for invalid label-position above", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "above"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (above) - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("show console warning for invalid label-position below", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        tester.dataUpdate({
          "label-position": "below"
        });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Property 'label-position' invalid value (below) - Ignored."))).to.be.true;
        warnSpy.restore();
      });
    });

    it("set checked message", function () {
      let switchCheckedText = "On";
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": switchCheckedText,
          "value": 1
        });
      }).then(function () {
        let checkedText = element.querySelector("span.u-checked-message").innerText;
        const checkedTextSlot = element.shadowRoot.querySelector(".checked-message");
        assert.equal(checkedText, switchCheckedText);
        expect(checkedTextSlot.scrollWidth).not.to.be.greaterThan(checkedTextSlot.clientWidth);

        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message span.");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide the unchecked message span.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");

        // Checking the visual order of elements.
        const statusMsg = element.querySelector("span.u-checked-message").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(statusMsg.right).to.be.greaterThan(widget.right);

        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");
      });
    });

    it("truncates checked message with ellipsis if length exceeds 12 characters", function () {
      let longMessage = "This is a very long checked message";
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": longMessage,
          "value": 1
        });
      }).then(function () {
        const checkedText = element.querySelector("span.u-checked-message").innerText;
        const checkedTextSlot = element.shadowRoot.querySelector(".checked-message");
        assert.equal(checkedText, longMessage);

        const computedStyle = window.getComputedStyle(checkedTextSlot);
        expect(computedStyle.overflow).to.equal("hidden");
        expect(computedStyle.whiteSpace).to.equal("nowrap");
        expect(computedStyle.textOverflow).to.equal("ellipsis");
        expect(checkedTextSlot.scrollWidth).to.be.greaterThan(checkedTextSlot.clientWidth);

        // Checking the visual order of elements.
        const statusMsg = element.querySelector("span.u-checked-message").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(statusMsg.left).to.be.greaterThan(widget.left);

        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");
      });
    });

    it("set unchecked message", function () {
      let switchUnCheckedText = "Off";
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "",
          "unchecked-message": switchUnCheckedText,
          "value": 0
        });
      }).then(function () {
        let uncheckedText = element.querySelector("span.u-unchecked-message").innerText;
        const uncheckedTextSlot = element.shadowRoot.querySelector(".unchecked-message");
        assert.equal(uncheckedText, switchUnCheckedText);
        expect(uncheckedTextSlot.scrollWidth).not.to.be.greaterThan(uncheckedTextSlot.clientWidth);

        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message span.");
        assert(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide the checked message span.");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");

        // Checking the visual order of elements.
        const statusMsg = element.querySelector("span.u-unchecked-message").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(statusMsg.right).to.be.greaterThan(widget.right);

        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");
      });
    });

    it("truncates unchecked message with ellipsis if length exceeds 12 characters", function () {
      let longMessage = "This is a very long unchecked message";
      return asyncRun(function () {
        tester.dataUpdate({
          "unchecked-message": longMessage,
          "value": 0
        });
      }).then(function () {
        let uncheckedText = element.querySelector("span.u-unchecked-message").innerText;
        const uncheckedTextSlot = element.shadowRoot.querySelector(".unchecked-message");
        assert.equal(uncheckedText, longMessage);

        const computedStyle = window.getComputedStyle(uncheckedTextSlot);
        expect(computedStyle.overflow).to.equal("hidden");
        expect(computedStyle.whiteSpace).to.equal("nowrap");
        expect(computedStyle.textOverflow).to.equal("ellipsis");
        expect(uncheckedTextSlot.scrollWidth).to.be.greaterThan(uncheckedTextSlot.clientWidth);

        // Checking the visual order of elements.
        const statusMsg = element.querySelector("span.u-unchecked-message").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(statusMsg.left).to.be.greaterThan(widget.left);

        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");
      });
    });

    it("checked/unchecked message should be present after the control when label-position is 'before'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "before",
          "value": 1,
          "checked-message": "On",
          "unchecked-message": "Off"
        });
      }).then(function () {
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message span.");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the unchecked message span.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        expect(element.querySelector("span.u-label-text").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");

        // Checking the visual order of elements.
        const checkedMessage = element.shadowRoot.querySelector(".status-message").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(control.right).to.be.greaterThan(label.right);
        expect(control.left).to.be.greaterThan(label.left);
        expect(checkedMessage.left).to.be.greaterThan(control.left);
        expect(checkedMessage.right).to.be.greaterThan(control.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("1");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");
      });
    });

    it("checked/unchecked message should be present between control and label text when label-position is 'after'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "value": 1,
          "checked-message": "On",
          "unchecked-message": "Off"
        });
      }).then(function () {
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message span.");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the unchecked message span.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        expect(element.querySelector("span.u-label-text").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-error-icon").getAttribute("slot")).equal("");

        // Checking the visual order of elements.
        const checkedMessage = element.shadowRoot.querySelector(".status-message").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(checkedMessage.left).to.be.greaterThan(control.left);
        expect(checkedMessage.right).to.be.greaterThan(control.right);
        expect(label.right).to.be.greaterThan(checkedMessage.right);
        expect(label.left).to.be.greaterThan(checkedMessage.left);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("2");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("1");
      });
    });

    it("verify space is reserved when switch is in checked state and unchecked message is defined", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "checked-message": "",
          "unchecked-message": "Off",
          "value": 1
        });
      }).then(function () {
        assert(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide the checked message span.");
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message span.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");

        const statusMsgSlot = element.shadowRoot.querySelector(".status-message");
        const reservedWidthInPixels = parseFloat(window.getComputedStyle(statusMsgSlot).width);
        expect(reservedWidthInPixels).to.be.greaterThan(0);
      });
    });

    it("verify space is reserved when switch is in unchecked state and checked message is defined", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "before",
          "checked-message": "On",
          "unchecked-message": "",
          "value": 0
        });
      }).then(function () {
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message span.");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide the unchecked message span.");
        assert(element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to hide the error icon.");

        const statusMsgSlot = element.shadowRoot.querySelector(".status-message");
        const reservedWidthInPixels = parseFloat(window.getComputedStyle(statusMsgSlot).width);
        expect(reservedWidthInPixels).to.be.greaterThan(0);
      });
    });

    it("verify space is reserved when switch is in error state and checked message is defined", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "checked-message": "On",
          "unchecked-message": "",
          "value": 2
        });
      }).then(function () {
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message span.");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide the unchecked message span.");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");

        const statusMsgSlot = element.shadowRoot.querySelector(".status-message");
        const reservedWidthInPixels = parseFloat(window.getComputedStyle(statusMsgSlot).width);
        expect(reservedWidthInPixels).to.be.greaterThan(0);
      });
    });

    it("verify no space is reserved when switch is in error state and neither checked/unchecked message is defined", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "checked-message": "",
          "unchecked-message": "",
          "value": 2
        });
      }).then(function () {
        assert(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide the checked message span.");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide the unchecked message span.");
        assert(!element.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the error icon.");

        const statusMsgSlot = element.shadowRoot.querySelector(".status-message");
        const reservedWidthInPixels = parseFloat(window.getComputedStyle(statusMsgSlot).width);
        expect(reservedWidthInPixels).to.equal(0);
      });
    });

    it("set invalid value when switch checked state is false", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "value": ""
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message");
      });
    });

    it("shows error icon on correct side when label-position is 'before'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "before",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message");

        // Checking the visual order of elements.
        const errorIcon = element.querySelector(".u-error-icon").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const widget = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(widget.right).to.be.greaterThan(errorIcon.right);
        expect(errorIcon.right).to.be.greaterThan(label.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("1");
        // Checking the value of style property 'order' for error icon.
        const computedStylesError = window.getComputedStyle(element.shadowRoot.querySelector(".error"));
        expect(computedStylesError.order).to.equal("2");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
      });
    });

    it("shows error icon on correct side when label-position is 'after'", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "label-text": "Label Text",
          "label-position": "after",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        expect(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message");

        // Checking the visual order of elements.
        const errorIcon = element.querySelector(".u-error-icon").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(errorIcon.right).to.be.greaterThan(control.right);
        expect(label.right).to.be.greaterThan(errorIcon.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("3");
        // Checking the value of style property 'order' for error icon.
        const computedStylesError = window.getComputedStyle(element.shadowRoot.querySelector(".error"));
        expect(computedStylesError.order).to.equal("2");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("1");
      });
    });

    it("set error to true with checked and unchecked messages and label position after", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "On",
          "unchecked-message": "Off",
          "label-position": "after",
          "label-text": "Label Text",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        // Checking the visual order of elements.
        const errorIcon = element.querySelector(".u-error-icon").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(errorIcon.right).to.be.greaterThan(control.right);
        expect(label.left).to.be.greaterThan(errorIcon.left);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("3");
        // Checking the value of style property 'order' for error icon.
        const computedStylesError = window.getComputedStyle(element.shadowRoot.querySelector(".error"));
        expect(computedStylesError.order).to.equal("2");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("2");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("1");

        // If there are checked and unchecked messages to be shown, the slots should not be hidden once the error is removed.
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message slot");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message slot");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
      });
    });

    it("set error to true with checked and unchecked messages and label position before", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "On",
          "unchecked-message": "Off",
          "label-position": "before",
          "label-text": "Label Text",
          "value": 123
        });
      }).then(function () {
        expect(element).to.have.class("u-format-invalid");
        // Checking the visual order of elements.
        const errorIcon = element.querySelector(".u-error-icon").getBoundingClientRect();
        const label = element.shadowRoot.querySelector("label").getBoundingClientRect();
        const control = element.shadowRoot.querySelector(".switch").getBoundingClientRect();
        expect(control.left).to.be.greaterThan(errorIcon.left);
        expect(errorIcon.right).to.be.greaterThan(label.right);

        // Checking the value of style property 'order' for label-text.
        const computedStylesLabel = window.getComputedStyle(element.shadowRoot.querySelector(".label"));
        expect(computedStylesLabel.order).to.equal("1");
        // Checking the value of style property 'order' for error icon.
        const computedStylesError = window.getComputedStyle(element.shadowRoot.querySelector(".error"));
        expect(computedStylesError.order).to.equal("2");
        // Checking the value of style property 'order' for the switch control.
        const computedStylesSwitch = window.getComputedStyle(element.shadowRoot.querySelector(".switch"));
        expect(computedStylesSwitch.order).to.equal("3");
        // Checking the value of style property 'order' for status message.
        const computedStylesMessage = window.getComputedStyle(element.shadowRoot.querySelector(".status-message"));
        expect(computedStylesMessage.order).to.equal("4");

        // If there are checked and unchecked messages to be shown, the slots should not be hidden once the error is removed.
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message slot");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message slot");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
      });
    });

    it("set error to false with checked and unchecked messages", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "On",
          "unchecked-message": "Off",
          "value": 1
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        // If there are checked and unchecked messages to be shown, the slots should not be hidden once the error is removed.
        assert(!element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the unchecked message slot");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
        assert(!element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message slot");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
      });
    });

    it("set error to false without checked and unchecked messages", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "checked-message": "",
          "unchecked-message": "",
          "value": 1
        });
      }).then(function () {
        expect(element).to.not.have.class("u-format-invalid");
        // If there are no messages to show in the slot, they should still be kept hidden even after the error has been removed
        assert(element.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to keep the unchecked message slot hidden.");
        expect(element.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
        assert(element.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to keep the checked message slot hidden.");
        expect(element.querySelector("span.u-checked-message").getAttribute("slot")).equal("");
      });
    });
  });

  describe("Switch onchange trigger", function () {
    const triggerMap = {
      "onchange" : function () {
        const value = tester.widget.getValue();
        tester.debugLog(`Onchange trigger has been called at ${new Date().toLocaleTimeString()}, new value: ${value}!`);
      }
    };
    const trigger = "onchange";

    beforeEach(async function () {
      await asyncRun(function () {
        tester.createWidget(triggerMap);
      });

      tester.resetTriggerCalled(trigger);
    });

    // Test case for the onchange trigger.
    it("should call the onchange trigger handler when the switch is clicked", async function () {
      // Simulate a click event
      await tester.asyncUserClick();

      // Assert that the onchange trigger handler was called once.
      expect(tester.calledOnce(trigger)).to.be.true;
      // Expected the value is the 3rd item of valRepArray.
      expect(tester.widget.getValue()).to.equal(true, "Widget value");
    });

  });

  describe("blockUI()", function () {
    let element, widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    it("check if the 'u-blocked' class is applied and ensure the widget is disabled when the blockUI() is invoked", function () {
      return asyncRun(function () {
        widget.blockUI();
      }).then(function () {
        expect(element, "Class u-blocked is not applied.").to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(true);
        expect(element.disabled).equal(true);
        expect(element.ariaDisabled).equal("true");
      });
    });
  });

  describe("unblockUI()", function () {
    let element, widget;
    before(function () {
      widget = tester.createWidget();
      element = tester.element;
    });

    beforeEach(function () {
      widget.blockUI();
    });

    it("check if the 'u-blocked' class is removed and ensure the widget is not disabled when the unblockUI() is invoked", function () {
      return asyncRun(function () {
        widget.unblockUI();
      }).then(function () {
        expect(element, "Class u-blocked is applied.").not.to.have.class("u-blocked");
        expect(widget.data.uiblocked).equal(false);
        expect(element.disabled).equal(false);
        expect(element.ariaDisabled).equal("false");
      });
    });

    it("check if the disabled mode is retained when the unblockUI() is called", function () {
      return asyncRun(function () {
        tester.dataUpdate({
          "html:disabled": true
        });
        widget.unblockUI();
      }).then(function () {
        expect(element.hasAttribute("disabled")).to.be.true;
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.createWidget();
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        console.error(e);
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });
})();