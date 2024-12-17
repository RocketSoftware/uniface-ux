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
   * @param {Worker} worker - Specifies the worker.
   */
  registerSetter(widgetClass, propId, worker) {
    widgetClass.setters[propId] = widgetClass.setters[propId] || [];
    widgetClass.setters[propId].push(worker);
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
    widgetClass.getters[propId] = worker;
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
    widgetClass.defaultValues[propId] = defaultValue;
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
   * @param {UPropName} propId
   * @return {Object}
   */
  getNode(node, propId) {
    return Base.getNode(node, propId);
  }

  /**
   * Looks up the node within node as specified by propId.
   * @param {UData} node
   * @param {UPropName} propId
   * @return {Object}
   */
  static getNode(node, propId) {
    return propId ? node[propId] : undefined;
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

  // TODO: Remove this function when backend starts sending flattened data.
  dataConversionUtil = (function () {
    function flatToNested(flat) {
      const result = {};
      for (const key in flat.properties) {
        const value = flat.properties[key];
        const key_parts = key.split(":");
        if (key_parts.length === 1) {
          // only if the property key does not have any colon,
          // we assume it is a "uniface:" property.
          if (!result.uniface) {
            result.uniface = {};
          }
          result.uniface[key] = value;
        } else if (key_parts.length === 2 && key_parts[0] === "class") {
          if (!result.classes) {
            result.classes = {};
          }
          result.classes[key_parts[1]] = value;
        } else {
          let sub_obj = result;
          for (let i = 0; i < key_parts.length; i++) {
            const part_key = key_parts[i];
            if (!sub_obj[part_key]) {
              sub_obj[part_key] = {};
            }
            if (i === key_parts.length - 1) {
              sub_obj[part_key] = value;
            } else {
              sub_obj = sub_obj[part_key];
            }
          }
        }
      }
      if (flat.value !== undefined) {
        result.value = flat.value;
      }
      if (flat.valrep !== undefined) {
        result.valrep = flat.valrep;
      }
      return result;
    }

    function flattenProps(obj, prefix) {
      let data = {};
      let separate = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const newKey = prefix ? `${prefix}:${key}` : key;

          if (key === "value" || key === "valrep") {
            if (prefix !== undefined) {
              throw new Error(`Inner level ${newKey} property not (or not yet) supported`);
            }
            separate[key] = value;
          } else if (key === "classes") {
            for (const cls in value) {
              data[`class:${cls}`] = value[cls];
            }
          } else if (typeof value === "object" && Object.keys(value).length > 0) {
            if (key === "uniface") {
              let props = flattenProps(value).data;
              data = { ...data, ...props };
            } else {
              let props = {};
              let flattenedProps = flattenProps(value, newKey).data;
              for (const n in flattenedProps) {
                props[`${key}:${n}`] = flattenedProps[n];
              }
              data = { ...data, ...props };
            }
          } else {
            data[key] = value;
          }
        }
      }
      let result = {};
      result.data = data;
      if (!prefix && Object.keys(separate).length > 0) {
        result.separate = separate;
      }
      return result;
    }

    function nestedToWrapper(obj) {
      const result = flattenProps(obj);
      // Return a wrapper around the flat object.
      // Add a toString() function as a debugging aid.
      return {
        "getPropertyNames": function () {
          return Object.keys(result.data);
        },
        "getProperty": function (propertyName) {
          return result.data[propertyName];
        },
        "getValue": function () {
          return result.separate?.value;
        },
        "getValRep": function () {
          return result.separate?.valrep;
        },
        "toString": function () {
          let s = "";
          if (this.getPropertyNames().length > 0) {
            let propsString = "";
            for (let i = 0; i < this.getPropertyNames().length; i++) {
              let prop = this.getPropertyNames()[i];
              propsString = `${propsString}    "${prop}": ${this.getProperty(prop)}\n`;
            }
            s = `  properties: {\n${propsString}  }\n`;
          }
          if (this.getValue()) {
            s = `${s}  value: ${this.getValue()}\n`;
          }
          if (this.getValRep()) {
            let valrepString = "";
            let valrep = this.getValRep();
            for (let i = 0; i < valrep.length; i++) {
              valrepString = `${valrepString}    ${valrep[i].value} = ${valrep[i].representation}\n`;
            }
            s = `${s}  valrep: {\n${valrepString}  }\n`;
          }
          return `{\n${s}\n}`;
        },
        "toObject": function () {
          let flat = {};
          if (this.getPropertyNames().length > 0) {
            for (let i = 0; i < this.getPropertyNames().length; i++) {
              let prop = this.getPropertyNames()[i];
              flat[prop] = this.getProperty(prop);
            }
          }
          if (this.getValue() !== undefined) {
            flat.value = this.getValue();
          }
          if (this.getValRep() !== undefined) {
            flat.valrep = this.getValRep();
          }
          return flat;
        }
      };
    }

    function nestedToWrapperToFlat(obj) {
      let wrapper = nestedToWrapper(obj);
      let flatData = wrapper.toObject();
      return flatData;
    }

    // The actual utility functions:
    return {
      "toFlat": nestedToWrapperToFlat,
      "toNested": flatToNested
    };
  })();

  /**
   * Extracts sub-widget data from the original data object and removes the corresponding
   * properties from original data object.
   * @param {Object} data - The source object containing properties to extract.
   * @returns {Object} An object containing the extracted sub-widget data.
   */
  getSubWidgetData(data, subWidgetPropPrefix) {
    let subWidgetData;
    for (let property in data) {
      if (property.startsWith(subWidgetPropPrefix)) {
        let pos = property.search(":");
        if (pos > 0) {
          subWidgetData = subWidgetData || {};
          let key = property.substring(pos + 1);
          subWidgetData[key] = key === "valrep" ? this.getFormattedValrep(data[property]) : data[property];
          // Remove the property from the original data to avoid duplication.
          delete data[property];
        }
      }
    }
    return subWidgetData;
  }
}
