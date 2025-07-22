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
    new StyleClassManager(this, ["u-switch"]),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, undefined, "role", "switch"),
    new AttributeBooleanValue(this, "value", "checked", null, false, "change"),
    new AttributeString(this, undefined, "currentValue", "on"),
    new AttributeBoolean(this, undefined, "ariaChecked", false),
    new AttributeBoolean(this, undefined, "ariaDisabled", false),
    new AttributeBoolean(this, undefined, "ariaReadOnly", false),
    new AttributeBoolean(this, undefined, "currentChecked", false),
    new AttributeBoolean(this, "html:readonly", "readOnly", false),
    new AttributeBoolean(this, "html:disabled", "disabled", false),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeUIBlocking(this, "disabled"),
    new AttributeChoice(this, "label-position", "u-label-position", ["before", "after"], "before", true),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "", "label-text", ""),
    new ElementIconText(this, "span", "u-checked-message", ".u-checked-message", "checked-message", "checked-message"),
    new ElementIconText(this, "span", "u-unchecked-message", ".u-unchecked-message", "unchecked-message", "unchecked-message"),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "error"),
    new EventTrigger(this, "onchange", "change", true)
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
