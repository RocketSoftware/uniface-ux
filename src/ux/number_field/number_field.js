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
    this.elements.widget.enterKeyPressed = false;

    let previousValue = this.getNode(this.data, "value"); // Set once when initializing

    // Stop propagating change event to parent nodes on pressing enter key if change button is enabled.
    this.elements.widget.addEventListener("keydown", (event) => {
      if (!this.elements.widget.querySelector(".u-sw-changebutton").hidden && event.key === "Enter") {
        this.elements.widget.enterKeyPressed = true;
      }
    });

    let isProgrammaticChange = false;

    // During a server round-trip, the widget is in a readonly and blocked state,
    // and the user presses the arrow keys, the value will change. This occurs because
    // the widget is temporarily in a readonly and blocked state during the round-trip,
    // allowing the value change to persist even though it shouldn't.
    // This is considered a minor bug that we are currently opting to live with.
    this.elements.widget.addEventListener("change", (event) => {
      if (isProgrammaticChange) {
        // Ignore programmatic changes to prevent recursion
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      let readOnly = this.getNode(widgetElement, "readOnly");
      let currentValue = widgetElement.value;

      // Check if the widget is in read-only mode AND not explicitly overridden by a class
      // If true, revert the change and block further processing
      // The 'u-blocked' class is used to allow editing even when 'readOnly' is true (a controlled override)
      if (readOnly && !widgetElement.classList.contains("u-blocked")) {
        isProgrammaticChange = true;
        // Revert the value to previous valid value (if available), or fallback to initial value from data
        widgetElement.value = previousValue !== undefined ? previousValue : this.getNode(this.data, "value");
        isProgrammaticChange = false;

        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      // If the current value has changed from the last known good value, update previousValue
      // This stores the most recent valid value to revert to later if needed
      if (currentValue !== previousValue) {
        previousValue = currentValue;
      }
      if (this.elements.widget.enterKeyPressed) {
        event.stopPropagation();
        this.elements.widget.enterKeyPressed = false;
      }
    });
    // Dispatch change event when clicked on change button.
    this.elements.widget.querySelector(".u-sw-changebutton").addEventListener("click", () => {
      this.elements.widget.dispatchEvent(new window.Event("change", { "bubbles": false }));
    });
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
