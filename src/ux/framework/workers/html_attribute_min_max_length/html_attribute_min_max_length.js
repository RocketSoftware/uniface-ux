// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */

import { Worker } from "../worker/worker.js";

/**
 * HtmlAttributeMinMaxLength is a specialized worker that sets and manages
 * the `minlength` and `maxlength` attributes of an HTML element.
 * It applies the constraints to the element and validates that any current value
 * falls within the defined range.
 * @export
 * @class HtmlAttributeMinMaxLength
 * @extends {Worker}
 */
export class HtmlAttributeMinMaxLength extends Worker {

  /**
   * Creates an instance of HtmlAttributeMinMaxLength.
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {string} propMin
   * @param {string} propMax
   * @param {number} [defaultMin]
   * @param {number} [defaultMax]
   */
  constructor(widgetClass, propMin, propMax, defaultMin, defaultMax) {
    super(widgetClass);
    this.propMin = propMin;
    this.propMax = propMax;
    this.defaultMin = defaultMin;
    this.defaultMax = defaultMax;
    this.registerSetter(widgetClass, propMin, this);
    this.registerSetter(widgetClass, propMax, this);
  }

  /**
   * Refreshes the widget based on properties.
   * It ensures that the values are valid (non-negative integers) and that
   * `minlength` is not greater than `maxlength`. If the control already contains
   * a non-empty value during the update, or if invalid values (e.g., negative numbers or incorrect combinations)
   * are provided, the worker issues a warning.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrNames": ["minlength", "maxlength"]
    });
    let element = this.getElement(widgetInstance);
    // @ts-ignore
    if (element.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    /** @type {number | null | undefined} */
    let minlength = parseInt(this.getNode(widgetInstance.data, this.propMin));
    if (Number.isNaN(minlength)) {
      minlength = null;
    } else if (minlength < 0) {
      this.warn("refresh()", `Property '${this.propMin}' is not a positive number`, "Ignored");
      return;
    }

    /** @type {number | null | undefined} */
    let maxlength = parseInt(this.getNode(widgetInstance.data, this.propMax));
    if (Number.isNaN(maxlength)) {
      maxlength = null;
    } else if (maxlength === 0) {
      // In Uniface means no maximum length.
      maxlength = null;
    } else if (maxlength < 0) {
      this.warn("refresh()", `Property '${this.propMax}' is not a positive number`, "Ignored");
      return;
    }
    // BUG: Once maxlength has been set, fluent forces it to 0 when being unset (attribute).
    // This causes checks to fail or exceptions to be thrown.
    if (maxlength !== null) {
      // maxlength has been set at least once.
      widgetInstance.widget.maxlengthHasBeenSet = true;
    } else if (widgetInstance.widget.maxlengthHasBeenSet) {
      // Instead of removing the maxlength attribute, force it to a very high number => 10000.
      maxlength = this.defaultMax;
    }
    if (minlength === null && maxlength === null) {
      element.removeAttribute("minlength");
      element.removeAttribute("maxlength");
    } else if (minlength === null && maxlength !== null) {
      element.removeAttribute("minlength");
      element["maxlength"] = maxlength;
    } else if (minlength !== null && maxlength === null) {
      element.removeAttribute("maxlength");
      element["minlength"] = minlength;
    } else if (minlength && maxlength && minlength > maxlength) {
      this.warn("setMinMaxLength()", `Invalid combination of 'html:minlength' (${this.propMin}) and 'html:maxlength' (${this.propMax})`, "Ignored");
    } else {
      element["maxlength"] = 10000;
      element["minlength"] = 0;
      element["minlength"] = minlength;
      element["maxlength"] = maxlength;
    }
  }
}
