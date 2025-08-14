// @ts-check
import { Widget } from "../framework/common/widget.js";
import { WorkerBase } from "../framework/common/worker_base.js";
import { Element } from "../framework/workers/element.js";
import { getWidgetClass, registerWidgetClass } from "../framework/common/dsp_connector.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { StyleClassToggle } from "../framework/workers/style_class_toggle.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";
import { AttributeFormattedValue } from "../framework/workers/attribute_formatted_value.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import {
  fluentDesignSystemProvider,
  fluentDataGrid,
  fluentDataGridCell,
  fluentDataGridRow,
  provideFluentDesignSystem
} from "@fluentui/web-components";

provideFluentDesignSystem().register(fluentDesignSystemProvider(), fluentDataGrid(), fluentDataGridCell(), fluentDataGridRow());

/**
 * This file describes all widget classes needed to construct the DataGrid entity widget.
 */

/**
 * DataGrid Collection class
 * @export
 * @class DataGridCollection
 * @extends {Widget}
 */
export class DataGridCollection extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * Private Worker: This worker creates a placeholder element for an object as specified by the provided bindingId.
   * The placeholder element will be directly bound to that object after which Uniface fully maintains the widgets.
   * The widget-class is provided by Uniface (usys.ini and web.ini).
   * @export
   * @class WidgetOccurrence
   * @extends {WorkerBase}
   */
  static WidgetOccurrence = class extends WorkerBase {

    /**
     * Creates an instance of WidgetOccurrence.
     * @param {typeof Widget} widgetClass - Specifies the widget class definition the worker is created for.
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
  };

  /**
   * Private Worker: This worker creates a sub-widget for every child object of type field in objectDefinition.
   * The widget definition is established during processLayout() and cannot be changed afterwards.
   * An exclude property, of which the id is specified by propId, allows exclusion of fields to this process.
   * This property can be set as part of field properties in the IDE. If it evaluates to true, the field is excluded.
   * @export
   * @class SubWidgetsFields
   * @extends {WorkerBase}
   */
  static SubWidgetsFields = class extends WorkerBase {

    /**
     * Creates an instance of SubWidgetsFields.
     * @param {typeof Widget} widgetClass - Specifies the widget class definition the setter is created for.
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
  };

  /**
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-design-system-provider", "", "", [
    new StyleClassManager(this, ["u-datagrid-container"]),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, "html:base-layer-luminance", "baseLayerLuminance", undefined, false),
    new AttributeChoice(this, "responsive-type", "u-responsive-type", ["horizontal-scroll", "wrap"], "horizontal-scroll", true),
    new StyleClassToggle(this, "html:hidden", "u-hidden", false),
    new ElementIconText(this, "span", "u-datagrid-labeltext", ".u-datagrid-labeltext", "", "label-text", ""),
    new Element(this, "fluent-data-grid", "u-datagrid", ".u-datagrid", [
      new AttributeString(this, undefined, "role", "grid", false),
      new AttributeString(this, undefined, "tabIndex", "0", false),
      new AttributeString(this, undefined, "generate-header", "default", false),
      new AttributeString(this, undefined, "grid-template-columns", "none", true),
      new Element(this, "fluent-data-grid-row", "u-datagrid-header-row", ".u-datagrid-header-row", [
        new AttributeString(this, undefined, "row-type", "header", false),
        new AttributeString(this, undefined, "role", "row", false),
        new AttributeString(this, undefined, "grid-template-columns", "none", false),
        new this.SubWidgetsFields(this, "exclude", "UX.DataGridColumnHeader")
      ]),
      new this.WidgetOccurrence(this, "span", "uocc:{{getName()}}")
    ]),
    new EventTrigger(this, "detail", "click", true)
  ]);
}

/**
 * DataGrid Column Header widget.
 * This widget has the fluent-data-grid-cell web-component as root element and
 * is mend to be used as child element of a fluent column row.
 * @export
 * @class DataGridColumnHeader
 */
export class DataGridColumnHeader extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-data-grid-cell", "", "", [
    new StyleClassManager(this, ["u-datagrid-header-cell"]),
    new AttributeString(this, undefined, "grid-column", "auto", true),
    new AttributeString(this, undefined, "cell-type", "columnheader", true),
    new AttributeString(this, "column-title", "title", undefined, true),
    new AttributeNumber(this, undefined, "tabIndex", -1, undefined, -1, true),
    new ElementIconText(this, "span", "control-bar", ".control-bar", "", "label-text", "")
  ]);
}

/**
 * DataGrid Occurrence class
 * @export
 * @class DataGridOccurrence
 * @extends {Widget}
 */
export class DataGridOccurrence extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * Private Worker: This worker creates a placeholder element for every child object of type field in objectDefinition.
   * Every placeholder element will be directly bound to that field object after which Uniface fully maintains the widgets.
   * The widget-classes are provided by Uniface (usys.ini and web.ini).
   * @export
   * @class WidgetsFields
   * @extends {WorkerBase}
   */
  static WidgetsFields = class extends WorkerBase {

    /**
     * Creates an instance of WidgetsFields.
     * @param {typeof Widget} widgetClass - Specifies the widget class definition the worker is created for.
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
  };

  /**
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-data-grid-row", "", "", [
    new StyleClassManager(this, ["u-datagrid-content-row"]),
    new AttributeString(this, undefined, "row-type", "default", true),
    new AttributeString(this, undefined, "role", "row", false),
    new AttributeString(this, undefined, "grid-template-columns", "none", false),
    new this.WidgetsFields(this, "span", "exclude", "ufld:{{getName()}}")
  ]);
}

/**
 * DataGrid Field/Cell class
 * @export
 * @class DataGridField
 * @extends {Widget}
 */
export class DataGridField extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * This widget transparently maintains properties and triggers.
   * To avoid unwanted warnings on unknown properties, these are suppressed here.
   */
  static reportUnsupportedPropertyWarnings = false;
  static reportUnsupportedTriggerWarnings = false;

  /**
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-data-grid-cell", "", "", [
    new StyleClassManager(this, ["u-datagrid-content-cell"]),
    new AttributeString(this, undefined, "grid-column", "auto", true),
    new AttributeString(this, undefined, "cell-type", "default", false),
    new AttributeFormattedValue(this, "org-widget-class")
  ]);

  /**
   * This widget specializes the setProperties() method of the widget base class with
   * logic that refreshes the widget based on changes to dynamically determined properties.
   * This method allows the super tp update the widget property state after which it gets
   * the property ids that affect the formatted value from the object widget-class.
   * If one of the properties is changed, the refresh() of worker AttributeFormattedValue is invoked.
   * @param {UData} data
   * @memberof DataGridField
   */
  setProperties(data) {
    let setterPropIds = [
      "html:title",
      "html:disabled",
      "html:readonly",
      "html:hidden",
      "value",
      "error",
      "error-message"
    ];
    super.setProperties(data);
    const objectClassNamePropId = "org-widget-class";
    const objectWidgetName = this.getNode(this.data, objectClassNamePropId);
    if (objectWidgetName) {
      let formattedValueChange = false;
      const objectWidgetClass = getWidgetClass(objectWidgetName);
      if (objectWidgetClass) {
        setterPropIds.push(...objectWidgetClass.getValueFormattedSetters());
      }
      setterPropIds.forEach((propId) => {
        if (this.getNode(data, propId) !== undefined) {
          formattedValueChange = true;
        }
      });
      if (formattedValueChange) {

        /** @type {object} */
        const widgetClass = this.constructor;
        const setter = this.getNode(widgetClass.setters, objectClassNamePropId)[0];
        setter.refresh(this);
      }
    }
  }
}

// Although used internal, this registration is still needed
registerWidgetClass("UX.DataGridColumnHeader", DataGridColumnHeader);
registerWidgetClass("UX.DataGridField", DataGridField);
