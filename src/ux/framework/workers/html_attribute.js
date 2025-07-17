// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { BaseHtmlAttribute } from "../common/base_html_attribute.js";

/**
 * HtmlAttribute is a specialized worker that extends BaseHtmlAttribute.
 * It is designed to handle and update string-based attribute values on HTML elements.
 * @exports
 * @class HtmlAttribute
 * @extends BaseHtmlAttribute
 */
export class HtmlAttribute extends BaseHtmlAttribute {

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
    this.setHtmlAttribute(element, value);
  }
}
