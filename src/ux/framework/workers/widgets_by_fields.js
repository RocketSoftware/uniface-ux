// @ts-check
import { Worker } from "../common/worker.js";

/**
 * WidgetsByFields worker creates a placeholder element for every child object of type field in objectDefinition.
 * Every placeholder element will be directly bound to that field object after which Uniface fully maintains the widgets.
 * The widget-classes are provided by Uniface (usys.ini and web.ini).
 * @export
 * @class WidgetsByFields
 * @extends {Worker}
 */
export class WidgetsByFields extends Worker {

  /**
   * Creates an instance of WidgetsByFields.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {string} tagName - Specifies the widget's element tag-name in the skeleton layout.
   * @param {UPropName} propId - Specifies the exclude property id.
   * @param {string} bindingId - Specifies the binding id.
   */
  constructor(widgetClass, tagName, propId, bindingId) {
    super(widgetClass);
    this.tagName = tagName;
    this.propId = propId;
    this.bindingId = bindingId;
  }

  /**
   * Generate and return layout for this worker.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Array<HTMLElement>}
   */
  getLayout(objectDefinition) {
    let excludePropId = this.propId;
    let elements = [];
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      childObjectDefinitions.forEach((childObjectDefinition) => {
        const childType = childObjectDefinition.getType();
        let exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
        if (!exclude) {
          let element = document.createElement(this.tagName);
          element.id = this.substituteInstructions(childObjectDefinition, this.bindingId);
          elements.push(element);
        }
      });
    }
    return elements;
  }
}
