// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker.js";
import { getWidgetClass } from "../common/dsp_connector.js";

/**
 * SubWidgetsFields worker creates a sub-widget for every child object of type field in objectDefinition.
 * The widget definition is established during processLayout() and cannot be changed afterwards.
 * An exclude property, of which the id is specified by propId, allows exclusion of fields to this process.
 * This property can be set as part of field properties in the IDE. If it evaluates to true, the field is excluded.
 * @export
 * @class SubWidgetsFields
 * @extends {WorkerBase}
 */
export class SubWidgetsFields extends WorkerBase {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {UPropName} propId - Specifies the id of a Boolean property that, if true, excludes the field from the process.
   * @param {string} subWidgetClassName - Specifies the name of the sub-widget to be included for every field.
   */
  constructor(widgetClass, propId, subWidgetClassName) {
    super(widgetClass);
    this.propId = propId;
    this.subWidgetClassName = subWidgetClassName;
    this.registerSubWidgetWorker(widgetClass, this);
    this.registerSetter(widgetClass, "value", this);
    this.registerDefaultValue(widgetClass, "value", null);
    this.registerGetter(widgetClass, "value", this);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Array<HTMLElement>}
   */
  getLayout(objectDefinition) {
    let excludePropId = this.propId;
    let elements = [];
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      let subWidgetClass = getWidgetClass(this.subWidgetClassName);
      if (subWidgetClass) {
        childObjectDefinitions.forEach((childObjectDefinition) => {
          const childType = childObjectDefinition.getType();
          let exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
          if (!exclude) {
            const childName = childObjectDefinition.getName().toLowerCase();
            const subWidgetId = `${childType}-${childName}`;
            const subWidgetStyleClass = `u-sw-${childType}-${childName.replace(/\./g, "-")}`;
            let element = document.createElement("span");
            element = subWidgetClass.processLayout(element, childObjectDefinition);
            element.classList.add(subWidgetStyleClass);
            elements.push(element);

            /**
             * Iterate through the properties in childObjectDefinitions and check whether
             * it exists as sub-widget property in the sub-widget.
             * If so, move the property from childObjectDefinition to objectDefinition and set child version to undefined.
             */
            childObjectDefinition.getPropertyNames()?.forEach((propId) => {
              // Look it up in the sub-widget's definition.
              if (this.getNode(subWidgetClass.setters, propId)) {
                const childPropValue = childObjectDefinition.getProperty(propId);
                childObjectDefinition.setProperty(propId, undefined);
                objectDefinition.setProperty(`${subWidgetId}:${propId}`, childPropValue);
              }
            });
            childObjectDefinition.setProperty("org-widget-class", childObjectDefinition.getWidgetClass());
            childObjectDefinition.setWidgetClass("UX.DataGridField");
          }
        });
      } else {
        this.warn(
          "getLayout",
          `Widget definition with name '${this.subWidgetClassName}' is not registered.`,
          "Creation of sub-widget(s) skipped"
        );
      }
    }
    return elements;
  }

  /**
   * Returns the subWidget definitions.
   * @param {UObjectDefinition} objectDefinition
   * @returns {object}
   */
  getSubWidgetDefinitions(objectDefinition) {
    let excludePropId = this.propId;
    let subWidgetDefinitions = {};
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      let subWidgetClass = getWidgetClass(this.subWidgetClassName);
      if (subWidgetClass) {
        childObjectDefinitions.forEach((childObjectDefinition) => {
          const childType = childObjectDefinition.getType();
          const exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
          if (!exclude) {
            const childName = childObjectDefinition.getName().toLowerCase();
            const subWidgetId = `${childType}-${childName}`;
            const subWidgetStyleClass = `u-sw-${childType}-${childName.replace(/\./g, "-")}`;
            let subWidgetDefinition = {};
            subWidgetDefinition.class = subWidgetClass;
            subWidgetDefinition.styleClass = subWidgetStyleClass;
            subWidgetDefinition.triggers = [];
            subWidgetDefinition.propPrefix = subWidgetId;
            subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
          }
        });
      }
    }
    return subWidgetDefinitions;
  }

  /**
   * Returns the (field) value back to Uniface.
   * @returns {any}
   */
  getValue(widgetInstance) {
    let value = {};
    Object.keys(widgetInstance.subWidgets).forEach((subWidgetId) => {
      value[subWidgetId] = widgetInstance.subWidgets[subWidgetId].getValue();
    });
    return JSON.stringify(value);
  }

  /**
   * This method is typically used to handle user interactions by registering a callback
   * that will be invoked when the defined event occurs.
   * @param {Widget} widgetInstance
   * @returns
   */
  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
    return;
  }
}
