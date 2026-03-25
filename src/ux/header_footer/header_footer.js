import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { AttributeString } from "../framework/workers/attribute_string.js";
import { ChildWidgets } from "../framework/workers/child_widgets.js";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { SwatchRGB } from "@microsoft/fast-components";
import { neutralBaseColor, accentBaseColor, baseLayerLuminance } from "@fluentui/web-components";

/**
 * Generates index rules dynamically for any number of children.
 * Pattern:
 * - 1 child: main[0].
 * - 2 children: header[0], main[1].
 * - 3+ children: header[0], main[1...n-2], footer[n-1].
 *
 * @param {number} n - Number of children
 * @returns {Object} Index rule for n children
 */
function generateIndexRule(n) {
  if (n === 1) {
    return { "main": [0] };
  } else if (n === 2) {
    return {
      "header": [0],
      "main": [1]
    };
  } else {
    // n >= 3: first to header, last to footer, rest to main.
    const mainIndices = [];
    for (let i = 1; i < n - 1; i++) {
      mainIndices.push(i);
    }
    return {
      "header": [0],
      "main": mainIndices,
      "footer": [n - 1]
    };
  }
}

/**
 * Creates a Proxy object that generates index rules on-demand for any child count.
 * @returns {Object} Dynamic index rules object.
 */
function createDynamicIndexRules() {
  // @ts-ignore - Proxy usage for dynamic rule generation.
  return new Proxy({}, {
    get(_target, prop) {
      if (typeof prop === "string") {
        const childCount = parseInt(prop, 10);
        if (!isNaN(childCount) && childCount > 0) {
          return generateIndexRule(childCount);
        }
      }
      return undefined;
    },
    has(_target, prop) {
      if (typeof prop === "string") {
        const childCount = parseInt(prop, 10);
        return !isNaN(childCount) && childCount > 0;
      }
      return false;
    }
  });
}

/**
 * HeaderFooter class for managing a header-main-footer layout structure.
 * Provides features like layout control and child widget assignment.
 * Uses the ChildWidgets API with slot-based distribution.
 * @extends Widget
 */
export class HeaderFooter extends Widget {
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * Slot configuration for child widget distribution.
   * Supports both property-based (area-slot) and index-based assignment.
   *
   * Dynamic index-based assignment pattern for any 'n' children:
   * - 1 child: main section.
   * - 2 children: first → header, second → main.
   * - 3+ children: first → header, last → footer, everything in between → main.
   */
  static #slotConfig = {
    "propertyName": "area-slot",
    "defaultSlot": "main",
    "validSlots": ["header", "main", "footer"],
    "indexRules": createDynamicIndexRules()
  };

  static structure = new Element(
    this,
    "uf-shell",
    "",
    "",
    [
      new StyleClassManager(this, ["u-header-footer"]),

      // Header Section.
      new Element(this, "uf-header", "u-header", ".u-header", [
        new AttributeString(this, undefined, "role", "banner", true),
        new AttributeChoice(this, "header:placement", "placement", ["scroll", "sticky", "hidden"], "sticky", true),
        // Layout controls (aligned with uf-container).
        new AttributeChoice(this, "header:layout-type", "layout-type", ["vertical-scroll", "horizontal-scroll", "vertical-wrap", "horizontal-wrap", "auto"], "horizontal-wrap", true),
        new AttributeChoice(this, "header:horizontal-align", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "space-between", true),
        new AttributeChoice(this, "header:vertical-align", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "center", true),
        new ChildWidgets(this, "div", "header", this.#slotConfig)
      ]),

      // Main Section.
      new Element(this, "uf-main", "u-main", ".u-main", [
        new AttributeString(this, undefined, "role", "main", true),
        // Layout controls (aligned with uf-container).
        new AttributeChoice(this, "main:layout-type", "layout-type", ["vertical-scroll", "horizontal-scroll", "vertical-wrap", "horizontal-wrap", "auto"], "vertical-scroll", true),
        new AttributeChoice(this, "main:horizontal-align", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "start", true),
        new AttributeChoice(this, "main:vertical-align", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "start", true),
        new ChildWidgets(this, "div", "main", this.#slotConfig)
      ]),

      // Footer Section.
      new Element(this, "uf-footer", "u-footer", ".u-footer", [
        new AttributeString(this, undefined, "role", "contentinfo", true),
        new AttributeChoice(this, "footer:placement", "placement", ["scroll", "sticky", "hidden"], "sticky", true),
        // Layout controls (aligned with uf-container).
        new AttributeChoice(this, "footer:layout-type", "layout-type", ["vertical-scroll", "horizontal-scroll", "vertical-wrap", "horizontal-wrap", "auto"], "horizontal-wrap", true),
        new AttributeChoice(this, "footer:horizontal-align", "horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "space-between", true),
        new AttributeChoice(this, "footer:vertical-align", "vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"], "center", true),
        new ChildWidgets(this, "div", "footer", this.#slotConfig)
      ])
    ]
  );

  /**
   * Default theme configuration for HeaderFooter sections.
   * Each section can have its own neutral color, accent color, and luminance.
   */
  static defaultTheme = {
    "header": {
      "neutral": "#0078d4",
      "accent": "#4A9EFF",
      "luminance": 0.23
    },
    "footer": {
      "neutral": "#808080",
      "accent": "#0078d4",
      "luminance": 0.9
    }
  };

  /**
   * Update color palette of an element by setting base design tokens.
   *
   * @param {HTMLElement} element - Target element.
   * @param {string} neutralColor - Neutral base color for neutral palette (background tint).
   * @param {string} accentColor - Accent base color for interactive elements.
   * @param {number} luminance - 0 (dark mode) to 1 (light mode), typically 0.15 for dark, 0.98 for light.
   */
  applyColorPalette(element, neutralColor, accentColor, luminance) {
    const parsedNeutral = parseColorHexRGB(neutralColor);
    const parsedAccent = parseColorHexRGB(accentColor);

    if (parsedNeutral) {
      neutralBaseColor.setValueFor(element, SwatchRGB.from(parsedNeutral));
    }
    if (parsedAccent) {
      accentBaseColor.setValueFor(element, SwatchRGB.from(parsedAccent));
    }
    baseLayerLuminance.setValueFor(element, luminance);
  }

  /**
   * Apply default theme to a HeaderFooter section.
   *
   * @param {HTMLElement} widgetElement - Root widget element.
   * @param {string} sectionName - Section name ('header', 'main', or 'footer').
   */
  applyDefaultTheme(widgetElement, sectionName) {
    const element = widgetElement.querySelector(`:scope > .u-${sectionName}`);
    const theme = HeaderFooter.defaultTheme[sectionName];

    if (element instanceof HTMLElement && theme) {
      this.applyColorPalette(element, theme.neutral, theme.accent, theme.luminance);
    }
  }

  /**
   * Handles intelligent sticky placement for footer that switches between fixed and sticky
   * based on whether content overflows (has scrollbar).
   * Nested HeaderFooter always use sticky positioning (never fixed).
   */
  handleStickyPlacement() {
    const container = this.elements.widget;
    const footer = container.querySelector(":scope > .u-footer");
    const isNested = container.parentElement?.closest(".u-header-footer");

    const updateFooterPlacement = () => {
      if (footer.getAttribute("placement") !== "sticky") {
        // Remove data-behavior when placement is not sticky.
        footer.removeAttribute("data-behavior");
        return;
      }

      // Check if container has enough space to fit on screen without scrolling.
      // If footer is currently fixed, it's removed from document flow, so add its height back
      // to get the true content height for comparison.
      const containerHeight = footer.getAttribute("data-behavior") === "fixed"
        ? parseFloat(window.getComputedStyle(container).height) + parseFloat(window.getComputedStyle(footer).height)
        : parseFloat(window.getComputedStyle(container).height);
      const hasEmptySpace = containerHeight < window.innerHeight;
      const useSticky = isNested || !hasEmptySpace;
      footer.setAttribute("data-behavior", useSticky ? "sticky" : "fixed");
    };

    updateFooterPlacement();

    window.addEventListener("resize", updateFooterPlacement);

    this._mutationObserver = new window.MutationObserver(updateFooterPlacement);
    this._mutationObserver.observe(container, {
      "childList": true,
      "subtree": true
    });
  }

  /**
   * Private Uniface API method - onConnect.
   * Called when the widget connects to the DOM. Applies default theme to all sections and sets up intelligent footer placement behavior.
   */
  onConnect(widgetElement, objectDefinition) {
    let valueUpdaters = super.onConnect(widgetElement, objectDefinition);
    // Apply default theme to all sections.
    this.applyDefaultTheme(widgetElement, "header");
    this.applyDefaultTheme(widgetElement, "footer");
    // Set up intelligent footer placement behavior.
    this.handleStickyPlacement();
    return valueUpdaters;
  }
}
