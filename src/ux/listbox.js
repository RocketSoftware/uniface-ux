// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  StyleClass,
  Trigger,
  SlottedElement,
  SlottedElementsByValRep,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeBoolean,
  IgnoreProperty,
  SlottedError,
  Worker
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js.

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
      // Register a setter for display format, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "display-format", this);
      // Register a setter for valrep, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "valrep", this);
      this.registerGetter(widgetClass, "value", this);
    }

    getValue(widgetInstance) {
      const element = this.getElement(widgetInstance);
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const value = valrep[element["selectedIndex"]]?.value ?? widgetInstance?.data?.value;
      return value;
    }

    getValueUpdaters(widgetInstance) {
      this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
      const element = this.getElement(widgetInstance);
      let updaters = [];
      updaters.push({
        "element": element,
        "event_name": "change",
        "handler": () => {
          const valrep = this.getNode(widgetInstance.data, "valrep");
          if (valrep && valrep.length > 0) {
            // Since the value received will be the corresponding index, find the actual value from valrep.
            const value = valrep[element["selectedIndex"]]?.value;
            widgetInstance.setProperties({ "value": value });
          }
        }
      });
      return updaters;
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
      const element = this.getElement(widgetInstance);
      const value = this.getNode(widgetInstance.data, "value");
      const valrep = this.getNode(widgetInstance.data, "valrep");

      // Since the index is passed to fluent instead of the actual value, find the index corresponding to the value received.
      const valueToSet = valrep.findIndex((item) => item.value === value);
      const isValueEmpty = (value === null || value === "");

      if (valrep.length > 0 && (valueToSet !== -1 || isValueEmpty)) {
        widgetInstance.setProperties({
          "format-error": false,
          "format-error-message": ""
        });
      } else {
        widgetInstance.setProperties({
          "format-error": true,
          "format-error-message": Listbox.formatErrorMessage
        });
      }

      window.queueMicrotask(() => {
        element["selectedIndex"] = valueToSet;
      });
    }
  };

  /**
   * Private Worker: ListBoxValRep
   * This is specialized worker to accommodate Listbox with no valrep defined.
   * @class ListBoxValRep
   * @extends {SlottedElementsByValRep}
   */
  static ListBoxValRep = class extends SlottedElementsByValRep {

    /**
     * Creates an instance of ListBoxValRep.
     * @param {typeof Widget} widgetClass
     * @param {String} tagName
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     */
    constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.registerSetter(widgetClass, "layout", this);
      this.registerSetter(widgetClass, "valrep", this);
    }

    refresh(widgetInstance) {
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const value = this.getNode(widgetInstance.data, "value");
      let matchedValrepObj = valrep ? valrep.find((valrepObj) => valrepObj.value === value) : undefined;
      if (valrep.length > 0) {
        if (matchedValrepObj) {
          widgetInstance.elements.widget.valrepUpdated = true;
        }
        super.refresh(widgetInstance);
      } else {
        const ListBoxElement = this.getElement(widgetInstance);
        this.removeValRepElements(widgetInstance);
        ListBoxElement.appendChild(document.createElement(this.tagName));
      }
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
    new SlottedElementsByValRep(this, "fluent-option", "u-option", ""),
    new this.ListboxSelectedValue(this, "value", ""),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength")
  ], [
    new this.ListBoxValRep(this, "fluent-option", "u-option", ""),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "label", "label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "error")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Method used to handle selection change and fire a change event.
   */
  handleSelectionChange() {
    let widgetElement = this.elements.widget;
    const value = this.getNode(this.data, "value");
    const valrep = this.getNode(this.data, "valrep");
    const previousSelectedIndex = valrep.findIndex((item) => item.value === value);
    if (widgetElement.hasAttribute("readonly") || widgetElement.hasAttribute("disabled")) {
      // If listbox is in readonly or disabled state, reset the selectedIndex and return, do not fire a change event.
      widgetElement.selectedIndex = previousSelectedIndex;
      return;
    }
    if (widgetElement.selectedIndex !== previousSelectedIndex) {
      const event = new window.Event("change");
      widgetElement.dispatchEvent(event);
    }
  }

  /**
   * Creates a custom adoptedStyleSheet rules for the ListBox element.
   */
  styleListBox() {
    let element = this.elements.widget;
    this.CSSStyleSheet = new window.CSSStyleSheet();
    this.CSSStyleSheet.replaceSync(`
        .label {
          display: block;
          color: var(--neutral-foreground-rest);
          cursor: pointer;
          font-family: var(--body-font);
          font-size: var(--type-ramp-base-font-size);
          line-height: var(--type-ramp-base-line-height);
          font-weight: initial;
          font-variation-settings: var(--type-ramp-base-font-variations);
          margin-bottom: 4px;
          word-break: break-all;
        }

        :host([disabled]) .label {
          cursor: not-allowed;
          user-select: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
        }

        :host([readonly]) .label {
          cursor: not-allowed;
        }

        :host(:focus-within:not([disabled])) slot:not([name]) {
          outline: calc(var(--focus-stroke-width) * 1px) solid var(--focus-stroke-outer);
          outline-offset: calc(var(--focus-stroke-width) * -1px);
        }

        slot:not([name]) {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          border: calc(var(--stroke-width)* 1px) solid var(--neutral-stroke-rest);
          border-radius: calc(var(--control-corner-radius)* 1px);
          padding: calc(var(--design-unit)* 1px) 0;
        }

        slot[name="error"]{
          cursor: default;
        }
      `);
    if (element.shadowRoot) {
      element.shadowRoot.adoptedStyleSheets = [...element.shadowRoot.adoptedStyleSheets, this.CSSStyleSheet];
    }
  }

  /**
   * Creates a new label element with a slot to place the label.
   */
  createElement() {
    let element = this.elements.widget;

    // Put label inside the shadow root since the fluent library doesn't provide it.
    let labelElement = document.createElement("label");
    labelElement.setAttribute("class", "label");
    labelElement.setAttribute("part", "label");

    // Creating slot element to hold label, since we can't use default slot.
    let labelSlot = document.createElement("slot");
    labelSlot.setAttribute("name", "label");
    labelElement.appendChild(labelSlot);

    // Creating slot element to hold error-icon.
    let errorSlot = document.createElement("slot");
    errorSlot.setAttribute("name", "error");
    labelElement.appendChild(errorSlot);

    element?.shadowRoot?.prepend(labelElement);
  }

  /**
   * Private Uniface API method - onConnect.
   * Specialized onConnect method to add a change event for the listbox when user interaction occurs.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    const labelElement = widgetElement?.shadowRoot?.querySelector(".label");
    if (!labelElement) {
      this.createElement();
      this.styleListBox();
    }

    // Add event listener to prevent the widget from getting focus when clicking on error-icon.
    const errorIcon = widgetElement.querySelector('.u-error-icon');
    errorIcon.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    // Add event listeners for user interactions.
    widgetElement.addEventListener("click", () => {
      this.handleSelectionChange();
    });
    widgetElement.addEventListener("keydown", () => {
      this.handleSelectionChange();
    });
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
