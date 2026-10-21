
/* global chai, describe, it, beforeEach, afterEach, sinon, UNIFACE */

(function () {
  "use strict";

  const expect = chai.expect;

  /** Registry lookup avoids the unresolvable bare specifier "@fluentui/web-components". */
  const Checkbox = UNIFACE.ClassRegistry.get("UX.Checkbox");
  const AttributeTristateValue = Checkbox.AttributeTristateValue;

  class MockWidgetClass {
    static subWidgets = {};
    static subWidgetWorkers = [];
    static defaultValues = {};
    static setters = {};
    static getters = {};
    static triggers = {};
    static structure = { "childWorkers": [] };
  }

  function resetMockWidgetClass() {
    MockWidgetClass.subWidgets = {};
    MockWidgetClass.subWidgetWorkers = [];
    MockWidgetClass.defaultValues = {};
    MockWidgetClass.setters = {};
    MockWidgetClass.getters = {};
    MockWidgetClass.triggers = {};
  }

  /** Creates a mock widget instance backed by a real detached fluent-checkbox. */
  function createMockWidgetInstance(data = {}) {
    const widgetElement = document.createElement("fluent-checkbox");
    return {
      "data": data,
      "elements": { "widget": widgetElement },
      "toBoolean": function (value) {
        return value === true || value === "true";
      },
      "getTraceDescription": function () {
        return "traceDescription";
      }
    };
  }

  describe("Checkbox", function () {

    let sandbox;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      resetMockWidgetClass();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe("AttributeTristateValue", function () {

      let worker;
      let widgetInstance;

      beforeEach(function () {
        worker = new AttributeTristateValue(MockWidgetClass, "value", "checked", null);
        worker.setErrorProperties = sandbox.stub();
        widgetInstance = createMockWidgetInstance();
      });

      describe("Constructor", function () {

        it("should store the attribute name", function () {
          expect(worker.attrName, "attrName should be 'checked'.").to.equal("checked");
        });

        it("should register itself as setter and getter for the value property", function () {
          expect(MockWidgetClass.setters.value, "Worker should be registered as setter.").to.include(worker);
          expect(MockWidgetClass.getters.value, "Worker should be registered as getter.").to.equal(worker);
        });

        it("should register the default value", function () {
          expect(MockWidgetClass.defaultValues.value, "Default value should be null.").to.be.null;
        });

      });

      describe("fieldValueToTriState", function () {

        it("should return booleans unchanged", function () {
          expect(worker.fieldValueToTriState(true), "true should stay true.").to.be.true;
          expect(worker.fieldValueToTriState(false), "false should stay false.").to.be.false;
        });

        it("should map truthy strings to true case-insensitively", function () {
          expect(worker.fieldValueToTriState("TRUE"), "'TRUE' should map to true.").to.be.true;
          expect(worker.fieldValueToTriState("1"), "'1' should map to true.").to.be.true;
        });

        it("should map falsy strings to false case-insensitively", function () {
          expect(worker.fieldValueToTriState("OFF"), "'OFF' should map to false.").to.be.false;
          expect(worker.fieldValueToTriState("0"), "'0' should map to false.").to.be.false;
        });

        it("should map an empty string to null", function () {
          expect(worker.fieldValueToTriState(""), "Empty string should map to null.").to.be.null;
        });

        it("should map the numbers 1 and 0 to true and false", function () {
          expect(worker.fieldValueToTriState(1), "1 should map to true.").to.be.true;
          expect(worker.fieldValueToTriState(0), "0 should map to false.").to.be.false;
        });

        it("should return null for null", function () {
          expect(worker.fieldValueToTriState(null), "null should map to null.").to.be.null;
        });

        it("should throw the format error message for invalid values", function () {
          [ "maybe", 2, {} ].forEach(function (value) {
            expect(function () {
              worker.fieldValueToTriState(value);
            }, `Value '${String(value)}' should throw.`).to.throw(Checkbox.formatErrorMessage);
          });
        });

      });

      describe("changeValue", function () {

        it("should set checked and clear indeterminate for a boolean value", function () {
          worker.changeValue(widgetInstance, true);
          expect(widgetInstance.elements.widget.checked, "checked should be true.").to.be.true;
          expect(widgetInstance.elements.widget.indeterminate, "indeterminate should be false.").to.be.false;
          expect(widgetInstance.data.currentValue, "currentValue should be stored.").to.be.true;
        });

        it("should set indeterminate for null", function () {
          widgetInstance.elements.widget.checked = true;
          worker.changeValue(widgetInstance, null);
          expect(widgetInstance.elements.widget.indeterminate, "indeterminate should be true.").to.be.true;
        });

        it("should force checked to false on error", function () {
          worker.changeValue(widgetInstance, true, true);
          expect(widgetInstance.elements.widget.checked, "checked should be false on error.").to.be.false;
          expect(widgetInstance.data.currentValue, "currentValue should still be the new value.").to.be.true;
        });

        it("should dispatch a valuechange event with the new value", function () {
          const listener = sandbox.spy();
          widgetInstance.elements.widget.addEventListener("valuechange", listener);
          worker.changeValue(widgetInstance, false);
          expect(listener.calledOnce, "valuechange should be dispatched once.").to.be.true;
          expect(listener.firstCall.args[0].detail.value, "Event detail should carry the value.").to.be.false;
          expect(listener.firstCall.args[0].cancelable, "Event should be cancelable.").to.be.true;
        });

        it("should set ignoreChangeEvent during the update and reset it afterwards", function () {
          let flagDuringUpdate;
          Object.defineProperty(widgetInstance.elements.widget, "indeterminate", {
            "configurable": true,
            "set": function () {
              flagDuringUpdate = widgetInstance.data.ignoreChangeEvent;
            }
          });
          worker.changeValue(widgetInstance, true);
          expect(flagDuringUpdate, "Flag should be true during update.").to.be.true;
          expect(widgetInstance.data.ignoreChangeEvent, "Flag should be reset afterwards.").to.be.false;
        });

      });

      describe("handleChange", function () {

        let event;

        beforeEach(function () {
          event = { "preventDefault": sandbox.spy() };
          sandbox.spy(worker, "changeValue");
        });

        it("should do nothing when ignoreChangeEvent is set", function () {
          widgetInstance.data.ignoreChangeEvent = true;
          worker.handleChange(event, widgetInstance);
          expect(event.preventDefault.called, "preventDefault should not be called.").to.be.false;
          expect(worker.changeValue.called, "changeValue should not be called.").to.be.false;
        });

        it("should prevent default and clear errors", function () {
          sandbox.spy(worker, "clearErrors");
          widgetInstance.data.currentValue = true;
          worker.handleChange(event, widgetInstance);
          expect(event.preventDefault.calledOnce, "preventDefault should be called.").to.be.true;
          expect(worker.clearErrors.calledWith(widgetInstance), "clearErrors should be called.").to.be.true;
        });

        it("should change true to false", function () {
          widgetInstance.data.currentValue = true;
          worker.handleChange(event, widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, false), "Should change to false.").to.be.true;
        });

        it("should change false to true without tri-state", function () {
          widgetInstance.data.currentValue = false;
          widgetInstance.data["tri-state"] = false;
          worker.handleChange(event, widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, true), "Should change to true.").to.be.true;
        });

        it("should change false to null with tri-state", function () {
          widgetInstance.data.currentValue = false;
          widgetInstance.data["tri-state"] = true;
          worker.handleChange(event, widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, null), "Should change to null.").to.be.true;
        });

        it("should change null to true", function () {
          widgetInstance.data.currentValue = null;
          worker.handleChange(event, widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, true), "Should change to true.").to.be.true;
        });

        it("should change undefined to true", function () {
          widgetInstance.data.currentValue = undefined;
          worker.handleChange(event, widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, true), "Should change to true.").to.be.true;
        });

      });

      describe("clearErrors", function () {

        it("should clear both the default and the format error", function () {
          worker.clearErrors(widgetInstance);
          expect(worker.setErrorProperties.calledTwice, "setErrorProperties should be called twice.").to.be.true;
          expect(worker.setErrorProperties.firstCall.args, "First call should clear the default error.").to.deep.equal([ widgetInstance ]);
          expect(worker.setErrorProperties.secondCall.args, "Second call should clear the format error.").to.deep.equal([ widgetInstance, "format-error" ]);
        });

      });

      describe("getValueUpdaters", function () {

        it("should return a single change updater on the widget element", function () {
          const updaters = worker.getValueUpdaters(widgetInstance);
          expect(updaters, "Should return one updater.").to.have.lengthOf(1);
          expect(updaters[0].element, "Updater element should be the widget element.").to.equal(widgetInstance.elements.widget);
          expect(updaters[0].event_name, "Updater event should be 'change'.").to.equal("change");
        });

        it("should route the handler to handleChange", function () {
          sandbox.stub(worker, "handleChange");
          const event = {};
          worker.getValueUpdaters(widgetInstance)[0].handler(event);
          expect(worker.handleChange.calledOnceWithExactly(event, widgetInstance), "handleChange should receive event and instance.").to.be.true;
        });

      });

      describe("getValue", function () {

        it("should return an empty string when indeterminate", function () {
          widgetInstance.elements.widget.indeterminate = true;
          widgetInstance.elements.widget.checked = true;
          expect(worker.getValue(widgetInstance), "Should return ''.").to.equal("");
        });

        it("should return true when checked", function () {
          widgetInstance.elements.widget.checked = true;
          expect(worker.getValue(widgetInstance), "Should return true.").to.be.true;
        });

        it("should return false when unchecked", function () {
          widgetInstance.elements.widget.checked = false;
          expect(worker.getValue(widgetInstance), "Should return false.").to.be.false;
        });

      });

      describe("refresh", function () {

        beforeEach(function () {
          sandbox.spy(worker, "changeValue");
        });

        it("should apply a valid value and clear the format error", function () {
          widgetInstance.data.value = "yes";
          worker.refresh(widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, true, false), "Should change to true without error.").to.be.true;
          expect(worker.setErrorProperties.calledWith(widgetInstance, "format-error"), "Format error should be cleared.").to.be.true;
          expect(worker.setErrorProperties.neverCalledWith(widgetInstance, "format-error", sinon.match.string), "No error message should be set.").to.be.true;
        });

        it("should not call changeValue when the value equals currentValue", function () {
          widgetInstance.data.value = true;
          widgetInstance.data.currentValue = true;
          worker.refresh(widgetInstance);
          expect(worker.changeValue.called, "changeValue should not be called.").to.be.false;
        });

        it("should apply null as the indeterminate state when no value was applied before", function () {
          widgetInstance.data.value = null;
          worker.refresh(widgetInstance);
          expect(worker.changeValue.calledWith(widgetInstance, null, false), "Should change to null without error.").to.be.true;
          expect(widgetInstance.elements.widget.indeterminate, "indeterminate should be true.").to.be.true;
        });

        it("should not call changeValue again when the same invalid value is applied twice", function () {
          widgetInstance.data.value = "garbage";
          worker.refresh(widgetInstance);
          worker.refresh(widgetInstance);
          expect(worker.changeValue.calledOnce, "changeValue should be called once.").to.be.true;
        });

        it("should set the format error and force unchecked for an invalid value", function () {
          widgetInstance.data.value = "garbage";
          worker.refresh(widgetInstance);
          expect(worker.setErrorProperties.calledWith(widgetInstance, "format-error", Checkbox.formatErrorMessage), "Format error message should be set.").to.be.true;
          expect(worker.changeValue.calledWith(widgetInstance, "garbage", true), "Should call changeValue with isError.").to.be.true;
          expect(widgetInstance.elements.widget.checked, "checked should be false.").to.be.false;
        });

      });

    });

    describe("getValueFormattedSetters", function () {

      it("should return the properties affecting the formatted value", function () {
        expect(Checkbox.getValueFormattedSetters(), "Should list value, error and error-message.").to.deep.equal([ "value", "error", "error-message" ]);
      });

    });

    describe("getValueFormatted", function () {

      beforeEach(function () {
        sandbox.stub(Checkbox, "staticLog");
      });

      it("should return 'Unset' for an empty value", function () {
        const result = Checkbox.getValueFormatted({ "value": "" });
        expect(result.primaryPlainText, "Text should be 'Unset'.").to.equal("Unset");
        expect(result, "No error message expected.").to.not.have.property("errorMessage");
      });

      it("should include the error message for an empty value when error is set", function () {
        const result = Checkbox.getValueFormatted({
          "value": "",
          "error": true,
          "error-message": "Required"
        });
        expect(result.errorMessage, "Error message should be included.").to.equal("Required");
      });

      it("should return 'Checked' for a true value", function () {
        expect(Checkbox.getValueFormatted({ "value": "true" }).primaryPlainText, "Text should be 'Checked'.").to.equal("Checked");
      });

      it("should return 'Unchecked' for a false value", function () {
        expect(Checkbox.getValueFormatted({ "value": 0 }).primaryPlainText, "Text should be 'Unchecked'.").to.equal("Unchecked");
      });

      it("should include the error message for a valid value when error is set", function () {
        const result = Checkbox.getValueFormatted({
          "value": true,
          "error": "true",
          "error-message": "Invalid"
        });
        expect(result.primaryPlainText, "Text should be 'Checked'.").to.equal("Checked");
        expect(result.errorMessage, "Error message should be included.").to.equal("Invalid");
      });

      it("should not include an error message when error is not set", function () {
        const result = Checkbox.getValueFormatted({
          "value": true,
          "error": false,
          "error-message": "Ignored"
        });
        expect(result, "No error message expected.").to.not.have.property("errorMessage");
      });

      it("should return 'ERROR' with the format error message for an invalid value", function () {
        const result = Checkbox.getValueFormatted({ "value": "garbage" });
        expect(result.primaryPlainText, "Text should be 'ERROR'.").to.equal("ERROR");
        expect(result.errorMessage, "Format error message expected.").to.equal(Checkbox.formatErrorMessage);
      });

      it("should return 'ERROR' without message when a non-string is thrown", function () {
        sandbox.stub(Checkbox, "fieldValueToBoolean").throws(new Error("boom"));
        const result = Checkbox.getValueFormatted({ "value": "x" });
        expect(result.primaryPlainText, "Text should be 'ERROR'.").to.equal("ERROR");
        expect(result, "No error message expected.").to.not.have.property("errorMessage");
      });

    });

  });
})();