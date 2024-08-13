//@ts-check

import { Widget_UXWF } from "./widget_UXWF.js";

/**
 * UX Widget generic helper functions
 *
 * @export
 * @class Base_UXWF
 */
export class Base_UXWF {
  constructor() { }

  /**
   * Registers a setter to react on property changes.
   *
   * @param {typeof Widget_UXWF} widgetClass
   * @param {UPropName} propId
   * @param {*} setterClass
   * @memberof Base_UXWF
   */
  registerSetter(widgetClass, propId, setterClass) {
    if (!widgetClass.setters) widgetClass.setters = {};
    let pos = propId.search(":");
    if (pos > 0) {
      let prefix = propId.substring(0, pos);
      propId = propId.substring(pos + 1);
      if (!widgetClass.setters[prefix]) widgetClass.setters[prefix] = {};
      if (!widgetClass.setters[prefix][propId])
        widgetClass.setters[prefix][propId] = [];
      widgetClass.setters[prefix][propId].push(setterClass);
    } else {
      if (!widgetClass.setters[propId]) widgetClass.setters[propId] = [];
      widgetClass.setters[propId].push(setterClass);
    }
  }

  /**
   * Registers a sub-widget.
   *
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} subWidgetId
   * @param {typeof Widget_UXWF} subWidgetClass
   * @param {String} subWidgetStyleClass
   * @param {*} subWidgetTriggers
   * @memberof Base_UXWF
   */
  registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) {
    // registerSubWidget(class TextField, "change-button", class Button, "u-change-button", {});
    if (!widgetClass.subWidgets) widgetClass.subWidgets = {};
    widgetClass.subWidgets[subWidgetId] = {
      class: subWidgetClass,
      styleClass: subWidgetStyleClass,
      triggers: subWidgetTriggers,
    };
  }

  /**
   * Registers a default value.
   *
   * @param {typeof Widget_UXWF} widgetClass
   * @param {UPropName} propId
   * @param {UPropValue} defaultValue
   * @memberof Base_UXWF
   */
  registerDefaultValue(widgetClass, propId, defaultValue) {
    if (!widgetClass.defaultValues) widgetClass.defaultValues = {};
    let node = widgetClass.defaultValues;
    let ids = propId.split(":");
    let i;
    for (i = 0; i < ids.length - 1; i++) {
      if (node[ids[i]] == undefined) node[ids[i]] = {};
      node = node[ids[i]];
    }
    node[ids[i]] = defaultValue;
  }

  /**
   * Registers a getter to return the widget value.
   *
   * @param {typeof Widget_UXWF} widgetClass
   * @param {UPropName} propId
   * @param {*} setterClass
   * @memberof Base_UXWF
   */
  registerGetter(widgetClass, propId, setterClass) {
    if (!widgetClass.getters) widgetClass.getters = {};
    let pos = propId.search(":");
    if (pos > 0) {
      let prefix = propId.substring(0, pos);
      propId = propId.substring(pos + 1);
      if (!widgetClass.getters[prefix]) widgetClass.getters[prefix] = {};
      widgetClass.getters[prefix][propId] = setterClass;
    } else {
      widgetClass.getters[propId] = setterClass;
    }
  }

  /**
   * Registers a trigger.
   *
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} triggerName
   * @param {*} setterClass
   * @memberof Base_UXWF
   */
  registerTrigger(widgetClass, triggerName, setterClass) {
    if (!widgetClass.triggers) widgetClass.triggers = {};
    widgetClass.triggers[triggerName] = setterClass;
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
   * Creates a new HTMLElement with a given tagName, which is a clone
   * of a given HTMLElement.
   * @param {HTMLElement} sourceElement - The HTMLElement to clone.
   * @param {string} tagName - The tagName for the new HTMLElement.
   * @param {boolean} copyChildren - Copy the sourceElement's children
   *   to the new element.
   * @param {boolean} copyAttributes - Copy the sourceElement's attributes
   *   to the new element.
   * @returns {HTMLElement} The new HTML element.
   */
  static cloneElement(sourceElement, tagName, copyChildren, copyAttributes) {
    /** @type {HTMLElement} */
    const newElement = document.createElement(tagName);
    if (copyChildren) {
      const childNodes = sourceElement.childNodes;
      childNodes.forEach((node) => {
        newElement.appendChild(node.cloneNode(true));
      });
    }
    if (copyAttributes) {
      const attributeNames = sourceElement.getAttributeNames();
      attributeNames.forEach((name) => {
        const value = sourceElement.getAttribute(name);
        if (value) {
          newElement.setAttribute(name, value);
        }
      });
    }
    return newElement;
  }

  /**
   * Convert various 'Uniface' values into a JS Boolean.
   *
   * @param {String|boolean|number} value
   * @return {boolean} 
   * @memberof Base_UXWF
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
   * Converts a Uniface field value explicitly to a JavaScript Boolean value.
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
      Fix dataUpdate data.
    **/
  fixData(data) {
    let newData = {};
    Object.keys(data).forEach((key) => {
      if (key == "uniface") {
        if (newData.uniface == undefined) {
          newData.uniface = {};
        }
        Object.keys(data.uniface).forEach((key) => {
          let ids = key.split(":");
          if (ids.length == 1) {
            newData.uniface[key] = data.uniface[key];
          } else {
            let newDataNode = newData;
            let id;
            let i;
            for (i = 0; i < ids.length - 1; i++) {
              id = ids[i];
              if (newDataNode[id] == undefined) {
                newDataNode[id] = {};
              }
              newDataNode = newDataNode[id];
            }
            if (
              id == "html" ||
              id == "style" ||
              id == "class" ||
              ids[i] == "value" ||
              ids[i] == "valrep"
            ) {
              newDataNode[ids[i]] = data.uniface[key];
            } else {
              if (newDataNode.uniface == undefined) {
                newDataNode.uniface = {};
              }
              newDataNode = newDataNode.uniface[ids[i]] = data.uniface[key];
            }
          }
        });
      } else {
        newData[key] = data[key];
      }
    });
    return newData;
  }

  /**
   * Converts "control_id__detail" into "control-id:detail"
   * 
   * @param {String} triggerName 
   * @returns String
   */
  fixTriggerName(triggerName) {
    triggerName = triggerName.replace("__", ":");
    triggerName = triggerName.replace("_", "-");
    return triggerName;
  }

  /**
      Trace and console errpr/warning functions
      Keep trace functions last in JS file, so can easy be changed.
    **/
  static warn(functionName, message, consequence) {
    console.warn(`${this.name}.${functionName}: ${message} - ${consequence}.`);
  }

  static error(functionName, message, consequence) {
    console.warn(`${this.name}.${functionName}: ${message} - ${consequence}.`);
  }

  warn(functionName, message, consequence) {
    console.warn(
      `${this.constructor.name}.${functionName}: ${message} - ${consequence}.`
    );
  }

  error(functionName, message, consequence) {
    console.error(
      `${this.constructor.name}.${functionName}: ${message} - ${consequence}.`
    );
  }

  static staticLog(functionName, data) {
    const classNames = new Set();
    // classNames.add("Base");
    classNames.add("Button");
    if (classNames.has("ALL") || classNames.has(this.name)) {
      const log = {
        all: false,
        processLayout: false,
      };
      let data_ = "";
      if (data) {
        data_ = JSON.stringify(data);
      }
      console.log(`${this.constructor.name}.static:${functionName}(${data_})`);
    }
  }

  log(functionName, data) {
    // const classNames = new Set("NONE");
    const classNames = {
      all: false,
      Nothing: false,
    };
    if (classNames.all || classNames[this.constructor.name]) {
      let data_ = "";
      if (data) {
        data_ = JSON.stringify(data);
      }
      console.log(`${this.constructor.name}.${functionName}(${data_})`);
    }
  }
}
