/* global chai, describe, it, before, beforeEach, sinon, UNIFACE */

(function () {
  "use strict";

  const expect = chai.expect;

  /**
   * Button is registered in the bundle loaded by the test harness HTML page.
   * Using the registry avoids a direct source import that would pull in
   * the unresolvable bare specifier "@fluentui/web-components".
   */
  const Button = UNIFACE.ClassRegistry.get("UX.Button");


  /**
   * MockWidgetClass - mimics a widget class with static registries
   * that workers register into during construction.
   */
  class MockWidgetClass {
    static subWidgets = {};
    static subWidgetWorkers = [];
    static defaultValues = {};
    static setters = {};
    static getters = {};
    static triggers = {};
    static structure = { "childWorkers": [] };

    static getNode(node, propId) {
      return propId ? node[propId] : undefined;
    }

    static staticLog() {}
  }

  /** Resets MockWidgetClass static registries to pristine state. */
  function resetMockWidgetClass() {
    MockWidgetClass.subWidgets = {};
    MockWidgetClass.subWidgetWorkers = [];
    MockWidgetClass.defaultValues = {};
    MockWidgetClass.setters = {};
    MockWidgetClass.getters = {};
    MockWidgetClass.triggers = {};
  }

  /**
   * Creates a minimal mock widgetInstance that ElementText / ElementIcon workers expect.
   */
  function createMockWidgetInstance(data = {}) {
    const widgetElement = document.createElement("fluent-button");

    const textSpan = document.createElement("span");
    textSpan.classList.add("u-text");
    widgetElement.appendChild(textSpan);

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("u-icon");
    widgetElement.appendChild(iconSpan);

    return {
      "data": data,
      "elements": { "widget": widgetElement },
      "getTraceDescription": function () {
        return "traceDescription";
      }
    };
  }

  describe("Button", function () {

    beforeEach(function () {
      resetMockWidgetClass();
    });

    describe("Static members", function () {

      it("should have subWidgets as an empty object", function () {
        expect(Button.subWidgets, "SubWidgets should be an empty object.").to.deep.equal({});
      });

      it("should have subWidgetWorkers as an empty array", function () {
        expect(Button.subWidgetWorkers, "SubWidgetWorkers should be an empty array.").to.deep.equal([]);
      });

      it("should have a structure property", function () {
        expect(Button.structure, "Structure should be defined.").to.exist;
      });

      it("should have defaultValues as a non-empty object", function () {
        expect(Button.defaultValues, "defaultValues should be a non-empty object.").to.not.be.empty;
      });

      it("should have setters as a non-empty object", function () {
        expect(Button.setters, "setters should be a non-empty object.").to.not.be.empty;
      });

      it("should have getters as a non-empty object", function () {
        expect(Button.getters, "getters should be a non-empty object.").to.not.be.empty;
      });

      it("should have triggers as a non-empty object", function () {
        expect(Button.triggers, "triggers should be a non-empty object.").to.not.be.empty;
      });

    });

    describe("getValueFormattedSetters()", function () {
      let result;

      before(function () {
        result = Button.getValueFormattedSetters();
      });

      it("should return an array", function () {
        expect(result, "getValueFormattedSetters() should return an array.").to.be.an("array");
      });

      it("should include 'value' in the returned array", function () {
        expect(result, "Returned array should include 'value'.").to.include("value");
      });

      it("should include 'error' in the returned array", function () {
        expect(result, "Returned array should include 'error'.").to.include("error");
      });

      it("should include 'error-message' in the returned array", function () {
        expect(result, "Returned array should include 'error-message'.").to.include("error-message");
      });

      it("should include 'icon' in the returned array", function () {
        expect(result, "Returned array should include 'icon'.").to.include("icon");
      });

      it("should return exactly four items", function () {
        expect(result.length, "Returned array should have exactly 4 entries.").to.equal(4);
      });

    });

    describe("getValueFormatted()", function () {

      it("should return primaryPlainText from value property", function () {
        const properties = { "value": "Click Me" };
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should equal the 'value' property.").to.equal("Click Me");
      });

      it("should return empty string for primaryPlainText when value is missing", function () {
        const properties = {};
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should be an empty string when value is undefined.").to.equal("");
      });

      it("should return empty string for primaryPlainText when value is empty string", function () {
        const properties = { "value": "" };
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should be an empty string.").to.equal("");
      });

      it("should return prefixIcon from icon property", function () {
        const properties = {
          "value": "OK",
          "icon": "Add"
        };
        const result = Button.getValueFormatted(properties);
        expect(result.prefixIcon, "prefixIcon should equal the 'icon' property.").to.equal("Add");
      });

      it("should return undefined prefixIcon when icon is not provided", function () {
        const properties = { "value": "OK" };
        const result = Button.getValueFormatted(properties);
        expect(result.prefixIcon, "prefixIcon should be undefined when icon is absent.").to.be.undefined;
      });

      it("should return empty string for prefixIcon when icon is empty string", function () {
        const properties = {
          "value": "OK",
          "icon": ""
        };
        const result = Button.getValueFormatted(properties);
        expect(result.prefixIcon, "prefixIcon should be an empty string when icon is empty string.").to.equal("");
      });

      it("should return empty string for primaryPlainText when value is null", function () {
        const properties = { "value": null };
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should be an empty string for null value.").to.equal("");
      });

      it("should ignore 'icon-position' and return only primaryPlainText and prefixIcon when icon-position is 'start'", function () {
        const properties = {
          "value": "Prev",
          "icon": "AddHome",
          "icon-position": "start"
        };
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should be 'Prev'.").to.equal("Prev");
        expect(result.prefixIcon, "prefixIcon should be 'AddHome'.").to.equal("AddHome");
        expect(Object.keys(result).length, "Formatted result should only contain 'primaryPlainText' and 'prefixIcon'.").to.equal(2);
      });

      it("should ignore 'icon-position' and return only primaryPlainText and prefixIcon when icon-position is 'end'", function () {
        const properties = {
          "value": "Prev",
          "icon": "AddHome",
          "icon-position": "end"
        };
        const result = Button.getValueFormatted(properties);
        expect(result.primaryPlainText, "primaryPlainText should be 'Prev'.").to.equal("Prev");
        expect(result.prefixIcon, "prefixIcon should be 'AddHome'.").to.equal("AddHome");
        expect(Object.keys(result).length, "Formatted result should only contain 'primaryPlainText' and 'prefixIcon'.").to.equal(2);
      });

    });

    describe("showError()", function () {
      let button;

      beforeEach(function () {
        button = new Button();
      });

      /**
       * sinon.stub is used instead of sinon.spy because console.error IS the implementation of showError().
       * A spy would let the real console.error fire, flooding the console with red errors during the test run.
       */
      it("should call console.error with the error message", function () {
        const stub = sinon.stub(console, "error");
        button.showError("Something went wrong");
        expect(stub.calledOnce, "console.error() should be called once.").to.be.true;
        expect(stub.firstCall.args[0], "console.error() should receive the error message.").to.equal("Something went wrong");
        stub.restore();
      });

      it("should handle empty string error message", function () {
        const stub = sinon.stub(console, "error");
        button.showError("");
        expect(stub.calledOnce, "console.error() should be called for an empty string message.").to.be.true;
        expect(stub.firstCall.args[0], "console.error() should receive an empty string.").to.equal("");
        stub.restore();
      });

      it("should handle null error message", function () {
        const stub = sinon.stub(console, "error");
        button.showError(null);
        expect(stub.calledOnce, "console.error() should be called for a null message.").to.be.true;
        expect(stub.firstCall.args[0], "console.error() should receive null.").to.equal(null);
        stub.restore();
      });

    });

    describe("hideError()", function () {
      let button;

      beforeEach(function () {
        button = new Button();
      });

      // hideError() has an empty body — this test verifies calling it does not throw a JavaScript exception.
      it("should not throw exception when called", function () {
        expect(function () {
          button.hideError();
        }, "hideError() should not throw exception when called.").to.not.throw();
      });

    });

    describe("ElementText constructor()", function () {

      it("should register a setter for 'value'", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        expect(MockWidgetClass.setters["value"], "Setter for 'value' should be registered as an array.").to.be.an("array");
        expect(MockWidgetClass.setters["value"], "Setter for 'value' should contain the worker.").to.include(worker);
      });

      it("should register a getter for 'value'", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        expect(MockWidgetClass.getters["value"], "Getter for 'value' should be the worker.").to.equal(worker);
      });

      it("should register default value for 'value' as empty string", function () {
        new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        expect(MockWidgetClass.defaultValues["value"], "Default value for 'value' should be an empty string.").to.equal("");
      });

      it("should store styleClass", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        expect(worker.styleClass, "styleClass should be 'u-text'.").to.equal("u-text");
      });

      it("should store elementQuerySelector", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        expect(worker.elementQuerySelector, "elementQuerySelector should be '.u-text'.").to.equal(".u-text");
      });

      it("should handle empty string styleClass", function () {
        const worker = new Button.ElementText(MockWidgetClass, "", ".u-text");
        expect(worker.styleClass, "styleClass should be an empty string.").to.equal("");
      });

    });

    describe("ElementText getLayout()", function () {

      it("should return a span element", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        const element = worker.getLayout();
        expect(element.tagName, "getLayout() should return a SPAN element.").to.equal("SPAN");
      });

      it("should add styleClass to the span element", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        const element = worker.getLayout();
        expect(element.classList.contains("u-text"), "Span should have the 'u-text' class.").to.be.true;
      });

      it("should not add class when styleClass is falsy", function () {
        const worker = new Button.ElementText(MockWidgetClass, "", ".u-text");
        const element = worker.getLayout();
        expect(element.classList.length, "Span should have no classes when styleClass is empty.").to.equal(0);
      });

    });

    describe("ElementText refresh()", function () {
      let worker;

      beforeEach(function () {
        worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
      });

      it("should show element and set innerText when value exists", function () {
        const instance = createMockWidgetInstance({ "value": "Click Me" });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should not be hidden when value exists.").to.be.false;
        expect(span.innerText, "Span innerText should equal the value.").to.equal("Click Me");
      });

      it("should hide element and clear innerText when value is empty string", function () {
        const instance = createMockWidgetInstance({ "value": "" });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should be hidden when value is empty.").to.be.true;
        expect(span.innerText, "Span innerText should be empty.").to.equal("");
      });

      it("should hide element and clear innerText when value is null", function () {
        const instance = createMockWidgetInstance({ "value": null });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should be hidden when value is null.").to.be.true;
        expect(span.innerText, "Span innerText should be empty.").to.equal("");
      });

      it("should hide element when value is undefined (absent from data)", function () {
        const instance = createMockWidgetInstance({});
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should be hidden when value is undefined.").to.be.true;
        expect(span.innerText, "Span innerText should be empty.").to.equal("");
      });

      it("should set value as plain text, not parsed HTML", function () {

        /**
         * This test guards against replacing innerText with innerHTML.
         * If innerHTML were used, the tag would be parsed and innerText would return only 'Click'.
         */
        const instance = createMockWidgetInstance({ "value": "<b>Click</b>" });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.innerText, "Span innerText should contain the literal string, not rendered HTML.").to.equal("<b>Click</b>");
      });

      it("should HTML-encode special characters in the span's innerHTML", function () {

        /**
         * When innerText is set, the browser escapes '<' and '>' in innerHTML.
         * If innerHTML were used instead, this escaping would not occur and could expose an XSS vector.
         */
        const instance = createMockWidgetInstance({ "value": "<script>alert(1)</script>" });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.innerHTML, "innerHTML should contain HTML-escaped characters, not a raw script tag.").to.not.include("<script>");
      });

    });

    describe("ElementText getValue()", function () {
      let worker;

      beforeEach(function () {
        worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
      });

      it("should return the value from widgetInstance data", function () {
        const instance = createMockWidgetInstance({ "value": "Submit" });
        const result = worker.getValue(instance);
        expect(result, "getValue() should return the 'value' property.").to.equal("Submit");
      });

      it("should return undefined when value is not in data", function () {
        const instance = createMockWidgetInstance({});
        const result = worker.getValue(instance);
        expect(result, "getValue() should return undefined when value is absent.").to.be.undefined;
      });

      it("should return null when value is explicitly null", function () {
        const instance = createMockWidgetInstance({ "value": null });
        const result = worker.getValue(instance);
        expect(result, "getValue() should return null when value is null.").to.be.null;
      });

      it("should return empty string when value is empty string", function () {
        const instance = createMockWidgetInstance({ "value": "" });
        const result = worker.getValue(instance);
        expect(result, "getValue() should return an empty string.").to.equal("");
      });

    });

    describe("ElementText getValueAsFormattedHTML()", function () {
      let worker;

      beforeEach(function () {
        worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
      });

      it("should return innerHTML of the text element", function () {
        const instance = createMockWidgetInstance({ "value": "Hello" });
        // Manually set innerHTML to simulate rendered content.
        const span = instance.elements.widget.querySelector(".u-text");
        span.innerHTML = "<b>Hello</b>";
        const result = worker.getValueAsFormattedHTML(instance);
        expect(result, "getValueAsFormattedHTML() should return the innerHTML of the element.").to.equal("<b>Hello</b>");
      });

      it("should return empty string when element has no content", function () {
        const instance = createMockWidgetInstance({});
        const result = worker.getValueAsFormattedHTML(instance);
        expect(result, "getValueAsFormattedHTML() should return an empty string for an empty element.").to.equal("");
      });

    });

    describe("ElementText getValueUpdaters()", function () {
      let worker;

      beforeEach(function () {
        worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
      });

      it("should return undefined", function () {
        const instance = createMockWidgetInstance({});
        const result = worker.getValueUpdaters(instance);
        expect(result, "getValueUpdaters() should return undefined.").to.be.undefined;
      });

    });

    describe("ElementIcon constructor()", function () {

      it("should register a setter for 'value'", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(MockWidgetClass.setters["value"], "Setter for 'value' should include the ElementIcon worker.").to.include(worker);
      });

      it("should register a setter for 'icon'", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(MockWidgetClass.setters["icon"], "Setter for 'icon' should be an array.").to.be.an("array");
        expect(MockWidgetClass.setters["icon"], "Setter for 'icon' should include the worker.").to.include(worker);
      });

      it("should register a setter for 'icon-position'", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(MockWidgetClass.setters["icon-position"], "Setter for 'icon-position' should be an array.").to.be.an("array");
        expect(MockWidgetClass.setters["icon-position"], "Setter for 'icon-position' should include the worker.").to.include(worker);
      });

      it("should register default value for 'icon' as empty string", function () {
        new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(MockWidgetClass.defaultValues["icon"], "Default value for 'icon' should be an empty string.").to.equal("");
      });

      it("should register default value for 'icon-position' as 'start'", function () {
        new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(MockWidgetClass.defaultValues["icon-position"], "Default value for 'icon-position' should be 'start'.").to.equal("start");
      });

      it("should store styleClass", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(worker.styleClass, "styleClass should be 'u-icon'.").to.equal("u-icon");
      });

      it("should handle empty string styleClass", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "", ".u-icon");
        expect(worker.styleClass, "styleClass should be an empty string.").to.equal("");
      });

      it("should store elementQuerySelector", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        expect(worker.elementQuerySelector, "elementQuerySelector should be '.u-icon'.").to.equal(".u-icon");
      });

    });

    describe("ElementIcon getLayout()", function () {

      it("should return a span element", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        const element = worker.getLayout();
        expect(element.tagName, "getLayout() should return a SPAN element.").to.equal("SPAN");
      });

      it("should add styleClass to the span element", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
        const element = worker.getLayout();
        expect(element.classList.contains("u-icon"), "Span should have the 'u-icon' class.").to.be.true;
      });

      it("should not add class when styleClass is falsy", function () {
        const worker = new Button.ElementIcon(MockWidgetClass, "", ".u-icon");
        const element = worker.getLayout();
        expect(element.classList.length, "Span should have no classes when styleClass is empty.").to.equal(0);
      });

    });

    describe("ElementIcon refresh()", function () {
      let worker;

      beforeEach(function () {
        worker = new Button.ElementIcon(MockWidgetClass, "u-icon", ".u-icon");
      });

      it("should show icon with ms-Icon classes when icon is set", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.hidden, "Span should not be hidden when icon is set.").to.be.false;
        expect(span.classList.contains("ms-Icon"), "Span should have the 'ms-Icon' class.").to.be.true;
        expect(span.classList.contains("ms-Icon--Add"), "Span should have the 'ms-Icon--Add' class.").to.be.true;
      });

      it("should set slot to icon-position when text value exists", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": "end"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.getAttribute("slot"), "Slot should be set to 'end' when text exists.").to.equal("end");
      });

      it("should set slot to 'start' when icon-position is 'start' and text exists", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.getAttribute("slot"), "Slot should be set to 'start'.").to.equal("start");
      });

      it("should set slot to empty string when icon is present but no text", function () {
        const instance = createMockWidgetInstance({
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.getAttribute("slot"), "Slot should be an empty string for an icon-only button.").to.equal("");
      });

      it("should show icon with ms-Icon classes for icon-only button", function () {
        const instance = createMockWidgetInstance({
          "icon": "Home",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.hidden, "Span should not be hidden for icon-only button.").to.be.false;
        expect(span.classList.contains("ms-Icon"), "Span should have the 'ms-Icon' class.").to.be.true;
        expect(span.classList.contains("ms-Icon--Home"), "Span should have the 'ms-Icon--Home' class.").to.be.true;
      });

      it("should hide element and set slot to empty when icon is not provided", function () {
        const instance = createMockWidgetInstance({ "value": "OK" });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.hidden, "Span should be hidden when no icon is provided.").to.be.true;
        expect(span.getAttribute("slot"), "Slot should be empty when no icon is provided.").to.equal("");
      });

      it("should hide element when icon is empty string", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": ""
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.hidden, "Span should be hidden when icon is an empty string.").to.be.true;
      });

      it("should remove ms-Icon classes when icon is cleared", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Home",
          "icon-position": "start"
        });
        worker.refresh(instance);

        // Clear the icon and refresh again.
        instance.data["icon"] = "";
        worker.refresh(instance);

        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.hidden, "Span should be hidden after clearing icon.").to.be.true;
        expect(span.classList.contains("ms-Icon"), "ms-Icon class should be removed.").to.be.false;
        expect(span.classList.contains("ms-Icon--Home"), "ms-Icon--Home class should be removed.").to.be.false;
      });

      it("should fall back to default icon-position when invalid position is given", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": "invalid"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        const defaultPos = MockWidgetClass.defaultValues["icon-position"];
        expect(span.getAttribute("slot"), "Slot should fall back to default 'icon-position' for an invalid value.").to.equal(defaultPos);
      });

      it("should fall back to default icon-position when icon-position is absent", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        const defaultPos = MockWidgetClass.defaultValues["icon-position"];
        expect(span.getAttribute("slot"), "Slot should fall back to default when 'icon-position' is absent.").to.equal(defaultPos);
      });

      it("should fall back to default icon-position when icon-position is null", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": null
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        const defaultPos = MockWidgetClass.defaultValues["icon-position"];
        expect(span.getAttribute("slot"), "Slot should fall back to default when 'icon-position' is null.").to.equal(defaultPos);
      });

      it("should remove old ms-Icon classes before adding new ones", function () {
        const instance = createMockWidgetInstance({
          "value": "OK",
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);

        // Change icon and refresh again to verify old class is removed.
        instance.data["icon"] = "Edit";
        worker.refresh(instance);

        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.classList.contains("ms-Icon--Add"), "Old 'ms-Icon--Add' class should be removed.").to.be.false;
        expect(span.classList.contains("ms-Icon--Edit"), "New 'ms-Icon--Edit' class should be added.").to.be.true;
      });

      it("should set slot to empty string when icon present and value is empty string", function () {
        const instance = createMockWidgetInstance({
          "value": "",
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.getAttribute("slot"), "Slot should be empty when value is an empty string.").to.equal("");
      });

      it("should set slot to empty string when icon present and value is null", function () {
        const instance = createMockWidgetInstance({
          "value": null,
          "icon": "Add",
          "icon-position": "start"
        });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-icon");
        expect(span.getAttribute("slot"), "Slot should be empty when value is null.").to.equal("");
      });

    });

    describe("Edge cases", function () {

      it("should construct the Button instance without errors", function () {
        const button = new Button();
        expect(button, "Button instance should exist.").to.exist;
        expect(button.data, "data should be an object.").to.be.an("object");
        expect(button.elements, "elements should be an object.").to.be.an("object");
      });

      it("should handle ElementText refresh when data has numeric value", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        const instance = createMockWidgetInstance({ "value": 42 });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should not be hidden for a numeric value.").to.be.false;
        expect(span.innerText, "Span innerText should be the stringified number.").to.equal("42");
      });

      it("should treat 0 as falsy in ElementText refresh() and hide the span", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        const instance = createMockWidgetInstance({ "value": 0 });
        worker.refresh(instance);
        const span = instance.elements.widget.querySelector(".u-text");
        expect(span.hidden, "Span should be hidden when value is 0 (falsy).").to.be.true;
      });

      it("should return 0 from ElementText getValue() when value is 0", function () {
        const worker = new Button.ElementText(MockWidgetClass, "u-text", ".u-text");
        const instance = createMockWidgetInstance({ "value": 0 });
        const result = worker.getValue(instance);
        expect(result, "getValue() should return 0.").to.equal(0);
      });

      it("should handle multiple ElementText workers on same MockWidgetClass", function () {
        const worker1 = new Button.ElementText(MockWidgetClass, "u-text-1", ".u-text-1");
        const worker2 = new Button.ElementText(MockWidgetClass, "u-text-2", ".u-text-2");
        expect(MockWidgetClass.setters["value"], "worker1 should be in the setter list.").to.include(worker1);
        expect(MockWidgetClass.setters["value"], "worker2 should be in the setter list.").to.include(worker2);
      });

    });

  });
})();
