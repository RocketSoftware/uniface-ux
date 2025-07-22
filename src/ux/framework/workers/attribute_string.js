// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeBase } from "../common/attribute_base.js";

/**
 * AttributeString is a specialized worker that extends AttributeBase.
 * It is designed to handle and update string-based attribute values on HTML elements.
 * @exports
 * @class AttributeString
 * @extends AttributeBase
 */
export class AttributeString extends AttributeBase {

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
