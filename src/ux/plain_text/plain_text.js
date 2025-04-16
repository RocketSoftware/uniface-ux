// @ts-check
import { Widget } from "../framework/widget.js";
import {
  StyleClass,
  HtmlAttributeBoolean,
  Element,
  SlottedElement,
  SlottedError,
  HtmlAttribute,
  IgnoreProperty
} from "../framework/workers.js";

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
    constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.hidden = true;

      this.registerSetter(widgetClass, "valrep", this);
      this.registerDefaultValue(widgetClass, "valrep", []);

      this.registerSetter(widgetClass, "plaintext-format", this);
      this.registerDefaultValue(widgetClass, "plaintext-format", "first-line");

      this.registerSetter(widgetClass, "value", this);
      this.registerGetter(widgetClass, "value", this);

      this.registerDefaultValue(widgetClass, "value", "");
    }

    /**
     * Returns error message if display-format is valrep based.
     */
    getFormatErrorText(widgetInstance) {
      const plainTextFormat = this.getNode(widgetInstance.data, "plaintext-format");
      switch (plainTextFormat) {
        case "valrep-text":
        case "valrep-html":
        case "value-only":
        case "representation-only":
          return PlainText.formatErrorMessage;
        default:
          return "";
      }
    }

    /**
     * Format the text according to the specified format.
     * If the `valrep` object does not match the expected value, a format error is shown.
     */
    setTextAsPlaintextFormat(widgetInstance) {
      let value = this.getNode(widgetInstance.data, "value");
      const valrep = this.getNode(widgetInstance.data, "valrep");
      const plainTextFormat = this.getNode(widgetInstance.data, "plaintext-format");
      const element = this.getElement(widgetInstance);
      element.innerHTML = "";
      // Convert value to string if it's not a string already.
      value = value && typeof value !== "string" ? value.toString() : value;
      if (value) {
        element.hidden = false;
      }

      const matchedValrepObj = valrep?.find((valrepObj) => valrepObj.value === value);

      // Handle format errors.
      if (valrep && !matchedValrepObj) {
        const text = this.getFormatErrorText(widgetInstance);
        if (text) {
          this.setErrorProperties(widgetInstance, "format-error", text);
          element.textContent = value;
          return;
        }
      }

      this.setErrorProperties(widgetInstance, "format-error");

      // Create elements dynamically for different plain text formats.
      switch (plainTextFormat) {
        case "valrep-html":
          this.createValrepHtmlElement(matchedValrepObj, value, element);
          break;
        case "valrep-text":
          this.createTextElement(`${matchedValrepObj.representation} (${value})`, element);
          break;
        case "representation-only":
          this.createRepElement(matchedValrepObj, element);
          break;
        case "value-only":
          this.createTextElement(matchedValrepObj.value, element);
          break;
        case "multi-line":
          this.createTextElement(value, element);
          break;
        case "multi-paragraphs":
          this.createMultiParagraphsElement(value, element);
          break;
        case "single-line":
          this.createTextElement(value?.replaceAll(/\n/g, " ") || value, element);
          break;
        default: // "first-line" or any other case
          this.createTextElement(value?.split?.("\n", 2)[0] + (value.includes("\n") ? "..." : ""), element);
          break;
      }
    }

    /**
     * Create DOM element for 'valrep-html'.
     * @param {Object} matchedValrepObj
     * @param {String} value
     * @param {HTMLElement} element
     */
    createValrepHtmlElement(matchedValrepObj, value, element) {
      const valueSpan = document.createElement("span");
      valueSpan.className = "u-valrep-value";
      valueSpan.textContent = value;
      this.createRepElement(matchedValrepObj, element);
      element.appendChild(document.createTextNode(" ")); // Add space between the spans
      element.appendChild(valueSpan);
    }

    /**
     * Create DOM element for rep html element.
     * @param {Object} matchedValrepObj
     * @param {HTMLElement} element
     */
    createRepElement(matchedValrepObj, element) {
      const repSpan = document.createElement("span");
      repSpan.className = "u-valrep-rep";
      repSpan.innerHTML = matchedValrepObj.representation;
      element.appendChild(repSpan);
    }

    /**
     * Create a text node element.
     * @param {String} text
     * @param {HTMLElement} element
     */
    createTextElement(text, element) {
      element.textContent = text;
    }

    /**
     * Create a DOM structure for multi-paragraphs.
     * @param {String} value
     * @param {HTMLElement} element
     */
    createMultiParagraphsElement(value, element) {
      const paragraphs = value?.split(/\n/) || [];

      paragraphs.forEach((line) => {
        const paragraph = document.createElement("p");
        paragraph.className = "u-paragraph";
        paragraph.textContent = line;
        element.appendChild(paragraph);
      });
    }

    refresh(widgetInstance) {
      this.setTextAsPlaintextFormat(widgetInstance);
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      let text = this.getNode(widgetInstance.data, "value");
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
  // prettier-ignore
  static structure = new Element(this, "span", "", "", [
    new StyleClass(this, ["u-plain-text"]),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttribute(this, "html:slot", "slot", ""),
    new IgnoreProperty(this, "html:maxlength"),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:readonly"),
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new SlottedElement(this, "span", "u-prefix", ".u-prefix", "", "prefix-text", "", "prefix-icon", ""),
    new this.SlottedPlainTextFormat(this, "span", "u-control", ".u-control"),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", ""),
    new SlottedElement(this, "span", "u-suffix", ".u-suffix", "", "suffix-text", "", "suffix-icon", "")
  ]);

  /**
   * Returns an array of property ids that affect the formatted value.
   * @returns {string[]}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "valrep",
      "error",
      "error-message",
      "plaintext-format",
      "prefix-icon",
      "suffix-icon",
      "prefix-text",
      "suffix-text"
    ];
  }

  /**
   * Returns true if display format is related to valrep.
   * @param {string} displayFormat
   * @return {boolean}
   */
  static isValrepRelatedDisplayProperty(displayFormat) {
    switch (displayFormat) {
      case "valrep-html":
      case "valrep-text":
      case "representation-only":
      case "value-only":
        return true;
    }
    return false;
  }

  /**
   * Returns true if display format is related to text.
   * @param {string} displayFormat
   * @return {boolean}
   */
  static isTextRelatedDisplayProperty(displayFormat) {
    switch (displayFormat) {
      case "multi-paragraphs":
      case "multi-line":
      case "single-line":
      case "first-line":
        return true;
    }
    return false;
  }

  /**
   * Returns the value as format-object.
   * @param {string} displayFormat
   * @param {object} valrepItem
   * @return {UValueFormatting}
   */
  static formatValrepItem(displayFormat, valrepItem) {
    const formattedValue = {};

    switch (displayFormat) {
      case "valrep-html":
        formattedValue.primaryHtmlText = valrepItem.representation;
        formattedValue.secondaryPlainText = valrepItem.value;
        break;
      case "valrep-text":
        formattedValue.primaryPlainText = valrepItem.representation;
        formattedValue.secondaryPlainText = valrepItem.value;
        break;
      case "representation-only":
        formattedValue.primaryHtmlText = valrepItem.representation;
        break;
      case "value-only":
        formattedValue.primaryPlainText = valrepItem.value;
        break;
    }

    return formattedValue;
  }

  /**
   * Returns the value as format-object.
   * @param {string} displayFormat
   * @param {any} value
   * @return {UValueFormatting}
   */
  static formatText(displayFormat, value) {
    const formattedValue = {};

    switch (displayFormat) {
      case "multi-paragraphs":
      case "multi-line":
        break;
      case "single-line":
        if (value?.replaceAll) {
          value = value.replaceAll(/\n/g, " ");
        }
        break;
      case "first-line":
      default:
        if (value?.split) {
          let arr = value.split("\n", 2);
          if (arr.length > 1) {
            value = `${arr[0]}...`;
          }
        }
        break;
    }

    formattedValue.primaryPlainText = value;
    return formattedValue;
  }

  /**
   * Returns the value as format-object.
   * @param {UData} properties
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    const displayFormat = this.getNode(properties, "plaintext-format") || this.getNode(this.defaultValues, "plaintext-format");
    let value = this.getNode(properties, "value") || this.getNode(this.defaultValues, "value");

    const valrep = this.getNode(properties, "valrep") || this.getNode(this.defaultValues, "valrep");
    const valrepItem = this.getValrepItem(valrep, value);

    if (this.toBoolean(this.getNode(properties, "error"))) {
      formattedValue.errorMessage = this.getNode(properties, "error-message");
    }

    if (this.isValrepRelatedDisplayProperty(displayFormat) && valrepItem) {
      formattedValue = this.formatValrepItem(displayFormat, valrepItem);
    } else if (this.isTextRelatedDisplayProperty(displayFormat)) {
      formattedValue = this.formatText(displayFormat, value);
    } else {
      formattedValue.primaryPlainText = "ERROR";
      formattedValue.secondaryPlainText = value;
      formattedValue.errorMessage = this.formatErrorMessage;
    }

    formattedValue.prefixIcon = this.getNode(properties, "prefix-icon");
    if (!formattedValue.prefixIcon) {
      formattedValue.prefixText = this.getNode(properties, "prefix-text");
    }
    formattedValue.suffixIcon = this.getNode(properties, "suffix-icon");
    if (!formattedValue.suffixIcon) {
      formattedValue.suffixText = this.getNode(properties, "suffix-text");
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}
