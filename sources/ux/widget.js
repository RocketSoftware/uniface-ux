// @ts-check
/* global uniface globalThis */

import "./typedef_UXWF.js";
import "./workers_UXWF.js";
import { Base_UXWF } from "./base_UXWF.js";

/**
 * Base ux-widget class - Implements all Uniface UX Widget Interface methods.
 * @export
 * @class Widget_UXWF
 * @extends {Base_UXWF}
 */
export class Widget_UXWF extends Base_UXWF {

  /**
   * Configures tracing/logging.
   * Set all to true to enable tracing for all classes/functions.
   * Add/set a widget class name to true to enable tracing for that widget class.
   * Add/set a function to true to enable tracing for that function.
   * @static
   * @memberof Widget_UXWF
   */
  static tracing = {
    "classNames": {
      "all": true,
      "Select_UXWF": true,
    },
    "functionNames": {
      "all": true,
      "processLayout": false,
      "constructor": false,
      "onConnect": false,
      "onDisconnect": false,
      "mapTrigger": false,
      "dataInit": false,
      "dataUpdate": false,
      "dataCleanup": false,
      "validate": false,
      "showError": false,
      "hideError": false,
      "blockUI": false,
      "unblockUI": false,
      "getValue": false,
    },
    "elementIds": {
      "all": true,
      "noElementId": true,
      "ufld:WIDGET.DATA.NOMODEL:UX_WORKBENCH.1": false,
    },
  };

  /**
   * These static structures are defined here to prevent ESLint parser errors.
   * However, they need to be defined again within each specific widget class to
   * ensure unique definitions for each widget.
   * @static
   */
  static structure = {};
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = ""; // "disabled" | "readonly"

  /**
   * Holds the updated data of the widget instance.
   * @property {UData} data
   */
  data = {};

  /**
   * Holds references to elements on which updaters, getters, and events handlers need to work.
   * @property {Object} elements
   */
  elements = {};

  /**
   * This method is called by Uniface only once.
   * Returns the template layout to be used by the widget.
   * @static
   * @param {Element} skeletonWidgetElement - references to the placeholder element as defined by the IDE or parent widget.
   * @param {UObjectDefinition} objectDefinition - reference to the the definition of the object for which this widget is created.
   * @return {Element} - reference to the root created widget DOM.
   */
  static processLayout(skeletonWidgetElement, objectDefinition) {
    this.staticLog("processLayout", skeletonWidgetElement);
    // Create widget layout.
    let elementId = skeletonWidgetElement.id;

    let widgetElement = this.structure.getLayout(objectDefinition);
    if (elementId) {
      widgetElement.id = elementId;
    }

    // Workaround: Make Uniface object definitions available to widget onConnect() by element Id.
    if (elementId) {
      globalThis.UX_DEFINITIONS = globalThis.UX_DEFINITIONS || {};
      globalThis.UX_DEFINITIONS[elementId] = objectDefinition;
    }

    return widgetElement;
  }

  /**
   * Creates an instance of class widget extended from Widget_UXWF.
   * Initializes some tracing information to distinct widget instances.
   * Instantiates registered sub-widgets.
   */
  constructor() {
    super();
    this.widget = {};
    this.widget.id = Math.random();
    this.subWidgetDefinitions = {}; // As registered by the widget class.
    this.subWidgets = {}; // Instantiated subWidget objects.
    this.log("constructor");

    /**
     * Perform a deep copy of the sub-widgets registered with the widget class to widget object.
     * This to make sure widget object changes do not affect the widget class definition.
     * @type {Object}
     */
    let widgetClass = this.constructor;
    Object.keys(widgetClass.subWidgets).forEach((subWidgetId) => {
      this.subWidgetDefinitions[subWidgetId] = {};
      // Copy reference of sub-widget class.
      this.subWidgetDefinitions[subWidgetId].class =
        widgetClass.subWidgets[subWidgetId].class;
      // Copy value of styleClass.
      this.subWidgetDefinitions[subWidgetId].styleClass =
        widgetClass.subWidgets[subWidgetId].styleClass;
      // Copy array of triggers.
      this.subWidgetDefinitions[subWidgetId].triggers = JSON.parse(
        JSON.stringify(widgetClass.subWidgets[subWidgetId].triggers)
      );
    });
  }

  /**
   * Connects the widget DOM element (as created and returned by processLayout()) with the widget instance.
   * Invokes the onConnect of registered sub-widgets.
   * Returns an array of events descriptions that indicate the value is changed allowing Uniface to react.
   * @param {Element} widgetElement
   * @param {UObjectDefinition} objectDefinition - reference to the component definitions.
   * @return {Updaters}
   */
  onConnect(widgetElement, objectDefinition) {
    this.elements = {};

    /** @type {Object} */
    let widgetClass = this.constructor;
    this.elements.widget = widgetElement;
    this.log("onConnect");

    // Workaround: Until onConnect() provides the object definition as parameter.
    if (widgetElement.id && objectDefinition === undefined) {
      // Only get definition -part of element id: "ufld:FIELD.ENTITY.MODEL:INSTANCE.occ.occ" -> "ufld:FIELD.ENTITY.MODEL"
      const id = widgetElement.id.split(":").slice(0, 2).join(":");
      // Look up definition from the global UX_DEFINITIONS object.
      objectDefinition = globalThis.UX_DEFINITIONS[id];
    }

    // Iterate registered sub-widget-workers to add their sub-widgets to the sub-widgets of this widget instance.
    widgetClass.subWidgetWorkers.forEach((subWidgetWorker) => {
      const subWidgetDefinitions =
        subWidgetWorker.getSubWidgetDefinitions(objectDefinition);
      Object.keys(subWidgetDefinitions).forEach((subWidgetId) => {
        this.subWidgetDefinitions[subWidgetId] =
          subWidgetDefinitions[subWidgetId];
      });
    });

    // Instantiate sub-widgets, register defaults, call their onConnect and collect their value-updaters.
    let valueUpdaters = [];
    Object.keys(this.subWidgetDefinitions).forEach((subWidgetId) => {
      const subWidgetDefinition = this.subWidgetDefinitions[subWidgetId];
      const subWidgetStyleClass = subWidgetDefinition.styleClass;
      const subWidgetElement = widgetElement.querySelector(
        `.${subWidgetStyleClass}`
      );
      const subWidgetClass = this.subWidgetDefinitions[subWidgetId].class;
      this.subWidgets[subWidgetId] = new subWidgetClass();
      let subWidgetUpdaters =
        this.subWidgets[subWidgetId].onConnect(subWidgetElement) || [];
      subWidgetUpdaters.forEach((subWidgetUpdater) => {
        if (subWidgetUpdater !== undefined) {
          valueUpdaters.push(subWidgetUpdater);
        }
      });
    });

    // Add the value-updater(s) of widget itself.
    let valueWorker = widgetClass.getters.value;
    let widgetUpdaters = valueWorker?.getValueUpdaters(this);
    widgetUpdaters?.forEach((widgetUpdater) => {
      if (widgetUpdater !== undefined) {
        valueUpdaters.push(widgetUpdater);
      }
    });
    return valueUpdaters;
  }

  /**
   * Use this method to map a Uniface trigger to an event of your (sub) widget.
   * @param {String} triggerName
   * @return {TriggerMapping|undefined} [triggerMapping].
   */
  mapTrigger(triggerName) {
    this.log("mapTrigger", triggerName);

    /** @type {Object} */
    let widgetClass = this.constructor;
    let triggerMapping = null;

    // Look for the trigger-mapping with the widget-class itself.
    let worker = widgetClass.triggers[triggerName];
    if (worker) {
      triggerMapping = worker.getTriggerMapping(this);
    }

    // Look for the trigger-mapping with on of the widget-class's sub-widgets.
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      if (triggerMapping === null) {
        const subWidgetPrefix = `${subWidgetId}_`;
        if (triggerName.startsWith(subWidgetPrefix)) {
          const subWidgetTriggerName = triggerName.substring(
            subWidgetPrefix.length
          );
          triggerMapping =
            this.subWidgets[subWidgetId].mapTrigger(subWidgetTriggerName);
        }
      }
    });

    if (triggerMapping) {
      return triggerMapping;
    }

    this.warn(
      "mapTrigger",
      `No trigger map found for (web)trigger '${triggerName}'.`,
      "Ignored"
    );
  }

  /**
   * Initiates the widget after it has been bound to a new data object.
   */
  dataInit() {
    this.data = {};
    this.data.id = Math.random();
    this.data.properties = {};

    /** @type {Object} */
    let widgetClass = this.constructor;
    this.log("dataInit", widgetClass.defaultValues);

    /** @NOTE: This loop only deletes the attributes of the widget's root element,
     * it does not delete any attributes on child elements. This means the widget is
     * potentially still not reset properly and state might by left behind on child
     * elements by previous use. (UNI-39487)
     * This loop needs to be rewritten and should cleanup all child elements as well.
     * However, this has as a consequence that style-classes of child elements get deleted too
     * meaning child elements cannot be found anymore. To resolve that, the onConnect() needs to
     * build a element index first, like we had in the old widgets. It can do so by iterating
     * the widget's workers and have them add their e reference to their element to this admin.
     * Once this is available, workers don't rely on the style-class to lookup their element
     * and elements can be safely cleaned up by the dataInit(). (UNI-39488)
     * For now, we disable this code. Separate stories are created to deal with this.
    // Remove all html attributes except id but including class and style attributes.
    */
    // this.elements.widget.getAttributeNames().forEach((attributeName) => {
    //   if (attributeName !== "id") {
    //     this.elements.widget.removeAttribute(attributeName);
    //   }
    // });

    // Get default property values.
    /** @type {UData} */
    let data = widgetClass.defaultValues;

    // Iterate sub-widgets and call their dataInit() followed by their dataUpdate() with default values targeted at the sub-widgets.
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      this.subWidgets[subWidgetId].dataInit();
      if (data[subWidgetId]) {
        this.subWidgets[subWidgetId]?.dataUpdate(data[subWidgetId]);
      }
    });

    // Set default property values of widget.
    this.setProperties(data);
  }

  /**
   * Updates the widget with new or changed data, where data is value, property values, valrep.
   * @param {UData} data
   */
  dataUpdate(data) {
    data = this.fixData(data);
    this.log("dataUpdate", data);

    // Iterate sub-widgets and call their dataUpdate() with data targeted at the sub-widgets.
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      if (data[subWidgetId]) {
        this.subWidgets[subWidgetId].dataUpdate(data[subWidgetId]);
      }
    });

    this.setProperties(data);
  }

  /**
   * Cleans up the widget.
   */
  dataCleanup() {
    this.log("dataCleanup");

    // Call dataCleanup() of sub-widgets (if any).
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      this.subWidgets[subWidgetId].dataCleanup();
    });
  }

  /**
   * Returns the (field) value back to Uniface.
   * @return {any}
   */
  getValue() {
    let value = {};
    // Get the 'value' worker from the constructor's getters.
    /** @type {Object} */
    let widgetClass = this.constructor;
    let valueWorker = widgetClass.getters.value;
    // Check if the 'value' worker is defined.
    if (valueWorker) {
      // If the 'value' worker is defined, call its getValue method, passing the current instance (this) and
      // assign the result to the value variable.
      value = valueWorker.getValue(this);
    }
    this.log("getValue", value);
    // Return the value.
    return value;
  }

  /**
   * Validates the value of the widget before passing it back to Uniface.
   * @return {UDataError|null} [result]
   */
  validate() {
    this.log("validate");
    let uxwfErrors = {
      "id": "UXWF_VALIDATION_ERRORS",
      "validationMessages": {},
    };
    // Initialize a flag to track if there are any validation errors.
    let hasUxwfErrors = false;
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      // Call the validate method on each sub-widget and store the result.
      let subWidgetValidation = this.subWidgets[subWidgetId].validate();
      // If the sub-widget returns a validation message, add it to the uxwfErrors object.
      if (subWidgetValidation) {
        uxwfErrors.validationMessages[subWidgetId] = subWidgetValidation;
        // Set the error flag to true since there's at least one validation error.
        hasUxwfErrors = true;
      }
    });
    return hasUxwfErrors ? JSON.stringify(uxwfErrors) : null;
  }

  /**
   * Shows the error as provided by Uniface.
   * @param {String} errorMessage
   */
  showError(errorMessage) {
    this.log("showError", errorMessage);
    let subWidgetIds = Object.keys(this.subWidgets);
    if (subWidgetIds.length > 0) {
      subWidgetIds.forEach((subWidgetId) => {
        this.subWidgets[subWidgetId].hideError();
      });
      try {
        let parsedErrorMsg = JSON.parse(errorMessage);
        if (parsedErrorMsg.id === "UXWF_VALIDATION_ERRORS") {
          Object.keys(parsedErrorMsg.validationMessages).forEach((subWidgetId) => {
            this.subWidgets[subWidgetId].showError(parsedErrorMsg.validationMessages[subWidgetId]);
          });
        } else {
          this.setProperties({
            "uniface": {
              "error": true,
              "error-message": errorMessage
            }
          });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (_) {
        this.setProperties({
          "uniface": {
            "error": true,
            "error-message": errorMessage
          }
        });
      }
    } else {
      this.setProperties({
        "uniface": {
          "error": true,
          "error-message": errorMessage
        }
      });
    }
  }

  /**
   * Hides the error as it was provided by Uniface to showError.
   */
  hideError() {
    this.log("hideError");
    // Call hideError() for each sub-widget.
    Object.keys(this.subWidgets).forEach((subWidgetId) => {
      this.subWidgets[subWidgetId].hideError();
    });
    this.setProperties({
      "uniface": {
        "error": false,
        "error-message": ""
      }
    });
  }

  /**
   * Blocks user interaction with the widget.
   */
  blockUI() {
    this.log("blockUI");

    /** @type {Object} */
    let widgetClass = this.constructor;
    // Call blockUI() for each sub-widget.
    Object.keys(this.subWidgets).forEach((key) => {
      this.subWidgets[key].blockUI();
    });
    // Check if uiBlocking is defined in the constructor.
    if (widgetClass.uiBlocking) {
      // Add the 'u-blocked' class to the widget element.
      this.elements.widget.classList.add("u-blocked");
      // Handle different types of UI blocking.
      switch (widgetClass.uiBlocking) {
        case "disabled":
          // If uiBlocking is set to "disabled", disable the widget element.
          this.elements.widget.disabled = true;
          break;
        case "readonly":
          // If uiBlocking is set to "readonly", set the widget element to read-only.
          this.elements.widget.readOnly = true;
          break;
        default:
          // If uiBlocking has an invalid value, log an error.
          this.error(
            "blockUI()",
            "Static uiBlocking not defined or invalid value",
            "No UI blocking"
          );
      }
    }
  }

  /**
   * Unblocks user interaction with the widget.
   */
  unblockUI() {
    this.log("unblockUI");

    /** @type {Object} */
    let widgetClass = this.constructor;
    // Call unblockUI() for each sub-widget.
    Object.keys(this.subWidgets).forEach((key) => {
      this.subWidgets[key].unblockUI();
    });
    // Check if uiBlocking is defined in the constructor.
    if (widgetClass.uiBlocking) {
      // Remove the 'u-blocked' class from the widget element.
      this.elements.widget.classList.remove("u-blocked");
      // Handle different types of UI blocking.
      switch (widgetClass.uiBlocking) {
        case "disabled":
          // If uiBlocking is set to "disabled",
          // set the widget's disabled property based on the corresponding HTML property value.
          this.elements.widget.disabled = this.toBoolean(
            this.data.properties.html.disabled
          );
          break;
        case "readonly":
          // If uiBlocking is set to "readonly",
          // set the widget's readOnly property based on the corresponding HTML property value.
          this.elements.widget.readOnly = this.toBoolean(
            this.data.properties.html.readonly
          );
          break;
        default:
          // If uiBlocking has an invalid value, log an error.
          this.error(
            "unblockUI()",
            "Static uiBlocking not defined or invalid value",
            "No UI blocking"
          );
      }
    }
  }

  /**
   * Instructs the widget to update itself based on provided data changes.
   * @param {UData} data
   */
  setProperties(data) {

    /** @type {Object} */
    let widgetClass = this.constructor;
    let setters = [];
    this.log("setProperties", data);
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
                  widgetClass.defaultValues[prefix][id];
              } else {
                this.data.properties[prefix][id] = data[prefix][id];
              }
              if (
                widgetClass.setters[prefix] &&
                widgetClass.setters[prefix][id]
              ) {
                widgetClass.setters[prefix][id].forEach((setter) => {
                  setters.push(setter);
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
            Object.keys(data[prefix]).forEach((id) => {
              if (data[prefix][id] === uniface.RESET) {
                this.data.properties[prefix][id] = widgetClass.defaultValues[
                  prefix
                ][id]
                  ? widgetClass.defaultValues[prefix][id]
                  : "unset";
              } else {
                this.data.properties[prefix][id] = data[prefix][id];
              }
              if (widgetClass.setters[prefix]) {
                widgetClass.setters[prefix].forEach((setter) => {
                  setters.push(setter);
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
          case "value":
          case "valrep":
            let id = prefix;
            if (data[id] === uniface.RESET) {
              this.data.properties[id] = widgetClass.defaultValues[id];
            } else {
              this.data.properties[id] = data[id];
            }
            if (widgetClass.setters[id]) {
              widgetClass.setters[id].forEach((setter) => {
                setters.push(setter);
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
                  widgetClass.defaultValues[prefix][id];
              } else {
                this.data.properties[prefix][id] = data[prefix][id];
              }
              if (widgetClass.setters[prefix]) {
                widgetClass.setters[prefix].forEach((setter) => {
                  setters.push(setter);
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
          // This is a sub widget -> delicate TBD.
        }
      });
    }
    setters.forEach((setter) => {
      setter.refresh(this);
    });
  }

  /**
   * Collects trace information and returns a trace message.
   * @return {String}
   */
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
   * @static
   * @param {*} functionName
   * @param {*} data
   */
  static staticLog(functionName, data) {
    if (this.tracing.classNames.all || this.tracing.classNames[this.name]) {
      if (
        this.tracing.functionNames.all ||
        this.tracing.functionNames[functionName]
      ) {
        let prefix = "WIDGET";
        if (["processLayout"].includes(functionName)) {
          prefix = "UX-WIDGET";
        }
        if (data) {
          if (data instanceof HTMLElement) {
            console.log(
              `${prefix}[${this.name}:static].${functionName}("${data.outerHTML}")`
            );
          } else {
            console.log(
              `${prefix}[${this.name}:static].${functionName}(${JSON.stringify(
                data
              )})`
            );
          }
        } else {
          console.log(`${prefix}[${this.name}:static].${functionName}()`);
        }
      }
    }
  }

  /**
   * Logs the provided tracing info in console.log.
   * @param {String} functionName
   * @param {Object} [data]
   */
  log(functionName, data) {

    /** @type {Object} */
    let widgetClass = this.constructor;
    if (
      widgetClass.tracing.classNames.all ||
      widgetClass.tracing.classNames[this.constructor.name]
    ) {
      if (
        widgetClass.tracing.functionNames.all ||
        widgetClass.tracing.functionNames[functionName]
      ) {
        let elementId = "noElementId";
        if (this.elements && this.elements.widget && this.elements.widget.id) {
          elementId = this.elements.widget.id;
        }
        if (
          widgetClass.tracing.elementIds.all ||
          widgetClass.tracing.elementIds[elementId]
        ) {
          let data_ = "";
          if (data) {
            data_ = JSON.stringify(data);
          }
          let prefix = "WIDGET";
          if (
            [
              "constructor",
              "onConnect",
              "mapTrigger",
              "dataInit",
              "dataUpdate",
              "dataCleanup",
              "getValue",
              "validate",
              "showError",
              "hideError",
              "blockUI",
              "unblockUI",
            ].includes(functionName)
          ) {
            prefix = "UX-WIDGET";
          }
          console.log(
            `${prefix}[${this.getTraceDescription()}].${functionName}(${data_})`
          );
        }
      }
    }
  }
}
