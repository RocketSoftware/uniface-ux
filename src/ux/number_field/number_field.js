// @ts-check
import { registerWidgetClass } from "../framework/common/dsp_connector.js";
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeRange } from "../framework/workers/attribute_range.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";
import { PropertyFilter } from "../framework/workers/property_filter.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ElementError } from "../framework/workers/element_error.js";
import { SubWidget } from "../framework/workers/sub_widget.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../framework/workers/attribute_ui_blocking.js";
// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentNumberField());

// This widget also depends on Button, still registration is needed
import { Button } from "../button/button.js";
registerWidgetClass("UX.Button", Button);

/**
 * NumberField Widget.
 * @export
 * @class NumberField
 * @extends {Widget}
 */
export class NumberField extends Widget {

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
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-number-field", "", "", [
    new StyleClassManager(this, ["u-number-field", "outline"]),
    new AttributeString(this, undefined, "currentValue", ""),
    new AttributeString(this, "value", "value", "", false, "change"),
    new AttributeString(this, "html:size", "size", "", true),
    new AttributeString(this, "html:step", "step", 1),
    new AttributeString(this, "html:placeholder", "placeholder", undefined),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline", false),
    new AttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeBoolean(this, "html:hide-step", "hideStep", false),
    new AttributeBoolean(this, "html:disabled", "disabled", false),
    new AttributeBoolean(this, "html:readonly", "readOnly", false),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new AttributeRange(this, "html:min", "html:max", undefined, undefined),
    new AttributeUIBlocking(this, "readonly"),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new ElementIconText(this, "span", "u-prefix", ".u-prefix", "start", "prefix-text", "", "prefix-icon", ""),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new ElementIconText(this, "span", "u-suffix", ".u-suffix", "end", "suffix-text", "", "suffix-icon", ""),
    new SubWidget(this, "span", "", "", "end", "changebutton", "UX.Button", {
      "icon-position": "end",
      "html:tabindex": "-1",
      "html:appearance": "stealth"
    }, false, [
      "detail"
    ], [
      "html:disabled"
    ]),
    new EventTrigger(this, "onchange", "change", true)
  ]);

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the number-field class since we need change event for change button when clicked.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    // Track last valid value to compare later
    let previousValue = this.getNode(this.data, "value");
    widgetElement.enterKeyPressed = false;

    const isReadonly = () => this.getNode(widgetElement, "readOnly");

    const changeBtn = widgetElement.querySelector(".u-sw-changebutton");

    // Prevent arrow key increment/decrement in readonly mode
    widgetElement.addEventListener("keydown", (event) => {
      if (isReadonly() && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        widgetElement.value = previousValue; // reset to original value
        return;
      }

      // Track Enter key press if change button is visible
      if (changeBtn && !changeBtn.hidden && event.key === "Enter") {
        widgetElement.enterKeyPressed = true;
      }
    });

    // Listen to native change event
    widgetElement.addEventListener("change", (event) => {
      const currentValue = widgetElement.value;

      if (isReadonly()) {
        // Reset and cancel change
        widgetElement.value = previousValue;
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      // Stop event bubbling if Enter triggered the change
      if (widgetElement.enterKeyPressed) {
        event.stopPropagation();
        widgetElement.enterKeyPressed = false;
      }

      // Only treat as valid change if value actually changed
      if (currentValue !== previousValue) {
        previousValue = currentValue;
      } else {
        // Prevent unnecessary downstream updates
        event.stopImmediatePropagation();
      }
    });

    // Handle manual change via button click
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        const syntheticChange = new window.Event("change", { "bubbles": false });
        widgetElement.dispatchEvent(syntheticChange);
      });
    }

    return valueUpdaters;
  }


  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {Array<string>}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "error",
      "error-message",
      "prefix-icon",
      "prefix-text",
      "suffix-icon",
      "suffix-text"
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
    formattedValue.primaryPlainText = this.getNode(properties, "value");
    formattedValue.prefixIcon = this.getNode(properties, "prefix-icon");
    if (!formattedValue.prefixIcon) {
      formattedValue.prefixText = this.getNode(properties, "prefix-text");
    }
    formattedValue.suffixIcon = this.getNode(properties, "suffix-icon");
    if (!formattedValue.suffixIcon) {
      formattedValue.suffixText = this.getNode(properties, "suffix-text");
    }
    if (this.toBoolean(this.getNode(properties, "error"))) {
      formattedValue.errorMessage = this.getNode(properties, "error-message");
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
