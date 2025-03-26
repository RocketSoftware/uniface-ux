// @ts-check
import { Widget } from "./widget.js";
import {
  Element,
  Worker,
  StyleClass,
  SubWidgetsByProperty,
  HtmlAttributeChoice,
  HtmlAttributeBoolean,
  HtmlSubWidgetValueWorker
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
      const widget = widgetInstance.elements.widget;
      const overflowMenu = widgetInstance.elements.overflowMenu;
      const overflowButton = widgetInstance.elements.overflowButton;
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
        return overflowBehavior === "none";
      });
      for (let subWidget of subWidgetsToAlwaysShow) {
        this.showControlbarSubwidget(subWidget, overflowMenu);
      }

      // Handle "menu" overflow-behavior.
      const subWidgetsAlwaysInMenu = controlbarSubWidgets.filter((subWidget) => {
        const overflowBehavior = this.getOverflowPropertyValue(subWidget, "overflow-behavior");
        return overflowBehavior === "menu" && !subWidget.hasAttribute("hidden");
      });
      for (const subWidget of subWidgetsAlwaysInMenu) {
        this.moveItemToMenu(subWidget, overflowMenu);
      }

      // Handle "move" or "hide" overflow-behavior.
      // The variable priorityMap is used to keep subWidgets with same priority together so they can be processed together.
      let priorityMap = {};
      let subWidgetsToHideOrMoveWithNoPriority = [];
      for (const subWidget of controlbarSubWidgets) {
        const overflowBehavior = this.getOverflowPropertyValue(subWidget, "overflow-behavior");
        const priority = this.getOverflowPropertyValue(subWidget, "priority");
        const isHidden = subWidget.hasAttribute("hidden");
        if (!isHidden && (overflowBehavior === "move" || overflowBehavior === "hide" || overflowBehavior === null)) {
          if (priority) {
            if (priorityMap[priority]) {
              priorityMap[priority].push(subWidget);
            } else {
              priorityMap[priority] = [subWidget];
            }
          } else {
            subWidgetsToHideOrMoveWithNoPriority.push(subWidget);
          }
        }
      }

      let priorityList = Object.keys(priorityMap);
      if (priorityList.length || subWidgetsToHideOrMoveWithNoPriority.length) {
        // Sort in descending order, so that elements with lower priority(higher number) is first.
        priorityList.sort((a, b) => {
          return Number(b) - Number(a);
        });
        // For subWidgets with priority not specified, the order in which they should be moved/hidden is the reverse of the order in which they appear in the DOM.
        subWidgetsToHideOrMoveWithNoPriority.reverse();

        // Show all items.
        for (const subWidget of subWidgetsToHideOrMoveWithNoPriority.concat(Object.values(priorityMap).flat())) {
          this.showControlbarSubwidget(subWidget, overflowMenu);
        }
        // Check if overflow.
        if (this.checkOverflow(element)) {
          // If there is an overflow, the overflow button needs to be displayed, so when checking if there is an overflow the space occupied by the button is also included.
          overflowButton.removeAttribute("hidden");
        }
        // No priority specified means they have the lowest priority and hence should be the first to be moved/hidden.
        this.handleOverflow(subWidgetsToHideOrMoveWithNoPriority, element, overflowMenu, false);
        // Then elements with priority specified will be moved/hidden after in the order of sorted priority.
        for (const priority of priorityList) {
          this.handleOverflow(priorityMap[priority], element, overflowMenu);
        }
      }
      // Show the overflow button if there is at least one visible subWidget in the overflow menu.
      if (element.querySelector(".u-overflow-menu .u-menu-item:not([hidden])")) {
        widget.classList.add("u-overflowed");
        overflowButton.removeAttribute("hidden");
        widgetInstance.elements.overflowContainer.removeAttribute("hidden");
      } else {
        widget.classList.remove("u-overflowed");
        overflowButton.hidden = true;
        overflowMenu.hidden = true;
        widgetInstance.elements.overflowContainer.hidden = true;
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
     * Helper - Hide the subWidget in the controlbar and show the corresponding subWidget in the overflow-menu.
     * The subWidgets passed to this method can have overflow behavior hide, move or null.
     * Except for hide, rest should be moved to overflow-menu.
     */
    moveItemToMenu(subWidget, overflowMenu) {
      subWidget.classList.add("u-overflown-item");
      const overflowBehavior = this.getOverflowPropertyValue(subWidget, "overflow-behavior");
      if (overflowBehavior !== "hide") {
        const subWidgetId = subWidget.getAttribute("sub-widget-id");
        const menuItem = overflowMenu.querySelector(`[item-id="${subWidgetId}"]`);
        menuItem.removeAttribute("hidden");
        const widgetClass = this.overflowPropertiesMap[subWidgetId]["widget-class"];
        const value = this.overflowPropertiesMap[subWidgetId]["widget-instance"].getMenuItem(widgetClass);
        this.appendIconAndTextInMenuItem(menuItem, value);
      }
    }

    /**
     * Helper - Hide the subWidget in the overflow menu and show the corresponding subWidget in the controlbar.
     */
    showControlbarSubwidget(subWidget, overflowMenu) {
      subWidget.classList.remove("u-overflown-item");
      const subWidgetId = subWidget.getAttribute("sub-widget-id");
      const menuItem = overflowMenu.querySelector(`[item-id="${subWidgetId}"]`);
      menuItem.setAttribute("hidden", "");
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
    handleOverflow(subWidgets, element, overflowMenu, processTogether = true) {
      if (processTogether) {
        // If there is currently an overflow, move all elements in the list to the overflow menu.
        if (this.checkOverflow(element)) {
          for (const subWidget of subWidgets) {
            this.moveItemToMenu(subWidget, overflowMenu);
          }
        }
      } else {
        // As long as there is an overflow, keep moving subWidgets to the overflow menu one by one.
        for (const subWidget of subWidgets) {
          if (this.checkOverflow(element)) {
            this.moveItemToMenu(subWidget, overflowMenu);
          } else {
            break;
          }
        }
      }
    }

    /**
     * Helper - Set the value of the menu item by appending the text and icon element if it's available.
     */
    appendIconAndTextInMenuItem(element, value) {
      // Clear the element's content.
      element.innerHTML = "";

      // Helper function to create and append elements.
      const createElement = (tag, classNames = [], text = "", isHTML = false) => {
        const el = document.createElement(tag);
        if (classNames.length) {
          el.classList.add(...classNames);
        }
        if (isHTML) {
          el.innerHTML = text;
        } else {
          el.innerText = text;
        }
        return el;
      };

      // Handle not supported state.
      if (value.isNotSupported) {
        element.classList.add("u-not-supported");
      }

      // Append primary text (plain or HTML).
      if (value.primaryPlainText) {
        element.appendChild(createElement("span", [], value.primaryPlainText));
      } else if (value.primaryHtmlText) {
        element.appendChild(createElement("span", [], value.primaryHtmlText, true));
      }

      // Append secondary text.
      if (value.secondaryPlainText) {
        element.appendChild(createElement("span", ["u-suffix"], value.secondaryPlainText));
      }

      // Handle error state.
      if (value.errorMessage) {
        element.classList.add("u-invalid");
        element.appendChild(
          createElement("span", ["u-suffix", "ms-Icon", "ms-Icon--AlertSolid"], "")
            .setAttribute("title", value.errorMessage)
        );
      }

      // Append prefix icon or text.
      if (value.prefixIcon) {
        element.insertBefore(
          createElement("span", ["u-prefix", "ms-Icon", `ms-Icon--${value.prefixIcon}`]),
          element.firstChild
        );
      } else if (value.prefixText) {
        element.insertBefore(
          createElement("span", ["u-prefix"], value.prefixText),
          element.firstChild
        );
      }

      // Append suffix icon or text.
      if (value.suffixIcon) {
        element.appendChild(
          createElement("span", ["u-suffix", "ms-Icon", `ms-Icon--${value.suffixIcon}`])
        );
      } else if (value.suffixText) {
        element.appendChild(
          createElement("span", ["u-suffix"], value.suffixText)
        );
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
    new HtmlSubWidgetValueWorker(this, "value", "value", null),
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
   * Specialized processLayout method to create and append overflow container inside widget element.
   */
  static processLayout(skeletonWidgetElement, objectDefinition) {
    let widgetElement = super.processLayout(skeletonWidgetElement, objectDefinition);

    // Create overflow container.
    const overflowContainer = this.createOverflowContainer();
    // Create overflow button.
    const overflowButton = this.createOverflowButton();
    const subWidgets = widgetElement.querySelectorAll(".u-controlbar-item");
    // Create overflow menu and menu items.
    const overflowMenu = this.createOverflowMenuAndMenuItems(subWidgets);
    // Add overflow button to overflow menu and overflow menu to overflow container.
    overflowContainer.append(overflowButton);
    overflowContainer.append(overflowMenu);
    // Add overflow container to the widget element.
    widgetElement.append(overflowContainer);

    return widgetElement;
  }

  hideMenu() {
    this.elements.overflowMenu.hidden = true;
  }

  /**
   * Specialized onConnect to specifically manage the control bar's resize behavior,
   * and incorporated event listeners for opening and closing the overflow menu.
   */
  onConnect(widgetElement, objectDefinition) {
    const valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    // Handle horizontal responsive behavior of controlbar based on screen size.
    // Create a ResizeObserver instance.
    const resizeObserver = new window.ResizeObserver(() => {
      this.hideMenu();
      this.setProperties({
        "widget-resize": true
      });
    });
    // Observe the controlbar for changes in screen size.
    resizeObserver.observe(widgetElement);

    this.elements.overflowButton = this.elements.widget.querySelector(".u-overflow-button");
    this.elements.overflowMenu = this.elements.widget.querySelector(".u-overflow-menu");

    // Show or hide the overflow menu by clicking the overflow menu button.
    this.elements.overflowButton.addEventListener("click", () => {
      this.elements.overflowMenu.hidden = !this.elements.overflowMenu.hidden;
    });

    // Hide the menu on clicking outside.
    document.addEventListener("click", (event) => {
      if (!this.elements.overflowMenu.contains(event.target) && !this.elements.overflowButton.contains(event.target)) {
        this.hideMenu();
      }
    });

    // Hide the menu on scroll.
    widgetElement.addEventListener("scroll", () => {
      this.hideMenu();
      // Close any open select widget.
      // Only one can be kept opened at a time, since opening one will close the others.
      const selectWidgetWithOpenDropDown = widgetElement.querySelector(".u-select.open");
      if (selectWidgetWithOpenDropDown) {
        selectWidgetWithOpenDropDown.open = false;
      }
    });

    this.elements.overflowContainer = this.elements.widget.querySelector(".u-overflow-container");
    this.elements.overflowMenuItems = Array.from(widgetElement.querySelectorAll(".u-overflow-container .u-menu-item"));
    this.elements.controlbarSubWidgets = Array.from(widgetElement.querySelectorAll(".u-controlbar-item"));
    return valueUpdaters;
  }

  static createOverflowContainer() {
    // Create the overflowContainer.
    const overflowContainer = document.createElement("div");
    overflowContainer.classList.add("u-overflow-container");
    overflowContainer.setAttribute("slot", "end");
    overflowContainer.hidden = true;
    return overflowContainer;
  }

  static createOverflowButton() {
    // Create the overflowButton.
    const overflowButton = document.createElement("fluent-button");
    overflowButton.textContent = "...";
    overflowButton.classList.add("u-overflow-button");
    overflowButton.hidden = true;
    return overflowButton;
  }

  static createOverflowMenuAndMenuItems(subWidgets) {
    // Create the overflowMenu.
    const overflowMenu = document.createElement("fluent-menu");
    overflowMenu.classList.add("u-overflow-menu");
    overflowMenu.classList.add("u-menu");
    overflowMenu.hidden = true;
    for (const item of subWidgets) {
      const subWidgetsId = item.getAttribute("sub-widget-id");
      const menuItem = document.createElement("fluent-menu-item");
      menuItem.classList.add("u-menu-item");
      menuItem.setAttribute("role", "menuitem");
      menuItem.setAttribute("item-id", subWidgetsId);
      menuItem.hidden = true;
      overflowMenu.append(menuItem);
    }
    return overflowMenu;
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
    const validOverFlowBehavior = ["move", "hide", "menu", "none"];
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
    }
    invokeRefresh && setter?.refresh(this);
    super.setProperties(data);
  }
}
