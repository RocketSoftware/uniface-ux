// @ts-check
import { Worker } from "../workers.js";

/**
 * WidgetForOccurrence worker creates a placeholder element for an object as specified by the provided bindingId.
 * The placeholder element will be directly bound to that object after which Uniface fully maintains the widgets.
 * The widget-class is provided by Uniface (usys.ini and web.ini).
 * @export
 * @class WidgetForOccurrence
 * @extends {Worker}
 */
export class WidgetForOccurrence extends Worker {

  /**
   * Creates an instance of WidgetForOccurrence.
   * @param {typeof import("../../widget.js").Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {string} tagName - Specifies the sub-widget's element tag-name in the skeleton layout.
   * @param {string} bindingId - Specifies the binding id.
   */
  constructor(widgetClass, tagName, bindingId) {
    super(widgetClass);
    this.tagName = tagName;
    this.bindingId = bindingId;
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Array<HTMLElement>}
   */
  getLayout(objectDefinition) {
    let elements = [];
    let element = document.createElement(this.tagName);
    element.id = this.substituteInstructions(objectDefinition, this.bindingId);
    elements.push(element);
    return elements;
  }
}