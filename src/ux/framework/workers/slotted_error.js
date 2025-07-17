// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { Element } from "./element.js";

/**
 * SlottedError is a specialized worker responsible for updating the error element within a widget.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure,
 * - the element is being slotted into the web-component (the parent element),
 * - the element provides the data-validation error visualization of the widget.
 * @export
 * @class SlottedError
 * @extends {Element}
 */
export class SlottedError extends Element {

  /**
   * Creates an instance of SlottedError.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   * @param {string} tagName
   * @param {string} styleClass
   * @param {string} elementQuerySelector
   * @param {string} slot
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.registerSetter(widgetClass, "error", this);
    this.registerSetter(widgetClass, "error-message", this);
    this.registerSetter(widgetClass, "format-error", this);
    this.registerSetter(widgetClass, "format-error-message", this);
  }

  /**
   * Refreshes the widget based on properties.
   * It handles the display of both format errors and validation errors by updating
   * the slotted error content appropriately. This ensures clear and consistent
   * user feedback when input values are invalid or incorrectly formatted.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let error = this.toBoolean(this.getNode(widgetInstance.data, "error"));
    let errorMessage = this.getNode(widgetInstance.data, "error-message");
    let formatError = this.toBoolean(this.getNode(widgetInstance.data, "format-error"));
    let formatErrorMessage = this.getNode(widgetInstance.data, "format-error-message");
    let element = widgetInstance.elements.widget;
    let errorElement = this.getElement(widgetInstance);
    if (errorElement) {
      if (formatError) {
        element.classList.add("u-format-invalid");
        errorElement.title = formatErrorMessage;
        errorElement.hidden = false;
        errorElement.slot = this.slot;
        errorElement.classList.add("ms-Icon");
        errorElement.classList.add("ms-Icon--AlertSolid");
      } else if (error) {
        element.classList.add("u-invalid");
        errorElement.title = errorMessage;
        errorElement.hidden = false;
        errorElement.slot = this.slot;
        errorElement.classList.add("ms-Icon");
        errorElement.classList.add("ms-Icon--AlertSolid");
      } else {
        element.classList.remove("u-invalid");
        element.classList.remove("u-format-invalid");
        errorElement.title = "";
        errorElement.hidden = true;
        errorElement.slot = "";
        errorElement.classList.remove("ms-Icon");
        errorElement.classList.remove("ms-Icon--AlertSolid");
      }
    } else {
      this.error("refresh", `No element found for styleClass '${this.styleClass}'`, "Ignored");
    }
  }
}
