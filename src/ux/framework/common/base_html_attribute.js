// @ts-check

/**
 * @typedef {import("./widget.js").Widget} Widget
 */

import { WorkerBase } from "./worker.js";

/**
 * AttributeBase worker is an abstract Html-attribute base worker.
 * This worker is the abstract base class for all workers that maintain an attribute of an element.
 * This class provides a common foundation for attribute workers and includes utility methods,
 * to update the attribute value of the associated DOM element.
 * @export
 * @class AttributeBase
 * @abstract
 * @extends {WorkerBase}
 */
export class AttributeBase extends WorkerBase {

  /**
   * Creates an instance of AttributeBase.
   * @param {typeof import("./widget.js").Widget} widgetClass
   * @param {UPropName} [propId]
   * @param {string} [attrName]
   * @param {UPropValue} [defaultValue]
   * @param {boolean} [setAsAttribute]
   * @param {string} [valueChangedEventName]
   */
  constructor(widgetClass, propId, attrName, defaultValue, setAsAttribute, valueChangedEventName) {
    super(widgetClass);
    if (arguments.length > 1) {
      // Generate a unique private prop-id.
      this.propId = propId || Math.random().toString();
      if (attrName) {
        this.attrName = attrName;
      }
      this.defaultValue = defaultValue;
      this.setAsAttribute = setAsAttribute;
      this.valueChangedEventName = valueChangedEventName;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, defaultValue);
      if (this.propId === "value") {
        // This setter maps the Uniface value property -> register getter.
        this.registerGetter(widgetClass, this.propId, this);
      }
    }
  }

  /**
   * Updates an attribute of the specified element. Supports both standard HTML attributes
   * and custom user-defined attributes.
   * @param {HTMLElement} element
   * @param {any} attrValue
   */
  setHtmlAttribute(element, attrValue) {
    if (this.attrName) {
      const validatedAttributes = ["readonly", "type", "pattern", "min", "max", "minlength", "maxlength"];
      // First cast element to unknown, then to { value: string }, it is safe as we already check the value in element.
      if (validatedAttributes.includes(this.attrName) && (/** @type {{ value: string }} */ (/** @type {unknown} */ (element))).value !== "") {
        this.warn("refresh", `Property '${this.propId}' influences HTML5 validation rules and cannot be set if control-value is not ""`, "Ignored");
        return;
      }
      if (this.attrName === "innerText") {
        if (attrValue === undefined || attrValue === null) {
          element.innerText = "";
        } else {
          element.innerText = attrValue;
        }
      } else if (attrValue === undefined || attrValue === null) {
        if (this.setAsAttribute) {
          element.removeAttribute(this.attrName);
        } else {
          delete element[this.attrName];
          if (element.hasAttribute(this.attrName)) {
            // Some properties are also set as attributes internally by browsers.
            // These attributes are not removed when the property is deleted.
            // Check if the element has such an attribute and remove it.
            element.removeAttribute(this.attrName);
          }
        }
      } else {
        if (this.setAsAttribute) {
          element.setAttribute(this.attrName, attrValue);
        } else {
          element[this.attrName] = attrValue;
        }
      }
    }
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    super.refresh(widgetInstance);
  }

  /**
   * Returns the (field) value back to Uniface.
   * @returns {any}
   */
  getValue(widgetInstance) {
    this.log("getValue", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let value = null;
    if (this.attrName) {
      let element = this.getElement(widgetInstance);
      value = element[this.attrName];
      return value;
    }
  }

  /**
   * Returns the value of the element in a formatted state.
   * This method is useful for retrieving the element's value after applying
   * any necessary formatting or transformation logic.
   * @param {Widget} widgetInstance
   * @returns {any}
   */
  getValueAsFormattedHTML(widgetInstance) {
    this.log("getValueAsFormattedHTML", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let value = null;
    if (this.attrName) {
      let element = this.getElement(widgetInstance);
      value = element[this.attrName];
      return value;
    }
  }

  /**
   * Adds an event handler to the specified event type on the element.
   * This method is typically used to handle user interactions by registering a callback
   * that will be invoked when the defined event occurs.
   * @param {Widget} widgetInstance
   * @returns {Array<object>}
   */
  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
    let updaters = [];
    updaters.push({
      "element": this.getElement(widgetInstance),
      "event_name": this.valueChangedEventName || ""
    });
    return updaters;
  }
}
