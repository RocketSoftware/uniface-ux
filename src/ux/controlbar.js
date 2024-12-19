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
      this.handleOverflow(widgetInstance);
    }

    /**
     * Helper - Handles the horizontal responsiveness of the controlbar based on overflow-behavior and priority.
     */
    handleOverflow(widgetInstance) {
      const element = this.getElement(widgetInstance);
      const overflowMenu = widgetInstance.elements.overflowMenu;
      const widget = widgetInstance.elements.widget;
      const properties = widgetInstance.data.properties.uniface;

      // Create a map of subwidgets with their ids as key and the widgetInstance as value.
      // Also create a list of controlbarItems where each item is the corresponding HTML elements.
      let subWidgetsMap = {};
      const subWidgets = Object.values(widgetInstance?.subWidgets);
      this.overflowPropertiesMap = {};
      let controlBarItems = subWidgets
        .map((subWidget) => {
          const subWidgetElement = this.getElement(subWidget);
          const subWidgetId = subWidgetElement?.getAttribute("sub-widget-id");
          if (subWidgetId) {
            subWidgetsMap[subWidgetId] = subWidget;
            this.overflowPropertiesMap[subWidgetId] = {
              "overflow-behavior": this.validatePropertyValue("overflow-behavior", properties[`${subWidgetId}_overflow-behavior`]),
              "priority": this.validatePropertyValue("priority", properties[`${subWidgetId}_priority`])
            };
          }
          return subWidgetElement;
        })
        .filter((item) => item);

      let contentWidth = 0;
      // Handle overflow when overflow-behavior is "none".
      const itemsToAlwaysShow = controlBarItems.filter((item) => {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        return overflowBehavior === "none";
      });
      for (let item of itemsToAlwaysShow) {
        if (!item.hasAttribute("hidden")) {
          const itemWidth = this.getItemWidth(item);
          contentWidth += itemWidth;
        }
        item.removeAttribute("overflown-item");
      }

      // Handle 'menu' overflow-behavior.
      const itemsAlwaysInMenu = controlBarItems.filter((item) => {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        return overflowBehavior === "menu" && !item.hasAttribute("hidden");
      });
      this.moveControlBarItemsToMenu(itemsAlwaysInMenu, overflowMenu, subWidgetsMap);

      // Handle 'move' or 'hide' overflow-behavior.
      const itemsToHideOrMove = controlBarItems.filter((item) => {
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        const isHidden = item.hasAttribute("hidden");
        return !isHidden && (overflowBehavior === "move" || overflowBehavior === "hide" || overflowBehavior === null);
      });
      if (!itemsToHideOrMove.length) {
        return;
      }
      itemsToHideOrMove.sort((a, b) => {
        const valueA = Number(this.getPropertyValue(a, "priority"));
        const valueB = Number(this.getPropertyValue(b, "priority"));
        return valueA - valueB;
      });

      // Get the width of the controlbar items.
      const controlbarWidth = this.getItemInnerWidth(widget);
      const allContentWidth = this.getItemsWidth(widget, widgetInstance.elements.overflowButton);

      // Check if there is an overflow condition when all menu items without hidden property are shown.
      // If there is calculate the index of the item which can cause overflow and show all items in the sorted list with index
      // less than said index and hide the rest from menu and instead show them as menu items.
      if (allContentWidth > controlbarWidth) {
        const indexToBreak = this.findItemsToHide(controlbarWidth, widgetInstance.elements.overflowButton, itemsToHideOrMove, contentWidth);
        this.showControlbarItems(itemsToHideOrMove.slice(0, indexToBreak), overflowMenu);
        this.moveControlBarItemsToMenu(itemsToHideOrMove.slice(indexToBreak, itemsToHideOrMove.length), overflowMenu, subWidgetsMap);
      } else {
        this.showControlbarItems(itemsToHideOrMove, overflowMenu);
      }

      // Show the overflow button if there is at least one visible item in the overflow menu.
      if (element.querySelector(".u-overflow-menu .u-menu-item:not([hidden])")) {
        widget.classList.add("u-overflowed");
        widgetInstance.elements.overflowButton.removeAttribute("hidden");
        widgetInstance.elements.overflowContainer.removeAttribute("hidden");
      } else {
        widget.classList.remove("u-overflowed");
        widgetInstance.elements.overflowButton.hidden = true;
        overflowMenu.hidden = true;
        widgetInstance.elements.overflowContainer.hidden = true;
      }
    }

    getPropertyValue(item, property) {
      const id = item.getAttribute("sub-widget-id");
      return this.overflowPropertiesMap[id][property];
    }

    validatePropertyValue(property, value) {
      const validOverFlowBehavior = ["move", "hide", "menu", "none"];
      switch (property) {
        case "priority":
          if (!isNaN(value) && value > 0) {
            return value;
          }
          break;
        case "overflow-behavior":
          if (validOverFlowBehavior.includes(value)) {
            return value;
          }
          break;
        default:
          break;
      }
      return null;
    }

    /**
     * Helper - Find the index of the element at which the controlbar items starts to overflow.
     * It takes 4 arguments, the inner width of the controlbar, the overflowButton item, the width taken up by items that are always
     * present it the controlbar.
     * The remaining available width is calculated and the index of the item which will result in overflow in returned.
     */
    findItemsToHide(controlbarWidth, overflowButton, itemsToHideOrMove, contentWidth) {
      let availableSpace = controlbarWidth - contentWidth - this.getItemWidth(overflowButton);
      let indexToBreak = itemsToHideOrMove.length;
      for (let index = 0; index < itemsToHideOrMove.length; index++) {
        let item = itemsToHideOrMove[index];
        const itemWidth = this.getItemWidth(item);
        availableSpace -= itemWidth;
        if (availableSpace < 0) {
          indexToBreak = index;
          break;
        }
      }
      if (indexToBreak < itemsToHideOrMove.length) {
        const overFlowIndex = this.getPropertyValue(itemsToHideOrMove[indexToBreak], "priority");
        let index = indexToBreak - 1;
        while (index >= 0) {
          const prevOverFlowIndex = this.getPropertyValue(itemsToHideOrMove[index], "priority");
          if (overFlowIndex === prevOverFlowIndex) {
            indexToBreak = index;
            index--;
          } else {
            break;
          }
        }
      }
      return indexToBreak;
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

    /**
     * Helper - In the case of underflow, show the controlbar items upto a given index.
     * The index is previously calculated, such that showing items upto this index won't result in overflow.
     */
    showControlbarItems(items, overflowMenu) {
      for (const item of items) {
        item.classList.remove("u-overflown-item");
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        if (overflowBehavior === "move" || overflowBehavior === null) {
          const subWidgetId = item.getAttribute("sub-widget-id");
          const menuItem = overflowMenu.querySelector(`[item-id="${subWidgetId}"]`);
          menuItem.setAttribute("hidden", "");
        }
      }
    }

    /**
     * Helper - Hide the items in the controlbar and show the corresponding items in overflow-menu.
     * The items passed to this method can have overflow behavior hide, move or null.
     * Except for hide, rest should be moved to overflow-menu.
     */
    moveControlBarItemsToMenu(items, overflowMenu, subWidgetsMap) {
      for (const item of items) {
        item.classList.add("u-overflown-item");
        const overflowBehavior = this.getPropertyValue(item, "overflow-behavior");
        if (overflowBehavior !== "hide") {
          const subWidgetId = item.getAttribute("sub-widget-id");
          const menuItem = overflowMenu.querySelector(`[item-id="${subWidgetId}"]`);
          menuItem.removeAttribute("hidden");
          const value = subWidgetsMap[subWidgetId].getMenuItem();
          this.appendIconAndTextInMenuItem(menuItem, value);
        }
      }
    }

    /**
     * Helper - Get the total width of all the controlbar items.
     */
    getItemsWidth(widget, overflowButton) {
      let totalWidth = 0;
      const itemsRemaining = Array.from(widget.querySelectorAll(":scope > :not(.u-overflow-container) > :not([hidden])"));
      if (!overflowButton.hasAttribute("hidden")) {
        itemsRemaining.push(overflowButton);
      }
      itemsRemaining.forEach((item) => {
        const itemWidth = this.getItemWidth(item);
        totalWidth += itemWidth;
      });
      return totalWidth;
    }

    /**
     * Helper - Get the inner-width of an element, ie width excluding border, margins and paddings.
     */
    getItemInnerWidth(element) {
      const style = window.getComputedStyle(element);
      const paddingLeft = parseInt(style.paddingLeft);
      const paddingRight = parseInt(style.paddingRight);
      const innerWidth = element.clientWidth - paddingLeft - paddingRight;
      return innerWidth;
    }

    /**
     * Helper - Get the width of a controlbar item.
     */
    getItemWidth(item) {
      let itemWidth = 0;
      const originalDisplay = item.style.display;
      // Temporarily show the item to measure its width
      item.style.display = "block";
      const ItemCSSStyleSet = window.getComputedStyle(item);
      itemWidth = item.offsetWidth + parseFloat(ItemCSSStyleSet.marginInlineStart) + parseFloat(ItemCSSStyleSet.marginInlineEnd);
      // Revert the display property to its original value
      item.style.display = originalDisplay;
      return itemWidth;
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
      menuItem.setAttribute("tabindex", "-1");
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
    super.setProperties(data);
    const subWidgetIds = this.getSubWidgetIds();
    const overflowProperties = subWidgetIds.flatMap((item) => [`${item}_${"overflow-behavior"}`, `${item}_${"priority"}`]);
    const unifaceProperties = data.uniface ?? {};
    const setter = Controlbar.setters["uniface"]["widget-resize"][0];
    for (const property in unifaceProperties) {
      if (overflowProperties.includes(property)) {
        setter?.refresh(this);
      }
    }
  }
}
UNIFACE.ClassRegistry.add("UX.Controlbar", Controlbar);
