// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker.js";

/**
 * PropertyFilter worker is used to register a property with a default value and a setter
 * without executing any logic during widget refresh.
 * This is useful for properties that do not affect rendering or behavior dynamically
 * and therefore do not require re-evaluation or DOM updates on refresh.
 * It helps improve performance by skipping unnecessary warnings for unused properties.
 * @export
 * @class PropertyFilter
 * @extends {WorkerBase}
 */
export class PropertyFilter extends WorkerBase {

  /**
   * Creates an instance of PropertyFilter
   * @param {typeof import("../common/widget.js").Widget} widgetClass
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
