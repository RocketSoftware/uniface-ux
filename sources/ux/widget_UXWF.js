// @ts-check 

import "./typedef_UXWF.js"
import { Base_UXWF } from "./base_UXWF.js";
import { StyleClass, StyleProperty } from "./workers_UXWF.js";

/**
 * BASE UX-WIDGET CLASS - Implements all Uniface UX Widget Interface methods.
 * 
 *
 * @export
 * @class Widget_UXWF
 * @extends {Base_UXWF}
 */
export class Widget_UXWF extends Base_UXWF {

  /**
   * Holds the updaters that need to be executed after a property update.
   *
   * @property {Array} setters
   * @memberof Widget_UXWF
   */
  setters = [];

  /**
   * Holds the updated data of the widget instance
   *
   * @property {UData} data
   * @memberof Widget_UXWF
   */
  data = {};

  /**
   * Holds references to elements on which updaters, getters, and events handlers need to work.
   * 
   * @property {Object} elements
   * @memberof Widget_UXWF
   */
  elements = {};



  /**
   * This method is called by Uniface only once.
   * Returns the template layout to be used by the widget.
   *
   * @static
   * @param {Element} skeletonWidgetElement - references to the placeholder element as defined by the IDE or parent widget
   * @param {UObjectDefinition} definitions - reference to the component definitions
   * @return {Element} - reference to the root created widget DOM
   * @memberof Widget_UXWF
   */
  static processLayout(skeletonWidgetElement, definitions) {
    // Create widget layout
    let elementId = skeletonWidgetElement.id;
    let widgetElement = this.structure.getLayout(definitions);
    widgetElement.id = elementId;

    // WORKAROUND: Make Uniface object definitions available to widget constructors by element Id
    if (globalThis.UX_DEFINITIONS === undefined) {
      globalThis.UX_DEFINITIONS = {};
    }
    globalThis.UX_DEFINITIONS[elementId] = definitions;

    return widgetElement;
  }

  /**
   * Creates an instance of class widget extended from Widget_UXWF.
   * Initializes some tracing information to distinct widget instances.
   * Instantiates registered sub-widgets.
   * 
   * @memberof Widget_UXWF
   */
  constructor() {
    super();
    this.widget = {};
    this.widget.id = Math.random();
    this.subWidgets = {};
    this.log("constructor",);

    // Instantiate sub-widgets
    Object.keys(this.constructor.subWidgets).forEach((subWidgetId) => {
      let subWidgetClass = this.constructor.subWidgets[subWidgetId].class;
      this.subWidgets[subWidgetId] = new subWidgetClass();
    });

  }

  /**
   * Connects the widget DOM element (as created and returned by processLayout()) with the widget instance.
   * Invokes the onConnect of registered sub-widgets.
   * Returns an array of events descriptions that indicate the value is changed allowing Uniface to react.
   *
   * @param {Element} widgetElement
   * @return {Updaters} 
   * @memberof Widget_UXWF
   */
  onConnect(widgetElement) {
    this.elements = {};
    this.elements.widget = widgetElement;
    this.log("onConnect");

    // Call onConnect of sub-widgets and map triggers to custom events
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      let element = widgetElement.querySelector(`.${this.constructor.subWidgets[subWidgetId].styleClass}`);
      let subWidget = this.subWidgets[subWidgetId];
      subWidget.onConnect(element);
    });

    // Get updaters
    let getter = this.constructor.getters.value;
    if (getter) {
      let updaters = getter.getValueUpdaters(this);
      return updaters;
    }
  }

  /**
   * Use this method to map a Uniface trigger to an event of your (sub) widget.
   * 
   * @param {String} triggerName
   * @return {TriggerMapping|undefined} [triggerMapping]
   * @memberof Widget_UXWF
   */
  mapTrigger(triggerName) {
    triggerName = this.fixTriggerName(triggerName);
    this.log("mapTrigger", triggerName);
    let triggerMapping = null;
    if (this.constructor.triggers) {
      let setter = this.constructor.triggers[triggerName];
      if (setter) {
        return setter.getTriggerMapping(this);
      }
    }
    if (triggerMapping === null && this.subWidgets) {
      let subWidgetId = triggerName.split(":")[0];
      if (this.subWidgets[subWidgetId]) {
        let subWidgetPrefix = `${subWidgetId}:`;
        let subWidgetTriggerName = triggerName.substring(subWidgetPrefix.length);
        triggerMapping = this.subWidgets[subWidgetId].mapTrigger(subWidgetTriggerName);
      }
    }
    if (triggerMapping) {
      return triggerMapping;
    } else {
      this.warn("mapTrigger", `No trigger map found for (web)trigger '${triggerName}'.`, "Ignored")
    }
  }

  /**
   * Initiates the widget after it has been bound to a new data object.
   *
   * @memberof Widget_UXWF
   */
  dataInit() {
    this.data = {};
    this.data.id = Math.random();
    this.data.properties = {};
    this.log("dataInit", this.constructor.defaultValues);

    // Remove all html attributes except id but including class and style attributes
    this.elements.widget.getAttributeNames().forEach((attributeName) => {
      if (attributeName !== "id") {
        this.elements.widget.removeAttribute(attributeName);
      }
    });

    // Get default property values
    /** @type {UData} */
    let data = this.constructor.defaultValues;

    // Call dataInit() of sub-widgets (if any)
    // Set default property values targeted for sub-widget
    if (this.subWidgets) {
      Object.keys(this.subWidgets).forEach((subWidget) => {
        this.subWidgets[subWidget].dataInit();
        this.subWidgets[subWidget].dataUpdate(data[subWidget]);
      });
    }

    // Set default property values
    this.setProperties(data);
  }

  /**
   * Updates the widget with new or changed data, where data is value, property values, valrep.
   *
   * @param {UData} data
   * @memberof Widget_UXWF
   */
  dataUpdate(data) {
    data = this.fixData(data);
    this.log("dataUpdate", data);
    this.setProperties(data);

    // Call dataUpdate() of sub-widgets (if any)
    // and pass data targeted for sub-widget
    Object.keys(this.subWidgets).forEach((subWidget) => {
      if (data[subWidget]) {
        this.subWidgets[subWidget].dataUpdate(data[subWidget]);
      }
    });

  }

  /**
   * Cleans up the widget.
   *
   * @memberof Widget_UXWF
   */
  dataCleanup() {
    this.log("dataCleanup");

    // Call dataCleanup of sub-widgets
    Object.keys(this.subWidgets).forEach((key) => {
      this.subWidgets[key].dataCleanup();
    });
  }

  /**
   * Returns the (field) value back to Uniface.
   *
   * @return {any} 
   * @memberof Widget_UXWF
   */
  getValue() {
    let value;
    // Get value-getter from WORKER
    let getter = this.constructor.getters.value;
    if (getter) {
      value = getter.getValue(this);
    }
    this.log("getValue", value);
    return value;
  }

  /**
   * Validates the value of the widget before passing it back to Uniface.
   *
   * @return {UDataError|null} [result]
   * @memberof TextField5
   */
  validate() {
    this.log("validate");
    let result = null;
    return result;
  }

  /**
   * Shows the error as provided by Uniface.
   *
   * @param {String} errorMessage
   * @memberof Widget_UXWF
   */
  showError(errorMessage) {
    this.log("showError", errorMessage);
    this.setProperties({ uniface: { error: true, "error-message": errorMessage } });
  }

  /**
   * Hides the error as it was provided by Uniface to showError.
   *
   * @memberof Widget_UXWF
   */
  hideError() {
    this.log("hideError");
    this.setProperties({ uniface: { error: false, "error-message": "" } });
  }

  /**
   * Blocks user interaction with the widget.
   *
   * @memberof Widget_UXWF
   */
  blockUI() {
    this.log("blockUI");
    this.elements.widget.classList.add("u-blocked");
    switch (this.constructor.uiBlocking) {
      case "disabled":
        this.elements.widget.disabled = true;
        break;
      case "readonly":
        this.elements.widget.readOnly = true;
        break;
      default:
        this.error("blockUI()", "Static uiBlocking not defined or invalid value", "No UI blocking");
    }
  }

  /**
   * Unblocks user interaction with the widget.
   *
   * @memberof Widget_UXWF
   */
  unblockUI() {
    this.log("unblockUI");
    this.elements.widget.classList.remove("u-blocked");
    switch (this.constructor.uiBlocking) {
      case "disabled":
        this.elements.widget.disabled = this.toBoolean(
          this.data.properties.html.disabled
        );
        break;
      case "readonly":
        this.elements.widget.readOnly = this.toBoolean(
          this.data.properties.html.readonly
        );
        break;
      default:
        this.error(
          "unblockUI()",
          "Static uiBlocking not defined or invalid value",
          "No UI blocking"
        );
    }
  }

  /**
   * Instructs the widget to update itself based on provided data changes.
   * 
   * @param {UData} data 
   */
  setProperties(data) {
    this.log("setProperties", data);
    this.setters = [];
    // Iterate properties in data, update widget state, and collect setter information.
    if (data) {
      Object.keys(data).forEach((prefix) => {
        switch (prefix) {
          case "uniface":
          case "html":
            if (this.data.properties[prefix] === undefined) {
              this.data.properties[prefix] = {};
            }
            Object.keys(data[prefix]).forEach((id) => {
              if (data[prefix][id] === uniface.RESET) {
                this.data.properties[prefix][id] =
                  this.constructor.defaultValues[prefix][id];
              } else {
                this.data.properties[prefix][id] = data[prefix][id];
              }
              if (
                this.constructor.setters[prefix] &&
                this.constructor.setters[prefix][id]
              ) {
                this.constructor.setters[prefix][id].forEach((setter) => {
                  this.addSetter(setter);
                });
              } else {
                this.warn(
                  "setProperties(data)",
                  `Widget does not support property '${prefix}:${id}'`,
                  "Ignored"
                );
              }
            });
            break;
          case "style":
            if (this.data.properties[prefix] === undefined) {
              this.data.properties[prefix] = {};
            }
            Object.keys(data[prefix]).forEach(id => {
              if (data[prefix][id] === uniface.RESET) {
                this.data.properties[prefix][id] = this.constructor.defaultValues[prefix][id] ? this.constructor.defaultValues[prefix][id] : "unset";
              } else if (this.data.properties[prefix][id]) {
                this.data.properties[prefix][id] = data[prefix][id];
              } else {
                this.data.properties[prefix] = {};
                this.data.properties[prefix][id] = data[prefix][id]
                new StyleProperty(this.constructor, { id: data[prefix][id] })
              }
              if (this.constructor.setters[prefix]) {
                this.constructor.setters[prefix].forEach(setter => {
                  this.addSetter(setter);
                });
              } else {
                this.warn("setProperties(data)", `Widget does not support property '${prefix}:${id}'`, "Ignored");
              }
            });
            break;
          case "value":
          case "valrep":
            let id = prefix;
            if (data[id] === uniface.RESET) {
              this.data.properties[id] = this.constructor.defaultValues[id];
            } else {
              this.data.properties[id] = data[id];
            }
            if (this.constructor.setters[id]) {
              this.constructor.setters[id].forEach((setter) => {
                this.addSetter(setter);
              });
            } else {
              this.warn(
                "setProperties(data)",
                `Widget does not support property '${id}'`,
                "Ignored"
              );
            }
            break;
          case "classes":
            this.data.properties[prefix] = this.data.properties[prefix] || {};
            Object.keys(data[prefix]).forEach((id) => {
              if (data[prefix][id] === uniface.RESET) {
                this.data.properties[prefix][id] =
                  this.constructor.defaultValues[prefix][id];
              } else {
                this.data.properties[prefix][id] = data[prefix][id];
                if (data[prefix][id] && !Object.keys(this.data.properties[prefix]).filter(x => Object.keys(data[prefix]).includes(x)).length) {
                  new StyleClass(this.constructor, [id])
                }
              }
              if (this.constructor.setters[prefix]) {
                this.constructor.setters[prefix].forEach((setter) => {
                  this.addSetter(setter);
                });
              } else {
                this.warn(
                  "setProperties(data)",
                  `Widget does not support property '${prefix}:${id}'`,
                  "Ignored"
                );
              }
            });
            break;
          default:
          // This is a sub widget -> delicate TBD
        }
      });
    }
    this.setters.forEach((setter) => {
      setter.refresh(this);
    });
    this.setters = [];
  }

  /**
   * Adds a setter to itself which are executed later by
   * 
   * @param {*} setter
   */
  addSetter(setter) {
    this.setters.push(setter);
  }

  getTraceDescription() {
    let widgetId = "<noWidgetId>";
    let elementId = "<noElementId>";
    let dataId = "<noDataId>";
    if (this.widget && this.widget.id) {
      widgetId = String(this.widget.id).split(".")[1];
    }
    if (this.elements && this.elements.widget && this.elements.widget.id) {
      elementId = this.elements.widget.id;
    }
    if (this.data && this.data.id) {
      dataId = String(this.data.id).split(".")[1];
    }
    return `${this.constructor.name}:${widgetId}:${elementId}:${dataId}`;
  }

  /**
   * Logs the provided tracing info in console.log.
   *
   * @static
   * @param {*} functionName
   * @param {*} data
   * @memberof Widget_UXWF
   */
  static staticLog(functionName, data) {
    const classNames = new Set();
    classNames.add("ALL");
    if (classNames.has("ALL") || classNames.has(this.name)) {
      const log = {
        all: true,
        processLayout: false,
      };
      if (log.all || log[functionName]) {
        if (data) {
          if (data instanceof HTMLElement) {
            console.log(
              `WIDGET[${this.name}:static].${functionName}("${data.outerHTML}")`
            );
          } else {
            console.log(
              `WIDGET[${this.name}:static].${functionName}(${JSON.stringify(data)})`
            );
          }
        } else {
          console.log(`WIDGET[${this.name}:static].${functionName}()`);
        }
      }
    }
  }

  /**
   * Logs the provided tracing info in console.log.
   *
   * @param {String} functionName
   * @param {Object} [data]
   * @memberof Widget_UXWF
   */
  log(functionName, data) {
    // const classNames = new Set("NONE");
    const classNames = {
      all: true,
      TextField_UXWF: true,
      Button_UXWF: true,
    };
    const functionNames = {
      all: false,
      constructor: false,
      onConnect: false,
      onDisconnect: false,
      mapTrigger: false,
      dataInit: false,
      dataUpdate: false,
      setDisabled: false,
      dataCleanup: false,
      validate: false,
      showError: false,
      hideError: false,
      blockUI: false,
      unblockUI: false,
      getValue: false,
      onFocus: false,
      onBlur: false,
      gridEventHandler: false,
      editorAccept: false,
      setBlocked: false,
      setHtmlAttribute: false,
      setSlot: false,
      setMinMax: false,
      setValue: false,
      invokeSetters: false,
    };
    const elementIds = {
      all: false,
      noElementId: true,
      "ufld:WIDGET.DATA.NOMODEL:UX_WORKBENCH.1": true,
    };
    if (classNames.all || classNames[this.constructor.name]) {
      if (functionNames.all || functionNames[functionName]) {
        let elementId = "noElementId";
        if (this.elements && this.elements.widget && this.elements.widget.id) {
          elementId = this.elements.widget.id;
        }
        if (elementIds.all || elementIds[elementId]) {
          let data_ = "";
          if (data) {
            data_ = JSON.stringify(data);
          }
          console.log(`WIDGET[${this.getTraceDescription()}].${functionName}(${data_})`);
        }
      }
    }
  }
}

UNIFACE.ClassRegistry.add("UX.Widget", Widget_UXWF);
