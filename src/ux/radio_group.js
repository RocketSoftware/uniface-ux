// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  SlottedError,
  SlottedElement,
  SlottedElementsByValRep,
  HtmlAttribute,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttributeNumber,
  StyleClass,
  Trigger,
  IgnoreProperty
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

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
  static uiBlocking = "readonly";

  /**
   * Private Worker: RadioGroupSelectedValue
   * @class RadioGroupSelectedValue
   * @extends {HtmlAttribute}
   */

  static RadioGroupSelectedValue = class extends HtmlAttribute {

    /**
     * Creates an instance of RadioGroupSelectedValue.
     * @param {typeof Widget} widgetClass
     * @param {UPropName | undefined} [propId]
     * @param {String} [attrName]
     * @param {UPropValue} [defaultValue]
     */
    constructor(widgetClass, propId, attrName, defaultValue) {
      super(widgetClass, propId, attrName, defaultValue);
      // Register a setter for display format, ensuring it also updates the worker's refresh function.
      this.registerSetter(widgetClass, "uniface:display-format", this);
      this.registerSetter(widgetClass, "valrep", this);
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      const value = this.getNode(widgetInstance.data.properties, "value");
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
          const valrep = this.getNode(widgetInstance.data.properties, "valrep");
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
      const valrep = this.getNode(widgetInstance.data.properties, "valrep");
      const value = this.getNode(widgetInstance.data.properties, "value");
      const valRepRadioElement = element.querySelectorAll("fluent-radio");
      let emptyValrepObj = valrep ? valrep.find((valrepObj) => valrepObj.value === '') : undefined;
      // Since the index is passed to fluent instead of the actual value, find the index corresponding to the value received.
      const valueToSet = valrep.findIndex((item) => item.value === value) ?? "";
      const isValueEmpty = (value === null || value === "");
      if (valrep.length > 0 && (valueToSet !== -1 || isValueEmpty)) {
        // Manually clear the checked state when value is empty and empty value not present in valrep.
        if (isValueEmpty && !emptyValrepObj) {
          valRepRadioElement.forEach(radioButton => {
            // @ts-ignore
            radioButton.checked = false;
          });
        }
        widgetInstance.setProperties({
          "uniface": {
            "format-error": false,
            "format-error-message": ""
          }
        });
      } else {
        widgetInstance.setProperties({
          "uniface": {
            "format-error": true,
            "format-error-message": RadioGroup.formatErrorMessage
          }
        });
      }
      this.setHtmlAttribute(element, valueToSet.toString());
    }
  };

  /**
   * Private Worker: RadioGroupValRep
   * This is specialized worker to accommodate tooltip changes to valrep element.
   * @class RadioGroupValRep
   * @extends {SlottedElementsByValRep}
   */
  static RadioGroupValRep = class extends SlottedElementsByValRep {

    /**
     * Creates an instance of RadioGroupValRep.
     * @param {typeof Widget} widgetClass
     * @param {String} tagName
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     */
    constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.registerSetter(widgetClass, "uniface:layout", this);
      this.registerSetter(widgetClass, "valrep", this);
    }

    addTooltipToValrepElement(widgetInstance) {
      const radioGroupElement = this.getElement(widgetInstance);
      const layout = this.getNode(widgetInstance.data.properties, "uniface:layout");
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
      const valrep = this.getNode(widgetInstance.data.properties, "valrep");
      const value = this.getNode(widgetInstance.data.properties, "value");
      let matchedValrepObj = valrep ? valrep.find((valrepObj) => valrepObj.value === value) : undefined;
      if (valrep.length > 0) {
        if (matchedValrepObj) {
          widgetInstance.elements.widget.valrepUpdated = true;
        }
        super.refresh(widgetInstance);
        this.addTooltipToValrepElement(widgetInstance);
      } else {
        const radioGroupElement = this.getElement(widgetInstance);
        this.removeValRepElements(widgetInstance);
        radioGroupElement.appendChild(document.createElement(this.tagName));
      }
    }
  };

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-radio-group", "", "", [
    new StyleClass(this, ["u-radio-group"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeBoolean(this, undefined, "ariaDisabled", false),
    new HtmlAttributeBoolean(this, undefined, "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "uniface:layout", "orientation", ["vertical", "horizontal"], "vertical", true),
    new this.RadioGroupSelectedValue(this, "value", "value", ""),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength")
  ], [
    new this.RadioGroupValRep(this, "fluent-radio", "u-radio", ""),
    new SlottedElement(this, "label", "u-label-text", ".u-label-text", "label", "uniface:label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "label")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {string[]}
   */
  static getValueFormattedSetters() {
    // prettier-ignore
    return [
      "value",
      "valrep",
      "uniface:error",
      "uniface:error-message",
      "uniface:display-format"
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
    const displayFormat = this.getNode(properties, "uniface:display-format") ||
      this.getNode(this.defaultValues, "uniface:display-format");
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
      if (this.toBoolean(this.getNode(properties, "uniface:error"))) {
        formattedValue.errorMessage = this.getNode(properties, "uniface:error-message");
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
    let labelSlot = shadowRoot.querySelector('slot[name="label"]');
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

UNIFACE.ClassRegistry.add("UX.RadioGroup", RadioGroup);
