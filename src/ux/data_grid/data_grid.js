// @ts-check
import { Widget } from "../framework/widget.js";
import * as Worker from "../framework/workers.js";
import { getWidgetClass, registerWidgetClass } from "../framework/dsp_connector.js";
// The import of Fluent UI web-components is done in loader.js

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
  static structure = new Worker.Element(this, "fluent-design-system-provider", "", "", [
    new Worker.StyleClass(this, ["u-datagrid-container"]),
    new Worker.HtmlAttribute(this, "html:title", "title", undefined),
    new Worker.HtmlAttribute(this, "html:base-layer-luminance", "baseLayerLuminance", undefined, false),
    new Worker.HtmlAttributeChoice(this, "responsive-type", "u-responsive-type", ["horizontal-scroll", "wrap"], "horizontal-scroll", true),
    new Worker.HtmlAttributeClass(this, "html:hidden", "u-hidden", false),
    new Worker.SlottedElement(this, "span", "u-datagrid-labeltext", ".u-datagrid-labeltext", "", "label-text", ""),
    new Worker.Element(this, "fluent-data-grid", "u-datagrid", ".u-datagrid", [
      new Worker.HtmlAttribute(this, undefined, "role", "grid", false),
      new Worker.HtmlAttribute(this, undefined, "tabIndex", "0", false),
      new Worker.HtmlAttribute(this, undefined, "generate-header", "default", false),
      new Worker.HtmlAttribute(this, undefined, "grid-template-columns", "none", true),
      new Worker.Element(this, "fluent-data-grid-row", "u-datagrid-header-row", ".u-datagrid-header-row", [
        new Worker.HtmlAttribute(this, undefined, "row-type", "header", false),
        new Worker.HtmlAttribute(this, undefined, "role", "row", false),
        new Worker.HtmlAttribute(this, undefined, "grid-template-columns", "none", false),
        new Worker.SubWidgetsByFields(this, "exclude", "UX.DataGridColumnHeader")
      ]),
      new Worker.WidgetForOccurrence(this, "span", "uocc:{{getName()}}")
    ]),
    new Worker.Trigger(this, "detail", "click", true)
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
  static structure = new Worker.Element(this, "fluent-data-grid-cell", "", "", [
    new Worker.StyleClass(this, ["u-datagrid-header-cell"]),
    new Worker.HtmlAttribute(this, undefined, "grid-column", "auto", true),
    new Worker.HtmlAttribute(this, undefined, "cell-type", "columnheader", true),
    new Worker.HtmlAttribute(this, "column-title", "title", undefined, true),
    new Worker.HtmlAttributeNumber(this, undefined, "tabIndex", -1, undefined, -1, true),
    new Worker.SlottedElement(this, "span", "control-bar", ".control-bar", "", "label-text", "")
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
  static structure = new Worker.Element(this, "fluent-data-grid-row", "", "", [
    new Worker.StyleClass(this, ["u-datagrid-content-row"]),
    new Worker.HtmlAttribute(this, undefined, "row-type", "default", true),
    new Worker.HtmlAttribute(this, undefined, "role", "row", false),
    new Worker.HtmlAttribute(this, undefined, "grid-template-columns", "none", false),
    new Worker.WidgetsByFields(this, "span","exclude", "ufld:{{getName()}}")
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
  static structure = new Worker.Element(this, "fluent-data-grid-cell", "", "", [
    new Worker.StyleClass(this, ["u-datagrid-content-cell"]),
    new Worker.HtmlAttribute(this, undefined, "grid-column", "auto", true),
    new Worker.HtmlAttribute(this, undefined, "cell-type", "default", false),
    new Worker.HtmlAttributeFormattedValue(this, "org-widget-class")
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
      const objectWidgetClass = getWidgetClass(objectWidgetName);
      let formattedValueChange = false;
      setterPropIds = [...setterPropIds, ...objectWidgetClass.getValueFormattedSetters()];
      setterPropIds?.forEach((propId) => {
        if (this.getNode(data, propId) !== undefined) {
          formattedValueChange = true;
        }
      });
      if (formattedValueChange) {

        /** @type {Object} */
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
