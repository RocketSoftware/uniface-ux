// @ts-check
/* global UNIFACE */
import { Widget } from "./widget.js";
import { Element, Worker, StyleClass, SubWidgetsByProperty, HtmlAttributeChoice } from "./workers.js";
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
   * Private Worker: HandleOverFlowWorker.
   * Handles the horizontal responsiveness of the controlbar based on overflow-behavior and priority.
   * @class HandleOverFlowWorker
   * @extends {Worker}
   */
  static HandleOverFlowWorker = class extends Worker {
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
      const properties = widgetInstance.data.properties.uniface;
      const subWidgets = Object.values(widgetInstance?.subWidgets);

      // Create a map of subwidgets with their ids as key and the widgetInstance as value.
      let subWidgetsMap = {};
      // Create a map of for accessing overflow related properties easily. Will be a nested object of the which maps the sub-widget-id of each sub-widget to its overflow-behavior and priority values
      this.overflowPropertiesMap = {};
      // Also create a list of controlbarItems where each item is the corresponding HTML elements.
      let controlBarItems = subWidgets
        .map((subWidget) => {
          const subWidgetElement = this.getElement(subWidget);
          const subWidgetId = subWidgetElement?.getAttribute("sub-widget-id");
          if (subWidgetId) {
            subWidgetsMap[subWidgetId] = subWidget;
            this.overflowPropertiesMap[subWidgetId] = {
              "overflow-behavior": properties[`${subWidgetId}_overflow-behavior`] ?? null,
              "priority": properties[`${subWidgetId}_priority`] ?? null,
              "widget-instance": subWidget
            };
          }
          return subWidgetElement;
        })
        .filter((item) => item);

      // Handle overflow when overflow-behavior is "none".
      const itemsToAlwaysShow = controlBarItems.filter((item) => {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        return overflowBehavior === "none";
      });
      for (let item of itemsToAlwaysShow) {
        this.showControlbarItem(item, overflowMenu);
      }

      // Handle 'menu' overflow-behavior.
      const itemsAlwaysInMenu = controlBarItems.filter((item) => {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        return overflowBehavior === "menu" && !item.hasAttribute("hidden");
      });
      for (const item of itemsAlwaysInMenu) {
        this.moveItemToMenu(item, overflowMenu);
      }

      // Handle 'move' or 'hide' overflow-behavior.
      // The variable priorityMap is used to keep items with same priority together so they can be processed together.
      let priorityMap = {};
      let itemsToHideOrMoveWithNoPriority = [];
      for (const item of controlBarItems) {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        const priority = this.getPropertyValue(item, "priority");
        const isHidden = item.hasAttribute("hidden");
        if (!isHidden && (overflowBehavior === "move" || overflowBehavior === "hide" || overflowBehavior === null)) {
          if (priority) {
            if (priorityMap[priority]) {
              priorityMap[priority].push(item);
            } else {
              priorityMap[priority] = [item];
            }
          } else {
            itemsToHideOrMoveWithNoPriority.push(item);
          }
        }
      }

      let priorityList = Object.keys(priorityMap);
      if (priorityList.length || itemsToHideOrMoveWithNoPriority.length) {
        // Sort in descending order, so that elements with lower priority(higher number) is first.
        priorityList.sort((a, b) => {
          return Number(b) - Number(a);
        });
        // For items with priority not specified, the order in which they should be moved/hidden is the reverse of the order in which they appear in the DOM.
        itemsToHideOrMoveWithNoPriority.reverse();

        // Show all items
        for (const item of itemsToHideOrMoveWithNoPriority.concat(Object.values(priorityMap).flat())) {
          this.showControlbarItem(item, overflowMenu);
        }
        // Check if overflow
        if (this.checkOverflow(element)) {
          // If there is an overflow, the overflow button needs to be displayed, so when checking if there is an overflow the space occupied by the button is also included.
          overflowButton.removeAttribute("hidden");
        }
        // No priority specified means they have the lowest priority and hence should be the first to be moved/hidden.
        this.handleOverflow(itemsToHideOrMoveWithNoPriority, element, overflowMenu, false);
        // Then elements with priority specified will be moved/hidden after in the order of sorted priority.
        for (const priority of priorityList) {
          this.handleOverflow(priorityMap[priority], element, overflowMenu);
        }
      }
      // Show the overflow button if there is at least one visible item in the overflow menu.
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
     * Helper - Returns the value of a given property of a particulat sub-widget.
     * Only useful for properties of the format "[sub-widget-id]_[property-name]".
     */
    getPropertyValue(item, property) {
      const id = item.getAttribute("sub-widget-id");
      return this.overflowPropertiesMap[id][property];
    }

    /**
     * Helper - Hide the item in the controlbar and show the corresponding item in the overflow-menu.
     * The items passed to this method can have overflow behavior hide, move or null.
     * Except for hide, rest should be moved to overflow-menu.
     */
    moveItemToMenu(item, overflowMenu) {
      item.classList.add("u-overflown-item");
      const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
      if (overflowBehavior !== "hide") {
        const subWidgetId = item.getAttribute("sub-widget-id");
        const menuItem = overflowMenu.querySelector(`[item-id="${subWidgetId}"]`);
        menuItem.removeAttribute("hidden");
        const value = this.overflowPropertiesMap[subWidgetId]["widget-instance"].getMenuItem();
        this.appendIconAndTextInMenuItem(menuItem, value);
      }
    }

    /**
     * Helper - Hide the item in the overflow menu and show the corresponding item in the controlbar.
     */
    showControlbarItem(item, overflowMenu) {
      item.classList.remove("u-overflown-item");
      const subWidgetId = item.getAttribute("sub-widget-id");
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
     * Helper - Receives a list of items and based on whether there is an overflow or not, move the items to the overflow menu.
     * Can either process the items separately or together, this is decided by the processTogether argument, whose default is true.
     */
    handleOverflow(items, element, overflowMenu, processTogether = true) {
      if (processTogether) {
        // If there is currently an overflow, move all elements in the list to the overflow menu.
        if (this.checkOverflow(element)) {
          for (const item of items) {
            this.moveItemToMenu(item, overflowMenu);
          }
        }
      } else {
        // As long as there is an overflow, keep moving items to the overflow menu one by one.
        for (const item of items) {
          if (this.checkOverflow(element)) {
            this.moveItemToMenu(item, overflowMenu);
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
      element.innerHTML = "";
      if (value.isNotSupported) {
        element.classList.add("u-not-supported");
      }
      if (value.primaryPlainText) {
        let textElement = document.createElement("span");
        textElement.innerText = value.primaryPlainText;
        element.appendChild(textElement);
      } else if (value.primaryHtmlText) {
        let textElement = document.createElement("span");
        textElement.innerHTML = value.primaryHtmlText;
        element.appendChild(textElement);
      }
      if (value.secondaryPlainText) {
        let textElement = document.createElement("span");
        textElement.classList.add("u-suffix");
        textElement.innerText = value.secondaryPlainText;
        element.appendChild(textElement);
      }
      if (value.errorMessage) {
        element.classList.add("u-invalid");
        let iconElement = document.createElement("span");
        iconElement.classList.add(`u-suffix`, "ms-Icon", `ms-Icon--AlertSolid`);
        iconElement.setAttribute("title", value.errorMessage);
        element.appendChild(iconElement);
      }

      if (value.prefixIcon) {
        let iconElement = document.createElement("span");
        iconElement.classList.add(`u-prefix`, "ms-Icon", `ms-Icon--${value.prefixIcon}`);
        element.insertBefore(iconElement, element.firstChild);
      } else if (value.prefixText) {
        let textElement = document.createElement("span");
        textElement.innerText = value.prefixText;
        textElement.classList.add(`u-prefix`);
        element.insertBefore(textElement, element.firstChild);
      }
      if (value.suffixIcon) {
        let iconElement = document.createElement("span");
        iconElement.classList.add(`u-suffix`, "ms-Icon", `ms-Icon--${value.suffixIcon}`);
        element.appendChild(iconElement);
      } else if (value.suffixText) {
        let textElement = document.createElement("span");
        textElement.innerText = value.suffixText;
        textElement.classList.add(`u-suffix`);
        element.appendChild(textElement);
      }
    }
  };

  /**
   * Widget definition.
   */
  static structure = new Element(
    this,
    "div",
    "",
    "",
    [
      new HtmlAttributeChoice(this, "uniface:orientation", "u-orientation", ["horizontal", "vertical"], "horizontal", true),
      new StyleClass(this, ["u-controlbar"]),
      new this.HandleOverFlowWorker(this, "uniface:widget-resize", false)
    ],
    [
      new Element(
        this,
        "div",
        "u-start-section",
        ".u-start-section",
        [],
        [new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "controls-start")]
      ),
      new Element(
        this,
        "div",
        "u-center-section",
        ".u-center-section",
        [],
        [new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "controls-center")]
      ),
      new Element(
        this,
        "div",
        "u-end-section",
        ".u-end-section",
        [],
        [new SubWidgetsByProperty(this, "span", "u-controlbar-item", "", "controls-end")]
      )
    ]
  );

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

  static createOverflowMenuAndMenuItems(controls) {
    // Create the overflowMenu.
    const overflowMenu = document.createElement("fluent-menu");
    overflowMenu.classList.add("u-overflow-menu");
    overflowMenu.classList.add("u-menu");
    overflowMenu.hidden = true;
    for (const item of controls) {
      const controlId = item.getAttribute("sub-widget-id");
      const menuItem = document.createElement("fluent-menu-item");
      menuItem.classList.add("u-menu-item");
      menuItem.setAttribute("role", "menuitem");
      menuItem.setAttribute("item-id", controlId);
      menuItem.hidden = true;
      overflowMenu.append(menuItem);
    }
    return overflowMenu;
  }

  onConnect(widgetElement, objectDefinition) {
    const valueUpdaters = super.onConnect(widgetElement, objectDefinition);

    // Handle horizontal responsive behavior of controlbar based on screen size.
    // Create a ResizeObserver instance.
    const ro = new window.ResizeObserver(() => {
      this.setProperties({
        "uniface": {
          "widget-resize": true
        }
      });
    });
    // Observe the controlbar for changes in screen size.
    ro.observe(widgetElement);

    this.elements.overflowButton = this.elements.widget.querySelector(".u-overflow-button");
    this.elements.overflowMenu = this.elements.widget.querySelector(".u-overflow-menu");

    // Hide the menu on clicking outside.
    document.addEventListener("click", (event) => {
      if (!this.elements.overflowMenu.contains(event.target) && !this.elements.overflowButton.contains(event.target)) {
        this.elements.overflowMenu.setAttribute("hidden", true);
      }
    });

    this.elements.overflowContainer = this.elements.widget.querySelector(".u-overflow-container");
    this.elements.overflowMenuItems = Array.from(widgetElement.querySelectorAll(".u-overflow-container .u-menu-item"));
    this.elements.controlbarItems = Array.from(widgetElement.querySelectorAll(":scope > :not(.u-overflow-container) > *"));
    return valueUpdaters;
  }

  static processLayout(skeletonWidgetElement, objectDefinition) {
    let widgetElement = super.processLayout(skeletonWidgetElement, objectDefinition);

    // Create overflow container.
    const overflowContainer = Controlbar.createOverflowContainer();
    // Create overflow button.
    const overflowButton = Controlbar.createOverflowButton();
    const subWidgets = widgetElement.querySelectorAll(":scope > * > *");
    // Create overflow menu and menu items.
    const overflowMenu = Controlbar.createOverflowMenuAndMenuItems(subWidgets);
    overflowButton.addEventListener("click", () => {
      overflowMenu.hidden = !overflowMenu.hidden;
    });
    // Add overflow button to overflow menu and overflow menu to overflow container.
    overflowContainer.append(overflowButton);
    overflowContainer.append(overflowMenu);
    // Add overflow container to the widget element.
    widgetElement.append(overflowContainer);

    return widgetElement;
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

  validatePropertyValue(property, value) {
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

  setProperties(data) {
    const subWidgetIds = this.getSubWidgetIds();
    const overflowProperties = subWidgetIds.flatMap((item) => [`${item}_${"overflow-behavior"}`, `${item}_${"priority"}`]);
    const unifaceProperties = data.uniface ?? {};
    const setter = Controlbar.setters["uniface"]["widget-resize"][0];
    let invokeRefresh = false;
    for (const property in unifaceProperties) {
      if (overflowProperties.includes(property)) {
        const value = unifaceProperties[property];
        // Use == (iso ===) to check whether both sides of compare refer to the same uniface.RESET object.
        // eslint-disable-next-line eqeqeq, no-undef
        if (value == uniface.RESET) {
          this.data.properties.uniface[property] = Controlbar.defaultValues.uniface[property] ?? null;
          invokeRefresh = true;
        } else if (this.validatePropertyValue(property, value)) {
          this.data.properties.uniface[property] = value;
          invokeRefresh = true;
        } else {
          this.warn("setProperties", `Property '${property}' is given invalid value '(${value})'`, "Ignored");
        }
        delete data.uniface[property];
      }
    }
    invokeRefresh && setter?.refresh(this);
    super.setProperties(data);
  }
}
UNIFACE.ClassRegistry.add("UX.Controlbar", Controlbar);
