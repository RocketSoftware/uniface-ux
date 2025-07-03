// @ts-check

/**
 * @typedef {import("../../widget.js").Widget} Widget
 */
import { Worker } from "../workers.js";

/**
 * HtmlAttributeClass is a specialized worker that extends BaseHtmlAttribute.
 * Resets the `class` attribute of the element based on the provided property value.
 * @export
 * @class HtmlAttributeClass
 * @extends {Worker}
 */
export class HtmlAttributeClass extends Worker {

  /**
   * Creates an instance of HtmlAttributeClass.
   * @param {typeof import("../../widget.js").Widget} widgetClass
   * @param {UPropName} propId
   * @param {string} styleClassName
   * @param {UPropValue} defaultValue
   */
  constructor(widgetClass, propId, styleClassName, defaultValue) {
    super(widgetClass);
    this.propId = propId;
    this.styleClassName = styleClassName;
    this.registerSetter(widgetClass, propId, this);
    this.registerDefaultValue(widgetClass, propId, this.toBoolean(defaultValue));
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    if (this.toBoolean(this.getNode(widgetInstance.data, this.propId))) {
      element.classList.add(this.styleClassName);
    } else {
      element.classList.remove(this.styleClassName);
    }
  }
}