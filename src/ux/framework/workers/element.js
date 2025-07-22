// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker.js";

/**
 * Element worker is responsible for adding and maintaining a DOM element as a child within the widget structure.
 * This worker ensures that the element is correctly inserted and managed according to
 * the widget's hierarchical structure and configuration.
 * @export
 * @class Element
 * @extends {WorkerBase}
 */
export class Element extends WorkerBase {

  /**
   * Creates an instance of Element.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   * @param {string} tagName
   * @param {string} styleClass
   * @param {string} elementQuerySelector
   * @param {Array<WorkerBase>} [childWorkers]
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, childWorkers) {
    super(widgetClass);
    this.tagName = tagName;
    this.styleClass = styleClass;
    this.elementQuerySelector = elementQuerySelector;
    this.hidden = false;
    this.childWorkers = childWorkers;
    // Make sure the setters can find the element by providing the element query selector if one is not already present.
    if (this.childWorkers) {
      this.childWorkers.forEach((childWorker) => {
        if (!childWorker.elementQuerySelector) {
          childWorker.setElementQuerySelector(this.elementQuerySelector);
        }
      });
    }
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Array<HTMLElement> | HTMLElement}
   */
  getLayout(objectDefinition) {
    this.log("getLayout", null);

    // Create element
    let element = document.createElement(this.tagName);
    element.hidden = this.hidden;
    if (this.styleClass) {
      element.classList.add(this.styleClass);
    }

    // Allow any child element-workers to add child elements.
    this.childWorkers?.forEach((define) => {
      // If the workers are attribute or trigger related, they will return an empty array.
      let childLayout = define.getLayout(objectDefinition);
      if (childLayout instanceof Array) {
        childLayout.forEach((childElement) => {
          element.appendChild(childElement);
        });
      } else if (childLayout) {
        element.appendChild(childLayout);
      }
    });
    return element;
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "styleClass": this.styleClass
    });
    super.refresh(widgetInstance);
  }
}
