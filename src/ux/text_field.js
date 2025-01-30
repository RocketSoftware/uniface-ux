// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  StyleClass,
  Trigger,
  SlottedElement,
  SlottedError,
  SlottedSubWidget,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttributeReadonlyDisabled,
  HtmlAttributeMinMaxLength
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

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
  static uiBlocking = "readonly";

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
    new StyleClass(this, ["u-text-field", "outline"])
  ], [
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
    ])
  ], [
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
   * Private Uniface API method - blockUI.
   * Blocks user interaction with the widget.
   */
  blockUI() {
    this.log("blockUI");
    // Call blockUI() for each sub-widget.
    Object.keys(this.subWidgets).forEach((key) => {
      this.subWidgets[key].blockUI();
    });
    // Add the 'u-blocked' class to the widget element.
    this.elements.widget.classList.add("u-blocked");
    this.setProperties({ "uiblocked": true });
  }

  /**
   * Private Uniface API method - unblockUI.
   * Unblocks user interaction with the widget.
   */
  unblockUI() {
    this.log("unblockUI");
    // Call unblockUI() for each sub-widget.
    Object.keys(this.subWidgets).forEach((key) => {
      this.subWidgets[key].unblockUI();
    });
    // Remove the 'u-blocked' class from the widget element.
    this.elements.widget.classList.remove("u-blocked");
    this.setProperties({ "uiblocked": false });
  }

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {string[]}
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
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    let plainTextValue = this.getNode(properties, "value");
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

UNIFACE.ClassRegistry.add("UX.TextField", TextField);
