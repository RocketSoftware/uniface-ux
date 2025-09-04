// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeLength } from "../framework/workers/attribute_length.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ElementError } from "../framework/workers/element_error.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../framework/workers/attribute_ui_blocking.js";

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

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-text-area", "", "", [
    new StyleClassManager(this, ["u-text-area", "outline"]),
    new AttributeString(this, undefined, "currentValue", ""),
    new AttributeString(this, "value", "value", "", false, "change"),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, "html:cols", "cols", "20"),
    new AttributeString(this, "html:rows", "rows", "", true),
    new AttributeString(this, "html:placeholder", "placeholder", undefined),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
    new AttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeChoice(this, "html:resize", "resize", ["none", "both", "horizontal", "vertical"], "both"),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeBoolean(this, "html:disabled", "disabled", false),
    new AttributeBoolean(this, "html:readonly", "readOnly", false),
    new AttributeBoolean(this, "html:spellcheck", "spellcheck", false),
    new AttributeLength(this, "html:minlength", "html:maxlength", undefined, undefined),
    new AttributeUIBlocking(this, "readonly"),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new EventTrigger(this, "onchange", "change", true)
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

    // ResizeObserver to update the label's maxWidth when the widget is resized, for label position above and below.
    const resizeObserver = new window.ResizeObserver(() => {
      if (this.data["label-position"] === "above" || this.data["label-position"] === "below") {
        let labelSpan = widgetElement.querySelector(".u-label-text");
        labelSpan.style.width = `${control.offsetWidth}px`;
      }
    });
    resizeObserver.observe(control);

    return updaters;
  }

  /**
   * Private Uniface API method - validate.
   * This method is used to ensure that all validation errors are caught, as Fluent doesn't detect some validation errors.
   */
  validate() {
    this.log("validate");

    const controlElement = this.elements.widget.control;
    const minlength = controlElement.getAttribute("minlength");
    const maxlength = controlElement.getAttribute("maxlength");
    const currentValueLength = this.elements.widget.value.length;
    let html5ValidationMessage = "";

    if (!controlElement.checkValidity()) {
      html5ValidationMessage = controlElement.validationMessage;
    } else if (minlength && currentValueLength < minlength) {
      html5ValidationMessage = `Please lengthen this text to ${minlength} characters or more (you are currently using ${currentValueLength} characters).`;
    } else if (maxlength && currentValueLength > maxlength) {
      html5ValidationMessage = `Please shorten this text to ${maxlength} characters or less (you are currently using ${currentValueLength} characters).`;
    }

    return html5ValidationMessage;
  }
}
