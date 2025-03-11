// @ts-check

import { Widget } from "./widget.js"; // eslint-disable-line no-unused-vars
import { Worker } from "./workers.js"; // eslint-disable-line no-unused-vars

/**
 * UX Widget generic helper functions.
 * @export
 * @class Base
 */
export class Base {

  static formatErrorMessage = "ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.";

  constructor() {}

  /**
   * This method registers the worker that Uniface calls to update the widget caused by a property change.
   * Per property, one worker needs to be registered.
   * dataInit() and dataUpdate() call this worker (via setProperties()) to make the widget react to the property change.
   * @param {typeof Widget} widgetClass - Specifies the widget-class for which the worker will be registered.
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
   * @param {typeof Widget} widgetClass - Specifies the widget-class for which the worker will be registered.
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
   * @param {typeof Widget} widgetClass - Specifies the widget-class for which the default value will be registered.
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
   * @param {typeof Widget} widgetClass - Specifies the widget-class for which the worker will be registered.
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
   * @param {typeof Widget} widgetClass
   * @param {String} subWidgetId
   * @param {typeof Widget} subWidgetClass
   * @param {String} subWidgetStyleClass
   * @param {Array} subWidgetTriggers
   */
  registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) {
    widgetClass.subWidgets[subWidgetId] = {
      "class": subWidgetClass,
      "styleClass": subWidgetStyleClass,
      "triggers": subWidgetTriggers
    };
  }

  /**
   * This method registers the worker that Uniface calls to handle dynamic sub-widgets.
   * Dynamic sub-widgets are added to the widget at runtime based on object definitions.
   * Each worker generates sub-widgets based on a unique algorithm.
   * Uniface iterates through all registered workers and adds their sub-widgets to the widget object at runtime.
   * The UXWF deals with sub-widgets transparently, like generate their layouts, instantiate them, invoke their onConnect
   * get their value, map their triggers, update their properties, etc.
   * @param {typeof Widget} widgetClass - Specifies the widget-class for which the worker will be registered.
   * @param {Worker} worker - Specifies the worker.
   */
  // @ts-ignore
  registerSubWidgetWorker(widgetClass, worker) {
    widgetClass.subWidgetWorkers.push(worker);
  }

  /**
   * Looks up the node within node as specified by propId.
   * @param {UData} node
   * @param {UPropName|undefined} propId
   * @return {Object}
   */
  getNode(node, propId) {
    return Base.getNode(node, propId);
  }

  /**
   * Looks up the node within node as specified by propId.
   * @param {UData} node
   * @param {UPropName|undefined} propId
   * @return {Object}
   */
  static getNode(node, propId) {
    if (propId) {
      let url = propId.split(":");
      for (let i = 0; i < url.length; i++) {
        node = node[url[i]];
        if (node === undefined) {
          return undefined;
        }
      }
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
    return Base.toBoolean(value);
  }

  /**
   * Convert Uniface property values into JS Boolean.
   * @param {String|boolean|number} value
   * @return {boolean}
   */
  static toBoolean(value) {
    let result = false;
    switch (typeof value) {
      case "boolean":
        result = value;
        break;
      case "string":
        value = value.toUpperCase();
        if (value.substring(0, 1) === "1" || value.substring(0, 1) === "T" || value.substring(0, 1) === "Y" || value.substring(0, 1) === "J") {
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
   * @param {any} value
   * @return {Boolean}
   * @throws {*} - Conversion failure.
   */
  fieldValueToBoolean(value) {
    return Base.fieldValueToBoolean(value);
  }

  /**
   * Convert Uniface field value to JS Boolean.
   * @param {any} value
   * @return {Boolean}
   * @throws {*} - Conversion failure.
   */
  static fieldValueToBoolean(value) {
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
    throw this.formatErrorMessage;
  }

  /**
   * Fix properties data.
   * @param {UData} data
   * @return {UData}
   */
  fixData(data) {
    return Base.fixData(data);
  }

  /**
   * Fix properties data.
   * @param {UData} data
   * @return {UData}
   */
  static fixData(data) {
    let newData = {};
    for (let key in data) {
      if (key === "uniface") {
        newData.uniface = newData.uniface || {};
        for (let key in data.uniface) {
          let prefixes = key.split(":");
          if (prefixes.length === 1) {
            newData.uniface[key] = data.uniface[key];
          } else {
            let newDataNode = newData;
            let prefix;
            let i;
            for (i = 0; i < prefixes.length - 1; i++) {
              prefix = prefixes[i];
              let id = prefix === "class" ? "classes" : prefix;
              newDataNode[id] = newDataNode[id] || {};
              newDataNode = newDataNode[id];
            }
            if (prefixes[i] === "valrep") {
              newDataNode[prefixes[i]] = this.getFormattedValrep(data.uniface[key]);
            } else if (prefix === "class") {
              newDataNode[prefixes[i]] = this.toBoolean(data.uniface[key]);
            } else if (prefix === "html" || prefix === "style" || prefixes[i] === "value") {
              newDataNode[prefixes[i]] = data.uniface[key];
            } else {
              newDataNode.uniface = newDataNode.uniface || {};
              newDataNode = newDataNode.uniface[prefixes[i]] = data.uniface[key];
            }
          }
        }
      } else {
        newData[key] = data[key];
      }
    }
    return newData;
  }

  /**
   * Returns the valrep-item for the provided value
   * @param {Array} valrep
   * @param {any} value
   * @return {Object}
   */
  static getValrepItem(valrep, value) {
    if (Array.isArray(valrep)) {
      for (let i = 0; i < valrep.length; i++) {
        if (valrep[i].value === value) {
          return valrep[i];
        }
      }
    }
    return null;
  }

  /**
   * Converts a string format valrep into [{"value": "representation"},....] format.
   * @param {string} valrep - The valrep string to be formatted.
   * @returns {Array} An array of objects with "value" and "representation" properties.
   */
  getFormattedValrep(valrep) {
    return Base.getFormattedValrep(valrep);
  }

  /**
   * Converts a string format valrep into [{"value": "representation"},....] format.
   * @param {string} valrep - The valrep string to be formatted.
   * @returns {Array} An array of objects with "value" and "representation" properties.
   */
  static getFormattedValrep(valrep) {
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
   * Calls an objectDefinition function, as specified by the instruction string, and returns the result of that function call.
   * Returns a error message if the instruction is of an incorrect format or the requested function does not exist.
   * @param {UObjectDefinition} objectDefinition
   * @param {String} instruction  ; Instruction string of syntax: "function({arg1{,arg2{...,argN}}})"
   * @return {*}
   * @memberof Base
   */
  objectDefinitionFunctionCall(objectDefinition, instruction) {
    // Check whether instruction is a proper function call: func(), func(a), or func(a,b,c).
    if (/^\w+\([\w\s-:,]*\)$/.test(instruction)) {
      const funcName = instruction.split("(")[0];
      const args = instruction.split("(")[1].split(")")[0].split(",");
      switch (funcName) {
        case "getType":
          return objectDefinition.getType();
        case "getName":
          return objectDefinition.getName();
        case "getShortName":
          return objectDefinition.getShortName();
        case "getProperty":
          return objectDefinition.getProperty(args[0]);
        case "getWidgetClass":
          return objectDefinition.getWidgetClass();
        case "getCollectionWidgetClass":
          return objectDefinition.getCollectionWidgetClass();
        case "getOccurrenceWidgetClass":
          return objectDefinition.getOccurrenceWidgetClass();
        default:
          return `Unknown function detected (${funcName}). Allowed: getType(), getName(), getShortName(), getProperty(propId), getWidgetClass(), getCollectionWidgetClass(), getOccurrenceWidgetClass()`;
      }
    } else {
      return `Invalid instruction detected (${instruction}). Expected: func(), func(a), func(a,b), ...`;
    }
  }

  substituteInstructions(objectDefinition, string) {
    return string.replaceAll(/{{(.*?)}}/gi, (instruction) => {
      instruction = instruction.substring(2, instruction.length - 2);
      return this.objectDefinitionFunctionCall(objectDefinition, instruction);
    });
  }

  /**
   * Formatting valrep element with representation and value.
   * u-valrep-value - this class is used for querying the value element in both valrep and val display formats.
   * u-value - this class is specific to valrep format and is used to style the value section.
   * u-valrep-representation - this class is used both as a query-selector and for styling the representation section.
   * @param {String} displayFormat
   * @param {String | null} value
   * @param {String} representation
   * @returns {HTMLElement | DocumentFragment}
   */
  getFormattedValrepItemAsHTML(displayFormat, value, representation) {
    const valrepRepElement = document.createElement("span");
    valrepRepElement.className = "u-valrep-representation";
    valrepRepElement.innerHTML = representation;
    const valrepValueElement = document.createElement("span");
    valrepValueElement.className = "u-valrep-value";
    valrepValueElement.textContent = value ? value : "null";
    switch (displayFormat) {
      case "valrep":
        const fragmentElement = document.createDocumentFragment();
        fragmentElement.appendChild(valrepRepElement);
        valrepValueElement.classList.add("u-value");
        fragmentElement.appendChild(valrepValueElement);
        return fragmentElement;
      case "val":
        return valrepValueElement;
      case "rep":
      default:
        return valrepRepElement;
    }
  }

  /**
   * Warning log function.
   * @param {String} functionName
   * @param {String} message
   * @param {String} consequence
   */
  warn(functionName, message, consequence) {
    console.warn(`${this.constructor.name}.${functionName}: ${message} - ${consequence}.`);
  }

  /**
   * Error log function.
   * @param {String} functionName
   * @param {String} message
   * @param {String} consequence
   */
  error(functionName, message, consequence) {
    console.error(`${this.constructor.name}.${functionName}: ${message} - ${consequence}.`);
  }
}
