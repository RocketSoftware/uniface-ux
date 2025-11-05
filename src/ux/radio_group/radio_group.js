// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
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
import { fluentRadio, fluentRadioGroup, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentRadio(), fluentRadioGroup());

/**
 * Radio-Group Widget Definition
 * Wrapper class for Fluent-radio-group web component.
 * @export
 * @class RadioGroup
 * @extends {Widget}
 */
export class RadioGroup extends Widget {

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
   * Private Worker: A worker that manages the selected value by mapping the actual value
   * to the index within the `valrep` array and syncing it with the DOM element.
   * It ensures the correct item is selected and updates the widget's `value` property accordingly
   * when the user interacts with the radio group.
   * @class AttributeSelectedValue
   * @extends {AttributeString}
   */

  static AttributeSelectedValue = class extends AttributeString {

    /**
     * Creates an instance of AttributeSelectedValue.
     * @param {typeof Widget} widgetClass
     * @param {UPropName} [propId]
     * @param {string} [attrName]
     * @param {UPropValue} [defaultValue]
     */
    constructor(widgetClass, propId, attrName, defaultValue) {
      super(widgetClass, propId, attrName, defaultValue);
      // Register a setter for display format, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "display-format", this);
      this.registerSetter(widgetClass, "valrep", this);
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      const element = this.getElement(widgetInstance);
      const valrep = this.getNode(widgetInstance.data, "valrep");
      // When the user event triggers,
      // the getValue function is called first, so the value should be read directly from the element instead of the data properties.
      const value = valrep[element["value"]]?.value;
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
            const value = valrep[element["value"]]?.value;
            widgetInstance.setProperties({ "value": value });
          }
        }
      });
      return updaters;
    }

    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription(),
        "attrName": this.attrName
      });

      const element = this.getElement(widgetInstance);
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const value = this.getNode(widgetInstance.data, "value");
      const valRepRadioElement = element.querySelectorAll("fluent-radio");
      // Since the index is passed to fluent instead of the actual value, find the index corresponding to the value received.
      const valueToSet = valrep.findIndex((item) => item.value === value) ?? "";
      const isValueEmpty = (value === null || value === "");
      if (valrep.length > 0 && (valueToSet !== -1 || isValueEmpty)) {
        // Manually clear the checked state when value is empty and empty value not present in valrep.
        if (isValueEmpty && valueToSet === -1) {
          valRepRadioElement.forEach(radioButton => {
            radioButton["checked"] = false;
          });
        }
        this.setErrorProperties(widgetInstance, "format-error");
      } else {
        this.setErrorProperties(widgetInstance, "format-error", RadioGroup.formatErrorMessage);
      }
      this.setHtmlAttribute(element, valueToSet.toString());
    }
  };

  /**
   * Private Worker: A specialized worker to manage the rendering of `valrep` entries as radio button elements in a radio group.
   * It also enhances the UX by adding tooltips to each radio button label when the layout is horizontal.
   * This worker ensures the `valrep` is rendered correctly and that each option's label
   * is accessible via a tooltip when appropriate.
   * @class ElementsValrep
   * @extends {ElementsValrep}
   */
  static ElementsValrep = class extends ElementsValrep {

    /**
     * Creates an instance of ElementsValrep.
     * @param {typeof Widget} widgetClass
     * @param {string} tagName
     * @param {string} styleClass
     * @param {string} elementQuerySelector
     */
    constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.registerSetter(widgetClass, "layout", this);
      this.registerSetter(widgetClass, "valrep", this);
      this.registerSetter(widgetClass, "html:disabled", this);
    }

    addTooltipToValrepElement(widgetInstance) {
      const radioGroupElement = this.getElement(widgetInstance);
      const layout = this.getNode(widgetInstance.data, "layout");
      const valRepRadioElement = radioGroupElement.querySelectorAll("fluent-radio");
      valRepRadioElement.forEach((radioButton) => {
        let label = radioButton.querySelector("span");
        let labelText = label && label.textContent ? label.textContent : " ";
        if (layout === "horizontal") {
          radioButton.setAttribute("title", labelText);
        }
      });
    }

    refresh(widgetInstance) {
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const value = this.getNode(widgetInstance.data, "value");
      const radioGroupElement = this.getElement(widgetInstance);
      let matchedValrepObj = valrep ? valrep.find((valrepObj) => valrepObj.value === value) : undefined;

      if (valrep.length > 0) {
        if (matchedValrepObj) {
          widgetInstance.elements.widget.valrepUpdated = true;
        }
        super.refresh(widgetInstance);
        this.addTooltipToValrepElement(widgetInstance);
      } else {
        // Empty valrep case.
        const existingOption = radioGroupElement.querySelector(".empty-valrep-option");

        if (existingOption) {
          // If placeholder option already exists, just update disabled state.
          existingOption["disabled"] = true;
        } else {
          // Create placeholder option only if it doesn't exist.
          this.removeValRepElements(widgetInstance);
          const option = document.createElement(this.tagName);
          option.classList.add("empty-valrep-option");
          option["disabled"] = true;
          radioGroupElement.appendChild(option);
        }
      }
    }
  };

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-radio-group", "", "", [
    new StyleClassManager(this, ["u-radio-group"]),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeBoolean(this, undefined, "ariaDisabled", false),
    new AttributeBoolean(this, undefined, "ariaReadOnly", false),
    new AttributeBoolean(this, "html:disabled", "disabled", false),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeBoolean(this, "html:readonly", "readOnly", false),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeChoice(this, "layout", "orientation", ["vertical", "horizontal"], "vertical", true),
    new this.AttributeSelectedValue(this, "value", "value", ""),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new AttributeUIBlocking(this, "readonly"),
    new this.ElementsValrep(this, "fluent-radio", "u-radio", ""),
    new ElementIconText(this, "label", "u-label-text", ".u-label-text", "label", "label-text"),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "label"),
    new EventTrigger(this, "onchange", "change", true)
  ]);

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {Array<string>}
   */
  static getValueFormattedSetters() {
    // prettier-ignore
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
   * @return {UValueFormatting}
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

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the radio group class since we need to add the "part" attribute to the label slot.
   * Fluent provides this attribute in other web components, but is missing for the radio group.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    let shadowRoot = this.elements.widget.shadowRoot;
    let labelSlot = shadowRoot.querySelector("slot[name=\"label\"]");
    labelSlot.setAttribute("part", "label");
    // Stop propagating further change events when valrep has been updated.
    // This is to prevent fluent-radio-group from firing unwanted change events.
    this.elements.widget.addEventListener("change", (e) => {
      if (this.elements.widget.valrepUpdated) {
        e.stopImmediatePropagation();
      }
      this.elements.widget.valrepUpdated = false;
    });
    return valueUpdaters;
  }
}
