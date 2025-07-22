// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker_base.js";

/**
 * StyleClassManager is a worker responsible for updating the CSS class of a widget
 * based on the provided value.
 * @export
 * @class StyleClassManager
 * @extends {WorkerBase}
 */
export class StyleClassManager extends WorkerBase {
  constructor(widgetClass, defaultClassList) {
    super(widgetClass);
    this.registerSetter(widgetClass, "class", this);
    defaultClassList.forEach((className) => {
      this.registerDefaultValue(widgetClass, `class:${className}`, true);
    });
  }

  /**
   * Refreshes the widget based on properties.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    for (let property in widgetInstance.data) {
      if (property.startsWith("class:")) {
        let value = this.toBoolean(widgetInstance.data[property]);
        let pos = property.search(":");
        property = property.substring(pos + 1);
        if (value) {
          element.classList.add(property);
        } else {
          element.classList.remove(property);
        }
      }
    }
  }
}
