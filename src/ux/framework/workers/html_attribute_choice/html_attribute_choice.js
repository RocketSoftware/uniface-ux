// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */
import { BaseHtmlAttribute } from "../base_html_attribute/base_html_attribute.js";

/**
 * HtmlAttributeChoice is a specialized worker that extends BaseHtmlAttribute.
 * It is designed to handle and update choice-based attribute values on HTML elements.
 * This worker ensures that only valid, predefined values are assigned to the attribute.
 * If no matching attribute value is found, a warning is generated to aid in debugging
 * and maintaining data integrity.
 * @export
 * @class HtmlAttributeChoice
 * @extends {BaseHtmlAttribute}
 */
export class HtmlAttributeChoice extends BaseHtmlAttribute {

  /**
   * Creates an instance of HtmlAttributeChoice.
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {UPropName} propId
   * @param {string} attrName
   * @param {Array<string>} choices
   * @param {UPropValue} [defaultValue]
   * @param {boolean} [setAsAttribute]
   */
  constructor(widgetClass, propId, attrName, choices, defaultValue, setAsAttribute) {
    super(widgetClass, propId, attrName, defaultValue, setAsAttribute);
    this.choices = choices;
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data, this.propId);
    if (this.choices.includes(value)) {
      this.setHtmlAttribute(element, value);
    } else {
      this.warn("refresh", `Property '${this.propId}' invalid value (${value})`, "Ignored");
    }
  }
}