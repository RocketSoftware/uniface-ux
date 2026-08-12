// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker_base.js";

/**
 * EventTrigger is a worker that maps a trigger action to the corresponding widget.
 * Optionally provides a callback function to supply in-parameter values for the trigger.
 * @export
 * @class EventTrigger
 * @extends {WorkerBase}
 */
export class EventTrigger extends WorkerBase {

  /**
   * Creates an instance of EventTrigger.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   * @param {string} triggerName
   * @param {string} eventName
   * @param {boolean} validate
   * @param {Function} [parameterCallback] - Optional callback function that returns an array of values to pass as IN parameters to the trigger.
   */
  constructor(widgetClass, triggerName, eventName, validate, parameterCallback) {
    super(widgetClass);
    this.triggerName = triggerName;
    this.eventName = eventName;
    this.validate = validate;
    this.parameterCallback = parameterCallback;
    this.registerTrigger(widgetClass, triggerName, this);
  }

  /**
   * Returns an object that maps a widget element to its associated event name and validation properties.
   * Optionally includes a callback function for providing in-parameter values.
   * @param {Widget} widgetInstance
   * @returns {object}
   */
  getTriggerMapping(widgetInstance) {
    this.log("getTriggerMapping", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    return {
      "element": element,
      "event_name": this.eventName,
      "validate": this.validate,
      "parameter_callback": this.parameterCallback
    };
  }
}
