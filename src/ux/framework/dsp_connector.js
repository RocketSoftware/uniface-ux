// @ts-check

/**
 * Register a UX Widget class with a name. For Uniface DSP, the same name needs to be used in the web.ini configuration.
 * @param {string} widgetName - the name to register with.
 * @param {typeof import("./widget.js").Widget} widgetClass - Specifies the Widget class to register.
 */
export function registerWidgetClass(widgetName, widgetClass) {
  globalThis.UNIFACE.ClassRegistry.add(widgetName, widgetClass);
}

/**
 * Get the UX Widget class from the Uniface registry.
 * @param {string} widgetName - the name of the UX widget to get.
 * @returns {typeof import("./widget.js").Widget | undefined} the UX Widget class.
 */
export function getWidgetClass(widgetName) {
  return globalThis.UNIFACE.ClassRegistry.get(widgetName);
}
