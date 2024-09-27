// @ts-check

import { Widget } from "./widget.js";
import { HtmlAttribute, HtmlAttributeNumber, HtmlAttributeChoice, HtmlAttributeBoolean, HtmlAttributeMinMaxLength, StyleClass, SlottedWidgetsByProperty } from "./workers.js";
import { Element, SlottedElement, SlottedError, SlottedWidget } from "./workers.js";
import { Trigger } from "./workers.js";
import 'https://unpkg.com/@fluentui/web-components';


/**
 * TEXT-FIELD WIDGET DEFINITION
 * Wrapper class for Fluent-text-field web component.
 *
 * @class Toolbar
 * @extends {Widget}
 */
export class Toolbar extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.  
   *
   * @static
   * @memberof Toolbar
   */
  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "disabled";

  /**
   * Widget structure describes the DOM structure used by the widget and maps
   * attributes, events, etc to Uniface properties and triggers.
   *
   * @static
   * @memberof Toolbar
   */
  static structure = new Element(this, "fluent-toolbar", "", "", [
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new StyleClass(this, ["u-toolbar"])
  ], [
    // constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, propId, subWidgetDefaultValues);
    new SlottedWidgetsByProperty(this, "span", "u-toolbar-area-start", ".u-toolbar-area-start", "start", "uniface:controls-start", []),
    new SlottedWidgetsByProperty(this, "span", "u-toolbar-area-center", ".u-toolbar-area-center", "", "uniface:controls-center", []),
    new SlottedWidgetsByProperty(this, "span", "u-toolbar-area-end", ".u-toolbar-area-end", "end", "uniface:controls-end", [])
  ]);

}
UNIFACE.ClassRegistry.add("UX.Toolbar", Toolbar);

