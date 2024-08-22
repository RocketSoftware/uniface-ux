// @ts-check
/* global UNIFACE */
import { Widget_UXWF } from "./widget_UXWF.js";
import {
  Trigger,
  Element,
  SlottedElement,
  SlottedError,
  SlottedWidget,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttributeMinMaxLength,
  HtmlAttributeMinMax,
  StyleClass,
} from "./workers_UXWF.js";

/**
 * NumberField Widget.
 * @export
 * @class NumberField_UXWF
 * @extends {Widget_UXWF}
 */
export class NumberField_UXWF extends Widget_UXWF {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "readonly";

  /**
   * Widget Definition.
   */
  static structure = new Element(
    this,
    "fluent-number-field",
    "",
    "",
    [
      new HtmlAttribute(this, "html:current-value", "currentValue", ""),
      new HtmlAttribute(this, "value", "value", ""),
      new HtmlAttribute(this, "html:size", "size", ""),
      new HtmlAttribute(this, "html:step", "step", 1),
      new HtmlAttribute(this, "html:placeholder", "placeholder", undefined),
      new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, undefined),
      new HtmlAttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
      new HtmlAttributeChoice(this, "uniface:label-position", "u-label-position", ["above", "below", "before", "after"], "", true),
      new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
      new HtmlAttributeBoolean(this, "html:hide-step", "hideStep", false),
      new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
      new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
      new HtmlAttributeMinMax(this, "html:min", "html:max", undefined, undefined),
      new HtmlAttributeMinMaxLength(this, "html:minlength", "html:maxlength", undefined, undefined),
      new StyleClass(this, ["u-number-field", "neutral"]),
    ],
    [
      new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"),
      new SlottedElement(this, "span", "u-prefix", ".u-prefix", "start", "uniface:prefix-text", "", "uniface:prefix-icon", ""),
      new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end"),
      new SlottedElement(this, "span", "u-suffix", ".u-suffix", "end", "uniface:suffix-text", "", "uniface:suffix-icon", ""),
      new SlottedWidget(
        this,
        "span",
        "",
        "",
        "end",
        "changebutton",
        "UX.Button_UXWF",
        {
          "uniface:icon-position": "end",
          "html:tabindex": "-1",
          "html:appearance": "stealth",
        },
        false,
        ["detail"]
      ),
    ],
    [new Trigger(this, "onchange", "change", true)]
  );

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the numberfield class since we need change event for change button when clicked.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    this.elements.widget.enterKeyPressed = false;

    // Stop propagating change event to parent nodes on pressing enter key if change button is enabled.
    this.elements.widget.addEventListener("keydown", (event) => {
      if (!this.elements.widget.querySelector(".u-sw-changebutton").hidden && event.key === "Enter") {
        this.elements.widget.enterKeyPressed = true;
      }
    });
    this.elements.widget.addEventListener("change", (event) => {
      if (this.elements.widget.enterKeyPressed) {
        event.stopPropagation();
        this.elements.widget.enterKeyPressed = false;
      }
    });
    // Dispatch change event when clicked on change button.
    this.elements.widget.querySelector(".u-sw-changebutton").addEventListener("click", () => {
      this.elements.widget.dispatchEvent(new Event("change", { "bubbles": false }));
    });
    return valueUpdaters;
  }
}

UNIFACE.ClassRegistry.add("UX.NumberField_UXWF", NumberField_UXWF);
