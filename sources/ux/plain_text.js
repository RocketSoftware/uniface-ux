// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import {
  StyleClass,
  HtmlAttributeBoolean,
  Element,
  SlottedElement,
  SlottedError,
  HtmlAttribute
} from "./workers.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * PlaintText Widget
 * @export
 * @class PlainText
 * @extends {Widget}
 */
export class PlainText extends Widget {

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
   * Private Worker: SlottedPlainTextFormat
   * @export
   * @class SlottedPlainTextFormat
   * @extends {Element}
   */

  static SlottedPlainTextFormat = class extends Element {

    /**
     * Creates an instance of SlottedPlainTextFormat.
     * @param {typeof Widget} widgetClass
     * @param {String} tagName
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     */
    constructor(
      widgetClass,
      tagName,
      styleClass,
      elementQuerySelector
    ) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.hidden = true;

      this.registerSetter(widgetClass, "valrep", this);
      this.registerDefaultValue(widgetClass, "valrep", []);

      this.registerSetter(widgetClass, "uniface:plaintext-format", this);
      this.registerDefaultValue(widgetClass, "uniface:plaintext-format", "first-line");

      this.registerSetter(widgetClass, "value", this);
      this.registerGetter(widgetClass, "value", this);

      this.registerDefaultValue(widgetClass, "value", "");
    }

    /**
     * Formats error message if valrep is not defined.
     */
    reformatErrorText(widgetInstance) {
      const plainTextFormat = this.getNode(widgetInstance.data.properties, "uniface:plaintext-format");
      let data = widgetInstance.data.properties;
      let text = "";
      switch (plainTextFormat) {
        case "valrep-text":
        case "valrep-html":
          text = `ERROR: Unable to show representation of value ${(data.value || "null")}`;
          break;
        case "value-only":
          text = `ERROR: Invalid value ${(data.value || "null")}`;
          break;
        case "representation-only":
          text = "ERROR: Unable to show representation of value";
          break;
        default:
      }
      return text;
    }

    getValueRepresentationAsText(widgetInstance) {
      let value = this.getNode(widgetInstance.data.properties, "value");
      if (value && typeof value !== "string") {
        value = value.toString();
      }
      const valrep = this.getNode(widgetInstance.data.properties, "valrep");
      const matchedValrepObj = valrep ? valrep.find((valrepObj) => (valrepObj.value === value)) : undefined;
      const plainTextFormat = this.getNode(widgetInstance.data.properties, "uniface:plaintext-format");
      if (valrep && !matchedValrepObj) {
        const text = this.reformatErrorText(widgetInstance);
        if (text) {
          widgetInstance.setProperties({
            "uniface": {
              "format-error": true,
              "format-error-message": text
            }
          });
          return value;
        }
      }
      widgetInstance.setProperties({
        "uniface": {
          "format-error": false,
          "format-error-message": ""
        }
      });

      switch (plainTextFormat) {
        case "valrep-html": {
          value = `<span class="u-valrep-rep">${matchedValrepObj.representation}</span><span class="u-valrep-value">${value}</span>`;
          break;
        }
        case "valrep-text":
          value = `${matchedValrepObj.representation} (${value})`;
          break;
        case "representation-only":
          value = matchedValrepObj.representation;
          break;
        case "value-only":
          value = matchedValrepObj.value;
          break;
        case "multi-paragraphs":
          if (value && value.split) {
            let lines = value.split(/\n/);
            value = "";
            for (let i = 0; i < lines.length; i++) {
              let line = `<p class="u-paragraph">${lines[i]}</p>`;
              value += line;
            }
          }
          break;
        case "multi-line":
          break;
        case "single-line":
          if (value && value.replaceAll) {
            value = value.replaceAll(/\n/g, " ");
          }
          break;
        default: // "first-line".
          if (value && value.split) {
            var arr = value.split("\n", 2);
            if (arr.length > 1) {
              value = `${arr[0]}...`;
            }
          }
          break;
      }
      return value;
    }

    setTextAsPlaintextFormat(widgetInstance) {
      // Format html and multi-line formats locally.
      // Format single-line-text using getValueRepresentationAsText().
      let value = this.getValueRepresentationAsText(widgetInstance);
      const plainTextFormat = this.getNode(widgetInstance.data.properties, "uniface:plaintext-format");
      var element = this.getElement(widgetInstance);

      switch (plainTextFormat) {
        case "valrep-html":
        case "multi-paragraphs":
          element.innerHTML = value;
          break;
        // Other formats are assigned as text.
        default:
          element.innerText = value;
          break;
      }
      if (value) {
        element.hidden = false;
      }
    }

    refresh(widgetInstance) {
      this.setTextAsPlaintextFormat(widgetInstance);
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      let text = this.getNode(widgetInstance.data.properties, "value");
      return text;
    }

    getValueUpdaters(widgetInstance) {
      this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
      return;
    }
  };

  /**
   * Widget definition.
   */
  static structure = new Element(
    this,
    "span",
    "",
    "",
    [
      new StyleClass(this, ["u-plain-text"]),
      new HtmlAttribute(this, "html:title", "title", undefined, true),
      new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
      new HtmlAttribute(this, "html:slot", "slot", "")
    ],
    [
      new SlottedElement(this, "span", "u-prefix", ".u-prefix", "", "uniface:prefix-text", "", "uniface:prefix-icon", ""),
      new this.SlottedPlainTextFormat(this, "span", "u-control", ".u-control"),
      new SlottedError(this, "span", "u-error-icon", ".u-error-icon", ""),
      new SlottedElement(this, "span", "u-suffix", ".u-suffix", "", "uniface:suffix-text", "", "uniface:suffix-icon", "")
    ],
    []
  );
}

UNIFACE.ClassRegistry.add("UX.PlainText", PlainText);
