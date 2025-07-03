// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */
import { Worker } from "../worker/worker.js";

/**
 * Trigger is a worker that maps a trigger action to the corresponding widget.
 * @export
 * @class Trigger
 * @extends {Worker}
 */
export class Trigger extends Worker {

  /**
   * Creates an instance of Trigger.
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {string} triggerName
   * @param {string} eventName
   * @param {boolean} validate
   */
  constructor(widgetClass, triggerName, eventName, validate) {
    super(widgetClass);
    this.triggerName = triggerName;
    this.eventName = eventName;
    this.validate = validate;
    this.registerTrigger(widgetClass, triggerName, this);
  }

  /**
   * Returns an object that maps a widget element to its associated event name and validation properties.
   * @param {Widget} widgetInstance
   * @returns {object}
   */
  getTriggerMapping(widgetInstance) {
    this.log("getTriggerMapping", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    return {
      "element": element,
      "event_name": this.eventName,
      "validate": this.validate
    };
  }
}