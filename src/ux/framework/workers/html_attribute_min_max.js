// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker.js";

/**
 * AttributeRange sets and manages `min` and `max` properties for an element.
 * This worker ensures that the assigned minimum and maximum values are valid.
 * It applies the constraints to the element and validates that any current value
 * falls within the defined range.
 * @export
 * @class AttributeRange
 * @extends {WorkerBase}
 */
export class AttributeRange extends WorkerBase {

  /**
   * Creates an instance of AttributeRange.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
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
    this.registerDefaultValue(widgetClass, propMin, defaultMin);
    this.registerDefaultValue(widgetClass, propMax, defaultMax);
  }

  /**
   * Refreshes the widget based on properties.
   * This includes validating and updating the `min` and `max` values. If the control
   * contains a non-empty value during the update, or if the `min`/`max` values are null,
   * undefined, or form an invalid combination (e.g., `min` > `max`), a warning is issued.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrNames": ["min", "max"]
    });

    let element = this.getElement(widgetInstance);

    // @ts-ignore
    if (element?.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    let min = this.getNode(widgetInstance.data, this.propMin);
    let max = this.getNode(widgetInstance.data, this.propMax);

    let isMinUndefined = min === undefined;
    let isMaxUndefined = max === undefined;

    min = parseInt(min);
    if (Number.isNaN(min)) {
      min = null;
    }

    max = parseInt(max);
    if (Number.isNaN(max)) {
      max = null;
    }

    if (!isMinUndefined && !isMaxUndefined && min === null && max === null) {
      this.warn(
        "refresh()",
        `Fluent does not allow setting'${this.propMin}' (${min}) and '${this.propMax}' (${max}) to undefined/null, a number must be provided`,
        "Ignored"
      );
    } else if (min === null && max !== null) {
      element.setAttribute("max", max);
      // If min is null defined by user.
      if (!isMinUndefined) {
        this.warn("refresh()", `Fluent does not allow setting'${this.propMin}' (${min}) to undefined/null, a number must be provided`, "Ignored");
      }
    } else if (min !== null && max === null) {
      element.setAttribute("min", min);
      // If max is null defined by user.
      if (!isMaxUndefined) {
        this.warn("refresh()", `Fluent does not allow setting'${this.propMax}' (${max}) to undefined/null, a number must be provided`, "Ignored");
      }
    } else if (min > max) {
      this.warn("refresh()", `Invalid combination of '${this.propMin}' (${min}) and '${this.propMax}' (${max})`, "Ignored");
    } else if (min !== null && max !== null) {
      element.setAttribute("min", min);
      element.setAttribute("max", max);
    }
  }
}
