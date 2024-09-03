// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  StyleClass,
  HtmlAttribute,
  HtmlAttributeBoolean,
  HtmlValueAttributeBoolean,
  Element,
  Trigger,
  SlottedElement,
  SlottedError,
  HtmlAttributeNumber
} from "./workers.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * Checkbox Widget
 * @export
 * @class Checkbox
 * @extends {Widget}
 */
export class Checkbox extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "readonly";

  /**
   * Extends HtmlValueAttributeBoolean worker and adds tri-state functionality to it.
   * @export
   * @class HTMLValueAttributeTristate
   * @extends {HtmlValueAttributeBoolean}
   */
  static HTMLValueAttributeTristate = class extends HtmlValueAttributeBoolean {

    /**
     * Creates an instance of HTMLValueAttributeTristate.
     * @param {typeof Widget} widgetClass
     * @param {UPropName} propId
     * @param {String} attrName
     * @param {UPropValue} defaultValue
     */
    constructor(widgetClass, propId, attrName, defaultValue) {
      super(widgetClass, propId, attrName, defaultValue);
      this.attrName = attrName;
      this.registerDefaultValue(widgetClass, "uniface:tri-state", false);
    }

    /**
     * Updates the value of the widget, sets the indeterminate state based on the new value and dispatches a new change event.
     * @param {Object} widgetInstance
     * @param {any} newValue
     * @param {Boolean} isError
     */
    changeValue(widgetInstance, newValue, isError = false) {
      widgetInstance.data.ignoreChangeEvent = true;

      widgetInstance.elements.widget.indeterminate = newValue === null;
      widgetInstance.elements.widget[this.attrName] = isError ? false : newValue;

      widgetInstance.data.currentValue = newValue;
      widgetInstance.data.ignoreChangeEvent = false;

      widgetInstance.elements.widget.dispatchEvent(
        new window.CustomEvent("valuechange", {
          "detail": {
            "value": newValue
          },
          "cancelable": true
        })
      );
    }

    /**
     * Converts the input value to a Boolean or null value or throws an error in case of an invalid value.
     * @param {any} value
     * @returns {Boolean|null}
     */
    fieldValueToTriState(value) {
      let type = typeof value;
      switch (type) {
        case "boolean":
          return value;
        case "string":
          value = value.toLowerCase();
          if (["1", "t", "true", "on", "yes"].includes(value)) {
            return true;
          }
          if (["0", "f", "false", "off", "no"].includes(value)) {
            return false;
          }
          if (value === "") {
            return null;
          }
          break;
        case "number":
          if (value === 1) {
            return true;
          }
          if (value === 0) {
            return false;
          }
          break;
        default:
          if (value === null) {
            return null;
          }
          break;
      }
      throw "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.";
    }

    /**
     * Used to decide the next value of the checkbox when the user clicks on it.
     * Takes into account the current value of the checkbox and whether the tri-state is set or not.
     * @param {Event} event
     * @param {Object} widgetInstance
     */
    handleChange(event, widgetInstance) {
      if (!widgetInstance.data.ignoreChangeEvent) {
        event.preventDefault();
        let newValue;
        const isTriState = widgetInstance.toBoolean(widgetInstance.data.properties.uniface["tri-state"]);
        switch (widgetInstance.data.currentValue) {
          case true:
            newValue = false;
            break;
          case false:
            if (isTriState) {
              newValue = null;
            } else {
              newValue = true;
            }
            break;
          default:
            newValue = true;
            break;
        }
        this.changeValue(widgetInstance, newValue);
      }
    }

    clearErrors(widgetInstance) {
      widgetInstance.setProperties({
        "uniface": {
          "format-error": false,
          "format-error-message": ""
        }
      });
      widgetInstance.setProperties({
        "uniface": {
          "error": false,
          "error-message": ""
        }
      });
    }

    getValueUpdaters(widgetInstance) {
      this.log("getValueUpdaters", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });
      let element = this.getElement(widgetInstance);
      let updaters = [];
      updaters.push({
        "element": element,
        "event_name": "change",
        "handler": (event) => {
          this.clearErrors(widgetInstance);
          this.handleChange(event, widgetInstance);
        }
      });
      return updaters;
    }

    getValue(widgetInstance) {
      this.log("getValue", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });
      const value = widgetInstance.elements.widget.indeterminate ? "" : widgetInstance.elements.widget.checked;
      return value;
    }

    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });
      const value = widgetInstance.data.properties.value;
      let newValue = value;
      let isError = false;

      try {
        newValue = this.fieldValueToTriState(value);
        widgetInstance.setProperties({
          "uniface": {
            "format-error": false,
            "format-error-message": ""
          }
        });
      } catch (error) {
        isError = true;
        widgetInstance.setProperties({
          "uniface": {
            "format-error": true,
            "format-error-message": error
          }
        });
      }

      if (newValue !== widgetInstance.data.currentValue) {
        this.changeValue(widgetInstance, newValue, isError);
      }
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-checkbox", "", "", [
    new StyleClass(this, ["u-checkbox"]),
    new HtmlAttribute(this, "html:role", "role", "checkbox"),
    new HtmlAttribute(this, "html:title", "title", ""),
    new HtmlAttribute(this, "html:current-value", "currentValue", "on"),
    new this.HTMLValueAttributeTristate(this, "value", "checked", null),
    new HtmlAttributeBoolean(this, "html:aria-checked", "ariaChecked", false),
    new HtmlAttributeBoolean(this, "html:aria-required", "ariaRequired", false),
    new HtmlAttributeBoolean(this, "html:aria-disabled", "ariaDisabled", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeBoolean(this, "html:current-checked", "currentChecked", false)
  ], [
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "")
  ], [
    new Trigger(this, "onchange", "valuechange", true)
  ]);

  /**
   * Returns the value as format-object.
   * @param {UData} properties
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {
    this.staticLog("getValueFormatted");

    /** @type {UValueFormatting} */
    let formattedValue = {};
    const value_ = this.getNode(properties, "value");
    formattedValue.errorMessage = this.getNode(properties, "uniface:error-message");
    if (formattedValue.errorMessage) {
      formattedValue.text = "ERROR";
    } else if (value_ === "") {
      formattedValue.text = "Unset";
    } else {
      try {
        if (this.fieldValueToBoolean(value_)) {
          formattedValue.text = "Checked";
        } else {
          formattedValue.text = "Unchecked";
        }
      } catch (err) {
        formattedValue.errorMessage = err;
      }
    }
    return formattedValue;
  }
}
UNIFACE.ClassRegistry.add("UX.Checkbox", Checkbox);
