// @ts-check
import { Widget } from "../framework/common/widget.js";
import { WorkerBase } from "../framework/common/worker_base.js";
import { Element } from "../framework/workers/element.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeLength } from "../framework/workers/attribute_length.js";
import { AttributeNumber } from "../framework/workers/attribute_number.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ElementError } from "../framework/workers/element_error.js";
import { SubWidget } from "../framework/workers/sub_widget.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { EventTrigger } from "../framework/workers/event_trigger.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components
import { fluentTextField, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentTextField());

// This widget also depends on Button, still registration is needed
import { Button } from "../button/button.js";
import { registerWidgetClass } from "../framework/common/dsp_connector.js";
registerWidgetClass("UX.Button", Button);

/**
 * TextField Widget.
 * @export
 * @class TextField
 * @extends {Widget}
 */
export class TextField extends Widget {

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
   * Private Worker: This is a specialized worker that updates the `readonly` and `disabled`
   * attributes on an HTML element.
   * In addition to setting these attributes, it performs a validity check during the UI blocked phase
   * and updates the element state accordingly. This ensures that the control's interactivity aligns
   * with the current application state and validation logic.
   * @export
   * @class AttributeUIBlocking
   * @extends {WorkerBase}
   */
  static AttributeUIBlocking = class extends WorkerBase {

    /**
     * Creates an instance of AttributeUIBlocking.
     * @param {typeof Widget} widgetClass
     * @param {string} readonlyPropId
     * @param {string} disabledPropId
     * @param {string} uiblockedPropId
     * @param {boolean} readonlyDefaultValue
     * @param {boolean} disabledDefaultValue
     * @param {boolean} uiblockedDefaultValue
     */
    constructor(widgetClass, readonlyPropId, disabledPropId, uiblockedPropId, readonlyDefaultValue, disabledDefaultValue, uiblockedDefaultValue) {
      super(widgetClass);
      this.propReadonly = readonlyPropId;
      this.propDisabled = disabledPropId;
      this.propUiblocked = uiblockedPropId;
      this.registerSetter(widgetClass, readonlyPropId, this);
      this.registerSetter(widgetClass, disabledPropId, this);
      this.registerSetter(widgetClass, uiblockedPropId, this);
      this.registerDefaultValue(widgetClass, readonlyPropId, readonlyDefaultValue);
      this.registerDefaultValue(widgetClass, disabledPropId, disabledDefaultValue);
      this.registerDefaultValue(widgetClass, uiblockedPropId, uiblockedDefaultValue);
    }

    /**
     * Refreshes the widget based on properties.
     * @param {Widget} widgetInstance
     */
    refresh(widgetInstance) {
      this.log("refresh", {
        "widgetInstance": widgetInstance.getTraceDescription()
      });

      let element = this.getElement(widgetInstance);
      let readonly = this.getNode(widgetInstance.data, this.propReadonly);
      let disabled = this.getNode(widgetInstance.data, this.propDisabled);
      let uiblocked = this.getNode(widgetInstance.data, this.propUiblocked);

      // Ensure widget and control is not disabled before checking validity since html always returns true on checkValidity for disabled field.
      element["disabled"] = false;
      element["control"].disabled = false;
      // During uiblocked phase, set element to readonly or disabled based on validity.
      if (uiblocked) {
        if (!element["control"].checkValidity()) {
          element["disabled"] = true;
        } else {
          element["readOnly"] = true;
          element["disabled"] = this.toBoolean(disabled);
        }
      } else {
        // Reset properties based on initial values when not uiblocked.
        if (!element["control"].checkValidity()) {
          element["disabled"] = this.toBoolean(disabled);
        } else {
          element["readOnly"] = this.toBoolean(readonly);
          element["disabled"] = this.toBoolean(disabled);
        }
      }
    }
  };

  /**
   * Widget Definition.
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-text-field", "", "", [
    new StyleClassManager(this, ["u-text-field", "outline"]),
    new AttributeString(this, undefined, "currentValue", ""),
    new AttributeString(this, "value", "value", "", false, "change"),
    new AttributeString(this, "html:title", "title", undefined),
    new AttributeString(this, "html:size", "size", "20", true),
    new AttributeString(this, "html:pattern", "pattern", undefined),
    new AttributeString(this, "html:placeholder", "placeholder", undefined),
    new AttributeNumber(this, "html:tabindex", "tabIndex", -1, null, 0),
    new AttributeChoice(this, "html:appearance", "appearance", ["outline", "filled"], "outline"),
    new AttributeChoice(this, "html:type", "type", ["text", "email", "password", "tel", "url", "date"], "text"),
    new AttributeChoice(this, "label-position", "u-label-position", ["above", "below", "before", "after"], "above", true),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new this.AttributeUIBlocking(this, "html:readonly", "html:disabled", "uiblocked", false, false, false),
    new AttributeBoolean(this, "html:spellcheck", "spellcheck", false),
    new AttributeLength(this, "html:minlength", "html:maxlength", undefined, undefined),
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "", "label-text"),
    new ElementIconText(this, "span", "u-prefix", ".u-prefix", "start", "prefix-text", "", "prefix-icon", ""),
    new ElementError(this, "span", "u-error-icon", ".u-error-icon", "end"),
    new ElementIconText(this, "span", "u-suffix", ".u-suffix", "end", "suffix-text", "", "suffix-icon", ""),
    new SubWidget(this, "span", "", "", "end", "changebutton", "UX.Button", {
      "icon-position": "end",
      "html:tabindex": "-1",
      "html:appearance": "stealth"
    }, false, [
      "detail"
    ], [
      "html:disabled"
    ]),
    new EventTrigger(this, "onchange", "change", true)
  ]);

  /**
   * Private Uniface API method - onConnect.
   * This method is used for the textfield class since we need change event for change button when clicked.
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
      this.elements.widget.dispatchEvent(new window.Event("change", { "bubbles": false }));
    });
    return valueUpdaters;
  }

  /**
   * Private Uniface API method - validate.
   * This method is used to ensure that all validation errors are caught, as Fluent doesn't detect some validation errors.
   */
  validate() {
    this.log("validate");

    // Return any HTML5 validation errors.
    let html5ValidationMessage;
    if (!this.elements.widget.control.checkValidity()) {
      html5ValidationMessage = this.elements.widget.control.validationMessage;
    } else if (this.data["html:minlength"] > 0 && this.elements.widget.value.length < this.data["html:minlength"]) {
      // HTML5 minlength validation errors are not detected by fluent, Hence we manually add the HTML5 minlength validation message.
      html5ValidationMessage = `Please lengthen this text to ${this.data["html:minlength"]} characters or more (you are currently using ${this.elements.widget.value.length} characters).`;
    }
    return html5ValidationMessage;
  }

  /**
   * Returns an array of property ids that affect the formatted value for text-based widgets
   * like the cell widget of the data-grid.
   * @returns {Array<string>}
   */
  static getValueFormattedSetters() {
    return [
      "value",
      "error",
      "error-message",
      "prefix-icon",
      "prefix-text",
      "suffix-icon",
      "suffix-text"
    ];
  }

  /**
   * Returns the value as format-object for text-based widgets
   * like the cell widget of the data-grid.
   * @param {UData} properties
   * @returns {UValueFormatting}
   */
  static getValueFormatted(properties) {

    /** @type {UValueFormatting} */
    let formattedValue = {};
    let plainTextValue = this.getNode(properties, "value") ?? "";
    formattedValue.primaryPlainText = plainTextValue.replaceAll(/\n/g, " ");
    formattedValue.prefixIcon = this.getNode(properties, "prefix-icon");
    if (!formattedValue.prefixIcon) {
      formattedValue.prefixText = this.getNode(properties, "prefix-text");
    }
    formattedValue.suffixIcon = this.getNode(properties, "suffix-icon");
    if (!formattedValue.suffixIcon) {
      formattedValue.suffixText = this.getNode(properties, "suffix-text");
    }
    if (this.toBoolean(this.getNode(properties, "error"))) {
      formattedValue.errorMessage = this.getNode(properties, "error-message");
    }
    this.staticLog("getValueFormatted", formattedValue);
    return formattedValue;
  }
}

