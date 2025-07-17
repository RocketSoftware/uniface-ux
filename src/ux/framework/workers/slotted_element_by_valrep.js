// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { Element } from "./element.js";

/**
 * SlottedElementsByValRep is a worker that adds elements based on a defined valrep (value representation),
 * formatting them appropriately before insertion.
 * This is typically used to render dynamic content (e.g., options, labels) by mapping values
 * through a valrep and inserting the resulting elements into the component's slot structure.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure.
 * - the element is being slotted into the web-component (the parent element).
 * @export
 * @class SlottedElementsByValRep
 * @extends {Element}
 */
export class SlottedElementsByValRep extends Element {

  /**
   * Creates an instance of SlottedElementsByValRep.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   * @param {string} tagName
   * @param {string} styleClass
   * @param {string} elementQuerySelector
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;

    this.registerSetter(widgetClass, "valrep", this);
    this.registerDefaultValue(widgetClass, "valrep", []);

    this.registerSetter(widgetClass, "display-format", this);
    this.registerDefaultValue(widgetClass, "display-format", "rep");
  }

  /**
   * Removes all valrep elements from the widget.
   * @param {Widget} widgetInstance
   */
  removeValRepElements(widgetInstance) {
    let element = this.getElement(widgetInstance);
    let valrepElements = element.querySelectorAll(this.tagName);
    valrepElements.forEach((element) => {
      element.remove();
    });
  }

  /**
   * Creates all valrep elements from this worker.
   * Since fluent uses empty string to clear the selection, presence of an empty string as an actual valid option causes confusion.
   * So, when setting the value attribute of fluent-option elements, we use the corresponding index as the value.
   * And this will be mapped back to its original value before storing and sending to Uniface.
   * @param {Widget} widgetInstance
   */
  createValRepElements(widgetInstance) {
    let element = this.getElement(widgetInstance);
    let valrep = this.getNode(widgetInstance.data, "valrep");
    let displayFormat = this.getNode(widgetInstance.data, "display-format");
    if (valrep.length > 0) {
      valrep.forEach((valRepObj, index) => {
        const childElement = document.createElement(this.tagName);
        element.appendChild(childElement);
        childElement.setAttribute("value", index);
        childElement.setAttribute("class", this.styleClass);
        childElement.appendChild(this.getFormattedValrepItemAsHTML(displayFormat, valRepObj.value, valRepObj.representation));
      });
    }
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.removeValRepElements(widgetInstance);
    this.createValRepElements(widgetInstance);
  }
}
