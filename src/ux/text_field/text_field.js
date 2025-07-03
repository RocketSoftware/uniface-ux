// @ts-check
import { Widget } from "../framework/widget.js";
import { Element } from "../framework/workers/element/element.js";
import { HtmlAttribute } from "../framework/workers/html_attribute/html_attribute.js";
import { HtmlAttributeBoolean } from "../framework/workers/html_attribute_boolean/html_attribute_boolean.js";
import { HtmlAttributeChoice } from "../framework/workers/html_attribute_choice/html_attribute_choice.js";
import { HtmlAttributeMinMaxLength } from "../framework/workers/html_attribute_min_max_length/html_attribute_min_max_length.js";
import { HtmlAttributeNumber } from "../framework/workers/html_attribute_number/html_attribute_number.js";
import { HtmlAttributeReadonlyDisabled } from "../framework/workers/html_attribute_readonly_disabled/html_attribute_readonly_disabled.js";
import { SlottedElement } from "../framework/workers/slotted_element/slotted_element.js";
import { SlottedError } from "../framework/workers/slotted_error/slotted_error.js";
import { SlottedSubWidget } from "../framework/workers/slotted_subwidget/slotted_subwidget.js";
import { StyleClass } from "../framework/workers/style_class/style_class.js";
import { Trigger } from "../framework/workers/trigger/trigger.js";
import { UIBlock } from "../framework/workers/ui_block/ui_block.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentTextField, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentTextField());

// This widget also depends on Button, still registration is needed
import { Button } from "../button/button.js";
import { registerWidgetClass } from "../framework/dsp_connector.js";
registerWidgetClass("UX.Button", Button);

/**
 * TextField Widget.
 * @export
 * @class TextField
 * @extends {Widget}
 */
export class TextField extends Widget {

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
  static structure = new Element(this, "fluent-text-field", "", "", [
    new HtmlAttribute(this, undefined, "currentValue", ""),
    new HtmlAttribute(this, "value", "value", "", false, "change"),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, "html:size", "size", "20", true),
    new HtmlAttribute(this, "html:pattern", "pattern", undefined),
    new HtmlAttribute(this, "html:placeholder", "placeholder", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
    new HtmlAttributeChoice(this, "html:type", "type", ["text", "email", "password", "tel", "url", "date"], "text"),
    new HtmlAttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeReadonlyDisabled(this, "html:readonly", "html:disabled", "uiblocked", false, false, false),
    new HtmlAttributeBoolean(this, "html:spellcheck", "spellcheck", false),
    new HtmlAttributeMinMaxLength(this, "html:minlength", "html:maxlength", undefined, undefined),
    new UIBlock(this, "readonly"),
    new StyleClass(this, ["u-text-field", "outline"]),
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
   * This method is used for the textfield class since we need change event for change button when clicked.
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
   * Private Uniface API method - validate.
   * This method is used to ensure that all validation errors are caught, as Fluent doesn't detect some validation errors.
   */
  validate() {
    this.log("validate");

    // Return any HTML5 validation errors.
    let html5ValidationMessage;
    if (!this.elements.widget.control.checkValidity()) {
      html5ValidationMessage = this.elements.widget.control.validationMessage;
    } else if (this.data["html:minlength"] > 0 && this.elements.widget.value.length < this.data["html:minlength"]) {
      // HTML5 minlength validation errors are not detected by fluent, Hence we manually add the HTML5 minlength validation message.
      html5ValidationMessage = `Please lengthen this text to ${this.data["html:minlength"]} characters or more (you are currently using ${this.elements.widget.value.length} characters).`;
    }
    return html5ValidationMessage;
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
    let plainTextValue = this.getNode(properties, "value") ?? "";
    formattedValue.primaryPlainText = plainTextValue.replaceAll(/\n/g, " ");
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

