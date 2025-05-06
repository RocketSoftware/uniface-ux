// @ts-check
import { Widget } from "../framework/widget.js";
import {
  Element,
  StyleClass,
  Trigger,
  SlottedElement,
  SlottedError,
  HtmlAttribute,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttributeNumber,
  HtmlAttributeMinMaxLength,
  UIBlockElement
} from "../framework/workers.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentTextArea, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentTextArea());

/**
 * TextArea Widget.
 * @export
 * @class TextArea
 * @extends {Widget}
 */
export class TextArea extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   * @memberof TextArea
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "readonly";

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-text-area", "", "", [
    new HtmlAttribute(this, undefined, "currentValue", ""),
    new HtmlAttribute(this, "value", "value", "", false, "change"),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, "html:cols", "cols", "20"),
    new HtmlAttribute(this, "html:rows", "rows", "", true),
    new HtmlAttribute(this, "html:placeholder", "placeholder", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
    new HtmlAttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new HtmlAttributeChoice(this, "html:resize", "resize", ["none", "both", "horizontal", "vertical"], "both"),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeBoolean(this, "html:spellcheck", "spellcheck", false),
    new HtmlAttributeMinMaxLength(this, "html:minlength", "html:maxlength", undefined, undefined),
    new UIBlockElement(this, "u-blocked"),
    new StyleClass(this, ["u-text-area", "outline"]),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the textarea widget.
   * This is to put root div and an error span inside the shadow root since the fluent library doesn't provide them.
   * The control is also moved into the root div.
   */
  onConnect(widgetElement, objectDefinition) {
    let updaters = super.onConnect(widgetElement, objectDefinition);
    let shadowRoot = this.elements.widget.shadowRoot;
    let root = shadowRoot.querySelector(".root");
    if (!root) {
      root = document.createElement("div");
      root.setAttribute("class", "root");
      root.part = "root";
      shadowRoot.appendChild(root);
    }
    let control = shadowRoot.querySelector(".control");
    root.appendChild(control);
    let errorSpan = shadowRoot.querySelector(".error");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.part = "end";
      errorSpan.setAttribute("class", "error");
      let errorSlot = document.createElement("slot");
      errorSlot.name = "end";
      errorSpan.appendChild(errorSlot);
      root.appendChild(errorSpan);
    }
    return updaters;
  }
}
