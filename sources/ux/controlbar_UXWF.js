//@ts-check

import { Widget_UXWF } from "./widget_UXWF.js";
import { Worker, Element, StyleClass, Trigger, WidgetsByProperty } from "./workers_UXWF.js";
import { HtmlAttribute, HtmlAttributeNumber, HtmlAttributeChoice, HtmlAttributeBoolean } from "./workers_UXWF.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * Setter that maintains 
 *
 * @export
 * @class Controlbar_UXWF
 * @extends {Widget_UXWF}
 */
export class Controlbar_UXWF extends Widget_UXWF {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.  
   *
   * @static
   * @memberof Controlbar_UXWF
   */
  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "disabled";  // or "readonly" 

  /**
    WIDGET DEFINITION
  **/
  static structure = new Element(this, "div", "", "", [
    new StyleClass(this, ["u-controlbar"]),
  ], [
    new Element(this, "div", "u-start-section", ".u-start-section", [], [
      new WidgetsByProperty(this, "span", "", "", "uniface:controls-start")
    ]),
    new Element(this, "div", "u-center-section", ".u-center-section", [], [
      new WidgetsByProperty(this, "span", "", "", "uniface:controls-center")
    ]),
    new Element(this, "div", "u-end-section", ".u-end-section", [], [
      new WidgetsByProperty(this, "span", "", "", "uniface:controls-end")
    ])
  ]);

}
UNIFACE.ClassRegistry.add("UX.Controlbar_UXWF", Controlbar_UXWF);
