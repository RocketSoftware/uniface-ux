// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */

import { Worker } from "../worker/worker.js";

/**
 * IgnoreProperty is used to register a property with a default value and a setter
 * without executing any logic during widget refresh.
 * This is useful for properties that do not affect rendering or behavior dynamically
 * and therefore do not require re-evaluation or DOM updates on refresh.
 * It helps improve performance by skipping unnecessary warnings for unused properties.
 * @export
 * @class IgnoreProperty
 * @extends {Worker}
 */
export class IgnoreProperty extends Worker {

  /**
   * Creates an instance of IgnoreProperty
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {UPropName} propId
   * @param {UPropValue} defaultValue
   */
  constructor(widgetClass, propId, defaultValue = null) {
    super(widgetClass);
    this.propId = propId;
    this.defaultValue = defaultValue;
    this.registerSetter(widgetClass, propId, this);
    this.registerDefaultValue(widgetClass, propId, defaultValue);
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "propId": this.propId,
      "value": this.getNode(widgetInstance.data, this.propId)
    });
  }
}
