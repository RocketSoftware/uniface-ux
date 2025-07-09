// @ts-check
import { Widget } from "../framework/widget.js";
import { Element } from "../framework/workers/element/element.js";
import { HtmlAttribute } from "../framework/workers/html_attribute/html_attribute.js";
import { HtmlAttributeBoolean } from "../framework/workers/html_attribute/html_attribute_boolean.js";
import { HtmlAttributeChoice } from "../framework/workers/html_attribute/html_attribute_choice.js";
import { HtmlAttributeNumber } from "../framework/workers/html_attribute/html_attribute_number.js";
import { HtmlValueAttributeBoolean } from "../framework/workers/html_attribute/html_value_attribute_boolean.js";
import { IgnoreProperty } from "../framework/workers/ignore_property/ignore_property.js";
import { SlottedElement } from "../framework/workers/slotted/slotted_element.js";
import { SlottedError } from "../framework/workers/slotted/slotted_error.js";
import { StyleClass } from "../framework/workers/style_class/style_class.js";
import { Trigger } from "../framework/workers/trigger/trigger.js";
import { UIBlock } from "../framework/workers/ui_block/ui_block.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentSwitch, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentSwitch());

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
    new UIBlock(this, "disabled"),
    new HtmlAttributeChoice(this, "label-position", "u-label-position", ["before", "after"], "before", true),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "label-text", ""),
    new SlottedElement(this, "span", "u-checked-message", ".u-checked-message", "checked-message", "checked-message"),
    new SlottedElement(this, "span", "u-unchecked-message", ".u-unchecked-message", "unchecked-message", "unchecked-message"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "error"),
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Creates a new error element with a slot inside it to place the error icon.
   */
  createErrorSlot() {
    let element = this.elements.widget;

    // Create an error element.
    let errorElement = document.createElement("span");
    errorElement.setAttribute("part", "error");
    errorElement.classList.add("error");

    // Create a slot element to hold the error-icon and append it to the error element.
    let slot = document.createElement("slot");
    slot.setAttribute("name", "error");
    errorElement.appendChild(slot);

    // Append the error element to the shadow root.
    element.shadowRoot?.appendChild(errorElement);
  }

  /**
   * Private Uniface API method - onConnect.
   * Specialized onConnect method to set the 'part' attribute on the switch slot and to create a new slot for the error-icon.
   * @param {HTMLElement} widgetElement
   * @param {UObjectDefinition} objectDefinition - reference to the component definitions.
   * @returns {Array<Updater> | undefined | null}
   */
  onConnect(widgetElement, objectDefinition) {
    this.elements = {};
    this.elements.widget = widgetElement;
    // Set the 'part' attribute on the switch slot so that CSS styling can be done.
    this.elements.widget.shadowRoot?.querySelector("slot[name='switch']").setAttribute("part", "switch-toggle");
    // Create a new slot for the error-icon since the fluent library does not provide it.
    this.createErrorSlot();
    return super.onConnect(widgetElement, objectDefinition);
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
      "checked-message",
      "unchecked-message"
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
    try {
      if (this.fieldValueToBoolean(this.getNode(properties, "value"))) {
        formattedValue.primaryHtmlText = this.getNode(properties, "checked-message") || "On";
      } else {
        formattedValue.primaryHtmlText = this.getNode(properties, "unchecked-message") || "Off";
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
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
