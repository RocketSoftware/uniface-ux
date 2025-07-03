// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */
import { BaseHtmlAttribute } from "../base_html_attribute/base_html_attribute.js";

/**
 * HtmlAttributeBoolean is a specialized worker that extends BaseHtmlAttribute.
 * It is designed to handle and update boolean-based attribute values on HTML elements.
 * @export
 * @class HtmlAttributeBoolean
 * @extends {BaseHtmlAttribute}
 */
export class HtmlAttributeBoolean extends BaseHtmlAttribute {

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