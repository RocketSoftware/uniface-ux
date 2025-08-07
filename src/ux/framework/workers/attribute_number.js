// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeBase } from "../common/attribute_base.js";

/**
 * AttributeNumber is a specialized worker that updates number-based attributes
 * on an HTML element, such as `min`, `max` properties.
 * It ensures that the assigned values are valid numbers and applies them correctly
 * to the element to support numeric input constraints and behaviors.
 * @export
 * @class AttributeNumber
 * @extends {AttributeBase}
 */
export class AttributeNumber extends AttributeBase {
  constructor(widgetClass, propId, attrName, min, max, defaultValue, setAsAttribute) {
    super(widgetClass, propId, attrName, defaultValue, setAsAttribute);
    this.min = min;
    this.max = max;
  }

  /**
   * Refreshes the widget based on properties.
   * This includes validating and updating the `min` and `max` values. If the `min`/`max` values are null,
   * undefined, or form an invalid combination (e.g., `min` > `max`), a warning is issued.
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
    if (value !== undefined && value !== null) {
      value = parseInt(value);
      if (this.min !== undefined && this.min !== null && value < this.min) {
        this.warn("refresh", `Property '${this.propId}' must be a number >== ${this.min}`, "Ignored");
        return;
      } else if (this.max !== undefined && this.max !== null && value > this.max) {
        this.warn("refresh", `Property '${this.propId}' must be a number <== ${this.max}`, "Ignored");
        return;
      }
    }
    this.setHtmlAttribute(element, value);
  }
}
