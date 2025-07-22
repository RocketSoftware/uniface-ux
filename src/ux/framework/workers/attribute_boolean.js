// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeBase } from "../common/attribute_base.js";

/**
 * AttributeBoolean is a specialized worker that extends AttributeBase.
 * It is designed to handle and update boolean-based attribute values on HTML elements.
 * @export
 * @class AttributeBoolean
 * @extends {AttributeBase}
 */
export class AttributeBoolean extends AttributeBase {

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    if (this.attrName) {
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let value = this.toBoolean(this.getNode(widgetInstance.data, this.propId));
      if (this.setAsAttribute) {
        if (value) {
          element.setAttribute(this.attrName, value.toString());
        } else {
          element.removeAttribute(this.attrName);
        }
      } else {
        element[this.attrName] = value;
      }
    }
  }
}
