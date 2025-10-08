// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";
import { AttributeBooleanValue } from "../framework/workers/attribute_boolean_value.js";
import { PropertyFilter } from "../framework/workers/property_filter.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ElementError } from "../framework/workers/element_error.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../framework/workers/attribute_ui_blocking.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentCheckbox, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentCheckbox());

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

  /**
   * Private Worker: A specialized worker that extends AttributeBooleanValue worker to support tri-state behavior in the checkbox.
   * Enables toggling between checked, unchecked, and indeterminate states based on the tri-state property.
   * It ensures that the checkbox reflects the correct visual and logical state, and dispatches appropriate change events.
   * @export
   * @class AttributeTristateValue
   * @extends {AttributeBooleanValue}
   */
  static AttributeTristateValue = class extends AttributeBooleanValue {

    /**
     * Creates an instance of AttributeTristateValue.
     * @param {typeof Widget} widgetClass
     * @param {UPropName} propId
     * @param {string} attrName
     * @param {UPropValue} defaultValue
     */
    constructor(widgetClass, propId, attrName, defaultValue) {
      super(widgetClass, propId, attrName, defaultValue);
      this.attrName = attrName;
    }

    /**
     * Updates the checkbox state and dispatches a valuechange event.
     * Sets the widget in indeterminate state if the value is null.
     * @param {object} widgetInstance
     * @param {any} newValue
     * @param {boolean} isError
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
     * Converts various input types to a tri-state-compatible value: true, false, or null.
     * Throws an error if the value is invalid.
     * @param {any} value
     * @returns {boolean | null}
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
      throw Checkbox.formatErrorMessage;
    }

    /**
     * Handles user interaction with the checkbox.
     * Decides on the next value of the checkbox based on the current value and the tri-state setting.
     * @param {Event} event
     * @param {object} widgetInstance
     */
    handleChange(event, widgetInstance) {
      if (!widgetInstance.data.ignoreChangeEvent) {
        event.preventDefault();
        this.clearErrors(widgetInstance);
        let newValue;
        const isTriState = widgetInstance.toBoolean(widgetInstance.data["tri-state"]);
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

    /**
     * Clears any format-related errors on the widget.
     * @param {Widget} widgetInstance
     */
    clearErrors(widgetInstance) {
      this.setErrorProperties(widgetInstance);
      this.setErrorProperties(widgetInstance, "format-error");
    }

    /**
     * Private Uniface API method - getValueUpdaters.
     * Specialized getValueUpdaters method to add an event handler to the change event that will taking into account the tri-state settings while dealing with user interaction.
     * @param {Widget} widgetInstance
     * @returns {Array<object>}
     */
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
          this.handleChange(event, widgetInstance);
        }
      });
      return updaters;
    }

    /**
     * Private Uniface API method - getValue.
     * Specialized getValue method to take into account the indeterminate state of the checkbox while returning the field value back to Uniface.
     * @param {Widget} widgetInstance
     * @returns {boolean | string}
     */
    getValue(widgetInstance) {
      this.log("getValue", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });
      const value = widgetInstance.elements.widget.indeterminate ? "" : widgetInstance.elements.widget.checked;
      return value;
    }

    /**
     * Refreshes the checkbox state based on the current data value.
     * Validates and normalizes the value before applying it.
     * @param {Widget} widgetInstance
     */
    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });
      const value = widgetInstance.data.value;
      let newValue = value;
      let isError = false;

      try {
        newValue = this.fieldValueToTriState(value);
        this.setErrorProperties(widgetInstance, "format-error");
      } catch (error) {
        isError = true;
        if (typeof error === "string") {
          this.setErrorProperties(widgetInstance, "format-error", error);
        }
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
    new StyleClassManager(this, ["u-checkbox"]),
    new AttributeString(this, undefined, "role", "checkbox"),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, undefined, "currentValue", "on"),
    new PropertyFilter(this, "tri-state", false),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new this.AttributeTristateValue(this, "value", "checked", null),
    new AttributeBoolean(this, undefined, "ariaChecked", false),
    new AttributeBoolean(this, undefined, "ariaRequired", false),
    new AttributeBoolean(this, undefined, "ariaDisabled", false),
    new AttributeBoolean(this, "html:disabled", "disabled", false),
    new AttributeBoolean(this, "html:readonly", "readOnly", false),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeBoolean(this, undefined, "currentChecked", false),
    new AttributeChoice(this, "label-position", "u-label-position", ["before", "after"], "after", true),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new AttributeUIBlocking(this, "readonly"),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", ""),
    new EventTrigger(this, "onchange", "valuechange", true)
  ]);

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {Array<string>}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "error",
      "error-message"
    ];
  }

  /**
   * Returns the value as format-object for text-based widgets
   * like the cell widget of the data-grid.
   * @param {UData} properties
   * @returns {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    const value = this.getNode(properties, "value");
    if (value === "") {
      formattedValue.primaryPlainText = "Unset";
      if (this.toBoolean(this.getNode(properties, "error"))) {
        formattedValue.errorMessage = this.getNode(properties, "error-message");
      }
    } else {
      try {
        if (this.fieldValueToBoolean(value)) {
          formattedValue.primaryPlainText = "Checked";
        } else {
          formattedValue.primaryPlainText = "Unchecked";
        }
        if (this.toBoolean(this.getNode(properties, "error"))) {
          formattedValue.errorMessage = this.getNode(properties, "error-message");
        }
      } catch (error) {
        formattedValue.primaryPlainText = "ERROR";
        if (typeof error === "string") {
          formattedValue.errorMessage = error;
        }
      }
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
