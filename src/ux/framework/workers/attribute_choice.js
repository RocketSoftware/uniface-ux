// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeBase } from "../common/attribute_base.js";

/**
 * AttributeChoice is a specialized worker that extends AttributeBase.
 * It is designed to handle and update choice-based attribute values on HTML elements.
 * This worker ensures that only valid, predefined values are assigned to the attribute.
 * If no matching attribute value is found, a warning is generated to aid in debugging
 * and maintaining data integrity.
 * @export
 * @class AttributeChoice
 * @extends {AttributeBase}
 */
export class AttributeChoice extends AttributeBase {

  /**
   * Creates an instance of AttributeChoice.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
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
