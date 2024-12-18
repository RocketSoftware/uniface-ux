// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import { Element, StyleClass, SubWidgetsByProperty, HtmlAttributeChoice } from "./workers.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * Controlbar Widget
 * @export
 * @class Controlbar
 * @extends {Widget}
 */
export class Controlbar extends Widget {

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
    [
      new HtmlAttributeChoice(this, "orientation", "u-orientation", ["horizontal", "vertical"], "horizontal", true),
      new StyleClass(this, ["u-controlbar"])
    ],
    [
      new Element(this, "div", "u-start-section", ".u-start-section", [], [new SubWidgetsByProperty(this, "span", "", "", "controls-start")]),
      new Element(this, "div", "u-center-section", ".u-center-section", [], [new SubWidgetsByProperty(this, "span", "", "", "controls-center")]),
      new Element(this, "div", "u-end-section", ".u-end-section", [], [new SubWidgetsByProperty(this, "span", "", "", "controls-end")])
    ]
  );
}
UNIFACE.ClassRegistry.add("UX.Controlbar", Controlbar);
