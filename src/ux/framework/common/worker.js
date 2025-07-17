// @ts-check

/**
 * @typedef {import("./widget.js").Widget} Widget
 */
import { Base } from "./base.js";

/**
 * Worker base class.
 * This worker is the abstract base class for all workers used by widget class definitions.
 * All worker classes need to extend this class.
 * @export
 * @class Worker
 * @abstract
 * @extends {Base}
 */
export class Worker extends Base {

  /**
   * Creates an instance of Worker.
   * @param {typeof import("./widget.js").Widget} widgetClass
   */
  constructor(widgetClass) {
    super();
    this.isSetter = true;
    this.widgetClass = widgetClass;
    this.log("constructor", null);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} _objectDefinition
   * @returns {Array<HTMLElement> | HTMLElement}
   */
  getLayout(_objectDefinition) {
    return [];
  }

  /**
   * Sets the styleClass that identifies the element this setters work on.
   * @param {string} elementQuerySelector
   */
  setElementQuerySelector(elementQuerySelector) {
    this.elementQuerySelector = elementQuerySelector;
  }

  /**
   * Uses the provided styleClass, which should be unique within the widget, to return the element this setter work on.
   * @param {Widget} widgetInstance
   * @returns {HTMLElement}
   */
  getElement(widgetInstance) {
    let element = widgetInstance.elements.widget;
    if (this.elementQuerySelector) {
      element = element.querySelector(this.elementQuerySelector);
    }
    return element;
  }

  /**
   * Refresh widget parts this setter is responsible for based on the widget properties.
   * @param {Widget} _widgetInstance
   */
  refresh(_widgetInstance) {
    // intentionally left empty
  }

  /**
   * Provides setter-specific tracing.
   * @param {string} functionName
   * @param {object} data
   */
  log(functionName, data) {
    const classNames = {
      "all": false
    };
    if (classNames.all || classNames[this.constructor.name]) {
      let data_ = "";
      if (data) {
        data_ = JSON.stringify(data);
      }
      console.log(`SETTER[${this.widgetClass.name}.${this.constructor.name}].${functionName}(${data_})`);
    }
  }
}
