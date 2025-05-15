// @ts-check
import { registerWidgetClass } from "../framework/dsp_connector.js";
import { Widget } from "../framework/widget.js";
import {
  Trigger,
  Element,
  SlottedElement,
  SlottedError,
  SlottedSubWidget,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttributeMinMax,
  StyleClass,
  IgnoreProperty,
  UIBlock
} from "../framework/workers.js";

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
    new HtmlAttribute(this, undefined, "currentValue", ""),
    new HtmlAttribute(this, "value", "value", "", false, "change"),
    new HtmlAttribute(this, "html:size", "size", "", true),
    new HtmlAttribute(this, "html:step", "step", 1),
    new HtmlAttribute(this, "html:placeholder", "placeholder", undefined),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline", false),
    new HtmlAttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:hide-step", "hideStep", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new HtmlAttributeMinMax(this, "html:min", "html:max", undefined, undefined),
    new UIBlock(this, "readonly"),
    new StyleClass(this, ["u-number-field", "outline"]),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new SlottedElement(this, "span", "u-prefix", ".u-prefix", "start", "prefix-text", "", "prefix-icon", ""),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new SlottedElement(this, "span", "u-suffix", ".u-suffix", "end", "suffix-text", "", "suffix-icon", ""),
    new SlottedSubWidget(this, "span", "", "", "end", "changebutton", "UX.Button", {
      "icon-position": "end",
      "html:tabindex": "-1",
      "html:appearance": "stealth"
    }, false, [
      "detail"
    ], [
      "html:disabled"
    ]),
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the number-field class since we need change event for change button when clicked.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    this.elements.widget.enterKeyPressed = false;

    // Stop propagating change event to parent nodes on pressing enter key if change button is enabled.
    this.elements.widget.addEventListener("keydown", (event) => {
      if (!this.elements.widget.querySelector(".u-sw-changebutton").hidden && event.key === "Enter") {
        this.elements.widget.enterKeyPressed = true;
      }
    });
    this.elements.widget.addEventListener("change", (event) => {
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
