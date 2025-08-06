// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker_base.js";

/**
 * AttributeUIBlocking worker applies UI blocking behavior based on the `uiblocked` property.
 * This worker updates your widget’s DOM element by:
 * - Toggling a CSS class (e.g. `u-blocked`) to reflect the blocked state visually.
 * - Applying or restoring the `disabled` or `readonly` properties based on the `uiBlocking` configuration of the widget.
 * @export
 * @class AttributeUIBlocking
 * @extends {WorkerBase}
 */
export class AttributeUIBlocking extends WorkerBase {

  /**
   * Creates an instance of AttributeUIBlocking.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {string} uiblocking - Specifies the type of UI blocking behavior to apply. Supported values are "disabled" and "readonly".
   */
  constructor(widgetClass, uiblocking) {
    super(widgetClass);
    this.registerSetter(widgetClass, "uiblocked", this);
    this.uiblocking = uiblocking;
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription()
    });
    let element = widgetInstance.elements.widget;
    const isBlocked = this.toBoolean(this.getNode(widgetInstance.data, "uiblocked"));

    if (isBlocked) {
      element.classList.add("u-blocked");
      if (this.uiblocking === "disabled") {
        element.disabled = true;
      } else if (this.uiblocking === "readonly") {
        element.readOnly = true;
      } else {
        widgetInstance.error("AttributeUIBlocking", "Invalid block type", this.uiblocking);
      }
    } else {
      element.classList.remove("u-blocked");
      if (this.uiblocking === "disabled") {
        element.disabled = widgetInstance.toBoolean(widgetInstance.data["html:disabled"]);
      } else if (this.uiblocking === "readonly") {
        element.readOnly = widgetInstance.toBoolean(widgetInstance.data["html:readonly"]);
      }
    }
  }
}
