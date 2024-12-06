// UX widget is not supported yet
/* eslint-disable */

(function () {
  'use strict';

  const assert = chai.assert;
  const expect = chai.expect;

  const asyncRun = umockup.asyncRun;

  // for widget test
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;

  // toolbar definitions
  const MOCK_CONTROLS_PROPERTIES_DEFINITION = {
    properties: {
      "controls-start": "size",
      "controls-end": "last",
      "last:widget-class": "UX.Button",
      "size:widget-class": "UX.Select",
      "last:overflow-behavior": "none",
      "size:overflow-behavior": "hide",
      "last:overflow-index": "1",
      "size:overflow-index": "2",
      "last:value": "a",
      "size:value": "1",
      "size:valrep": "1=a10=1025=2550=50100=100",
      "size:label-text": "Label",
      "last:html:appearance": "accent",
      "last:style:padding": "10px",
      "last:class:classA": "true"
    }
  };

  const MOCK_CONTROLS = {
    last: {
      "overflow-behavior": "none",
      "overflow-index": "1",
      "widget-class": "UX.Button",
      "widget-cleanup-properties": {},
      "widget-properties": {
        classes: {
          classA: "true"
        },
        html: {
          appearance: "accent"
        },
        style: {
          padding: "10px"
        },
        value: "a"
      }
    },
    size: {
      "widget-properties": {
        uniface: {
          "label-text": "Label"
        },
        valrep: [
          {
            value: "1",
            representation: "a"
          },
          {
            value: "10",
            representation: "10"
          },
          {
            value: "25",
            representation: "25"
          },
          {
            value: "50",
            representation: "50"
          },
          {
            value: "100",
            representation: "100"
          }
        ],
        value: "1"
      },
      "widget-cleanup-properties": {},
      "widget-class": "UX.Select",
      "overflow-behavior": "hide",
      "overflow-index": "2"
    }
  };


  describe("Uniface Mockup tests", function () {

    it("Get class " + widgetName, function () {
      const widgetClass = tester.getWidgetClass();
      assert(widgetClass, "widgetClass is not defined! \n    Check if the JavaScript file for " + widgetName + " is loaded.");
    });

  });

  describe(widgetName + ".processLayout", function () {
    let element;

    it("processLayout, non-empty definition", function () {
      element = tester.processLayout(null, MOCK_CONTROLS_PROPERTIES_DEFINITION);
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {

      beforeEach(function () {
        element = tester.processLayout(null, MOCK_CONTROLS_PROPERTIES_DEFINITION);
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

    });

  });

  describe("Create widget", function () {

    beforeEach(function () {
      tester.construct();
    });

    it("constructor", function () {
      try {
        const widget = tester.construct();
        assert(widget, "widget is not defined!");
        assert.strictEqual(widget.widget.id.toString().length > 0, true);
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }

    });

    describe("onConnect", function () {
      it("check element created and connected", function () {
        const element = tester.processLayout(null, MOCK_CONTROLS_PROPERTIES_DEFINITION);
        const widget = tester.onConnect();

        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "widget is not connected");
      });

    });

  });

  describe("dataInit", function () {
    const defaultValues = tester.getDefaultValues();
    const classes = defaultValues.classes;
    var element;

    beforeEach(function () {
      tester.dataInit();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const clazz in classes) {
      it("check class '" + clazz + "'", function () {
        if (classes[clazz]) {
          expect(element).to.have.class(clazz, "widget element has class " + clazz);
        } else {
          expect(element).not.to.have.class(clazz, "widget element has no class " + clazz);
        }
      });
    }

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

  });

  describe("Event tests (not supported yet)", function () {
    const texts = [
      "click",
      "etc ..."
    ];

    it("mapTrigger");

    for (let i = 0; i < texts.length; i++) {
      it(texts[i]);
    }

  });

  describe("dataUpdate", function () {
    let widget;

    beforeEach(function () {
      tester.processLayout(null, MOCK_CONTROLS_PROPERTIES_DEFINITION);
      widget = tester.createWidget();
    });

    it("Set STYLE property", async function () {
      await asyncRun(function () {
        widget.dataUpdate({
          style: { "background-color": "green" }
        });

      });

      let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
      let bgColor = buttonStyle.getPropertyValue("background-color");
      assert.equal(bgColor, 'rgb(0, 128, 0)');

    });

    it("Set CLASS property", async function () {
      await asyncRun(function () {
        widget.dataUpdate({
          classes: { "ClassA": true }
        });

      });

      let classAttributeValue = widget.elements.widget.getAttribute('class');
      let classExist = classAttributeValue.includes('ClassA');
      expect(classExist).to.be.true;

    });

  });

  describe("invokeControlFunction()", function () {
    describe("if controls object is defined", function () {
      it("should call dataUpdate() of the control with the widgetProperties", async function () {
        let toolbarWidget;
        await asyncRun(function() {
          tester.processLayout(null, MOCK_CONTROLS_PROPERTIES_DEFINITION);
          tester.dataInit();
          toolbarWidget = tester.widget;
          toolbarWidget.invokeControlFunction("dataUpdate", MOCK_CONTROLS);
        });

        expect(toolbarWidget["last"].element.getAttribute("appearance")).to.equal(MOCK_CONTROLS.last["widget-properties"].html.appearance);
      });
    });
  });

  /*
    */

  describe("Other API methods (not supported yet)", function () {
    const texts = [
      "getValue",
      "validate",
      "showError",
      "etc ..."
    ];

    for (let i = 0; i < texts.length; i++) {
      it(texts[i]);
    }

  });

  describe("dataCleanup", function () {
    let widget;

    beforeEach(function () {
      widget = tester.createWidget();
    });

    it("value", function () {
      try {
        widget.dataCleanup({ value: new Set(), html: new Set(), uniface: new Set() });
      } catch (e) {
        console.error(e);
        assert(false, "Failed to call dataCleanup(), exception " + e);
      }

    });

    it("style:color", function () {
      try {
        widget.dataCleanup({ html: new Set(), style: new Set(["color"]), uniface: new Set() });
      } catch (e) {
        console.error(e);
        assert(false, "Failed to call dataCleanup(), exception " + e);
      }

    });

  });

  describe("End", function () {
    let widget;

    beforeEach(function () {
      widget = tester.createWidget();
    });

    it("Set back to default", function () {
      widget.dataUpdate({
        value: widgetName
      });

    });

  });

})();
