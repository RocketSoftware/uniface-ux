import { Widget } from "../../src/ux/framework/common/widget.js";
import { Element } from "../../src/ux/framework/workers/element.js";
import { AttributeString } from "../../src/ux/framework/workers/attribute_string.js";
import { AttributeBooleanValue } from "../../src/ux/framework/workers/attribute_boolean_value.js";
import { SubWidget } from "../../src/ux/framework/workers/sub_widget.js";
import { StyleClassManager } from "../../src/ux/framework/workers/style_class_manager.js";
import { EventTrigger } from "../../src/ux/framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../../src/ux/framework/workers/attribute_ui_blocking.js";

// Simple widget that has both subwidgets and triggers for easier testing and doens't mess with other widgets.
export class TestWidget extends Widget {

  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};

  static structure = new Element(this, "fluent-text-field", "", "", [
    new StyleClassManager(this, ["u-test-field", "u-test-field-2"]),
    new AttributeString(this, "html:current-value", "current-value", ""),
    new AttributeBooleanValue(this, "value", "checked", false),
    new AttributeUIBlocking(this, "readonly"),
    new SubWidget(this, "span", "u-change-button", ".u-change-button", "end", "change-button", "UX.Button", {
      "icon": "",
      "icon-position": "end",
      "value": "Change",
      "classes:u-change-button": true,
      "html:title": "",
      "html:appearance": ""
    }, false, ["detail"]),
    new EventTrigger(this, "onchange", "change", true),
    new EventTrigger(this, "detail", "click", true)
  ]);

}

(function () {
  "use strict";

  const expect = chai.expect;
  const sandbox = sinon.createSandbox();

  describe("Widget constructor() properly defined with subwidgets", function () {

    let widget, subWidgetId;

    it("constructor() with subWidgets", function () {
      subWidgetId = "change-button";
      widget = new TestWidget;
      expect(Object.keys(widget.subWidgetDefinitions)).to.eql([subWidgetId]);
    });

  });

  describe("Widget class methods", function () {

    let definitions, returnedProcess, testWidget, consoleLogSpy;

    definitions = {
      "widget_class": "Widget",
      "controls-center": "four\u001bfive\u001bsix",
      "controls-end": "seven",
      "controls-start": "one\u001btwo\u001bthree",
      "five:widget-class": "UX.Button",
      "four:widget-class": "UX.Button",
      "html:readonly": "true",
      "one:widget-class": "UX.Button",
      "seven:widget-class": "UX.Button",
      "six:widget-class": "UX.Button",
      "three:widget-class": "UX.Button",
      "two:widget-class": "UX.Button"
    };

    beforeEach(function () {
      testWidget = new TestWidget;
      TestWidget.reportUnsupportedTriggerWarnings = true;
      returnedProcess = TestWidget.processLayout(testWidget, definitions);
      testWidget.onConnect(returnedProcess);
      testWidget.dataInit();
    });

    it("processLayout()", function () {
      expect(returnedProcess).to.have.tagName("FLUENT-TEXT-FIELD");
      expect(returnedProcess.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
      expect(returnedProcess.querySelector("span.u-text"), "Widget misses or has incorrect u-text element.");
      expect(returnedProcess.querySelector("span.u-text").outerText).to.eql("Change");
    });

    it("onConnect()", function () {
      let connectedWidget = testWidget.onConnect(returnedProcess);

      expect(connectedWidget[0].element).instanceOf(HTMLElement);
      expect(connectedWidget[0].event_name).to.eql("");
      expect(connectedWidget[0].element).to.have.tagName("FLUENT-TEXT-FIELD");
    });

    it("mapTrigger()", function () {
      // Test with a wrong trigger, should return undefined and display a warning.
      consoleLogSpy = sandbox.spy(console, "warn");
      let badTrigger = testWidget.mapTrigger("click");
      expect(badTrigger).to.be.undefined;
      expect(consoleLogSpy.called).to.equal(true);
      sandbox.restore();

      let onchangeTrigger = testWidget.mapTrigger("onchange");
      expect(onchangeTrigger.element).instanceOf(HTMLElement);
      expect(onchangeTrigger.event_name).to.eql("change");
      expect(onchangeTrigger.element).to.have.tagName("FLUENT-TEXT-FIELD");

      let detailTrigger = testWidget.mapTrigger("detail");
      expect(detailTrigger.element).instanceOf(HTMLElement);
      expect(detailTrigger.event_name).to.eql("click");
      expect(onchangeTrigger.element).to.have.tagName("FLUENT-TEXT-FIELD");
    });

    it("dataInit()", function () {
      expect(testWidget.element, "Widget top element is not defined!");
      const dataKeys = Object.keys(testWidget.data).filter(key => key.startsWith("class:"));
      const defaultValueKeys = Object.keys(TestWidget.defaultValues).filter(key => key.startsWith("class:"));
      expect(dataKeys).to.eql(defaultValueKeys);

      expect(testWidget.data).to.have.deep.property("class:u-test-field", true);
      expect(testWidget.data).to.have.deep.property("class:u-test-field-2", true);

      expect(TestWidget.defaultValues).to.have.deep.property("class:u-test-field", true);
      expect(TestWidget.defaultValues).to.have.deep.property("class:u-test-field-2", true);
    });

    it("dataUpdate()", function () {
      const data = {
        "icon": "",
        "icon-position": "start",
        "value": true
      };

      testWidget.dataUpdate(data);

      const defaultTestWidget = new TestWidget;
      defaultTestWidget.onConnect(returnedProcess);
      defaultTestWidget.dataInit();

      // Expect widget properties to differ from the initial Widget.
      expect(defaultTestWidget.data).to.not.eql(testWidget.data);

      // Exepct widget properties to be updated with the new data object.
      expect(testWidget.data.value).to.equal(true);
      expect(testWidget.data.icon).to.equal("");
      expect(testWidget.data["icon-position"]).to.equal("start");

      // Expect the widget to still have the default values that were not updated by dataUpdate().
      expect(testWidget.data["change-button"]).to.equal(false);
      expect(testWidget.data["format-error"]).to.equal(false);
      expect(testWidget.data["format-error-message"]).to.equal("");
      expect(testWidget.data["html:current-value"]).to.equal("");
    });


    describe("dataCleanup()", function () {
      const mockData = {
        "class:class-test-1": "true",
        "class:class-test-2": "true"
      };
      const mockPropertNames = new Set(["class:class-test-1", "class:class-test-2"]);

      it("clean all class properties of the widget that are received as parameters in the dataCleanup() function", function () {
        testWidget.dataUpdate(mockData);
        expect(testWidget.elements.widget, "Widget top element is not defined!");

        testWidget.dataCleanup(mockPropertNames);
        mockPropertNames.forEach((propertyName) => {
          const className = propertyName.split(":")[1];
          expect(testWidget.elements.widget.classList.contains(className)).to.equal(false);
        });
      });
    });

    it("getValue()", function () {
      const value = testWidget.getValue();
      expect(value).to.equal(false);
    });

    // Validate only returns null for the time being.
    it("validate", function () {
      const returnNull = testWidget.validate();
      expect(returnNull).to.equal(null);
    });

    it("showError()", function () {
      const errorString = "{ \"change-button\": \"This is a testing error\" }";
      const errorReturn = {
        "error": true,
        "error-message": errorString
      };

      testWidget.showError(errorString);
      expect(testWidget.data).to.have.any.keys(errorReturn);
      expect(testWidget.data["error-message"]).equal(errorString);
      expect(testWidget.data["error"]).equal(true);
    });

    it("hideError()", function () {
      const errorReturn = {
        "error": false,
        "error-message": ""
      };

      testWidget.hideError();
      expect(testWidget.data).to.have.any.keys(errorReturn);
      expect(testWidget.data["error-message"]).equal("");
      expect(testWidget.data["error"]).equal(false);
    });

    it("blockUI()", function () {
      expect(testWidget.elements.widget.readOnly).to.equal(undefined);

      testWidget.blockUI();
      expect(testWidget.elements.widget.readOnly).to.equal(true);
    });

    it("unblockUI()", function () {
      expect(testWidget.elements.widget.readOnly).to.equal(undefined);

      testWidget.blockUI();
      expect(testWidget.elements.widget.readOnly).to.equal(true);

      testWidget.unblockUI();
      expect(testWidget.elements.widget.readOnly).to.equal(false);
    });
  });
})();
