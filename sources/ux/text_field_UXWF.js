// @ts-check

import { Widget_UXWF } from "./widget_UXWF.js";
import { HtmlAttribute, HtmlAttributeNumber, HtmlAttributeChoice, HtmlAttributeBoolean, HtmlAttributeMinMaxLength, StyleClass } from "./workers_UXWF.js";
import { Element, SlottedElement, SlottedError, SlottedWidget } from "./workers_UXWF.js";
import { Trigger } from "./workers_UXWF.js";
import 'https://unpkg.com/@fluentui/web-components';


/**
 * TEXT-FIELD WIDGET DEFINITION
 * Wrapper class for Fluent-text-field web component.
 *
 * @class TextField_UXWF
 * @extends {Widget_UXWF}
 */
export class TextField_UXWF extends Widget_UXWF {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.  
   *
   * @static
   * @memberof TextField_UXWF
   */
  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "disabled";

  /**
   * Widget structure describes the DOM structure used by the widget and maps
   * attributes, events, etc to Uniface properties and triggers.
   *
   * @static
   * @memberof TextField_UXWF
   */
  // static structure = new Element(this, "fluent-text-field", "", "", [
  //   new HtmlAttribute(this, "text-field", "xxx", "")
  // ]);

  static structure = new Element(this, "fluent-text-field", "", "", [
    new HtmlAttribute(this, "html:current-value", "current-value", ""),
    new HtmlAttribute(this, "value", "value", ""),
    new HtmlAttribute(this, "html:title", "title", undefined),
    new HtmlAttribute(this, "html:pattern", "pattern", undefined),
    new HtmlAttribute(this, "html:placeholder", "placeholder", undefined),
    new HtmlAttributeNumber(this, "html:tabindex", "tabIndex", -1, null, undefined),
    new HtmlAttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
    new HtmlAttributeChoice(this, "html:type", "type", ["text", "email", "password", "tel", "url", "date"], "text"),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new HtmlAttributeBoolean(this, "html:disabled", "disabled", false),
    new HtmlAttributeBoolean(this, "html:readonly", "readOnly", false),
    new HtmlAttributeBoolean(this, "html:spellcheck", "spellcheck", false),
    new HtmlAttributeMinMaxLength(this, "html:minlength", "html:maxlength", 0, 100000),
    // new UX.SETTER4.HtmlAttributeMinMax(this, "html:min", "html:max", -100000, 100000),
    new StyleClass(this, ["u-text-field", "neutral"])
  ], [
    new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"),
    new SlottedElement(this, "span", "u-prefix", ".u-prefix", "start", "uniface:prefix-text", "", "uniface:prefix-icon", ""),
    new SlottedError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new SlottedElement(this, "span", "u-suffix", ".u-suffix", "end", "uniface:suffix-text", "", "uniface:suffix-icon", ""),
    new SlottedWidget(this, "span", "u-change-button", ".u-change-button", "end", "change-button", "UX.Button_UXWF", {
      "uniface:icon": "",
      "uniface:icon-position": "end",
      "value": "Change",
      "classes:u-change-button": true,
      "html:title": "",
      "html:appearance": ""
    }, false, ["detail"])
  ], [
    new Trigger(this, "onchange", "change", true)
  ]);

  /**
   * Validates the value of the widget before passing it back to Uniface.
   *
   * @memberof TextField_UXWF
   */
  validate() {
    this.log("validate");
    // Return any HTML5 validation errors
    let result = null;
    if (!this.elements.widget.control.checkValidity()) {
      result = this.elements.widget.control.validationMessage;
    } else if (this.data.properties.html.minlength > 0 && this.elements.widget.value.length < this.data.properties.html.minlength) {
      // minlength errors are not detected by HTML5. Do it now.
      result = `String must atleast atleast consist of ${this.data.properties.html.minlength} characters.`;
    }
    return result;
  }
}
UNIFACE.ClassRegistry.add("UX.TextField_UXWF", TextField_UXWF);
