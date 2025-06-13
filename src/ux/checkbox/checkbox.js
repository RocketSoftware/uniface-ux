// @ts-check
import { Widget } from "../framework/widget.js";
import {
  StyleClass,
  HtmlAttribute,
  HtmlAttributeBoolean,
  HtmlValueAttributeBoolean,
  Element,
  Trigger,
  SlottedElement,
  SlottedError,
  HtmlAttributeNumber,
  HtmlAttributeChoice,
  IgnoreProperty,
  UIBlock
} from "../framework/workers.js";

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
     * @param {string} attrName
     * @param {UPropValue} defaultValue
     */
    constructor(widgetClass, propId, attrName, defaultValue) {
      super(widgetClass, propId, attrName, defaultValue);
      this.attrName = attrName;
    }

    /**
     * Updates the value of the widget, sets the indeterminate state based on the new value and dispatches a new change event.
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
     * Converts the input value to a Boolean or null value or throws an error in case of an invalid value.
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
     * Used to decide the next value of the checkbox when the user clicks on it.
     * Takes into account the current value of the checkbox and whether the tri-state is set or not.
     * @param {Event} event
     * @param {object} widgetInstance
     */
    handleChange(event, widgetInstance) {
      if (!widgetInstance.data.ignoreChangeEvent) {
        event.preventDefault();
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

    clearErrors(widgetInstance) {
      this.setErrorProperties(widgetInstance);
      this.setErrorProperties(widgetInstance, "format-error");
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
    new StyleClass(this, ["u-checkbox"]),
    new HtmlAttribute(this, undefined, "role", "checkbox"),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, undefined, "currentValue", "on"),
    new IgnoreProperty(this, "tri-state", false),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new this.HTMLValueAttributeTristate(this, "value", "checked", null),
    new HtmlAttributeBoolean(this, undefined, "ariaChecked", false),
    new HtmlAttributeBoolean(this, undefined, "ariaRequired", false),
    new HtmlAttributeBoolean(this, undefined, "ariaDisabled", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeBoolean(this, undefined, "currentChecked", false),
    new HtmlAttributeChoice(this, "label-position", "u-label-position", ["before", "after"], "after", true),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new UIBlock(this, "readonly"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", ""),
    new Trigger(this, "onchange", "valuechange", true)
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
