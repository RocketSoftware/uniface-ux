// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { ChildWidgets } from "../framework/workers/child_widgets.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { WidgetOccurrence } from "../framework/workers/widget_occurrence.js";

/**
 * Collection Layout
 * Provides a layout container for entity collections,
 * supporting dynamic arrangement of occurrences with configurable layout types,
 * alignment options, and label display settings to enhance the presentation of collection data within the user interface.
 * @export
 * @class CollectionLayout
 * @extends {Widget}
 */
export class CollectionLayout extends Widget {

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
  static structure = new Element(this, "uf-layout", "", "", [
    new StyleClassManager(this, ["u-coll-layout"]),
    new AttributeBoolean(this, undefined, "show-label", true, true),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "label", "label-text", "", "", "", true),
    new AttributeChoice(this, "label-size", "label-size", ["small", "medium", "large", "normal"], "normal", true),
    new AttributeChoice(this, "label-align", "label-align", ["start", "center", "end"], "start", true),
    new AttributeChoice(this, "label-position", "label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeChoice(this, "area-slot", "area-slot", ["main", "header", "footer"], "main", true),
    new AttributeChoice(this, "layout-type-occurrences", "layout-type", ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"], "auto", true),
    new AttributeChoice(this, "horizontal-align-occurrences", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "auto", true),
    new AttributeChoice(this, "vertical-align-occurrences", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "auto", true),
    new WidgetOccurrence(this, "span", "uocc:{{getName()}}")
  ]);
}

/**
 * Occurrence Layout
 * Provides a layout container for individual entity occurrences,
 * supporting dynamic layout adjustments and
 * alignment configurations to enhance the presentation of occurrence details within the user interface.
 * @export
 * @class OccurrenceLayout
 * @extends {Widget}
 */
export class OccurrenceLayout extends Widget {

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
  static structure = new Element(this, "uf-layout", "", "", [
    new StyleClassManager(this, ["u-occ-layout"]),
    new ChildWidgets(this, "span", null, null),
    new AttributeChoice(this, "layout-type", "layout-type", ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"], "auto", true),
    new AttributeChoice(this, "horizontal-align", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "auto", true),
    new AttributeChoice(this, "vertical-align", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "auto", true)
  ]);
}
