// @ts-check
import { Widget } from "../framework/common/widget.js";
import { WorkerBase } from "../framework/common/worker_base.js";
import { Element } from "../framework/workers/element.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { PropertyFilter } from "../framework/workers/property_filter.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { getWidgetClass } from "../framework/common/dsp_connector.js";

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

  /**
   * Private Worker: EventOverFlow.
   * Handles the horizontal responsiveness of the controlbar based on overflow-behavior and priority.
   * @class EventOverFlow
   * @extends {WorkerBase}
   */
  static EventOverFlow = class extends WorkerBase {

    /**
     * Creates an instance of EventOverFlow.
     * @param {typeof Widget} widgetClass
     * @param {string} propId
     * @param {UPropValue} defaultValue
     */
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
      const subWidgets = Object.values(widgetInstance.subWidgets);

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
   * Private Worker: This worker generates sub-widgets based on Uniface properties.
   * This worker adds one or more sub-widgets to the widget based on object definitions.
   * This happens once during processLayout and cannot be changed afterwards.
   * The property, of which the name is specified by propId, holds a Uniface list of subWidgetIds which are be added as sub-widgets:
   *   "sub-widget1;sub-widget2;sub-widget3;sub-widget4"
   * For each sub-widget, additional properties need to be available:
   *   - "<subWidgetId>_widget-class" - defines the sub-widget's widget-class as registered with UNIFACE.classRegistry
   *   - "<subWidgetId>_delegated-properties" - defines a list of properties that need to be delegated to the sub-widget;
   *      if not defined nothing will be delegated to the sub-widget.
   * The sub-widgets receive a style-class, of syntax "u-sw-<subWidgetId>", to allow custom styling of the sub-widgets.
   * @export
   * @class SubWidgetsProperty
   * @extends {Element}
   */
  static SubWidgetsProperty = class extends Element {

    /**
     * Creates an instance of SubWidgetsProperty.
     * @param {typeof Widget} widgetClass - Specifies the widget class definition the setter is created for.
     * @param {string} tagName - Specifies the wub-widget's element tag-name.
     * @param {string} styleClass - Specifies the style class for custom styling of the sub-widget.
     * @param {string} elementQuerySelector - Specifies the querySelector to find the sub-widget back.
     * @param {UPropName} propId - specifies the property used to get the ids of the to be added sub-widgets.
     */
    constructor(widgetClass, tagName, styleClass, elementQuerySelector, propId) {
      super(widgetClass, tagName, styleClass, elementQuerySelector);
      this.styleClass = styleClass;
      this.propId = propId;
      this.registerSubWidgetWorker(widgetClass, this);
    }

    /**
     * Generate and return layout for this setter.
     * @param {UObjectDefinition} objectDefinition
     * @returns {Array<HTMLElement>}
     */
    getLayout(objectDefinition) {
      let elements = [];
      let validSubWidgetIds = [];
      let subWidgetIds = objectDefinition.getProperty(this.propId);
      if (subWidgetIds) {
        subWidgetIds.split("")?.forEach((subWidgetId) => {
          let propName = `${subWidgetId}_widget-class`;
          let subWidgetClassName = objectDefinition.getProperty(propName);
          if (subWidgetClassName) {
            let subWidgetClass = getWidgetClass(subWidgetClassName);
            if (subWidgetClass) {
              validSubWidgetIds.push(subWidgetId);
              let element = document.createElement(this.tagName);
              element = subWidgetClass.processLayout(element, objectDefinition);
              let subWidgetStyleClass = `u-sw-${subWidgetId}`;
              element.classList.add(subWidgetStyleClass);
              if (this.styleClass) {
                element.classList.add(this.styleClass);
              }
              element.setAttribute("sub-widget-id", subWidgetId);
              elements.push(element);
            } else {
              this.warn(
                "getLayout",
                `Widget definition with name '${subWidgetClassName}' is not registered.`,
                `Creation of sub-widget '${subWidgetId}'skipped`
              );
            }
          } else {
            this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
          }
        });
      } else {
        this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped");
      }
      // Some sub-widgets might not get created -> update the property.
      objectDefinition.setProperty(this.propId, validSubWidgetIds.join(""));
      return elements;
    }

    /**
     * Collects the subWidget definitions based on the properties and returns them.
     * @param {UObjectDefinition} objectDefinition
     * @returns {object}
     */
    getSubWidgetDefinitions(objectDefinition) {
      let subWidgetDefinitions = {};
      let subWidgetIds = objectDefinition.getProperty(this.propId);
      if (subWidgetIds) {
        subWidgetIds.split("")?.forEach((subWidgetId) => {
          const classNamePropId = `${subWidgetId}_widget-class`;
          const delegatedPropertiesPropId = `${subWidgetId}_delegated-properties`;
          const className = objectDefinition.getProperty(classNamePropId);
          const subWidgetClass = getWidgetClass(className);
          if (subWidgetClass) {
            const delegatedProperties = objectDefinition.getProperty(delegatedPropertiesPropId);
            let subWidgetDefinition = {};
            subWidgetDefinition.class = subWidgetClass;
            subWidgetDefinition.styleClass = `u-sw-${subWidgetId}`;
            subWidgetDefinition.propPrefix = subWidgetId;
            subWidgetDefinition.delegatedProperties = delegatedProperties ? delegatedProperties.split("") : [];
            subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
          }
        });
      }
      return subWidgetDefinitions;
    }
  };

  /**
   * Widget definition.
   */
  // prettier-ignore
  static structure = new Element(this, "div", "", "", [
    new AttributeChoice(this, "orientation", "u-orientation", ["horizontal", "vertical"], "horizontal", true),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new StyleClassManager(this, ["u-controlbar"]),
    new this.EventOverFlow(this, "widget-resize", false),
    new AttributeString(this, "value", "value", ""),
    new AttributeString(this, undefined, "role", "toolbar"),
    new PropertyFilter(this, "error", "false"),
    new PropertyFilter(this, "error-message", ""),
    new PropertyFilter(this, "html:disabled", "false"),
    new PropertyFilter(this, "html:readonly", "false"),
    new PropertyFilter(this, "html:minlength"),
    new PropertyFilter(this, "html:maxlength"),
    new Element(this, "div", "u-start-section", ".u-start-section", [
      new this.SubWidgetsProperty(this, "span", "u-controlbar-item", "", "subwidgets-start")
    ]),
    new Element(this, "div", "u-center-section", ".u-center-section", [
      new this.SubWidgetsProperty(this, "span", "u-controlbar-item", "", "subwidgets-center")
    ]),
    new Element(this, "div", "u-end-section", ".u-end-section", [
      new this.SubWidgetsProperty(this, "span", "u-controlbar-item", "", "subwidgets-end")
    ])
  ]);

  /**
   * Specialized onConnect to specifically manage the control bar's resize behavior,
   * and incorporated event listeners for opening and closing the overflow menu.
   * @param {HTMLElement} widgetElement
   * @param {UObjectDefinition} objectDefinition - reference to the component definitions.
   * @returns {Array<Updater> | undefined | null}
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
        selectWidgetWithOpenDropDown["open"] = false;
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
    const subWidgetProperties = subWidgetIds.flatMap((subWidget) => [`${subWidget}_${"widget-class"}`, `${subWidget}_${"delegated-properties"}`]);
    subWidgetProperties.push("subwidgets-start", "subwidgets-center", "subwidgets-end");
    const setter = Controlbar.setters["widget-resize"][0];
    let invokeRefresh = false;
    for (const property in data) {
      if (overflowProperties.includes(property)) {
        const value = data[property];
        // Use == (iso ===) to check whether both sides of compare refer to the same global uniface.RESET object.
        // eslint-disable-next-line eqeqeq
        if (value == globalThis.uniface.RESET) {
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
