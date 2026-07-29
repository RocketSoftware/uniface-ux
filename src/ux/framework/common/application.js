// @ts-check

/**
 * @module app
 * Manages application-level implementations and settings.
 *
 * This module is the entrypoint for document-wide app behavior.
 * Currently it handles the `<html data-u-color-mode>` setting.
 *
 * Reads the `data-u-color-mode` attribute ("light", "dark", or "auto") from
 * `document.documentElement`, resolves it to a concrete mode, and applies the
 * corresponding Fluent UI `baseLayerLuminance` value directly to the html element.
 * A `MutationObserver` watches for attribute changes so the page reacts
 * whenever the attribute is updated at runtime. When the resolved mode is
 * "auto" a `prefers-color-scheme` media-query listener is also installed
 * so the html luminance follows OS preference changes automatically.
 * Future application-level features can be added here as needed.
 */

import { baseLayerLuminance, StandardLuminance } from "@fluentui/web-components";

/** @type {number} Fluent UI luminance value for dark mode (0 = black, 1 = white). */
const DARK_LUMINANCE = StandardLuminance.DarkMode;

/** @type {MediaQueryList} */
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

/** @type {ResolvedColorMode | null} Last applied resolved mode. */
let lastResolvedMode = null;

/**
 * Resolves the current OS color-scheme preference.
 * @returns {ResolvedColorMode}
 */
function resolveSystemMode() {
  return mediaQuery.matches ? "dark" : "light";
}

/**
 * Dispatches a `color-mode-change` event on `document.documentElement` carrying the resolved mode.
 * @param {ResolvedColorMode} resolvedMode
 */
function dispatchColorModeChange(resolvedMode) {
  document.documentElement.dispatchEvent(new window.CustomEvent("color-mode-change", {
    "bubbles": true,
    "detail": {
      "resolvedMode": resolvedMode
    }
  }));
}

/**
 * Applies `baseLayerLuminance` to `document.documentElement` for the given resolved mode
 * and dispatches a `color-mode-change` event.
 * @param {ResolvedColorMode} resolvedMode
 */
function applyResolvedMode(resolvedMode) {
  if (lastResolvedMode === resolvedMode) {
    return;
  }

  if (resolvedMode === "dark") {
    baseLayerLuminance.setValueFor(document.documentElement, DARK_LUMINANCE);
  } else {
    baseLayerLuminance.deleteValueFor(document.documentElement);
  }

  lastResolvedMode = resolvedMode;
  dispatchColorModeChange(resolvedMode);
}

/**
 * Removes the currently registered auto-mode media-query listener, if any.
 */
function removeAutoListener() {
  mediaQuery.removeEventListener("change", handleAutoModeChange);
}

/**
 * Registers the auto-mode media-query listener when needed.
 */
function addAutoListener() {
  mediaQuery.addEventListener("change", handleAutoModeChange);
}

/**
 * Handles system dark-mode preference changes while in auto mode.
 */
function handleAutoModeChange() {
  applyResolvedMode(resolveSystemMode());
}

/**
 * Applies the given `data-u-color-mode` value to `document.documentElement`.
 * - `"light"` / `"dark"`: applied directly.
 * - `"auto"`: resolved from OS preference; a media-query listener is installed
 *   to re-apply whenever the preference changes.
 * - Empty or invalid value: falls back to light mode.
 * @param {string} mode - Normalized value of the `data-u-color-mode` attribute (lowercase).
 */
function applyMode(mode) {
  switch (mode) {
    case "light":
    case "dark":
      removeAutoListener();
      applyResolvedMode(mode);
      break;
    case "auto":
      addAutoListener();
      applyResolvedMode(resolveSystemMode());
      break;
    default:
      removeAutoListener();
      applyResolvedMode("light");
      break;
  }
}

/**
 * Reads the current `data-u-color-mode` attribute from `document.documentElement` and applies it.
 * - Absent attribute: falls back to light.
 */
function syncColorMode() {
  const mode = (document.documentElement.dataset.uColorMode ?? "light").toLowerCase();
  applyMode(mode);
}

// Apply the initial html data-u-color-mode (if present).
syncColorMode();

// Watch for runtime changes to the `data-u-color-mode` attribute on <html>.
const observer = new window.MutationObserver(syncColorMode);
observer.observe(document.documentElement, {
  "attributes": true,
  "attributeFilter": ["data-u-color-mode"]
});
