/* global chai, describe, it, before, beforeEach, afterEach, UNIFACE */

(function () {
  "use strict";

  const expect = chai.expect;

  /**
   * TextField is registered in the bundle loaded by the test harness HTML page.
   * Using the registry avoids a direct source import that would pull in
   * the unresolvable bare specifier "@fluentui/web-components".
   */
  const TextField = UNIFACE.ClassRegistry.get("UX.TextField");

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
   * Creates a minimal mock widgetInstance backed by a mounted fluent-text-field.
   * The element is appended to document.body so that FluentUI shadow DOM internals
   * (proxy, control) are available. Remove instance.elements.widget from DOM after use.
   */
  function createMockWidgetInstance(data = {}) {
    const widgetElement = document.createElement("fluent-text-field");
    document.body.appendChild(widgetElement);
    return {
      "data": data,
      "elements": { "widget": widgetElement },
      "getTraceDescription": function () {
        return "traceDescription";
      }
    };
  }

  describe("TextField", function () {

    beforeEach(function () {
      resetMockWidgetClass();
    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("Static members", function () {

      it("should have subWidgets with a changebutton entry", function () {
        expect(TextField.subWidgets, "subWidgets should contain 'changebutton'.").to.have.property("changebutton");
      });

      it("should have subWidgetWorkers as an empty array", function () {
        expect(TextField.subWidgetWorkers, "subWidgetWorkers should be an empty array.").to.deep.equal([]);
      });

      it("should have a structure property", function () {
        expect(TextField.structure, "structure should be defined.").to.exist;
      });

      it("should have defaultValues as a non-empty object", function () {
        expect(TextField.defaultValues, "defaultValues should be a non-empty object.").to.not.be.empty;
      });

      it("should have setters as a non-empty object", function () {
        expect(TextField.setters, "setters should be a non-empty object.").to.not.be.empty;
      });

      it("should have getters as a non-empty object", function () {
        expect(TextField.getters, "getters should be a non-empty object.").to.not.be.empty;
      });

      it("should have triggers as a non-empty object", function () {
        expect(TextField.triggers, "triggers should be a non-empty object.").to.not.be.empty;
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("getValueFormattedSetters()", function () {
      let result;

      before(function () {
        result = TextField.getValueFormattedSetters();
      });

      it("should return an array", function () {
        expect(result, "getValueFormattedSetters() should return an array.").to.be.an("array");
      });

      it("should include 'value'", function () {
        expect(result, "Returned array should include 'value'.").to.include("value");
      });

      it("should include 'error'", function () {
        expect(result, "Returned array should include 'error'.").to.include("error");
      });

      it("should include 'error-message'", function () {
        expect(result, "Returned array should include 'error-message'.").to.include("error-message");
      });

      it("should include 'prefix-icon'", function () {
        expect(result, "Returned array should include 'prefix-icon'.").to.include("prefix-icon");
      });

      it("should include 'prefix-text'", function () {
        expect(result, "Returned array should include 'prefix-text'.").to.include("prefix-text");
      });

      it("should include 'suffix-icon'", function () {
        expect(result, "Returned array should include 'suffix-icon'.").to.include("suffix-icon");
      });

      it("should include 'suffix-text'", function () {
        expect(result, "Returned array should include 'suffix-text'.").to.include("suffix-text");
      });

      it("should return exactly seven items", function () {
        expect(result.length, "Returned array should have exactly 7 entries.").to.equal(7);
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("getValueFormatted()", function () {

      it("should return primaryPlainText from value property", function () {
        const result = TextField.getValueFormatted({ "value": "Hello" });
        expect(result.primaryPlainText, "primaryPlainText should equal the 'value' property.").to.equal("Hello");
      });

      it("should return empty string for primaryPlainText when value is absent", function () {
        const result = TextField.getValueFormatted({});
        expect(result.primaryPlainText, "primaryPlainText should be '' when value is absent.").to.equal("");
      });

      it("should return empty string for primaryPlainText when value is null", function () {
        const result = TextField.getValueFormatted({ "value": null });
        expect(result.primaryPlainText, "primaryPlainText should be '' for null value.").to.equal("");
      });

      it("should replace newlines with spaces in primaryPlainText", function () {
        const result = TextField.getValueFormatted({ "value": "line1\nline2" });
        expect(result.primaryPlainText, "Newlines should be replaced with spaces.").to.equal("line1 line2");
      });

      it("should return prefixIcon when prefix-icon is set", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "prefix-icon": "Add"
        });
        expect(result.prefixIcon, "prefixIcon should equal the 'prefix-icon' property.").to.equal("Add");
      });

      it("should return undefined prefixIcon when prefix-icon is absent", function () {
        const result = TextField.getValueFormatted({ "value": "x" });
        expect(result.prefixIcon, "prefixIcon should be undefined when absent.").to.be.undefined;
      });

      it("should return prefixText when prefix-icon is absent", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "prefix-text": "Pre"
        });
        expect(result.prefixText, "prefixText should be set when prefix-icon is absent.").to.equal("Pre");
      });

      it("should not return prefixText when prefix-icon is set", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "prefix-icon": "Add",
          "prefix-text": "Pre"
        });
        expect(result.prefixText, "prefixText should be absent when prefix-icon is set.").to.be.undefined;
      });

      it("should return suffixIcon when suffix-icon is set", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "suffix-icon": "Edit"
        });
        expect(result.suffixIcon, "suffixIcon should equal the 'suffix-icon' property.").to.equal("Edit");
      });

      it("should return suffixText when suffix-icon is absent", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "suffix-text": "Suf"
        });
        expect(result.suffixText, "suffixText should be set when suffix-icon is absent.").to.equal("Suf");
      });

      it("should not return suffixText when suffix-icon is set", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "suffix-icon": "Edit",
          "suffix-text": "Suf"
        });
        expect(result.suffixText, "suffixText should be absent when suffix-icon is set.").to.be.undefined;
      });

      it("should set errorMessage when error is true", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "error": true,
          "error-message": "Required"
        });
        expect(result.errorMessage, "errorMessage should be set when error is true.").to.equal("Required");
      });

      it("should not set errorMessage when error is false", function () {
        const result = TextField.getValueFormatted({
          "value": "x",
          "error": false,
          "error-message": "Required"
        });
        expect(result.errorMessage, "errorMessage should be absent when error is false.").to.be.undefined;
      });

      it("should not set errorMessage when error is absent", function () {
        const result = TextField.getValueFormatted({ "value": "x" });
        expect(result.errorMessage, "errorMessage should be absent when error is absent.").to.be.undefined;
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("AttributeUIBlocking constructor()", function () {

      it("should register a setter for the readonly property", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.setters["html:readonly"], "Setter for 'html:readonly' should be an array.").to.be.an("array");
        expect(MockWidgetClass.setters["html:readonly"], "Setter array should contain the worker.").to.include(worker);
      });

      it("should register a setter for the disabled property", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.setters["html:disabled"], "Setter for 'html:disabled' should be an array.").to.be.an("array");
        expect(MockWidgetClass.setters["html:disabled"], "Setter array should contain the worker.").to.include(worker);
      });

      it("should register a setter for the uiblocked property", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.setters["uiblocked"], "Setter for 'uiblocked' should be an array.").to.be.an("array");
        expect(MockWidgetClass.setters["uiblocked"], "Setter array should contain the worker.").to.include(worker);
      });

      it("should store propReadonly", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(worker.propReadonly, "propReadonly should be 'html:readonly'.").to.equal("html:readonly");
      });

      it("should store propDisabled", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(worker.propDisabled, "propDisabled should be 'html:disabled'.").to.equal("html:disabled");
      });

      it("should store propUiblocked", function () {
        const worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(worker.propUiblocked, "propUiblocked should be 'uiblocked'.").to.equal("uiblocked");
      });

      it("should register default value false for readonly", function () {
        new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.defaultValues["html:readonly"], "Default value for 'html:readonly' should be false.").to.equal(false);
      });

      it("should register default value false for disabled", function () {
        new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.defaultValues["html:disabled"], "Default value for 'html:disabled' should be false.").to.equal(false);
      });

      it("should register default value false for uiblocked", function () {
        new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
        expect(MockWidgetClass.defaultValues["uiblocked"], "Default value for 'uiblocked' should be false.").to.equal(false);
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("AttributeUIBlocking refresh()", function () {

      let worker;
      let instance;

      beforeEach(function () {
        worker = new TextField.AttributeUIBlocking(MockWidgetClass, "html:readonly", "html:disabled", "uiblocked", false, false, false);
      });

      afterEach(function () {
        if (instance) {
          const el = instance.elements.widget;
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
          instance = null;
        }
      });

      it("should add u-blocked class when uiblocked is true", function () {
        instance = createMockWidgetInstance({
          "html:readonly": false,
          "html:disabled": false,
          "uiblocked": true
        });
        worker.refresh(instance);
        expect(instance.elements.widget.classList.contains("u-blocked"), "u-blocked class should be added when uiblocked is true.").to.be.true;
      });

      it("should remove u-blocked class when uiblocked is false", function () {
        instance = createMockWidgetInstance({
          "html:readonly": false,
          "html:disabled": false,
          "uiblocked": false
        });
        instance.elements.widget.classList.add("u-blocked");
        worker.refresh(instance);
        expect(instance.elements.widget.classList.contains("u-blocked"), "u-blocked class should be removed when uiblocked is false.").to.be.false;
      });

      it("should set readOnly when uiblocked is true and control is valid", function () {
        instance = createMockWidgetInstance({
          "html:readonly": false,
          "html:disabled": false,
          "uiblocked": true
        });
        worker.refresh(instance);
        expect(instance.elements.widget.readOnly, "Element should be readOnly when uiblocked and control is valid.").to.be.true;
      });

      it("should set readOnly based on the readonly property when uiblocked is false", function () {
        instance = createMockWidgetInstance({
          "html:readonly": true,
          "html:disabled": false,
          "uiblocked": false
        });
        worker.refresh(instance);
        expect(instance.elements.widget.readOnly, "Element readOnly should reflect the 'html:readonly' property.").to.be.true;
      });

      it("should set disabled based on the disabled property when uiblocked is false", function () {
        instance = createMockWidgetInstance({
          "html:readonly": false,
          "html:disabled": true,
          "uiblocked": false
        });
        worker.refresh(instance);
        expect(instance.elements.widget.disabled, "Element disabled should reflect the 'html:disabled' property.").to.be.true;
      });

      it("should not set readOnly and not set disabled when uiblocked is false and both are false", function () {
        instance = createMockWidgetInstance({
          "html:readonly": false,
          "html:disabled": false,
          "uiblocked": false
        });
        worker.refresh(instance);
        expect(instance.elements.widget.readOnly, "Element should not be readOnly.").to.be.false;
        expect(instance.elements.widget.disabled, "Element should not be disabled.").to.be.false;
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("AttributeProxyGuard constructor()", function () {

      it("should register a setter for 'html:type'", function () {
        const worker = new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
        expect(MockWidgetClass.setters["html:type"], "Setter for 'html:type' should be registered as an array.").to.be.an("array");
        expect(MockWidgetClass.setters["html:type"], "Setter array should contain the worker.").to.include(worker);
      });

      it("should register a setter for 'value'", function () {
        const worker = new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
        expect(MockWidgetClass.setters["value"], "Setter for 'value' should be registered as an array.").to.be.an("array");
        expect(MockWidgetClass.setters["value"], "Setter array should contain the worker.").to.include(worker);
      });

      it("should store propType", function () {
        const worker = new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
        expect(worker.propType, "propType should be 'html:type'.").to.equal("html:type");
      });

      it("should store propValue", function () {
        const worker = new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
        expect(worker.propValue, "propValue should be 'value'.").to.equal("value");
      });

      it("should not register any default values", function () {
        new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
        expect(MockWidgetClass.defaultValues, "defaultValues should remain empty.").to.deep.equal({});
      });

    });

    // ─────────────────────────────────────────────────────────────────────────
    describe("AttributeProxyGuard refresh()", function () {

      let worker;
      let instance;

      beforeEach(function () {
        worker = new TextField.AttributeProxyGuard(MockWidgetClass, "html:type", "value");
      });

      afterEach(function () {
        if (instance) {
          const el = instance.elements.widget;
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
          instance = null;
        }
      });

      it("should replace element.validate with a patched version on first refresh", function () {
        instance = createMockWidgetInstance({
          "html:type": "email",
          "value": ""
        });
        const el = instance.elements.widget;
        const originalValidate = el["validate"];
        worker.refresh(instance);
        expect(el["validate"], "validate should be replaced with a patched function after first refresh.").to.not.equal(originalValidate);
      });

      it("should not re-patch element.validate on subsequent refresh calls", function () {
        instance = createMockWidgetInstance({
          "html:type": "email",
          "value": ""
        });
        worker.refresh(instance);
        const patchedValidate = instance.elements.widget["validate"];
        worker.refresh(instance);
        expect(instance.elements.widget["validate"], "validate should not be re-patched on subsequent refresh calls.").to.equal(patchedValidate);
      });

      it("should not throw when patched validate is called with email type and invalid value", function () {
        instance = createMockWidgetInstance({
          "html:type": "email",
          "value": "not-a-valid-email"
        });
        const el = instance.elements.widget;
        el["type"] = "email";
        if (el["proxy"] instanceof HTMLInputElement) {
          el["proxy"].type = "email";
          el["proxy"].value = "not-a-valid-email";
        }
        worker.refresh(instance);
        expect(function () {
          if (typeof el["validate"] === "function") {
            el["validate"]();
          }
        }, "patched validate() should not throw for email type with invalid value.").to.not.throw();
      });

      it("should call the original validate when proxy type is not email or url", function () {
        instance = createMockWidgetInstance({
          "html:type": "text",
          "value": "some-text"
        });
        const el = instance.elements.widget;
        let originalCalled = false;
        el["validate"] = function () {
          originalCalled = true;
        };
        worker.refresh(instance);
        if (typeof el["validate"] === "function") {
          el["validate"]();
        }
        expect(originalCalled, "original validate() should be called when proxy type is not email or url.").to.equal(true);
      });

      it("should set proxy.step to '0.001' for type=time", function () {
        instance = createMockWidgetInstance({
          "html:type": "time",
          "value": ""
        });
        worker.refresh(instance);
        expect(instance.elements.widget["proxy"].step,
          "proxy.step must be '0.001' for type=time to prevent stepMismatch TypeError.").to.equal("0.001");
      });

      it("should set proxy.step to '0.001' for type=datetime-local", function () {
        instance = createMockWidgetInstance({
          "html:type": "datetime-local",
          "value": ""
        });
        worker.refresh(instance);
        expect(instance.elements.widget["proxy"].step,
          "proxy.step must be '0.001' for type=datetime-local.").to.equal("0.001");
      });

      it("should set control.step to '' for an HH:MM time value", function () {
        instance = createMockWidgetInstance({
          "html:type": "time",
          "value": "14:30"
        });
        worker.refresh(instance);
        expect(instance.elements.widget["control"].step,
          "control.step should be '' (HH:MM spinner) for a plain HH:MM value.").to.equal("");
      });

      it("should set control.step to '1' for an HH:MM:SS time value", function () {
        instance = createMockWidgetInstance({
          "html:type": "time",
          "value": "14:30:45"
        });
        worker.refresh(instance);
        expect(instance.elements.widget["control"].step,
          "control.step should be '1' (seconds spinner) for an HH:MM:SS value.").to.equal("1");
      });

      it("should set control.step to '0.001' for an HH:MM:SS.sss time value", function () {
        instance = createMockWidgetInstance({
          "html:type": "time",
          "value": "14:30:45.500"
        });
        worker.refresh(instance);
        expect(instance.elements.widget["control"].step,
          "control.step should be '0.001' (milliseconds spinner) for an HH:MM:SS.sss value.").to.equal("0.001");
      });

      it("should set control.step to '1' for a datetime-local value with seconds", function () {
        instance = createMockWidgetInstance({
          "html:type": "datetime-local",
          "value": "2026-04-23T14:30:45"
        });
        worker.refresh(instance);
        expect(instance.elements.widget["control"].step,
          "control.step should be '1' for a datetime-local value with seconds.").to.equal("1");
      });

      it("should return early without throwing an exception for a non-time, non-typeMismatch type", function () {
        instance = createMockWidgetInstance({
          "html:type": "text",
          "value": ""
        });
        expect(function () {
          worker.refresh(instance);
        }, "refresh() should not throw an exception for non-time, non-typeMismatch types.").to.not.throw();
      });

    });

  });

}());
