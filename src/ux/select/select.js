// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { WorkerBase } from "../framework/common/worker_base.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";
import { PropertyFilter } from "../framework/workers/property_filter.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ElementsValrep } from "../framework/workers/elements_valrep.js";
import { ElementError } from "../framework/workers/element_error.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../framework/workers/attribute_ui_blocking.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentOption, fluentSelect, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentOption(), fluentSelect());

/**
 * Select Widget
 * @export
 * @class Select
 * @extends {Widget}
 */
export class Select extends Widget {

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
   * Private Worker: This is a specialized worker used to explicitly make the select widget readonly.
   * This is required as the readonly attribute is not supported by fluent-select.
   * @class AttributeBooleanReadOnly
   * @extends {AttributeBoolean}
   */
  static AttributeBooleanReadOnly = class extends AttributeBoolean {
    refresh(widgetInstance) {
      const element = this.getElement(widgetInstance);
      const readonly = this.toBoolean(this.getNode(widgetInstance.data, "html:readonly"));
      if (readonly) {
        element.classList.add("u-readonly");
      } else {
        element.classList.remove("u-readonly");
      }
    }
  };

  /**
   * Private Worker: Adds and maintains a slotted element for the placeholder/selected value text.
   * @class ElementSelectedValueWithPlaceholder
   * @extends {WorkerBase}
   */
  static ElementSelectedValueWithPlaceholder = class extends WorkerBase {

    /**
     * Creates an instance of ElementSelectedValueWithPlaceholder.
     * @param {typeof Widget} widgetClass
     * @param {string} styleClass
     * @param {string} elementQuerySelector
     */
    constructor(widgetClass, styleClass, elementQuerySelector) {
      super(widgetClass);
      // Register a setter for display format, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "display-format", this);
      this.registerSetter(widgetClass, "valrep", this);

      this.registerGetter(widgetClass, "value", this);
      this.registerSetter(widgetClass, "value", this);
      this.registerDefaultValue(widgetClass, "value", "");

      // Register a setter for label-text, ensuring it also updates the worker's refresh function.
      // This is to over-ride the behavior of setting the first option as selected on changing the label.
      this.registerSetter(widgetClass, "label-text", this);

      this.registerSetter(widgetClass, "placeholder-text", this);
      this.registerDefaultValue(widgetClass, "placeholder-text", "Selected item");

      this.registerSetter(widgetClass, "show-placeholder", this);
      this.registerDefaultValue(widgetClass, "show-placeholder", false);
      this.styleClass = styleClass;
      this.elementQuerySelector = elementQuerySelector;
    }

    createPlaceholderElement(text, value) {
      this.log("createPlaceholderElement", null);
      const element = document.createElement("div");
      element.setAttribute("value", value);
      const placeholderElement = document.createElement("span");
      placeholderElement.className = "u-placeholder";
      placeholderElement.textContent = text;
      element.appendChild(placeholderElement);
      return element;
    }

    /**
     * Get representation from valrep.
     */
    getRepresentation(value, valrep) {
      if (valrep) {
        const obj = valrep.find((item) => item.value === value);
        if (obj) {
          return obj.representation;
        }
      }
      return "";
    }

    createSelectedValrepElement(tagName, val, rep, displayFormat) {
      const selectedValRepElement = document.createElement(tagName);
      selectedValRepElement.setAttribute("value", val);
      selectedValRepElement.appendChild(this.getFormattedValrepItemAsHTML(displayFormat, val, rep));
      return selectedValRepElement;
    }

    reformatValueElement(displayFormat, selectedValueSlot, rep, val) {
      const selectedRepSpan = selectedValueSlot.querySelector(".u-valrep-representation");
      const selectedValSpan = selectedValueSlot.querySelector(".u-valrep-value");
      // If the previous selected option was placeholder, it will not have rep and value span,
      // hence create it. Also, remove the placeholder element.
      let selectedPlaceholderSpan = selectedValueSlot.querySelector(".u-placeholder");
      if (selectedPlaceholderSpan) {
        selectedPlaceholderSpan.remove();
        selectedValueSlot.appendChild(this.getFormattedValrepItemAsHTML(displayFormat, val, rep));
      } else {
        selectedRepSpan ? (selectedRepSpan.innerHTML = rep) : "";
        selectedValSpan ? (selectedValSpan.textContent = val) : "null";
      }

    }

    updateValueElement(widgetInstance) {

      /** @type {HTMLSelectElement} */
      // @ts-ignore
      const element = this.getElement(widgetInstance);
      const displayFormat = this.getNode(widgetInstance.data, "display-format");
      const selectedValueSlot = element.querySelector("[slot='selected-value']");
      const selectedOptionElement = element.options[element.selectedIndex];
      const selectedRepSpan = selectedOptionElement.querySelector(".u-valrep-representation");
      const selectedValSpan = selectedOptionElement.querySelector(".u-valrep-value");
      const valrep = this.getNode(widgetInstance.data, "valrep");
      if (selectedOptionElement.style && selectedOptionElement.style.display === "none") {
        return;
      }
      if (selectedValueSlot) {
        selectedValueSlot.setAttribute("value", element.value);
        // Since the value received will be the corresponding index, find the actual value from valrep.
        const value = valrep[element.value]?.value;
        widgetInstance.data.value = value;
      }
      this.reformatValueElement(
        displayFormat,
        selectedValueSlot,
        selectedRepSpan ? selectedRepSpan.innerHTML : "",
        selectedValSpan ? selectedValSpan.textContent : ""
      );
      // Always call hideFormatError as we cannot select an invalid option.
      this.setErrorProperties(widgetInstance, "format-error");
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      const element = this.getElement(widgetInstance);
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const selectedOption = valrep[element["value"]];
      // When the user event triggers,
      // the getValue() is called first, so the value should be read directly from the element instead of the data properties.
      // For programmatical updates, if the value is invalid, it is read from the data properties.
      const value = selectedOption ? selectedOption.value : widgetInstance.data.value;
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
          this.updateValueElement(widgetInstance);
        }
      });
      return updaters;
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
      let isPlaceholderElementCreated = false;
      const element = this.getElement(widgetInstance);
      let rep;
      const value = this.getNode(widgetInstance.data, "value");
      const valrep = this.getNode(widgetInstance.data, "valrep");
      // Since the index is passed to fluent instead of the actual value, find the index corresponding to the value received.
      const valueToSet = valrep.findIndex((item) => item.value === value) ?? "";
      const isValueEmpty = (value === null || value === "");
      const showPlaceholder = this.toBoolean(this.getNode(widgetInstance.data, "show-placeholder"));
      const placeholderText = this.getNode(widgetInstance.data, "placeholder-text");
      const displayFormat = this.getNode(widgetInstance.data, "display-format");
      let selectedValueElement = widgetInstance.elements.widget.querySelector("[slot='selected-value']");
      if (selectedValueElement) {
        selectedValueElement.remove();
      }
      if (valueToSet === -1 && isValueEmpty && showPlaceholder) {
        selectedValueElement = this.createPlaceholderElement(placeholderText, value);
        isPlaceholderElementCreated = true;
      } else {
        rep = this.getRepresentation(value, valrep);
        selectedValueElement = this.createSelectedValrepElement("div", value, rep, displayFormat);
      }
      if (selectedValueElement) {
        selectedValueElement.setAttribute("slot", "selected-value");
        element.appendChild(selectedValueElement);
      }

      if (!isPlaceholderElementCreated && valueToSet === -1) {
        this.setErrorProperties(widgetInstance, "format-error", Select.formatErrorMessage);
      } else {
        this.setErrorProperties(widgetInstance, "format-error");
      }
      // When the value doesn't match any of the options in the option list
      // then Fluent sets the first option as selected.
      // We override this behavior asynchronously (with the help of
      // queueMicrotask) by setting the widget's value to this.data.value.
      // So after fluent has selected the default (first) option,
      // it is overridden so that the value of select widget is equal to
      // this.data.value even if there is no option corresponding to it.
      // queueMicrotask() schedules a microtask to be executed in the next
      // available microtask queue, which is typically more immediate and
      // precise than setTimeout().
      window.queueMicrotask(() => {
        element["value"] = valueToSet.toString();
        // Also update 'previousValue' on programmatical value update.
        widgetInstance.previousValue = valueToSet;
      });
    }
  };

  /**
   * Private Worker: A special check is needed for the tabindex during the disabled state,
   * as Fluent automatically sets it to null when disabled and to 0 once the component is no longer disabled.
   * @class
   * @extends {AttributeBoolean}
   */
  static AttributeDisabled = class extends AttributeBoolean {
    refresh(widgetInstance) {
      super.refresh(widgetInstance);
      const element = this.getElement(widgetInstance);
      const tabIndexValue = this.getNode(widgetInstance.data, "html:tabindex");
      window.setTimeout(() => {
        element["tabIndex"] = tabIndexValue;
      }, 1000);
    }
  };

  /**
  * Private Worker: This is specialized worker to handle blockUI and unblockUI methods.
  * Select should be in readonly during block state and this property is not defined by fluent.
  * For this we explicitly need to add u-readonly class to the widget element.
  * @class AttributeUIBlocking
  * @extends {AttributeUIBlocking}
  */
  static AttributeUIBlocking = class extends AttributeUIBlocking {
    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription()
      });
      const element = widgetInstance.elements.widget;
      const isBlocked = this.toBoolean(this.getNode(widgetInstance.data, "uiblocked"));

      if (this.uiblocking === "readonly") {
        const htmlReadonly = widgetInstance.toBoolean(widgetInstance.data["html:readonly"]);
        if (isBlocked) {
          element.classList.add("u-blocked");
          element.classList.add("u-readonly");
        } else if (!htmlReadonly) {
          element.classList.remove("u-blocked");
          element.classList.remove("u-readonly");
        }
      } else {
        widgetInstance.error("AttributeUIBlocking", "Invalid block type", this.uiblocking);
      }
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-select", "", "", [
    new StyleClassManager(this, ["u-select", "collapsible", "outline"]),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, undefined, "role", "combobox"),
    new AttributeString(this, undefined, "currentValue", ""),
    new AttributeString(this, undefined, "ariaActivedescendant", ""),
    new AttributeString(this, undefined, "ariaControls", ""),
    new AttributeString(this, undefined, "ariaHaspopup", "listbox"),
    new AttributeBoolean(this, undefined, "ariaDisabled", false),
    new AttributeBoolean(this, undefined, "ariaReadOnly", false),
    new AttributeBoolean(this, undefined, "ariaExpanded", false),
    new this.AttributeDisabled(this, "html:disabled", "disabled", false),
    new this.AttributeBooleanReadOnly(this, "html:readonly", "readOnly", false),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeChoice(this, "popup-position", "u-position", ["above", "below"], "below", true),
    new this.AttributeUIBlocking(this, "readonly"),
    new this.ElementSelectedValueWithPlaceholder(this, "u-placeholder", ""),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "label", "label-text"),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new ElementsValrep(this, "fluent-option", "", ""),
    new EventTrigger(this, "onchange", "change", true)
  ]);

  /**
   * Creates a custom adoptedStyleSheet rules for the label element.
   */
  styleLabel() {
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
        }

        :host([disabled]) .label {
          cursor: not-allowed;
          opacity: var(--disabled-opacity);
        }

        :host([readonly]) .label {
          cursor: not-allowed;
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
    const controlElement = element?.shadowRoot?.querySelector(".control");

    // Put label inside the shadow root since the fluent library doesn't provide it.
    let labelElement = document.createElement("label");
    labelElement.setAttribute("class", "label");
    labelElement.setAttribute("for", "control");
    labelElement.setAttribute("part", "label");

    // Adding id to control element to bind with the label element, hence clicking on the label gives focus to the control.
    controlElement?.setAttribute("id", "control");

    // Creating slot element to hold label, since we can't use default slot.
    let slot = document.createElement("slot");
    slot.setAttribute("name", "label");
    labelElement.appendChild(slot);

    // Stop the propagation of click event to prevent opening of select pop-up.
    labelElement.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    element?.shadowRoot?.prepend(labelElement);
  }

  stylingInitialize(element) {
    this.CSSStyleSheet = new window.CSSStyleSheet();
    this.CSSStyleSheet["u-component"] = "Listbox";
    element.shadowRoot.adoptedStyleSheets = [...element.shadowRoot.adoptedStyleSheets, this.CSSStyleSheet];
  }

  stylingSetRule(index, selector, id, value) {
    if (this.CSSStyleSheet?.cssRules.length && this.CSSStyleSheet?.cssRules[index]) {
      this.CSSStyleSheet?.deleteRule(index);
    }
    if (selector && id && value) {
      // Set rule to !important, so it will overrule any other (adopted) style sheets.
      this.CSSStyleSheet?.insertRule(`${selector} { ${id}: ${value} !important ; }`, index);
    }
  }

  /*
     Custom position of popup helpers.

     Fluent defines the popup DOM as part of the shadow DOM of their web components.
     The popup is defined as position absolute to make it step out of the normal document flow.
     The intentions are good, however there is a limitation with this in HTML/CSS, being:
     An absolute positioned child element behaves like static when one of its parent
     elements has overflow set to scroll.

     This is major flaw is Fluent popup designs and hopefully thy will fix it some day.
     However, fixed does not allow positioning related to a non-absolute position parent element.
     So these calculations have to be made using JS.
     The following code calculates the position of the popup element.

     How to use:
     In the onConnect, execute: this.popupInitialize();  // This initialize the popup style sheets
     In the onConnect, create event listener for all events that start the popup:
     Execute: this.popupPreCalc(".popup");  // This will render the popup without showing it just CSSStyleSheet
     Calculate the position and sizes of the popup
     Execute: this.popupPostCalc(".popup");  // This will apply the position and size definitions and unhide the popup.

     !Note that this mechanism works with style sheets and not directly on the popup element itself.
     This allows external style sheets to still influent behavior.
     */

  popupInitialize(popupElementSelector, element) {
    // Initialize shadow root style sheet for popup element.
    this.stylingInitialize(element);
    this.stylingSetRule(0, popupElementSelector, "position", "fixed");
    this.stylingSetRule(1, popupElementSelector, "visibility", "hidden");
    this.stylingSetRule(2, popupElementSelector, "display", "unset");
    this.stylingSetRule(3, popupElementSelector, "top", "unset");
    this.stylingSetRule(4, popupElementSelector, "bottom", "unset");
    this.stylingSetRule(5, popupElementSelector, "height", "unset");
    this.stylingSetRule(6, popupElementSelector, "left", "unset");
    this.stylingSetRule(7, popupElementSelector, "right", "unset");
    this.stylingSetRule(8, popupElementSelector, "width", "unset");
  }

  popupPreCalc(popupElementSelector, element) {
    // Find the index of our stylesheet which has custom "component" property Listbox.
    element.shadowRoot.adoptedStyleSheets.forEach((styleSheet, index) => {
      if (styleSheet["u-component"] === "Listbox") {
        // When there is a change in certain prop ex:appearance  the adoptedStyleSheets is newly created.
        // At this time when we try to access the style sheet created by us, its not accessible.
        // We need to reinitialize the style sheet at that index to make it accessible.
        element.shadowRoot.adoptedStyleSheets[index] = styleSheet;
        return;
      }
    });
    // Set display but keep hidden.
    this.stylingSetRule(1, popupElementSelector, "visibility", "hidden");
    this.stylingSetRule(2, popupElementSelector, "display", "flex");
    // Reset the top and bottom position to calculate position properly.
    this.stylingSetRule(3, popupElementSelector, "top", "unset");
    this.stylingSetRule(4, popupElementSelector, "bottom", "unset");
  }

  popupPostCalc(popupElementSelector, popupElementRect) {
    // Apply popup position and size styles and unhide popup.
    this.stylingSetRule(1, popupElementSelector, "visibility", "unset");
    this.stylingSetRule(2, ".ignore", "display", "unset");
    this.stylingSetRule(3, popupElementSelector, "top", popupElementRect.top ? `${popupElementRect.top}px` : "unset");
    this.stylingSetRule(4, popupElementSelector, "bottom", popupElementRect.bottom ? `${popupElementRect.bottom}px` : "unset");
    this.stylingSetRule(5, popupElementSelector, "height", popupElementRect.height ? `${popupElementRect.height}px` : "unset");
    this.stylingSetRule(6, popupElementSelector, "left", popupElementRect.left ? `${popupElementRect.left}px` : "unset");
    this.stylingSetRule(7, popupElementSelector, "right", popupElementRect.right ? `${popupElementRect.right}px` : "unset");
    this.stylingSetRule(8, popupElementSelector, "width", popupElementRect.width ? `${popupElementRect.width}px` : "unset");
  }

  popupGetRect(anchorElement, popupElement, position) {
    const EXTRA_MARGIN = 20;
    const anchor = anchorElement.getBoundingClientRect();
    const popup = popupElement.getBoundingClientRect();
    let rect = {};
    // Calculate vertical location.
    if (position === "below" && popup.height < window.innerHeight - anchor.bottom) {
      // Requested below anchor and it fits.
      rect.top = Math.round(anchor.bottom);
      rect.bottom = null;
      rect.height = null;
    } else if (position === "above" && popup.height < anchor.top) {
      // Requested above anchor and it fits.
      rect.top = null;
      rect.bottom = Math.round(window.innerHeight - anchor.top);
      rect.height = null;
    } else if (popup.height < window.innerHeight - anchor.bottom) {
      // Fits below anchor regardless of what is requested.
      rect.top = Math.round(anchor.bottom);
      rect.bottom = null;
      rect.height = null;
    } else if (popup.height < anchor.top) {
      // Fits above anchor regardless of what is requested.
      rect.top = null;
      rect.bottom = Math.round(window.innerHeight - anchor.top);
      rect.height = null;
    } else if (popup.height < window.innerHeight - EXTRA_MARGIN) {
      // Fits the window.
      rect.top = Math.round(popup.height / 2);
      rect.bottom = null;
      rect.height = null;
    } else {
      // Shrink to fit window.
      rect.top = 0.5 * EXTRA_MARGIN;
      rect.bottom = 0.5 * EXTRA_MARGIN;
      rect.height = null;
    }
    if (anchor.width < window.innerWidth - EXTRA_MARGIN) {
      // Popup fits.
      rect.width = anchor.width;
    } else {
      rect.width = window.innerWidth - EXTRA_MARGIN;
    }
    if (anchor.left < 1) {
      rect.left = 1;
      rect.right = null;
    } else if (window.innerWidth < anchor.right) {
      rect.right = 1;
      rect.left = null;
    } else {
      rect.left = anchor.left;
      rect.right = null;
    }
    return rect;
  }

  /**
   * Private Uniface API method - onConnect.
   * This method manually handles popup positioning due to limitations in Fluent's design.
   * It ensures the label is present and styled, and calculates the position of the popup
   * on both click and Enter key interactions.
   */
  onConnect(widgetElement, objectDefinition) {
    const valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    const labelElement = widgetElement?.shadowRoot?.querySelector(".label");
    const controlElement = widgetElement.shadowRoot.querySelector(".control");
    const popup = widgetElement.shadowRoot.querySelector(".listbox");
    this.previousValue = -1;

    if (!labelElement) {
      this.createElement();
      this.styleLabel();
    }
    // Because of a major flaw in Fluent popup designs, we need to do the popup position calculation ourselves.
    this.popupInitialize(".listbox", widgetElement);

    // Compute the position of listbox and opens it.
    widgetElement.addEventListener("click", () => {
      this.popupPreCalc(".listbox", widgetElement);
      const rect = this.popupGetRect(controlElement, popup, this.getNode(this.data, "popup-position"));
      this.popupPostCalc(".listbox", rect);
    });

    widgetElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.popupPreCalc(".listbox", widgetElement);
        const rect = this.popupGetRect(controlElement, popup, this.getNode(this.data, "popup-position"));
        this.popupPostCalc(".listbox", rect);
      }
    });

    widgetElement.addEventListener("change", (event) => {
      const currentValue = widgetElement.value;
      const isReadOnly = widgetElement.classList.contains("u-readonly");
      const previousValue = this.previousValue.toString();

      // If widget is in readonly mode and the value has been updated, reset the value to the old value.
      if (isReadOnly) {
        event.preventDefault();
        event.stopImmediatePropagation();
        widgetElement.value = previousValue;
      } else if (currentValue !== previousValue) {
        // Else update 'previousValue' to the new value.
        this.previousValue = currentValue;
      }
    });

    return valueUpdaters;
  }

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {Array<string>}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "valrep",
      "error",
      "error-message",
      "display-format"
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
    const displayFormat = this.getNode(properties, "display-format") ||
                          this.getNode(this.defaultValues, "display-format");
    const value = this.getNode(properties, "value") || this.getNode(this.defaultValues, "value");
    const valrep = this.getNode(properties, "valrep") || this.getNode(this.defaultValues, "valrep");
    const valrepItem = this.getValrepItem(valrep, value);
    if (valrepItem) {
      switch (displayFormat) {
        case "valrep":
          formattedValue.primaryHtmlText = valrepItem.representation;
          formattedValue.secondaryPlainText = valrepItem.value;
          break;
        case "val":
          formattedValue.primaryPlainText = valrepItem.value;
          break;
        case "rep":
        default:
          formattedValue.primaryHtmlText = valrepItem.representation;
          break;
      }
      if (this.toBoolean(this.getNode(properties, "error"))) {
        formattedValue.errorMessage = this.getNode(properties, "error-message");
      }
    } else {
      formattedValue.primaryPlainText = "ERROR";
      formattedValue.secondaryPlainText = value;
      formattedValue.errorMessage = this.formatErrorMessage;
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
