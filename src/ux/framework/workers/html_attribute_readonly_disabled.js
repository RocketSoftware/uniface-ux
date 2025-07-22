// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker.js";

/**
 * HtmlAttributeReadonlyDisabled is a specialized worker that updates the `readonly` and `disabled`
 * attributes on an HTML element.
 * In addition to setting these attributes, it performs a validity check during the UI blocked phase
 * and updates the element state accordingly. This ensures that the control's interactivity aligns
 * with the current application state and validation logic.
 * @export
 * @class HtmlAttributeReadonlyDisabled
 * @extends {WorkerBase}
 */
export class HtmlAttributeReadonlyDisabled extends WorkerBase {

  /**
   * Creates an instance of HtmlAttributeReadonlyDisabled.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
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
}
