// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { BaseHtmlAttribute } from "../common/base_html_attribute.js";

/**
 * HtmlValueAttributeBoolean is a specialized worker that updates boolean HTML attributes
 * which are mapped to the element's `value` property.
 * It ensures that only valid boolean values are applied. If an invalid
 * or incorrectly formatted value is provided, the worker triggers a format error warning
 * to aid in debugging and maintaining data consistency.
 * @export
 * @class HtmlValueAttributeBoolean
 * @extends {BaseHtmlAttribute}
 */
export class HtmlValueAttributeBoolean extends BaseHtmlAttribute {

  /**
   * Adds an event handler to the specified event type on the element.
   * This method is typically used to handle user interactions by registering a callback
   * that will be invoked when the defined event occurs and sets format error for unexpected value.
   * @param {Widget} widgetInstance
   * @returns {Array<object>}
   */
  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let element = this.getElement(widgetInstance);
    let updaters = [];
    updaters.push({
      "element": element,
      "event_name": this.valueChangedEventName || "",
      "handler": () => {
        this.setErrorProperties(widgetInstance, "format-error");
        this.setErrorProperties(widgetInstance);
      }
    });
    return updaters;
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
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data, this.propId);
    // Validate value before assigning.
    try {
      this.setHtmlAttribute(element, this.fieldValueToBoolean(value));
      this.setErrorProperties(widgetInstance, "format-error");
    } catch (error) {
      if (typeof error === "string") {
        this.setErrorProperties(widgetInstance, "format-error", error);
      }
    }
  }
}
