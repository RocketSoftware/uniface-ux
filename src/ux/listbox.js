// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  Element,
  StyleClass,
  Trigger,
  SlottedElementsByValRep,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeBoolean,
  IgnoreProperty
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

/**
 * Listbox Widget
 * @export
 * @class Listbox
 * @extends {Widget}
 */
export class Listbox extends Widget {

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
  static uiBlocking = "readonly";

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-listbox", "", "", [
    new StyleClass(this, ["u-listbox"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, undefined, "role", "listbox"),
    new HtmlAttribute(this, undefined, "ariaActivedescendant", ""),
    new HtmlAttribute(this, undefined, "ariaControls", ""),
    new HtmlAttributeBoolean(this, undefined, "ariaDisabled", false),
    new HtmlAttributeBoolean(this, undefined, "ariaReadOnly", false),
    new HtmlAttributeBoolean(this, undefined, "ariaExpanded", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readonly", false, true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength")
  ], [
    new SlottedElementsByValRep(this, "fluent-option", "", "")
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the list box class since we need to add a change event for the listbox when user interaction occurs.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    // Add event listeners for user interactions.
    widgetElement.addEventListener("click", handleSelectionChange);
    widgetElement.addEventListener("keydown", handleSelectionChange);
    // Store the original selectedIndex value.
    let previousSelectedIndex = widgetElement.selectedIndex;

    // Function to handle selection change.
    function handleSelectionChange() {
      if (widgetElement.hasAttribute("readonly") || widgetElement.hasAttribute("disabled")) {
        widgetElement.selectedIndex = previousSelectedIndex;
        return; // Do nothing if the listbox is readonly or disabled.
      }
      if (widgetElement.selectedIndex !== previousSelectedIndex) {
        previousSelectedIndex = widgetElement.selectedIndex;
        const event = new window.Event("change");
        widgetElement.dispatchEvent(event);
      }
    }
    return valueUpdaters;
  }
}

UNIFACE.ClassRegistry.add("UX.Listbox", Listbox);
