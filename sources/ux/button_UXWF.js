//@ts-check

import { Widget_UXWF } from "./widget_UXWF.js";
import { Worker, Element, StyleClass, Trigger } from "./workers_UXWF.js";
import { HtmlAttribute, HtmlAttributeNumber, HtmlAttributeChoice, HtmlAttributeBoolean } from "./workers_UXWF.js";
import "https://unpkg.com/@fluentui/web-components";

/**
 * Setter that maintains 
 *
 * @export
 * @class Button_UXWF
 * @extends {Widget_UXWF}
 */
export class Button_UXWF extends Widget_UXWF {

  /**
   * PRIVATE WORKER: BUTTON TEXT
   * Adds and maintains a slotted element for the button text
   *
   * @export
   * @class ButtonText
   * @extends {Worker}
   */
  static SlottedButtonText = class extends Worker {

    /**
     * Creates an instance of ButtonText.
     * @param {typeof Widget_UXWF} widgetClass
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     * @memberof Element
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
      element.classList.add(this.styleClass);
      return element;
    }

    refresh(widgetInstance) {
      this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription() });
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let text = widgetInstance.data.properties["value"];
      let icon = widgetInstance.data.properties.uniface["icon"];
      let iconPosition = widgetInstance.data.properties.uniface["icon-position"];
      let defaultIconPosition = this.widgetClass.defaultValues.uniface["icon-position"];
      iconPosition = iconPosition !== "start" && iconPosition !== "end" ? defaultIconPosition : iconPosition;
      if (text) {
        element.hidden = false;
        element.innerText = text;
        if (icon) {
          widgetInstance.elements.widget.querySelector(".u-icon").setAttribute("slot", iconPosition);
        }
      } else {
        element.hidden = true;
        element.innerText = "";
        // Fixing fluent issue of rendering icon slot element with no button text.
        // By default we are setting iconPosition to empty string in order to generate icon only button.
        if (icon) {
          widgetInstance.elements.widget.querySelector(".u-icon").setAttribute("slot", "");
        }
      }
    }

    getValue(widgetInstance) {
      let text = widgetInstance.data.properties["value"];
      return text;
    }

    getValueUpdaters(widgetInstance) {
      this.log("getValueUpdaters", { widgetInstance: widgetInstance.getTraceDescription() });
      return;
    }
  };

  /**
   * PRIVATE WORKER: BUTTON ICON
   * Adds and maintains a slotted element for the button icon
   *
   * @export
   * @class ButtonIcon
   * @extends {Worker}
   */
  static SlottedButtonIcon = class extends Worker {

    /**
     * Creates an instance of ButtonIcon.
     * @param {typeof Widget_UXWF} widgetClass
     * @param {String} styleClass
     * @param {String} elementQuerySelector
     * @memberof Element
     */
    constructor(widgetClass, styleClass, elementQuerySelector) {
      super(widgetClass);
      this.registerSetter(widgetClass, "uniface:icon", this);
      this.registerSetter(widgetClass, "uniface:icon-position", this);
      this.registerDefaultValue(widgetClass, "uniface:icon", "");
      this.registerDefaultValue(widgetClass, "uniface:icon-position", "start");
      this.styleClass = styleClass;
      this.elementQuerySelector = elementQuerySelector;
    }

    getLayout() {
      this.log("getLayout", null);
      let element = document.createElement("span");
      element.classList.add(this.styleClass);
      return element;
    }

    refresh(widgetInstance) {
      this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription() });
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let text = widgetInstance.data.properties["value"];
      let icon = widgetInstance.data.properties.uniface["icon"];
      let iconPosition = widgetInstance.data.properties.uniface["icon-position"];
      let defaultIconPosition = this.widgetClass.defaultValues.uniface["icon-position"];
      iconPosition = iconPosition !== "start" && iconPosition !== "end" ? defaultIconPosition : iconPosition;
      if (icon) {
        deleteIconClasses();
        element.hidden = false;
        element.classList.add(`ms-Icon`, `ms-Icon--${icon}`);
        //Set the iconPosition if there is buttonText
        if (text) {
          element.setAttribute("slot", iconPosition);
        }
      } else {
        deleteIconClasses();
        element.hidden = true;
        element.setAttribute("slot", "");
      }

      function deleteIconClasses() {
        let arr = Array.from(element.classList);
        arr.forEach((key) => {
          if (key.startsWith("ms-Icon")) {
            element.classList.remove(key);
          }
        });
      }
    }
  };


  /**
   * Initialize as static at derived level, so definitions are unique per widget class.  
   *
   * @static
   * @memberof Button_UXWF
   */
  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "disabled";  // or "readonly" 

  /**
    WIDGET DEFINITION
  **/
  static structure = new Element(
    this, "fluent-button", "", "", [
    new HtmlAttribute(this, "html:current-value", "currentValue", ""),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["neutral", "accent", "outline", "lightweight", "stealth"], "neutral"),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new StyleClass(this, ["u-button", "neutral"]),
  ], [
    new this.SlottedButtonIcon(this, "u-icon", ".u-icon"),
    new this.SlottedButtonText(this, "u-text", ".u-text"),
  ], [
    new Trigger(this, "detail", "click", true)
  ]
  );

  /**
    SPECIALIZED UX METHODS - INVOKED BY UNIFACE TO PERFORM A SPECIFIC ACTION.
  **/
  showError(errorMessage) {
    this.log("showError", errorMessage);
    // If error exist throw exception.
    console.error(errorMessage);
  }

  hideError() {
    this.log("hideError");
  }
}
UNIFACE.ClassRegistry.add("UX.Button_UXWF", Button_UXWF);
