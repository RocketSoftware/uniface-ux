import { FASTElement } from "@microsoft/fast-element";
import { widgetContainerTemplate as template } from "./widget_container_template";
import { widgetContainerStyles as styles } from "./widget_container_styles";

/**
 * Base container component for widgets that expose a
 * common header/body layout structure.
 *
 * Derived custom elements include:
 * - uf-accordion-container
 * - etc.
 *
 * @export
 * @class WidgetContainer
 * @extends {FASTElement}
 */
export class WidgetContainer extends FASTElement {}

/**
 * Widget types that use the shared container implementation.
 *
 * Each type is registered as:
 * `uf-<type>-container`
 *
 * @type {string[]}
 */
const containerTypes = ["accordion"];

/**
 * Registers widget container custom elements using the
 * shared template and styles.
 */
for (const type of containerTypes) {
  FASTElement.define(class extends WidgetContainer {}, {
    "name": `uf-${type}-container`,
    template,
    styles
  });
}
