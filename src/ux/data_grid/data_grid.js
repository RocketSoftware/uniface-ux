// @ts-check
import { Widget } from "../framework/widget.js";
import { Element } from "../framework/workers/element/element.js";
import { getWidgetClass, registerWidgetClass } from "../framework/dsp_connector.js";
import { HtmlAttribute } from "../framework/workers/html_attribute/html_attribute.js";
import { HtmlAttributeChoice } from "../framework/workers/html_attribute_choice/html_attribute_choice.js";
import { HtmlAttributeClass } from "../framework/workers/html_attribute_class/html_attribute_class.js";
import { SlottedElement } from "../framework/workers/slotted_element/slotted_element.js";
import { StyleClass } from "../framework/workers/style_class/style_class.js";
import { SubWidgetsByFields } from "../framework/workers/sub_widgets_by_fields/sub_widgets_by_fields.js";
import { Trigger } from "../framework/workers/trigger/trigger.js";
import { WidgetForOccurrence } from "../framework/workers/widget_for_occurrence/widget_for_occurrence.js";
import { HtmlAttributeFormattedValue } from "../framework/workers/html_attribute_formatted_value/html_attribute_formatted_value.js";
import { HtmlAttributeNumber } from "../framework/workers/html_attribute_number/html_attribute_number.js";
import { WidgetsByFields } from "../framework/workers/widgets_by_fields/widgets_by_fields.js";

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
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-design-system-provider", "", "", [
    new StyleClass(this, ["u-datagrid-container"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, "html:base-layer-luminance", "baseLayerLuminance", undefined, false),
    new HtmlAttributeChoice(this, "responsive-type", "u-responsive-type", ["horizontal-scroll", "wrap"], "horizontal-scroll", true),
    new HtmlAttributeClass(this, "html:hidden", "u-hidden", false),
    new SlottedElement(this, "span", "u-datagrid-labeltext", ".u-datagrid-labeltext", "", "label-text", ""),
    new Element(this, "fluent-data-grid", "u-datagrid", ".u-datagrid", [
      new HtmlAttribute(this, undefined, "role", "grid", false),
      new HtmlAttribute(this, undefined, "tabIndex", "0", false),
      new HtmlAttribute(this, undefined, "generate-header", "default", false),
      new HtmlAttribute(this, undefined, "grid-template-columns", "none", true),
      new Element(this, "fluent-data-grid-row", "u-datagrid-header-row", ".u-datagrid-header-row", [
        new HtmlAttribute(this, undefined, "row-type", "header", false),
        new HtmlAttribute(this, undefined, "role", "row", false),
        new HtmlAttribute(this, undefined, "grid-template-columns", "none", false),
        new SubWidgetsByFields(this, "exclude", "UX.DataGridColumnHeader")
      ]),
      new WidgetForOccurrence(this, "span", "uocc:{{getName()}}")
    ]),
    new Trigger(this, "detail", "click", true)
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
    new StyleClass(this, ["u-datagrid-header-cell"]),
    new HtmlAttribute(this, undefined, "grid-column", "auto", true),
    new HtmlAttribute(this, undefined, "cell-type", "columnheader", true),
    new HtmlAttribute(this, "column-title", "title", undefined, true),
    new HtmlAttributeNumber(this, undefined, "tabIndex", -1, undefined, -1, true),
    new SlottedElement(this, "span", "control-bar", ".control-bar", "", "label-text", "")
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
   * Widget structure
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-data-grid-row", "", "", [
    new StyleClass(this, ["u-datagrid-content-row"]),
    new HtmlAttribute(this, undefined, "row-type", "default", true),
    new HtmlAttribute(this, undefined, "role", "row", false),
    new HtmlAttribute(this, undefined, "grid-template-columns", "none", false),
    new WidgetsByFields(this, "span", "exclude", "ufld:{{getName()}}")
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
    new StyleClass(this, ["u-datagrid-content-cell"]),
    new HtmlAttribute(this, undefined, "grid-column", "auto", true),
    new HtmlAttribute(this, undefined, "cell-type", "default", false),
    new HtmlAttributeFormattedValue(this, "org-widget-class")
  ]);

  /**
   * This widget specializes the setProperties() method of the widget base class with
   * logic that refreshes the widget based on changes to dynamically determined properties.
   * This method allows the super tp update the widget property state after which it gets
   * the property ids that affect the formatted value from the object widget-class.
   * If one of the properties is changed, the refresh() of worker HtmlAttributeFormattedValue is invoked.
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
