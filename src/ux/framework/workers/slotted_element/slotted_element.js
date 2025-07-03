// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */
import { Element } from "../element/element.js";

/**
 * SlottedElement is a worker for adding slotted content—such as icons or inner text—
 * to a widget's structure.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure,
 * - the element is being slotted into the web-component (the parent element),
 * - the element has innerText and Icon capabilities.
 * @export
 * @class SlottedElement
 * @extends {Element}
 */
export class SlottedElement extends Element {

  /**
   * Creates an instance of SlottedElement.
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {string} tagName
   * @param {string} styleClass
   * @param {string} elementQuerySelector
   * @param {string} slot
   * @param {UPropName} [textPropId]
   * @param {UPropValue} [textDefaultValue]
   * @param {UPropName} [iconPropId]
   * @param {UPropValue} [iconDefaultValue]
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, textPropId, textDefaultValue, iconPropId, iconDefaultValue) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.textPropId = textPropId;
    this.textDefaultValue = textDefaultValue;
    this.iconPropId = iconPropId;
    this.iconDefaultValue = iconDefaultValue;
    if (this.iconPropId) {
      this.registerSetter(widgetClass, this.iconPropId, this);
      this.registerDefaultValue(widgetClass, this.iconPropId, iconDefaultValue);
    }
    if (this.textPropId) {
      this.registerSetter(widgetClass, this.textPropId, this);
      this.registerDefaultValue(widgetClass, this.textPropId, textDefaultValue);
    }
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} _objectDefinition
   * @returns {HTMLElement}
   */
  getLayout(_objectDefinition) {
    this.log("getLayout", null);
    let element = document.createElement(this.tagName);
    element.hidden = this.hidden;
    if (this.styleClass) {
      element.classList.add(this.styleClass);
    }
    return element;
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let icon = this.getNode(widgetInstance.data, this.iconPropId);
    let text = this.getNode(widgetInstance.data, this.textPropId);
    this.setIconOrText(element, this.slot, icon, text);
  }

  /**
   * Updates the element with the specified icon, text, and slot assignment.
   * @param {HTMLElement} element
   * @param {string} slot
   * @param {string} icon
   * @param {string} text
   */
  setIconOrText(element, slot, icon, text) {
    this.deleteIconClasses(element);
    if (icon) {
      element.hidden = false;
      element.slot = slot;
      element.classList.add("ms-Icon");
      element.classList.add(`ms-Icon--${icon}`);
      element.innerText = "";
    } else if (text) {
      element.hidden = false;
      element.slot = slot;
      element.innerText = text;
    } else {
      element.hidden = true;
      // Force to default slot to avoid unwanted paddings and margins.
      element.slot = "";
      element.innerText = "";
    }
  }
}