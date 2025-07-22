// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeBase } from "../common/base_html_attribute.js";
import { getWidgetClass } from "../common/dsp_connector.js";

/**
 * AttributeFormattedValue is a specialized worker that extends AttributeBase.
 * It updates the widget-value as formatted HTML elements.
 * Formatting information is provided by the object's original widget and used to construct the formatting HTML.
 * @export
 * @class AttributeFormattedValue
 * @extends {AttributeBase}
 */
export class AttributeFormattedValue extends AttributeBase {

  /**
   * Creates an instance of AttributeFormattedValue.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {UPropName} propId - Specifies the id of the property that holds the object's original widget-class name.
   */
  constructor(widgetClass, propId) {
    super(widgetClass);
    this.propId = propId;
    this.registerSetter(widgetClass, propId, this);
  }

  /**
   * This method appends the element with text or icon at the given position.
   * @param {HTMLElement} element
   * @param {UValueFormatting} formattedValue
   * @param {string} position
   */
  appendIconOrTextAtPosition(element, formattedValue, position) {
    const iconKey = `${position}Icon`;
    const textKey = `${position}Text`;

    if (formattedValue[iconKey]) {
      let iconElement = document.createElement("span");
      iconElement.classList.add(`u-${position}-icon`, "ms-Icon", `ms-Icon--${formattedValue[iconKey]}`);
      element.appendChild(iconElement);
    } else if (formattedValue[textKey]) {
      let textElement = document.createElement("span");
      textElement.classList.add(`u-${position}-text`);
      textElement.innerText = formattedValue[textKey];
      element.appendChild(textElement);
    }
  }

  /**
   * This method appends the element as innerText or innerHTML at the given position.
   * @param {HTMLElement} textElement
   * @param {UValueFormatting} formattedValue
   * @param {string} position
   */
  appendHtmlOrPlainTextAtPosition(textElement, formattedValue, position) {
    const plainTextKey = `${position}PlainText`;
    const htmlTextKey = `${position}HtmlText`;

    if (formattedValue[plainTextKey]) {
      let textSpan = document.createElement("span");
      textSpan.classList.add(`u-${position}-text`);
      textSpan.innerText = formattedValue[plainTextKey];
      textElement.appendChild(textSpan);
    } else if (formattedValue[htmlTextKey]) {
      let textSpan = document.createElement("span");
      textSpan.classList.add(`u-${position}-text`);
      textSpan.innerHTML = formattedValue[htmlTextKey];
      textElement.appendChild(textSpan);
    }
  }

  /**
   * This method refreshes the innerHTML of the element with the new HTML-formatted value.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    const orgWidgetClassName = this.getNode(widgetInstance.data, this.propId);
    const orgWidgetClass = getWidgetClass(orgWidgetClassName);
    const element = this.getElement(widgetInstance);
    element.innerHTML = "";
    element.classList.remove("u-invalid");
    element.classList.remove("u-hidden");
    element.classList.remove("u-read-only");
    element.classList.remove("u-disabled");
    element.title = this.getNode(widgetInstance.data, "html:title") || "";
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:hidden"))) {
      element.classList.add("u-hidden");
      element.title = "";
    }
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:readonly"))) {
      element.classList.add("u-read-only");
    }
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:disabled"))) {
      element.classList.add("u-disabled");
    }

    /** @type {UValueFormatting} */
    let formattedValue = {};
    if (typeof orgWidgetClass?.getValueFormatted === "function") {
      formattedValue = orgWidgetClass.getValueFormatted(widgetInstance.data);
    } else {
      // Fallback if org widget does not provide this function.
      formattedValue.primaryPlainText = this.getNode(widgetInstance.data, "value");
    }

    this.appendIconOrTextAtPosition(element, formattedValue, "prefix");

    let valueElement = document.createElement("span");
    valueElement.classList.add("u-value");
    let textElement = document.createElement("span");
    textElement.classList.add("u-text");
    this.appendHtmlOrPlainTextAtPosition(textElement, formattedValue, "primary");
    this.appendHtmlOrPlainTextAtPosition(textElement, formattedValue, "secondary");
    valueElement.appendChild(textElement);

    if (formattedValue.errorMessage) {
      let errorElement = document.createElement("span");
      errorElement.classList.add("u-error-icon", "ms-Icon", "ms-Icon--AlertSolid");
      errorElement.title = formattedValue.errorMessage;
      valueElement.appendChild(errorElement);
      element.classList.add("u-invalid");
    }
    element.appendChild(valueElement);

    this.appendIconOrTextAtPosition(element, formattedValue, "suffix");
  }
}
