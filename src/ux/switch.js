// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  SlottedError,
  StyleClass,
  Trigger,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeBoolean,
  SlottedElement,
  HtmlValueAttributeBoolean,
  IgnoreProperty,
  SubWidgetOverFlow
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

/**
 * Switch widget
 * @export
 * @class Switch
 * @extends {Widget}
 */
export class Switch extends Widget {

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
  static uiBlocking = "disabled";

  /**
   * Private worker: SwitchSlottedError.
   * It remembers the slot which is utilizing the same error slot.
   * @export
   * @class SwitchSlottedError
   * @extends {SlottedError}
   */
  static SwitchSlottedError = class extends SlottedError {

    /**
     * Creates an instance of SwitchSlottedError.
     * @param {typeof Widget} widgetClass
     * @param {String} selectorUsingSameErrorSlot
     */
    constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, selectorUsingSameErrorSlot) {
      super(widgetClass, tagName, styleClass, elementQuerySelector, slot);
      this.selectorUsingSameErrorSlot = selectorUsingSameErrorSlot;
    }

    refresh(widgetInstance) {
      super.refresh(widgetInstance);
      let error = this.toBoolean(this.getNode(widgetInstance.data.properties, "uniface:error"));
      let formatError = this.toBoolean(this.getNode(widgetInstance.data.properties, "uniface:format-error"));
      let element = widgetInstance.elements.widget;
      let errorElement = this.getElement(widgetInstance);
      if (errorElement && this.selectorUsingSameErrorSlot) {
        let slotElement = element.querySelector(this.selectorUsingSameErrorSlot);
        if (formatError || error || slotElement.textContent.trim() === '') {
          slotElement.slot = "";
          slotElement.hidden = true;
        } else {
          // Resetting the slot again when error is hidden.
          slotElement.slot = this.slot;
          slotElement.hidden = false;
        }
      }
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-switch", "", "", [
    new StyleClass(this, ["u-switch"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, undefined, "role", "switch"),
    new HtmlValueAttributeBoolean(this, "value", "checked", null, false, "change"),
    new HtmlAttribute(this, undefined, "currentValue", "on"),
    new HtmlAttributeBoolean(this, undefined, "ariaChecked", false),
    new HtmlAttributeBoolean(this, undefined, "ariaDisabled", false),
    new HtmlAttributeBoolean(this, undefined, "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, undefined, "currentChecked", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new SubWidgetOverFlow(this, "uniface:overflow-behavior", "overflow-behavior", undefined, ["none", "move", "menu", "hide"]),
    new SubWidgetOverFlow(this, "uniface:priority", "priority", undefined, ["1", "2", "3", "4", "5", "6", "7", "8"])
  ], [
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text", ""),
    new SlottedElement(this, "span", "u-checked-message", ".u-checked-message", "checked-message", "uniface:checked-message"),
    new SlottedElement(this, "span", "u-unchecked-message", ".u-unchecked-message", "unchecked-message", "uniface:unchecked-message"),
    new this.SwitchSlottedError(this, "span", "u-error-icon-unchecked", ".u-error-icon-unchecked", "unchecked-message", ".u-unchecked-message"),
    new this.SwitchSlottedError(this, "span", "u-error-icon-checked", ".u-error-icon-checked", "checked-message", ".u-checked-message")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  onConnect(widgetElement, objectDefinition) {
    this.elements = {};
    this.elements.widget = widgetElement;
    // Set the 'part' attribute on the switch slot so that CSS styling can be done.
    this.elements.widget.shadowRoot.querySelector("slot[name='switch']").setAttribute("part", "switch-toggle");
    return super.onConnect(widgetElement, objectDefinition);
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
      "uniface:checked-message",
      "uniface:unchecked-message"
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
    try {
      if (this.fieldValueToBoolean(this.getNode(properties, "value"))) {
        formattedValue.primaryHtmlText = this.getNode(properties, "uniface:checked-message") || "On";
      } else {
        formattedValue.primaryHtmlText = this.getNode(properties, "uniface:unchecked-message") || "Off";
      }
      if (this.toBoolean(this.getNode(properties, "uniface:error"))) {
        formattedValue.errorMessage = this.getNode(properties, "uniface:error-message");
      }
    } catch (err) {
      formattedValue.primaryPlainText = "ERROR";
      formattedValue.errorMessage = err;
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}

UNIFACE.ClassRegistry.add("UX.Switch", Switch);
