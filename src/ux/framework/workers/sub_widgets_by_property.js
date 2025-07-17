// @ts-check
import { Element } from "./element.js";
import { getWidgetClass } from "../common/dsp_connector.js";

/**
 * SubWidgetsByProperty worker generates sub-widgets based on Uniface properties.
 * This worker adds one or more sub-widgets to the widget based on object definitions.
 * This happens once during processLayout and cannot be changed afterwards.
 * The property, of which the name is specified by propId, holds a Uniface list of subWidgetIds which are be added as sub-widgets:
 *   "sub-widget1;sub-widget2;sub-widget3;sub-widget4"
 * For each sub-widget, additional properties need to be available:
 *   - "<subWidgetId>_widget-class" - defines the sub-widget's widget-class as registered with UNIFACE.classRegistry
 *   - "<subWidgetId>_delegated-properties" - defines a list of properties that need to be delegated to the sub-widget;
 *      if not defined nothing will be delegated to the sub-widget.
 * The sub-widgets receive a style-class, of syntax "u-sw-<subWidgetId>", to allow custom styling of the sub-widgets.
 * @export
 * @class SubWidgetsByProperty
 * @extends {Element}
 */
export class SubWidgetsByProperty extends Element {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {string} tagName - Specifies the wub-widget's element tag-name.
   * @param {string} styleClass - Specifies the style class for custom styling of the sub-widget.
   * @param {string} elementQuerySelector - Specifies the querySelector to find the sub-widget back.
   * @param {UPropName} propId - specifies the property used to get the ids of the to be added sub-widgets.
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, propId) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.styleClass = styleClass;
    this.propId = propId;
    this.registerSubWidgetWorker(widgetClass, this);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Array<HTMLElement>}
   */
  getLayout(objectDefinition) {
    let elements = [];
    let validSubWidgetIds = [];
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        let propName = `${subWidgetId}_widget-class`;
        let subWidgetClassName = objectDefinition.getProperty(propName);
        if (subWidgetClassName) {
          let subWidgetClass = getWidgetClass(subWidgetClassName);
          if (subWidgetClass) {
            validSubWidgetIds.push(subWidgetId);
            let element = document.createElement(this.tagName);
            element = subWidgetClass.processLayout(element, objectDefinition);
            let subWidgetStyleClass = `u-sw-${subWidgetId}`;
            element.classList.add(subWidgetStyleClass);
            if (this.styleClass) {
              element.classList.add(this.styleClass);
            }
            element.setAttribute("sub-widget-id", subWidgetId);
            elements.push(element);
          } else {
            this.warn(
              "getLayout",
              `Widget definition with name '${subWidgetClassName}' is not registered.`,
              `Creation of sub-widget '${subWidgetId}'skipped`
            );
          }
        } else {
          this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
        }
      });
    } else {
      this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped");
    }
    // Some sub-widgets might not get created -> update the property.
    objectDefinition.setProperty(this.propId, validSubWidgetIds.join(""));
    return elements;
  }

  /**
   * Collects the subWidget definitions based on the properties and returns them.
   * @param {UObjectDefinition} objectDefinition
   * @returns {object}
   */
  getSubWidgetDefinitions(objectDefinition) {
    let subWidgetDefinitions = {};
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        const classNamePropId = `${subWidgetId}_widget-class`;
        const delegatedPropertiesPropId = `${subWidgetId}_delegated-properties`;
        const className = objectDefinition.getProperty(classNamePropId);
        const subWidgetClass = getWidgetClass(className);
        if (subWidgetClass) {
          const delegatedProperties = objectDefinition.getProperty(delegatedPropertiesPropId);
          let subWidgetDefinition = {};
          subWidgetDefinition.class = subWidgetClass;
          subWidgetDefinition.styleClass = `u-sw-${subWidgetId}`;
          subWidgetDefinition.propPrefix = subWidgetId;
          subWidgetDefinition.delegatedProperties = delegatedProperties ? delegatedProperties.split("") : [];
          subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
        }
      });
    }
    return subWidgetDefinitions;
  }
}
