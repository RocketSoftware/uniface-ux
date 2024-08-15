// @ts-check

import { Widget_UXWF } from "./widget_UXWF.js"; // eslint-disable-line no-unused-vars
import { Worker } from "./workers_UXWF.js"; // eslint-disable-line no-unused-vars
/**
 * UX Widget generic helper functions.
 * @export
 * @class Base_UXWF
 */
export class Base_UXWF {
  constructor() {}

  /**
   * This method registers the worker that Uniface calls to update the widget caused by a property change.
   * Per property, one worker needs to be registered.
   * dataInit() and dataUpdate() call this worker (via setProperties()) to make the widget react to the property change.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget-class for which the worker will be registered.
   * @param {UPropName} propId - Specifies the property-id for which the worker will be registered.
   * @param {Worker} worker - Specified the worker.
   */
  registerSetter(widgetClass, propId, worker) {
    let pos = propId.search(":");
    if (pos > 0) {
      let prefix = propId.substring(0, pos);
      propId = propId.substring(pos + 1);
      if (!widgetClass.setters[prefix]) {
        widgetClass.setters[prefix] = {};
      }
      if (!widgetClass.setters[prefix][propId]) {
        widgetClass.setters[prefix][propId] = [];
      }
      widgetClass.setters[prefix][propId].push(worker);
    } else {
      if (!widgetClass.setters[propId]) {
        widgetClass.setters[propId] = [];
      }
      widgetClass.setters[propId].push(worker);
    }
  }

  /**
   * This method registers the worker that Uniface calls to get information about getting the value of a property value.
   * Per property, one worker needs to be registered. Currently, only the 'value' property can be registered.
   * onConnect() calls the worker to get the updater information, which describes the events fired when the value has been changed.
   * getValue() calls this worker to get the value of the 'field' property.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget-class for which the worker will be registered.
   * @param {UPropName} propId - Specifies the property-id for which the worker will be registered.
   * @param {Worker} worker - Specifies the worker.
   */
  registerGetter(widgetClass, propId, worker) {
    let pos = propId.search(":");
    if (pos > 0) {
      let prefix = propId.substring(0, pos);
      propId = propId.substring(pos + 1);
      if (!widgetClass.getters[prefix]) {
        widgetClass.getters[prefix] = {};
      }
      widgetClass.getters[prefix][propId] = worker;
    } else {
      widgetClass.getters[propId] = worker;
    }
  }

  /**
   * This method registers a default value for a property.
   * Per property, one default value needs to be registered.
   * dataInit() uses the set of default values to reinitialize the widget for reuse.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget-class for which the default value will be registered.
   * @param {UPropName} propId - Specifies the property-id for which the default value will be registered.
   * @param {UPropValue} defaultValue - Specifies the default value.
   */
  registerDefaultValue(widgetClass, propId, defaultValue) {
    let node = widgetClass.defaultValues;
    let ids = propId.split(":");
    let i;
    for (i = 0; i < ids.length - 1; i++) {
      if (node[ids[i]] === undefined) {
        node[ids[i]] = {};
      }
      node = node[ids[i]];
    }
    node[ids[i]] = defaultValue;
  }

  /**
   * This method registers the worker that Uniface calls to get a trigger-mapping.
   * Per trigger-mapping, one worker needs to be registered.
   * mapTrigger() calls this worker to get the trigger-mapping.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget-class for which the worker will be registered.
   * @param {String} triggerName - Specifies the trigger-name for which the worker will be registered.
   * @param {Worker} worker - Specifies the worker.
   */
  registerTrigger(widgetClass, triggerName, worker) {
    widgetClass.triggers[triggerName] = worker;
  }

  /**
   * This method registers static sub-widget information.
   * Static sub-widgets are defined as part of widget structure.
   * Static sub-widgets are added to the widget instance at runtime.
   * The UXWF deals with sub-widgets transparently, like generate their layouts, instantiate them, invoke their onConnect
   * get their value, map their triggers, update their properties, etc.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} subWidgetId
   * @param {typeof Widget_UXWF} subWidgetClass
   * @param {String} subWidgetStyleClass
   * @param {Array} subWidgetTriggers
   */
  registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) {
    widgetClass.subWidgets[subWidgetId] = {
      "class": subWidgetClass,
      "styleClass": subWidgetStyleClass,
      "triggers": subWidgetTriggers,
    };
  }

  /**
   * This method registers the worker that Uniface calls to handle dynamic sub-widgets.
   * Dynamic sub-widgets are added to the widget at runtime based on object definitions.
   * Each worker generates sub-widgets based on a unique algorithm.
   * Uniface iterates through all registered workers and adds their sub-widgets to the widget object at runtime.
   * The UXWF deals with sub-widgets transparently, like generate their layouts, instantiate them, invoke their onConnect
   * get their value, map their triggers, update their properties, etc.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget-class for which the worker will be registered.
   * @param {*} worker - Specifies the worker.
   */
  // @ts-ignore
  registerSubWidgetWorker(widgetClass, worker) {
    widgetClass.subWidgetWorkers.push(worker);
  }

  getNode(node, url) {
    if (url) {
      url = url.split(":");
      url.forEach((key) => {
        node = node[key];
      });
      return node;
    } else {
      return undefined;
    }
  }

  /**
   * Convert Uniface property values into JS Boolean.
   * @param {String|boolean|number} value
   * @return {boolean}
   */
  toBoolean(value) {
    let result = false;
    switch (typeof value) {
      case "boolean":
        result = value;
        break;
      case "string":
        value = value.toUpperCase();
        if (
          value.substring(0, 1) === "1" ||
          value.substring(0, 1) === "T" ||
          value.substring(0, 1) === "Y" ||
          value.substring(0, 1) === "J"
        ) {
          result = true;
        }
        break;
      case "number":
        if (value) {
          result = true;
        }
    }
    return result;
  }

  /**
   * Convert Uniface field value to JS Boolean.
   * Throws an error on conversion failure.
   */
  fieldValueToBoolean(value) {
    let type = typeof value;
    switch (type) {
      case "boolean":
        return value;
      case "string":
        value = value.toLowerCase();
        if (["1", "t", "true", "on", "yes"].includes(value)) {
          return true;
        }
        if (["0", "f", "false", "off", "no"].includes(value)) {
          return false;
        }
        break;
      case "number":
        if (value === 1) {
          return true;
        }
        if (value === 0) {
          return false;
        }
        break;
    }
    throw "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.";
  }

  /**
   * Fix dataUpdate data.
   */
  fixData(data) {
    let newData = {};
    Object.keys(data).forEach((key) => {
      if (key === "uniface") {
        Object.keys(data.uniface).forEach((prop) => {
          let propValue = data.uniface[prop];
          let [mainKey, ...subKeys] = prop.split(":");
          if (subKeys.length) {
            newData[mainKey] = newData[mainKey] || {};
            if (subKeys.length > 1) {
              subKeys[0] = subKeys[0] === "class" ? "classes" : subKeys[0];
              newData[mainKey][subKeys[0]] = newData[mainKey][subKeys[0]] || {};
              newData[mainKey][subKeys[0]][subKeys[1]] = propValue;
            } else if (subKeys[0] === "value") {
              newData[mainKey][subKeys[0]] = propValue;
            } else if (subKeys[0] === "valrep") {
              newData[mainKey][subKeys[0]] = this.getFormattedValrep(propValue);
            } else {
              newData[mainKey]["uniface"] = newData[mainKey]["uniface"] || {};
              newData[mainKey]["uniface"][subKeys[0]] = propValue;
            }
          } else if (mainKey === "value") {
            newData[mainKey] = propValue;
          } else if (mainKey === "valrep") {
            newData[mainKey] = this.getFormattedValrep(propValue);
          } else {
            newData["uniface"] = newData["uniface"] || {};
            newData["uniface"][mainKey] = propValue;
          }
        });
      } else {
        newData[key] = data[key];
      }
    });
    return newData;
  }

  /**
   * Converts a string format valrep into [{"value": "representation"},....] format.
   * @param {string} valrep - The valrep string to be formatted.
   * @returns {Array} An array of objects with "value" and "representation" properties.
   */
  getFormattedValrep(valrep) {
    let formattedValrep = [];
    valrep.split("").forEach((keyVal) => {
      // Split each key-value pair by "="
      let [key, val] = keyVal.split("=");
      // Push an object with "value" and "representation" properties to the formattedValrep array.
      formattedValrep.push({
        "value": key,
        "representation": val
      });
    });
    return formattedValrep;
  }

  /**
   * Warning log function.
   * @param {String} functionName
   * @param {String} message
   * @param {String} consequence
   */
  warn(functionName, message, consequence) {
    console.warn(
      `${this.constructor.name}.${functionName}: ${message} - ${consequence}.`
    );
  }

  /**
   * Error log function.
   * @param {String} functionName
   * @param {String} message
   * @param {String} consequence
   */
  error(functionName, message, consequence) {
    console.error(
      `${this.constructor.name}.${functionName}: ${message} - ${consequence}.`
    );
  }
}
