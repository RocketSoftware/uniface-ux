// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  StyleClass,
  Trigger,
  SlottedElementsByValRep,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeBoolean,
  IgnoreProperty,
  Worker
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

/**
 * Listbox Widget
 * @export
 * @class Listbox
 * @extends {Widget}
 */
export class Listbox extends Widget {

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
   * Private Worker: Used to handle changes in value and valrep.
   * As part of basic implementation, will only update the previousSelectedIndex property in refresh method.
   * @class ListboxSelectedValue
   * @extends {Worker}
   */
  static ListboxSelectedValue = class extends Worker {

    /**
     * Creates an instance of ListboxSelectedValue.
     * @param {typeof Widget} widgetClass
     * @param {String} propId
     * @param {String} defaultValue
     */
    constructor(widgetClass, propId, defaultValue) {
      super(widgetClass);
      this.registerSetter(widgetClass, propId, this);
      this.registerDefaultValue(widgetClass, propId, defaultValue);
      // Register a setter for valrep, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "valrep", this);
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });

      // Should be set to -1 only if newly selected value is not part of valrep.
      // Now setting to -1 by default as value hook up is not yet implemented.
      widgetInstance.previousSelectedIndex = -1;
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-listbox", "", "", [
    new StyleClass(this, ["u-listbox"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, undefined, "role", "listbox"),
    new HtmlAttribute(this, undefined, "ariaActiveDescendant", ""),
    new HtmlAttribute(this, undefined, "ariaControls", ""),
    new HtmlAttributeBoolean(this, undefined, "ariaDisabled", false),
    new HtmlAttributeBoolean(this, undefined, "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, undefined, "ariaExpanded", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readonly", false, true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new this.ListboxSelectedValue(this, "value", ""),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength")
  ], [
    new SlottedElementsByValRep(this, "fluent-option", "u-option", "")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Method used to handle selection change and fire a change event.
   */
  handleSelectionChange(widgetElement) {
    if (widgetElement.hasAttribute("readonly") || widgetElement.hasAttribute("disabled")) {
      // If listbox is in readonly or disabled state, reset the selectedIndex and return, do not fire a change event.
      widgetElement.selectedIndex = this.previousSelectedIndex;
      return;
    }
    if (widgetElement.selectedIndex !== this.previousSelectedIndex) {
      this.previousSelectedIndex = widgetElement.selectedIndex;
      const event = new window.Event("change");
      widgetElement.dispatchEvent(event);
    }
  }

  /**
   * Private Uniface API method - onConnect.
   * Specialized onConnect method to add a change event for the listbox when user interaction occurs.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    let widgetInstance = this;
    // Add event listeners for user interactions.
    widgetElement.addEventListener("click", function () {
      widgetInstance.handleSelectionChange(widgetElement);
    });
    widgetElement.addEventListener("keydown", function () {
      widgetInstance.handleSelectionChange(widgetElement);
    });
    // Store the original selectedIndex value.
    widgetInstance.previousSelectedIndex = widgetElement.selectedIndex;
    return valueUpdaters;
  }

  /**
   * Private Uniface API method - blockUI.
   * Specialized blockUI method to explicitly add readonly as an attribute because it is not supported as a property.
   */
  blockUI() {
    this.log("blockUI");

    /** @type {Object} */
    let widgetClass = this.constructor;
    // Check if uiBlocking is defined in the constructor.
    if (widgetClass.uiBlocking) {
      // Add the 'u-blocked' class to the widget element.
      this.elements.widget.classList.add("u-blocked");
      if (widgetClass.uiBlocking === "readonly") {
        // Add the readonly attribute to the widget element.
        this.elements.widget.setAttribute("readonly", "true");
      } else {
        // If uiBlocking has an invalid value, log an error.
        this.error("blockUI()", "Static uiBlocking not defined or invalid value", "No UI blocking");
      }
    }
  }

  /**
   * Private Uniface API method - unblockUI.
   * Specialized unblockUI method to explicitly remove the readonly attribute.
   */
  unblockUI() {
    this.log("unblockUI");

    /** @type {Object} */
    const widgetClass = this.constructor;
    // Check if uiBlocking is defined in the constructor.
    if (widgetClass.uiBlocking) {
      // Remove the 'u-blocked' class from the widget element.
      this.elements.widget.classList.remove("u-blocked");
      if (widgetClass.uiBlocking === "readonly") {
        if (!this.toBoolean(this.data["html:readonly"])) {
          // Remove the readonly attribute from the widget element.
          this.elements.widget.removeAttribute("readonly");
        }
      } else {
        // If uiBlocking has an invalid value, log an error.
        this.error("unblockUI()", "Static uiBlocking not defined or invalid value", "No UI blocking");
      }
    }
  }
}

UNIFACE.ClassRegistry.add("UX.Listbox", Listbox);
