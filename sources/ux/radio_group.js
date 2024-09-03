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
  HtmlAttributeMinMaxLength,
  StyleClass,
  Trigger
} from "./workers.js";
import "https://unpkg.com/@fluentui/web-components";

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
   * Private Worker: RadioGroupValRep
   * It remembers the slot which is utilizing the same valrep slot.
   * @export
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
    }

    addTooltipToValrepElement(widgetInstance) {
      let radioGroupElement = this.getElement(widgetInstance);
      let layout = this.getNode(widgetInstance.data.properties, "uniface:layout");
      const valRepRadioElement = radioGroupElement.querySelectorAll("fluent-radio");
      valRepRadioElement.forEach((radioButton) => {
        let label = radioButton.querySelector("span");
        let labelText = label && label.textContent ? label.textContent : " ";
        if (layout === "horizontal" && labelText.length > 25) {
          // Append tooltip to the label text.
          const tooltipId = String(Math.random());
          radioButton.id = tooltipId;
          const newTooltip = document.createElement("fluent-tooltip");
          newTooltip.setAttribute("anchor", tooltipId);
          newTooltip.innerHTML = labelText;
          radioButton.appendChild(newTooltip);
        }
      });
    }

    refresh(widgetInstance) {
      let radioGroupElement = this.getElement(widgetInstance);
      let valrep = this.getNode(widgetInstance.data.properties, "valrep");
      this.removeValRepElements(widgetInstance);
      if (valrep.length > 0) {
        this.createValRepElements(widgetInstance);
        this.addTooltipToValrepElement(widgetInstance);
      } else {
        let childElement = document.createElement(this.tagName);
        radioGroupElement.appendChild(childElement);
      }
    }
  };

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-radio-group", "", "", [
    new StyleClass(this, ["u-radio-group"]),
    new HtmlAttribute(this, "html:current-value", "current-value", ""),
    new HtmlAttribute(this, "value", "value", null),
    new HtmlAttributeBoolean(this, "html:aria-disabled", "ariaDisabled", false),
    new HtmlAttributeBoolean(this, "html:aria-readonly", "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeBoolean(this, "html:required", "required", false),
    new HtmlAttributeMinMaxLength(this, "html:minlength", "html:maxlength", undefined, undefined),
    new HtmlAttributeChoice(this, "uniface:layout", "orientation", ["vertical", "horizontal"], "vertical", true)
  ], [
    new this.RadioGroupValRep(this, "fluent-radio", "u-radio", ""),
    new SlottedElement(this, "label", "u-label-text", ".u-label-text", "label", "uniface:label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Returns an array of property ids that affect the formatted value.
   * @returns {string[]}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "valrep",
      "uniface:error",
      "uniface:error-message",
      "uniface:display-format"
    ];
  }

  /**
   * Returns the value as format-object.
   * @param {UData} properties
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {
    this.staticLog("getValueFormatting");

    /** @type {UValueFormatting} */
    let formattedValue = {};
    const value_ = this.getNode(properties, "value");
    const valrepItem  = this.getValrepItem(this.getNode(properties, "valrep"), value_);
    switch (this.getNode(properties, "uniface:display-format")) {
      case "valrep":
        if (valrepItem) {
          formattedValue.text = `${valrepItem.representation} (${valrepItem.value})`;
        } else {
          formattedValue.text = "ERROR";
          formattedValue.errorMessage = this.formatErrorMessage;
        }
        break;
      case "val":
        formattedValue.text = value_ || "";
        break;
      case "rep":
      default:
        if (valrepItem) {
          formattedValue.text = valrepItem.representation;
        } else {
          formattedValue.text = "ERROR";
          formattedValue.errorMessage = this.formatErrorMessage;
        }
        break;
    }
    return formattedValue;
  }
}
UNIFACE.ClassRegistry.add("UX.RadioGroup", RadioGroup);
