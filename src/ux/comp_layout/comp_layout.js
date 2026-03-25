import { Widget } from "../framework/common/widget";
import { StyleClassManager } from "../framework/workers/style_class_manager";
import { AttributeChoice } from "../framework/workers/attribute_choice";
import { Element } from "../framework/workers/element.js";
import { ChildWidgets } from "../framework/workers/child_widgets.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean";
import { ElementIconText } from "../framework/workers/element_icon_text";

/**
 * Component Layout Widget
 * @export
 * @class CompLayout
 * @extends {Widget}
 */
export class CompLayout extends Widget {

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

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "uf-layout", "", "", [
    new StyleClassManager(this, ["u-comp-layout"]),
    new AttributeBoolean(this, undefined, "show-label", true, true),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "label", "label-text", "", "", "", true),
    new AttributeChoice(this, "label-size", "label-size", ["small", "medium", "large", "normal"], "normal", true),
    new AttributeChoice(this, "label-align", "label-align", ["start", "center", "end"], "start", true),
    new AttributeChoice(this, "label-position", "label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeChoice(this, "layout-type", "layout-type", ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"], "vertical-scroll", true),
    new AttributeChoice(this, "horizontal-align", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "start", true),
    new AttributeChoice(this, "vertical-align", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "start", true),
    new ChildWidgets(this, "div", null, null)
  ]);
}
