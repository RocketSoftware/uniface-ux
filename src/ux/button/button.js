// @ts-check
import { Widget } from "../framework/widget.js";
import {
  Worker,
  Element,
  StyleClass,
  Trigger,
  HtmlAttribute,
  HtmlAttributeNumber,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  IgnoreProperty,
  UIBlockElement
} from "../framework/workers.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentButton, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentButton());

/**
 * Button Widget
 * @export
 * @class Button
 * @extends {Widget}
 */
export class Button extends Widget {

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
   * Private Worker: Slotted Button Text
   * Adds and maintains a slotted element for the button text.
   * @class SlottedButtonText
   * @extends {Worker}
   */
  static SlottedButtonText = class extends Worker {

    /**
     * Creates an instance of SlottedButtonText.
     * @constructor
     * @param {typeof Widget} widgetClass
     * @param {string} styleClass
     * @param {string} elementQuerySelector
     */
    constructor(widgetClass, styleClass, elementQuerySelector) {
      super(widgetClass);
      this.registerSetter(widgetClass, "value", this);
      this.registerGetter(widgetClass, "value", this);
      this.registerDefaultValue(widgetClass, "value", "");
      this.styleClass = styleClass;
      this.elementQuerySelector = elementQuerySelector;
    }

    getLayout() {
      this.log("getLayout", null);
      let element = document.createElement("span");
      if (this.styleClass) {
        element.classList.add(this.styleClass);
      }
      return element;
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let text = this.getNode(widgetInstance.data, "value");
      if (text) {
        element.hidden = false;
        element.innerText = text;
      } else {
        element.hidden = true;
        element.innerText = "";
      }
    }

    getValue(widgetInstance) {
      this.log("getValue", { "widgetInstance": widgetInstance.getTraceDescription() });
      let text = this.getNode(widgetInstance.data, "value");
      return text;
    }

    getValueAsFormattedHTML(widgetInstance) {
      this.log("getValueAsFormattedHTML", {
        "widgetInstance": widgetInstance.getTraceDescription()
      });
      const element = this.getElement(widgetInstance);
      return element.innerHTML;
    }

    getValueUpdaters(widgetInstance) {
      this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
      return;
    }
  };

  /**
   * Private Worker: Slotted Button Icon
   * Adds and maintains a slotted element for the button icon.
   * @class SlottedButtonIcon
   * @extends {Worker}
   */
  static SlottedButtonIcon = class extends Worker {

    /**
     * Creates an instance of SlottedButtonIcon.
     * @constructor
     * @param {typeof Widget} widgetClass
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     */
    constructor(widgetClass, styleClass, elementQuerySelector) {
      super(widgetClass);
      // A setter is necessary for the value in SlottedButtonIcon because the class should respond to any changes in the value.
      this.registerSetter(widgetClass, "value", this);
      this.registerSetter(widgetClass, "icon", this);
      this.registerSetter(widgetClass, "icon-position", this);
      this.registerDefaultValue(widgetClass, "icon", "");
      this.registerDefaultValue(widgetClass, "icon-position", "start");
      this.styleClass = styleClass;
      this.elementQuerySelector = elementQuerySelector;
    }

    getLayout() {
      this.log("getLayout", null);
      let element = document.createElement("span");
      if (this.styleClass) {
        element.classList.add(this.styleClass);
      }
      return element;
    }

    refresh(widgetInstance) {
      this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let text = this.getNode(widgetInstance.data, "value");
      let icon = this.getNode(widgetInstance.data, "icon");
      let iconPosition = this.getNode(widgetInstance.data, "icon-position");
      let defaultIconPosition = this.getNode(this.widgetClass.defaultValues, "icon-position");
      if (iconPosition !== "start" && iconPosition !== "end") {
        iconPosition = defaultIconPosition;
      }

      this.deleteIconClasses(element);
      if (icon) {
        element.hidden = false;
        element.classList.add("ms-Icon", `ms-Icon--${icon}`);
        // Set the iconPosition if there is buttonText.
        if (text) {
          element.setAttribute("slot", iconPosition);
        } else {
          // Fixing fluent issue of rendering icon slot element with no button text.
          // By default we are setting iconPosition slot to empty string in order to generate icon only button.
          element.setAttribute("slot", "");
        }
      } else {
        element.hidden = true;
        element.setAttribute("slot", "");
      }
    }
  };

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-button", "", "", [
    new HtmlAttribute(this, undefined, "currentValue", ""),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["neutral", "accent", "outline", "lightweight", "stealth"], "neutral"),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new IgnoreProperty(this, "html:readonly"),
    new UIBlockElement(this, "disabled"),
    new StyleClass(this, ["u-button", "neutral"]),
    new this.SlottedButtonIcon(this, "u-icon", ".u-icon"),
    new this.SlottedButtonText(this, "u-text", ".u-text"),
    new Trigger(this, "detail", "click", true)
  ]);

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {string[]}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "error",
      "error-message",
      "icon"
    ];
  }

  /**
   * Returns the value as format-object for text-based widgets
   * like the cell widget of the data-grid.
   * @param {UData} properties
   * @return {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    formattedValue.primaryPlainText = this.getNode(properties, "value") || "";
    formattedValue.prefixIcon = this.getNode(properties, "icon");
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }

  /**
   * Private Uniface API methods are used for the button class since we don’t implement any error handling for it.
   * However, we can still log errors if any occur from Uniface.
   */
  showError(errorMessage) {
    this.log("showError", errorMessage);
    // If error exist just console log.
    console.error(errorMessage);
  }

  hideError() {
    this.log("hideError");
  }
}
