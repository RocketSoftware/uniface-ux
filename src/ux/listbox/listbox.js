// @ts-check
import { Widget } from "../framework/widget.js";
import { HtmlAttribute } from "../framework/workers/html_attribute/html_attribute.js";
import { HtmlAttributeBoolean } from "../framework/workers/html_attribute_boolean/html_attribute_boolean.js";
import { HtmlAttributeNumber } from "../framework/workers/html_attribute_number/html_attribute_number.js";
import { IgnoreProperty } from "../framework/workers/ignore_property/ignore_property.js";
import { SlottedElement } from "../framework/workers/slotted_element/slotted_element.js";
import { SlottedElementsByValRep } from "../framework/workers/slotted_element_by_valrep/slotted_element_by_valrep.js";
import { SlottedError } from "../framework/workers/slotted_error/slotted_error.js";
import { StyleClass } from "../framework/workers/style_class/style_class.js";
import { Trigger } from "../framework/workers/trigger/trigger.js";
import { UIBlock } from "../framework/workers/ui_block/ui_block.js";
import { Worker } from "../framework/workers/workers.js";
import { Element } from "../framework/workers/element/element.js";
// The import of Fluent UI web-components is done in loader.js.

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentOption, fluentListbox, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentOption(), fluentListbox());

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

  /**
   * Private Worker: Used to handle changes in value and valrep.
   * @class ListboxSelectedValue
   * @extends {Worker}
   */
  static ListboxSelectedValue = class extends Worker {

    /**
     * Creates an instance of ListboxSelectedValue.
     * @param {typeof Widget} widgetClass
     * @param {string} propId
     * @param {string} defaultValue
     */
    constructor(widgetClass, propId, defaultValue) {
      super(widgetClass);
      this.registerSetter(widgetClass, propId, this);
      this.registerDefaultValue(widgetClass, propId, defaultValue);
      // Register a setter for display-format, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "display-format", this);
      // Register a setter for valrep, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "valrep", this);
      this.registerGetter(widgetClass, "value", this);
    }

    /**
     * Returns the (field) value back to Uniface.
     * @param {Widget} widgetInstance
     * @returns {string}
     */
    getValue(widgetInstance) {
      const element = this.getElement(widgetInstance);
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const value = valrep[element["selectedIndex"]]?.value ?? widgetInstance.data.value;
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
        this.setErrorProperties(widgetInstance, "format-error");
      } else {
        this.setErrorProperties(widgetInstance, "format-error", Listbox.formatErrorMessage);
      }

      window.queueMicrotask(() => {
        element["selectedIndex"] = valueToSet;
      });
    }
  };

  /**
   * Private Worker: Used to handle size and overflow.
   * @class SizeAttribute
   * @extends {Worker}
   */
  static SizeAttribute = class extends Worker {

    /**
     * Creates an instance of SizeAttribute.
     * @param {typeof Widget} widgetClass
     * @param {string} propId
     * @param {string | undefined} defaultValue
     */
    constructor(widgetClass, propId, defaultValue) {
      super(widgetClass);
      this.propId = propId;
      this.registerSetter(widgetClass, propId, this);
      this.registerDefaultValue(widgetClass, propId, defaultValue);
      this.registerSetter(widgetClass, "valrep", this);
    }

    // Helper function to add the CSSStyleSheet to the shadowRoot.
    applyStyleSheet(element, cssString) {
      if (element.shadowRoot) {
        const CSSStyleSheet = new window.CSSStyleSheet();
        CSSStyleSheet.replaceSync(cssString);
        element.shadowRoot.adoptedStyleSheets = [
          ...element.shadowRoot.adoptedStyleSheets,
          CSSStyleSheet
        ];
      }
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });

      let size = this.getNode(widgetInstance.data, this.propId);
      const element = this.getElement(widgetInstance);

      if (size === undefined) {
        element.removeAttribute("u-size");
        const resetCSS = `
          slot:not([name]) {
            max-height: unset;
          }
        `;
        this.applyStyleSheet(element, resetCSS);
        return;
      }

      const fluentOptionElements = element.querySelectorAll("fluent-option");
      const slotElement = element.shadowRoot?.querySelector("slot:not([name])");
      size = parseInt(size);

      if (size > 0) {
        // Set the u-size attribute to the element.
        element.setAttribute("u-size", size);

        // Get computed styles for option and slot elements.
        const computedStyleOption = window.getComputedStyle(fluentOptionElements[0]);
        const computedStyleSlot = slotElement ? window.getComputedStyle(slotElement) : null;

        // Calculate total height based on option height, border height, and slotPadding.
        const optionHeight = parseFloat(computedStyleOption.height);
        const borderHeight = parseFloat(computedStyleOption.borderTopWidth) + parseFloat(computedStyleOption.borderBottomWidth);
        const slotPaddingTop = computedStyleSlot ? parseFloat(computedStyleSlot.paddingTop) : 0;
        // Apply bottom padding only if size equals to or greater than number of options, otherwise set it to 0.
        const slotPaddingBottom = (size >= fluentOptionElements.length) ? (computedStyleSlot ? parseFloat(computedStyleSlot.paddingBottom) : 0) : 0;
        const slotPadding = slotPaddingTop + slotPaddingBottom;

        const totalHeight = optionHeight * size + borderHeight + slotPadding;

        const updatedCSS = `
          slot:not([name]) {
            max-height: ${totalHeight}px;
            overflow-y: auto;
          }
          ::slotted(fluent-option) {
            overflow: unset;
            flex-shrink: 0;
          }
        `;
        this.applyStyleSheet(element, updatedCSS);
      } else {
        // Show warning if size is NaN or less than or equal to 0.
        this.warn("refresh()", `Size property cannot be set to '${size}'`, "Ignored");
      }
      return;
    }
  };

  /**
  * Private Worker: This is specialized worker to accommodate Listbox with no valrep defined.
  * @class ListBoxValRep
  * @extends {SlottedElementsByValRep}
  */
  static ListBoxValRep = class extends SlottedElementsByValRep {
    refresh(widgetInstance) {
      const valrep = this.getNode(widgetInstance.data, "valrep");
      if (valrep.length > 0) {
        super.refresh(widgetInstance);
      } else {
        const listBoxElement = this.getElement(widgetInstance);
        const option = document.createElement(this.tagName);
        this.removeValRepElements(widgetInstance);
        option["disabled"] = true;
        listBoxElement.appendChild(option);
      }
    }
  };

  /**
  * Private Worker: Specialized worker to explicitly add readonly as an attribute because it is not supported as a property.
  * @class ListboxUIBlock
  * @extends {UIBlock}
  */
  static ListboxUIBlock = class extends UIBlock {
    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription()
      });
      const element = widgetInstance.elements.widget;
      const isBlocked = this.toBoolean(this.getNode(widgetInstance.data, "uiblocked"));

      if (this.uiblocking === "readonly") {
        if (isBlocked) {
          element.classList.add("u-blocked");
          element.setAttribute("readonly", "true");
          element.setAttribute("aria-readonly", "true");
        } else {
          element.classList.remove("u-blocked");
          const htmlReadonly = widgetInstance.toBoolean(widgetInstance.data["html:readonly"]);
          if (!htmlReadonly) {
            element.removeAttribute("readonly");
            element.setAttribute("aria-readonly", "false");
          }
        }
      } else {
        widgetInstance.error("UIBlock", "Invalid block type", this.uiblocking);
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
    new HtmlAttributeBoolean(this, undefined, "ariaExpanded", false),
    new HtmlAttributeBoolean(this, "html:disabled", "ariaDisabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readonly", false, true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new this.ListBoxValRep(this, "fluent-option", "u-option", ""),
    new this.ListboxSelectedValue(this, "value", ""),
    new this.SizeAttribute(this, "size", undefined),
    new this.ListboxUIBlock(this, "readonly"),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "label", "label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "error"),
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
   * @param {HTMLElement} widgetElement
   * @param {UObjectDefinition} objectDefinition - reference to the component definitions.
   * @returns {Array<Updater> | undefined | null}
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    const labelElement = widgetElement.shadowRoot?.querySelector(".label");
    if (!labelElement) {
      this.createElement();
      this.styleListBox();
    }

    // Add event listener to prevent the widget from getting focus when clicking on error-icon.
    const errorIcon = widgetElement.querySelector(".u-error-icon");
    errorIcon?.addEventListener("mousedown", (event) => {
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
}
