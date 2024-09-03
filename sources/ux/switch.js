// @ts-check
/* global UNIFACE */
import { Widget_UXWF } from "./widget_UXWF.js";
import {
  Element,
  SlottedError,
  StyleClass,
  Trigger,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeBoolean,
  SlottedElement,
  HtmlValueAttributeBoolean
} from "./workers_UXWF.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * Switch widget
 * @export
 * @class Switch_UXWF
 * @extends {Widget_UXWF}
 */
export class Switch_UXWF extends Widget_UXWF {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
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
     * @param {typeof Widget_UXWF} widgetClass
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
        if (formatError || error) {
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
  static structure = new Element(
    this,
    "fluent-switch",
    "",
    "",
    [
      new StyleClass(this, ["u-switch"]),
      new HtmlAttribute(this, "html:role", "role", "switch"),
      new HtmlValueAttributeBoolean(this, "value", "checked", false),
      new HtmlAttribute(this, "html:current-value", "currentValue", "on"),
      new HtmlAttributeBoolean(this, "html:aria-checked", "ariaChecked", false),
      new HtmlAttributeBoolean(this, "html:aria-disabled", "ariaDisabled", false),
      new HtmlAttributeBoolean(this, "html:aria-readonly", "ariaReadOnly", false),
      new HtmlAttributeBoolean(this, "html:current-checked", "currentChecked", false),
      new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
      new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
      new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
      new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    ],
    [
      new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"),
      new SlottedElement(this, "span", "u-checked-message", ".u-checked-message", "checked-message", "uniface:checked-message"),
      new SlottedElement(this, "span", "u-unchecked-message", ".u-unchecked-message", "unchecked-message", "uniface:unchecked-message"),
      new this.SwitchSlottedError(this, "span", "u-error-icon-unchecked", ".u-error-icon-unchecked", "unchecked-message", ".u-unchecked-message"),
      new this.SwitchSlottedError(this, "span", "u-error-icon-checked", ".u-error-icon-checked", "checked-message", ".u-checked-message"),
    ],
    [new Trigger(this, "onchange", "change", true)]
  );

  onConnect(widgetElement, objectDefinition) {
    this.elements = {};
    this.elements.widget = widgetElement;
    // Set the 'part' attribute on the switch slot so that CSS styling can be done.
    this.elements.widget.shadowRoot.querySelector("slot[name='switch']").setAttribute("part", "switch-toggle");
    return super.onConnect(widgetElement, objectDefinition);
  }
}

UNIFACE.ClassRegistry.add("UX.Switch_UXWF", Switch_UXWF);
