// @ts-check
/* global UNIFACE */
import { Widget_UXWF } from "./widget_UXWF.js";
import { Element, StyleClass, WidgetsByProperty, HtmlAttributeChoice } from "./workers_UXWF.js";

/**
 * Controlbar Widget
 * @export
 * @class Controlbar_UXWF
 * @extends {Widget_UXWF}
 */
export class Controlbar_UXWF extends Widget_UXWF {

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
  // This widget does not have uiBlocking of its own but the subWidget may have.
  static uiBlocking = "";

  /**
   * Widget definition.
   */
  static structure = new Element(
    this,
    "div",
    "",
    "",
    [new HtmlAttributeChoice(this, "uniface:orientation", "u-orientation", ["horizontal", "vertical"], "horizontal", true), new StyleClass(this, ["u-controlbar"])],
    [
      new Element(this, "div", "u-start-section", ".u-start-section", [], [new WidgetsByProperty(this, "span", "", "", "controls-start")]),
      new Element(this, "div", "u-center-section", ".u-center-section", [], [new WidgetsByProperty(this, "span", "", "", "controls-center")]),
      new Element(this, "div", "u-end-section", ".u-end-section", [], [new WidgetsByProperty(this, "span", "", "", "controls-end")]),
    ]
  );
}
UNIFACE.ClassRegistry.add("UX.Controlbar_UXWF", Controlbar_UXWF);
