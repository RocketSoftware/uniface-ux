// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker_base.js";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { SwatchRGB } from "@microsoft/fast-components";
import { neutralBaseColor, accentBaseColor, baseLayerLuminance } from "@fluentui/web-components";

/**
 * AttributeTheme is a specialized worker that extends WorkerBase.
 * It applies Fluent UI design tokens (neutral color, accent color, luminance) on top of
 * the base dark/light mode. Reacts to "resolved-color-mode" set by AttributeDarkMode
 * to apply theme-specific tokens.
 *
 * Theme config: { light: { neutral?, accent?, luminance? }, dark: { ... } }
 * @export
 * @class AttributeTheme
 * @extends {WorkerBase}
 */
export class AttributeTheme extends WorkerBase {

  /**
   * Creates an instance of AttributeTheme.
   * @param {typeof import("../common/widget.js").Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {Object} theme - Theme configuration: { light: { neutral?, accent?, luminance? }, dark: { ... } }.
   */
  constructor(widgetClass, theme) {
    super(widgetClass);
    this.theme = theme;
  }

  /**
   * Parses a hex color and sets the given design token on the element.
   * @param {HTMLElement} element - Target element.
   * @param {Object} token - Fluent UI design token.
   * @param {string} hexColor - Hex color string (e.g. "#ff0000").
   */
  setColorToken(element, token, hexColor) {
    const parsed = parseColorHexRGB(hexColor);
    if (parsed) {
      token.setValueFor(element, SwatchRGB.from(parsed));
    } else {
      this.warn("setColorToken", `Invalid hex color '${hexColor}'`, "Ignored");
    }
  }

  /**
   * Applies Fluent UI design tokens (neutral, accent, luminance) to an element.
   * @param {HTMLElement} element - Target element.
   * @param {Object} theme - Theme: { neutral?, accent?, luminance? }.
   */
  applyTokens(element, theme) {
    if (!element || !theme) {
      return;
    }

    if (theme.neutral) {
      this.setColorToken(element, neutralBaseColor, theme.neutral);
    } else {
      neutralBaseColor.deleteValueFor(element);
    }

    if (theme.accent) {
      this.setColorToken(element, accentBaseColor, theme.accent);
    } else {
      accentBaseColor.deleteValueFor(element);
    }

    if (typeof theme.luminance === "number") {
      baseLayerLuminance.setValueFor(element, theme.luminance);
    } else {
      baseLayerLuminance.deleteValueFor(element);
    }
  }

  /**
   * Resolves the current color mode from `document.documentElement`'s `data-u-color-mode` attribute.
   * Falls back to "light" when the attribute is absent or unrecognised.
   * When set to "auto" the OS `prefers-color-scheme` preference is used.
   * @returns {ResolvedColorMode} - Resolved color mode: "light" or "dark".
   */
  resolveColorMode() {
    const colorMode = document.documentElement.dataset.uColorMode?.toLowerCase();
    switch (colorMode) {
      case "dark":
      case "light":
        return colorMode;
      case "auto":
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      default:
        return "light";
    }
  }

  /**
   * Initializes the layout element with the default theme tokens.
   * Called from processLayout before the widget is connected to the DOM.
   *
   * Establishes local design token overrides (neutral, accent, luminance) on the
   * section element so that once connected, the element is shielded from inheriting
   * ancestor token values. This prevents a cross-level cycle in FAST's design-token
   * notification system: without local overrides, setting baseColors on a child
   * element causes derived tokens (e.g. inside fluent-select/fluent-listbox) to inherit
   * baseLayerLuminance from a cross-widget ancestor, triggering infinite recomputation
   * (RangeError). By applying tokens here — before DOM insertion — each section element
   * has its own local values and is shielded from ancestor cascades, even when nested
   * inside another layout widget (e.g. CompLayout → HeaderFooter).
   *
   * Also registers a `color-mode-change` listener on `document.documentElement` (dispatched by
   * `app.js`) so tokens are re-applied whenever the resolved color mode changes.
   * @param {HTMLElement} widgetElement - The root widget element.
   */
  initializeLayout(widgetElement) {

    /** @type {HTMLElement|null} */
    let element = widgetElement;
    if (this.elementQuerySelector) {
      element = widgetElement.querySelector(this.elementQuerySelector);
    }

    if (!element) {
      return;
    }

    // Apply tokens for the current resolved mode.
    this.applyTokens(element, this.theme[this.resolveColorMode()]);

    // Re-apply tokens whenever the document color mode changes.
    document.documentElement.addEventListener("color-mode-change", (e) => {
      const resolvedMode = /** @type {CustomEvent} */ (e).detail?.resolvedMode;
      if (resolvedMode === "light" || resolvedMode === "dark") {
        this.applyTokens(element, this.theme[resolvedMode]);
      }
    });
  }
}

