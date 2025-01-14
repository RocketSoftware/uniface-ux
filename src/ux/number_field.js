// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
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
  IgnoreProperty
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

// This widget also depends on Button, still registration is needed
import { Button } from "./button.js";
UNIFACE.ClassRegistry.add("UX.Button", Button);

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
  static uiBlocking = "readonly";

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
    new HtmlAttributeChoice(this, "uniface:label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:hide-step", "hideStep", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new HtmlAttributeMinMax(this, "html:min", "html:max", undefined, undefined),
    new StyleClass(this, ["u-number-field", "outline"])
  ], [
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"),
    new SlottedElement(this, "span", "u-prefix", ".u-prefix", "start", "uniface:prefix-text", "", "uniface:prefix-icon", ""),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new SlottedElement(this, "span", "u-suffix", ".u-suffix", "end", "uniface:suffix-text", "", "uniface:suffix-icon", ""),
    new SlottedSubWidget(this, "span", "", "", "end", "changebutton", "UX.Button", {
      "uniface:icon-position": "end",
      "html:tabindex": "-1",
      "html:appearance": "stealth"
    }, false, [
      "detail"
    ])
  ], [
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
   * @returns {string[]}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "uniface:error",
      "uniface:error-message",
      "uniface:prefix-icon",
      "uniface:prefix-text",
      "uniface:suffix-icon",
      "uniface:suffix-text"
    ];
  }

  /**
   * Returns the value as format-object for text-based widgets
   * like the cell widget of the data-grid.
   * @param {UData} properties
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    formattedValue.primaryPlainText = this.getNode(properties, "value");
    formattedValue.prefixIcon = this.getNode(properties, "uniface:prefix-icon");
    if (!formattedValue.prefixIcon) {
      formattedValue.prefixText = this.getNode(properties, "uniface:prefix-text");
    }
    formattedValue.suffixIcon = this.getNode(properties, "uniface:suffix-icon");
    if (!formattedValue.suffixIcon) {
      formattedValue.suffixText = this.getNode(properties, "uniface:suffix-text");
    }
    if (this.toBoolean(this.getNode(properties, "uniface:error"))) {
      formattedValue.errorMessage = this.getNode(properties, "uniface:error-message");
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
