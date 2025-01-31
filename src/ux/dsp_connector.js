// @ts-check

/**
 * Register a UX Widget class with a name. For Uniface DSP, the same name needs to be used in the web.ini configuration.
 * @param {String} widgetName - the name to register with.
 * @param {Object} widgetClass - Specifies the Widget class to register.
 */
export function registerWidgetClass(widgetName, widgetClass) {
  globalThis.UNIFACE.ClassRegistry.add(widgetName, widgetClass);
}

/**
 * Get the UX Widget class from the Uniface registry.
 * @param {String} widgetName - the name of the UX widget to get.
 * @return {Object | undefined} the UX Widget class.
 */
export function getWidgetClass(widgetName) {
  return globalThis.UNIFACE.ClassRegistry.get(widgetName);
}
