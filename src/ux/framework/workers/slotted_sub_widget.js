// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { Element } from "./element.js";
import { getWidgetClass } from "../common/dsp_connector.js";

/**
 * SubWidget adds and maintains a sub-widget to the widget, where:
 * - the element is added as a child according the structure.
 * - the element is a UX widget.
 * - the element is being slotted into the web-component (the parent element).
 * @export
 * @class SubWidget
 * @extends {Element}
 */
export class SubWidget extends Element {

  /**
   * Creates an instance of SlottedWidget.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   * @param {string} tagName
   * @param {string} subWidgetStyleClass
   * @param {string} elementQuerySelector
   * @param {string} slot
   * @param {string} subWidgetId
   * @param {string} subWidgetClassName
   * @param {object} subWidgetDefaultValues
   * @param {boolean} visible
   * @param {Array<string>} subWidgetTriggers
   * @param {Array<string>} subWidgetDelegatedProperties
   */
  constructor(
    widgetClass,
    tagName,
    subWidgetStyleClass,
    elementQuerySelector,
    slot,
    subWidgetId,
    subWidgetClassName,
    subWidgetDefaultValues,
    visible,
    subWidgetTriggers,
    subWidgetDelegatedProperties = []
  ) {
    // Redefine subWidgetStyleClass with hard-coded values based on sub-widget id
    subWidgetStyleClass = `u-sw-${subWidgetId}`;
    elementQuerySelector = `.${subWidgetStyleClass}`;
    super(widgetClass, tagName, subWidgetStyleClass, elementQuerySelector);
    this.subWidgetId = subWidgetId;
    this.subWidgetClass = getWidgetClass(subWidgetClassName);
    this.subWidgetDelegatedProperties = subWidgetDelegatedProperties;
    if (this.subWidgetClass) {
      if (subWidgetDefaultValues) {
        Object.keys(subWidgetDefaultValues).forEach((propId) => {
          this.registerDefaultValue(widgetClass, `${subWidgetId}:${propId}`, subWidgetDefaultValues[propId]);
        });
      }
      this.slot = slot;
      // Register sub-widget and the property workers that toggle the sub-widget visible attribute.
      this.propId = subWidgetId;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, visible);
      this.registerSubWidget(widgetClass, subWidgetId, this.subWidgetClass, this.styleClass, subWidgetTriggers, subWidgetDelegatedProperties);
    } else {
      this.error("constructor", `Widget class with name '${subWidgetClassName}' is not registered.`, "Not available");
    }
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @returns {HTMLElement}
   */
  getLayout(objectDefinition) {
    let element = document.createElement(this.tagName);
    if (this.subWidgetClass) {
      element = this.subWidgetClass.processLayout(element, objectDefinition);
    }
    element.hidden = true;
    element.classList.add(this.styleClass);
    return element;
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let widgetElement = widgetInstance.elements.widget;
    let subWidgetElement = this.getElement(widgetInstance);
    if (this.toBoolean(this.getNode(widgetInstance.data, this.propId))) {
      subWidgetElement.hidden = false;
      subWidgetElement.slot = this.slot || "";
      widgetElement.classList.add(`${this.styleClass}-shown`);
    } else {
      subWidgetElement.hidden = true;
      subWidgetElement.slot = "";
      widgetElement.classList.remove(`${this.styleClass}-shown`);
    }
  }
}
