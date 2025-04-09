// @ts-check
import { Widget } from "./widget.js";
import {
  Element,
  Worker,
  StyleClass,
  SubWidgetsByProperty,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlAttribute,
  IgnoreProperty
} from "./workers.js";
// The import of Fluent UI web-components is done in loader.js

/**
 * Controlbar Widget
 * @export
 * @class Controlbar
 * @extends {Widget}
 */
export class Controlbar extends Widget {

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
  // This widget does not have uiBlocking of its own but the subWidget may have.
  static uiBlocking = "";

  /**
   * Private Worker: HandleOverFlowPropertyWorker.
   * Handles the horizontal responsiveness of the controlbar based on overflow-behavior and priority.
   * @class HandleOverFlowPropertyWorker
   * @extends {Worker}
   */
  static HandleOverFlowPropertyWorker = class extends Worker {
    constructor(widgetClass, propId, defaultValue) {
      super(widgetClass);
      this.propId = propId;
      this.defaultValue = defaultValue;
      this.overflowPropertiesMap = {};
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, defaultValue);
    }

    refresh(widgetInstance) {
      const element = this.getElement(widgetInstance);
      const properties = widgetInstance.data;
      const subWidgets = Object.values(widgetInstance?.subWidgets);

      // Create a map of subWidgets with their ids as key and the widgetInstance as value.
      let subWidgetsMap = {};
      // Create a map for easily accessing overflow related properties. It will be a nested object that maps the sub-widget-id of each sub-widget to its overflow behavior and priority values.
      this.overflowPropertiesMap = {};
      // Also create a list of controlbarSubwidgets where each subWidget is the corresponding HTML elements.
      let controlbarSubWidgets = subWidgets
        .map((subWidget) => {
          const subWidgetElement = this.getElement(subWidget);
          const subWidgetId = subWidgetElement?.getAttribute("sub-widget-id");
          if (subWidgetId) {
            subWidgetsMap[subWidgetId] = subWidget;
            this.overflowPropertiesMap[subWidgetId] = {
              "overflow-behavior": properties[`${subWidgetId}_overflow-behavior`] ?? null,
              "priority": properties[`${subWidgetId}_priority`] ?? null,
              "widget-instance": subWidget,
              "widget-class": properties[`${subWidgetId}_widget-class`] ?? ""
            };
          }
          return subWidgetElement;
        })
        .filter((subWidgets) => subWidgets);

      // Handle overflow when overflow-behavior is "none".
      const subWidgetsToAlwaysShow = controlbarSubWidgets.filter((subWidget) => {
        const overflowBehavior = this.getOverflowPropertyValue(subWidget, "overflow-behavior");
        return overflowBehavior === "none" || overflowBehavior === null;
      });
      for (let subWidget of subWidgetsToAlwaysShow) {
        subWidget.classList.remove("u-overflown-item");
      }

      // Handle "hide" overflow-behavior.
      // The variable priorityMap is used to keep subWidgets with same priority together so they can be processed together.
      let priorityMap = {};
      let subWidgetsToHideWithNoPriority = [];
      for (const subWidget of controlbarSubWidgets) {
        const overflowBehavior = this.getOverflowPropertyValue(subWidget, "overflow-behavior");
        const priority = this.getOverflowPropertyValue(subWidget, "priority");
        const isHidden = subWidget.hasAttribute("hidden");
        if (!isHidden && overflowBehavior === "hide") {
          if (priority) {
            if (priorityMap[priority]) {
              priorityMap[priority].push(subWidget);
            } else {
              priorityMap[priority] = [subWidget];
            }
          } else {
            subWidgetsToHideWithNoPriority.push(subWidget);
          }
        }
      }

      let priorityList = Object.keys(priorityMap);
      if (priorityList.length || subWidgetsToHideWithNoPriority.length) {
        // Sort in descending order, so that elements with lower priority(higher number) is first.
        priorityList.sort((a, b) => {
          return Number(b) - Number(a);
        });
        // For subWidgets with priority not specified, the order in which they should be hidden is the reverse of the order in which they appear in the DOM.
        subWidgetsToHideWithNoPriority.reverse();

        // Show all items.
        for (const subWidget of subWidgetsToHideWithNoPriority.concat(Object.values(priorityMap).flat())) {
          subWidget.classList.remove("u-overflown-item");
        }

        // No priority specified means they have the lowest priority and hence should be the first to be hidden.
        this.handleOverflow(subWidgetsToHideWithNoPriority, element, false);
        // Then elements with priority specified will be hidden after in the order of sorted priority.
        for (const priority of priorityList) {
          this.handleOverflow(priorityMap[priority], element);
        }
      }
    }

    /**
     * Helper - Returns the value of a given property of a particular sub-widget from overflowPropertiesMap.
     */
    getOverflowPropertyValue(subWidget, property) {
      const id = subWidget.getAttribute("sub-widget-id");
      return this.overflowPropertiesMap[id][property];
    }

    /**
     * Helper - Checks if there is currently an overflow condition.
     */
    checkOverflow(element) {
      let currentOverflow = element.style.overflow;
      if (!currentOverflow || currentOverflow === "visible") {
        element.style.overflow = "hidden";
      }
      let isOverflowing = element.clientWidth < element.scrollWidth;
      element.style.overflow = currentOverflow;
      return isOverflowing;
    }

    /**
     * Helper - Receives a list of subWidgets and based on whether there is an overflow or not, move the subWidgets to the overflow menu.
     * Can either process the subWidgets separately or together, this is decided by the processTogether argument, whose default is true.
     */
    handleOverflow(subWidgets, element, processTogether = true) {
      if (processTogether) {
        // If there is currently an overflow, move all elements in the list to the overflow menu.
        if (this.checkOverflow(element)) {
          for (const subWidget of subWidgets) {
            subWidget.classList.add("u-overflown-item");
          }
        }
      } else {
        // As long as there is an overflow, keep moving subWidgets to the overflow menu one by one.
        for (const subWidget of subWidgets) {
          if (this.checkOverflow(element)) {
            subWidget.classList.add("u-overflown-item");
          } else {
            break;
          }
        }
      }
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "div", "", "", [
    new HtmlAttributeChoice(this, "orientation", "u-orientation", ["horizontal", "vertical"], "horizontal", true),
    new HtmlAttributeBoolean(this, "html:hidden", "hidden", false),
    new StyleClass(this, ["u-controlbar"]),
    new this.HandleOverFlowPropertyWorker(this, "widget-resize", false),
    new HtmlAttribute(this, "value", "value", ""),
    new IgnoreProperty(this, "error", "false"),
    new IgnoreProperty(this, "error-message", ""),
    new IgnoreProperty(this, "html:disabled", "false"),
    new IgnoreProperty(this, "html:readonly", "false"),
    new IgnoreProperty(this, "html:minlength"),
    new IgnoreProperty(this, "html:maxlength"),
    new Element(this, "div", "u-start-section", ".u-start-section", [
      new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "subwidgets-start")
    ]),
    new Element(this, "div", "u-center-section", ".u-center-section", [
      new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "subwidgets-center")
    ]),
    new Element(this, "div", "u-end-section", ".u-end-section", [
      new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "subwidgets-end")
    ])
  ]);

  /**
   * Specialized onConnect to specifically manage the control bar's resize behavior,
   * and incorporated event listeners for opening and closing the overflow menu.
   */
  onConnect(widgetElement, objectDefinition) {
    const valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    // Handle horizontal responsive behavior of controlbar based on screen size.
    // Create a ResizeObserver instance.
    const resizeObserver = new window.ResizeObserver(() => {
      this.setProperties({
        "widget-resize": true
      });
    });
    // Observe the controlbar for changes in screen size.
    resizeObserver.observe(widgetElement);

    // Close the select dropdown on scroll.
    widgetElement.addEventListener("scroll", () => {
      // Only one select widget can be kept opened at a time, since opening one will close the others.
      const selectWidgetWithOpenDropDown = widgetElement.querySelector(".u-select.open");
      if (selectWidgetWithOpenDropDown) {
        selectWidgetWithOpenDropDown.open = false;
      }
    });

    return valueUpdaters;
  }

  checkSuffix(property) {
    if (property.endsWith("_overflow-behavior")) {
      return "_overflow-behavior";
    } else if (property.endsWith("_priority")) {
      return "_priority";
    } else {
      return null;
    }
  }

  validateOverflowPropertyValue(property, value) {
    const validOverFlowBehavior = ["hide", "none"];
    const propertyType = this.checkSuffix(property);
    switch (propertyType) {
      case "_priority":
        if (!isNaN(value) && value > 0) {
          return true;
        }
        break;
      case "_overflow-behavior":
        if (validOverFlowBehavior.includes(value)) {
          return true;
        }
        break;
      default:
        break;
    }
    return false;
  }

  getSubWidgetIds() {
    const subWidgets = Object.values(this.subWidgets);
    const subWidgetIds = subWidgets.map((subWidget) => {
      const subWidgetElement = subWidget.elements.widget;
      const subWidgetId = subWidgetElement?.getAttribute("sub-widget-id");
      return subWidgetId;
    });
    return subWidgetIds;
  }

  /**
   * A specialized setProperties method for the controlbar widget to avoid registering
   * "overflow-behavior" and "priority" properties under individual widgets.
   * These properties do not have a dedicated setter, so the method reuses the setter registered for the "widget-resize" property.
   * This specialized implementation validates the properties and invokes the worker's refresh method.
   * @param {UData} data
   */
  setProperties(data) {
    const subWidgetIds = this.getSubWidgetIds();
    const overflowProperties = subWidgetIds.flatMap((subWidget) => [`${subWidget}_${"overflow-behavior"}`, `${subWidget}_${"priority"}`]);
    const subWidgetProperties = subWidgetIds.flatMap((subWidget) => [`${subWidget}_${"widget-class"}`,`${subWidget}_${"delegated-properties"}`]);
    subWidgetProperties.push("subwidgets-start","subwidgets-center","subwidgets-end");
    const setter = Controlbar.setters["widget-resize"][0];
    let invokeRefresh = false;
    for (const property in data) {
      if (overflowProperties.includes(property)) {
        const value = data[property];
        // Use == (iso ===) to check whether both sides of compare refer to the same uniface.RESET object.
        // eslint-disable-next-line eqeqeq, no-undef
        if (value == uniface.RESET) {
          this.data[property] = Controlbar.defaultValues[property] ?? null;
          invokeRefresh = true;
        } else if (this.validateOverflowPropertyValue(property, value)) {
          this.data[property] = value;
          invokeRefresh = true;
        } else {
          this.warn("setProperties", `Property '${property}' is given invalid value '(${value})'`, "Ignored");
        }
        delete data[property];
      }

      if (subWidgetProperties.includes(property)) {
        delete data[property];
      }
    }
    invokeRefresh && setter?.refresh(this);
    super.setProperties(data);
  }
}
