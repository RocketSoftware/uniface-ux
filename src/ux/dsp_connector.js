/* global UNIFACE */
export function registerWidgetClass(widgetName, widgetClass) {
  UNIFACE.ClassRegistry.add(widgetName, widgetClass);
}

export function getWidgetClass(widgetName) {
  return UNIFACE.ClassRegistry.get(widgetName);
}
