// @ts-check
/* global UNIFACE */

import { Widget_UXWF } from "./widget_UXWF.js"; // eslint-disable-line no-unused-vars
import { Base_UXWF } from "./base_UXWF.js";

/**
 * Worker base class.
 * This worker is the abstract base-class for all workers as used by widget class definitions.
 * All worker classes need to extend this class.
 * @export
 * @class Worker
 * @abstract
 * @extends {Base_UXWF}
 */
export class Worker extends Base_UXWF {

  /**
   * Creates an instance of Worker.
   * @param {typeof Widget_UXWF} widgetClass
   */
  constructor(widgetClass) {
    super();
    this.isSetter = true;
    this.widgetClass = widgetClass;
    this.log("constructor", null);
  }

  /**
   * Sets the styleClass that identifies the element this setters work on.
   * @param {String} elementQuerySelector
   */
  setElementQuerySelector(elementQuerySelector) {
    this.elementQuerySelector = elementQuerySelector;
  }

  /**
   * Uses the provided styleClass, which should be unique within the widget, to return the element this setter work on.
   * @param {Widget_UXWF} widgetInstance
   * @return {HTMLElement}
   */
  getElement(widgetInstance) {
    let element = widgetInstance.elements.widget;
    if (this.elementQuerySelector) {
      element = element.querySelector(this.elementQuerySelector);
    }
    return element;
  }

  /**
   * Refresh widget parts this setter is responsible for based on the widget properties.
   * @param {Widget_UXWF} widgetInstance
   */
  refresh(widgetInstance) { // eslint-disable-line no-unused-vars
  }

  /**
   * Type guard function to check if an element is an HTMLInputElement.
   * @param {HTMLElement | null} element
   * @returns {element is HTMLInputElement}
   */
  isHTMLInputElement(element) {
    return element !== null && element instanceof HTMLInputElement;
  }

  /**
   * Provides setter-specific tracing.
   * @param {String} functionName
   * @param {Object} data
   */
  log(functionName, data) {
    const classNames = {
      "all": false,
    };
    if (classNames.all || classNames[this.constructor.name]) {
      let data_ = "";
      if (data) {
        data_ = JSON.stringify(data);
      }
      console.log(`SETTER[${this.widgetClass.name}.${this.constructor.name}].${functionName}(${data_})`);
    }
  }
}

/**
 * Worker: Element
 * Adds and maintains an element where the element is added as a child according to the structure.
 * @export
 * @class Element
 * @extends {Worker}
 */
export class Element extends Worker {

  /**
   * Creates an instance of Element.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {Array} [attributeDefines]
   * @param {Array} [elementDefines]
   * @param {Array} [triggerDefines]
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, attributeDefines, elementDefines, triggerDefines) {
    super(widgetClass);
    this.tagName = tagName;
    this.styleClass = styleClass;
    this.elementQuerySelector = elementQuerySelector;
    this.hidden = false;
    this.attributeDefines = attributeDefines;
    this.elementDefines = elementDefines;
    this.triggerDefines = triggerDefines;
    // Attributes and triggers work on an element.
    // Make sure the setters can find the element by providing the element query selector.
    if (this.attributeDefines) {
      this.attributeDefines.forEach((attributeDefine) => {
        attributeDefine.setElementQuerySelector(this.elementQuerySelector);
      });
    }
    if (this.triggerDefines) {
      this.triggerDefines.forEach((triggerDefine) => {
        triggerDefine.setElementQuerySelector(this.elementQuerySelector);
      });
    }
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} definitions
   * @return {HTMLElement[] | HTMLElement}
   */
  getLayout(definitions) {
    this.log("getLayout", null);
    let element = document.createElement(this.tagName);
    element.hidden = this.hidden;
    if (this.styleClass) {
      element.classList.add(this.styleClass);
    }
    if (this.elementDefines) {
      this.elementDefines.forEach((define) => {
        let childLayout = define.getLayout(definitions);
        if (childLayout instanceof Array) {
          childLayout.forEach((childElement) => {
            element.appendChild(childElement);
          });
        } else if (childLayout) {
          element.appendChild(childLayout);
        }
      });
    }
    return element;
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "styleClass": this.styleClass
    });
    super.refresh(widgetInstance);
  }
}

/**
 * Worker: Icon or text slot.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure,
 * - the element is being slotted into the web-component (the parent element),
 * - the element has innerText and Icon capabilities.
 * @export
 * @class SlottedElement
 * @extends {Element}
 */
export class SlottedElement extends Element {

  /**
   * Creates an instance of SlottedElement.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   * @param {UPropName} [propText]
   * @param {UPropValue} [defaultText]
   * @param {UPropName} [propIcon]
   * @param {UPropValue} [defaultIcon]
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, propText, defaultText, propIcon, defaultIcon) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.propText = propText;
    this.defaultText = defaultText;
    this.propIcon = propIcon;
    this.defaultIcon = defaultIcon;
    if (this.propIcon) {
      this.registerSetter(widgetClass, this.propIcon, this);
      this.registerDefaultValue(widgetClass, this.propIcon, defaultIcon);
    }
    if (this.propText) {
      this.registerSetter(widgetClass, this.propText, this);
      this.registerDefaultValue(widgetClass, this.propText, defaultText);
    }
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let icon = this.getNode(widgetInstance.data.properties, this.propIcon);
    let text = this.getNode(widgetInstance.data.properties, this.propText);
    if (icon) {
      element.hidden = false;
      element.slot = this.slot;
      element.classList.add("ms-Icon");
      element.classList.add(`ms-Icon--${icon}`);
      element.innerText = "";
    } else if (text) {
      element.hidden = false;
      element.slot = this.slot;
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("ms-")) {
          element.classList.remove(className);
        }
      });
      element.innerText = text;
    } else {
      element.hidden = true;
      // Force to default slot to avoid unwanted paddings and margins.
      element.slot = "";
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("ms-")) {
          element.classList.remove(className);
        }
      });
      element.innerText = "";
    }
  }
}

/**
 * Worker: Error slot.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure,
 * - the element is being slotted into the web-component (the parent element),
 * - the element provides the data-validation error visualization of the widget.
 * @export
 * @class SlottedError
 * @extends {Element}
 */
export class SlottedError extends Element {

  /**
   * Creates an instance of SlottedError.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.registerSetter(widgetClass, "uniface:error", this);
    this.registerSetter(widgetClass, "uniface:error-message", this);
    this.registerSetter(widgetClass, "uniface:format-error", this);
    this.registerSetter(widgetClass, "uniface:format-error-message", this);
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let error = this.toBoolean(this.getNode(widgetInstance.data.properties, "uniface:error"));
    let errorMessage = this.getNode(widgetInstance.data.properties, "uniface:error-message");
    let formatError = this.toBoolean(this.getNode(widgetInstance.data.properties, "uniface:format-error"));
    let formatErrorMessage = this.getNode(widgetInstance.data.properties, "uniface:format-error-message");
    let element = widgetInstance.elements.widget;
    let errorElement = this.getElement(widgetInstance);
    if (errorElement) {
      if (formatError) {
        element.classList.add("u-format-invalid");
        errorElement.title = formatErrorMessage;
        errorElement.hidden = false;
        errorElement.slot = this.slot;
        errorElement.classList.add("ms-Icon");
        errorElement.classList.add("ms-Icon--AlertSolid");
      } else if (error) {
        element.classList.add("u-invalid");
        errorElement.title = errorMessage;
        errorElement.hidden = false;
        errorElement.slot = this.slot;
        errorElement.classList.add("ms-Icon");
        errorElement.classList.add("ms-Icon--AlertSolid");
      } else {
        element.classList.remove("u-invalid");
        element.classList.remove("u-format-invalid");
        errorElement.title = "";
        errorElement.hidden = true;
        errorElement.slot = "";
        errorElement.classList.remove("ms-Icon");
        errorElement.classList.remove("ms-Icon--AlertSolid");
      }
    } else {
      this.error("refresh", `No element found for styleClass '${this.styleClass}'`, "Ignored");
    }
  }
}

/**
 * Worker: Sub-widget slot.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure,
 * - the element is a UX widget,
 * - the element is being slotted into the web-component (the parent element).
 * @export
 * @class SlottedWidget
 * @extends {Element}
 */
export class SlottedWidget extends Element {

  /**
   * Creates an instance of SlottedWidget.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   * @param {String} subWidgetId
   * @param {String} subWidgetClassName
   * @param {Object} subWidgetDefaultValues
   * @param {Boolean} visible
   * @param {Array} subWidgetTriggers
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, subWidgetId, subWidgetClassName, subWidgetDefaultValues, visible, subWidgetTriggers) {
    // Overwrite with hard-coded values based on sub-widget id
    styleClass = `u-sw-${subWidgetId}`;
    elementQuerySelector = `.${styleClass}`;
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.subWidgetId = subWidgetId;
    this.subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
    if (this.subWidgetClass) {
      if (subWidgetDefaultValues) {
        Object.keys(subWidgetDefaultValues).forEach((propId) => {
          this.registerDefaultValue(widgetClass, `${subWidgetId}:${propId}`, subWidgetDefaultValues[propId]);
        });
      }
      this.slot = slot;
      // Register sub-widget and the property workers that toggle the sub-widget visible attribute.
      this.propId = `uniface:${subWidgetId}`;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, visible);
      this.registerSubWidget(widgetClass, subWidgetId, this.subWidgetClass, this.styleClass, subWidgetTriggers);
    } else {
      this.error("constructor", `Widget class with name '${subWidgetClassName}' not found in UNIFACE.widgetRepository.`, "Not available");
    }
  }

  getLayout() {
    let element = document.createElement(this.tagName);
    element = this.subWidgetClass.processLayout(element);
    element.hidden = true;
    element.classList.add(this.styleClass);
    return element;
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let widgetElement = widgetInstance.elements.widget;
    let subWidgetElement = this.getElement(widgetInstance);
    if (this.toBoolean(this.getNode(widgetInstance.data.properties, this.propId))) {
      subWidgetElement.hidden = false;
      subWidgetElement.slot = this.slot || "";
      widgetElement.classList.add(`${this.styleClass}-shown`);
    } else {
      subWidgetElement.hidden = true;
      subWidgetElement.slot = "";
      widgetElement.classList.remove(`${this.styleClass}-shown`);
    }
  }
}

/**
 * Worker: Sub-widgets generated by uniface properties.
 * This worker adds one or more sub-widgets to the widget based on object definitions.
 * This happens once during processLayout and cannot be changed afterwards.
 * The property, of which the name is specified by propId, holds a Uniface list of subWidgetIds which are be added as sub-widgets:
 *   "sub-widget1;sub-widget2;sub-widget3;sub-widget4"
 * For each sub-widget, additional properties need to be available:
 *   - "<subWidgetId>:widget-class" - defines the sub-widget's widget-class as registered with UNIFACE.classRegistry
 *   - "<subWidgetId>:properties" - defines a list of property ids that need to be passed on to the sub-widget;
 *     if not defined, all properties are passed on to the sub-widget.
 *   - "<subWidgetId>:triggers" - defines a list of trigger names that need to be mapped on to the wub-widget;
 *     if not defined, all triggers are mapped to the sub-widget.
 * The sub-widgets receive a style-class, of syntax "u-sw-<subWidgetId>", to allow custom styling of the sub-widgets.
 * @export
 * @class WidgetsByProperty
 * @extends {Element}
 */
export class WidgetsByProperty extends Element {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {String} tagName - Specifies the wub-widget's element tag-name.
   * @param {String} styleClass - Specifies the style class for custom styling of the sub-widget.
   * @param {String} elementQuerySelector - Specifies the querySelector to find the sub-widget back.
   * @param {UPropName} propId - specifies the property used to get the ids of the to be added sub-widgets.
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, propId) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.styleClass = styleClass;
    this.propId = propId;
    this.registerSubWidgetWorker(widgetClass, this);
    this.registerSetter(widgetClass, "value", this);
    this.registerDefaultValue(widgetClass, "value", null);
    this.registerGetter(widgetClass, "value", this);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @return {HTMLElement[]}
   */
  getLayout(objectDefinition) {
    let elements = [];
    let validSubWidgetIds = [];
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        let propName = `${subWidgetId}:widget-class`;
        let subWidgetClassName = objectDefinition.getProperty(propName);
        if (subWidgetClassName) {
          let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
          if (subWidgetClass) {
            validSubWidgetIds.push(subWidgetId);
            let element = document.createElement(this.tagName);
            element = subWidgetClass.processLayout(element, objectDefinition);
            let subWidgetStyleClass = `u-sw-${subWidgetId}`;
            element.classList.add(subWidgetStyleClass);
            elements.push(element);
          } else {
            this.warn("getLayout", `Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry.`, `Creation of sub-widget '${subWidgetId}' skipped`);
          }
        } else {
          this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
        }
      });
    } else {
      this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped");
    }
    // Some sub-widgets might not get created -> update the property.
    objectDefinition.setProperty(this.propId, validSubWidgetIds.join(""));
    return elements;
  }

  /**
   * Collects the subWidget definitions based on the properties and returns them.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Object}
   */
  getSubWidgetDefinitions(objectDefinition) {
    let subWidgetDefinitions = {};
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        let subWidgetDefinition = {};
        // Add widget class name to definition.
        let subWidgetClassName = objectDefinition.getProperty(`${subWidgetId}:widget-class`);
        let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
        subWidgetDefinition.class = subWidgetClass;
        // Add subWidgetId as styleClass to definition.
        subWidgetDefinition.styleClass = `u-sw-${subWidgetId}`;
        // Add triggers that need to be enabled to definition.
        let subWidgetTriggers = objectDefinition.getProperty(`${subWidgetId}:widget-triggers`)?.split("") || [];
        subWidgetDefinition.triggers = subWidgetTriggers;
        // Add to set.
        subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
      });
    }
    return subWidgetDefinitions;
  }

  getValue(widgetInstance) {
    let value = {};
    Object.keys(widgetInstance.subWidgets).forEach((subWidgetId) => {
      value[subWidgetId] = widgetInstance.subWidgets[subWidgetId].getValue();
    });
    return JSON.stringify(value);
  }

  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
    return;
  }
}

/**
 * Under construction.
 * Worker: Sub-widgets generated by uniface fields.
 * This worker adds one or more sub-widgets to the widget based on the data-object's fields as defined in its definition.
 * This happens once during processLayout and cannot be changed afterwards.
 * The property, of which the name is specified by propId, holds a Uniface list of subWidgetIds which are to be added as sub-widgets:
 *   "sub-widget1;sub-widget2;sub-widget3;sub-widget4"
 * For each sub-widget, additional properties need to be available:
 *   - "<subWidgetId>:widget-class" - defines the sub-widget's widget-class as registered with UNIFACE.classRegistry
 *   - "<subWidgetId>:properties" - defines a list of property ids that need to be passed on to the sub-widget;
 *     if not defined, all properties are passed on to the sub-widget.
 *   - "<subWidgetId>:triggers" - defines a list of trigger names that need to be mapped on to the wub-widget;
 *     if not defined, all triggers are mapped to the sub-widget.
 * The sub-widgets receive a style-class, of syntax "u-sw-<subWidgetId>", to allow custom styling of the sub-widgets.
 * @export
 * @class WidgetsByProperty
 * @extends {Element}
 */
export class WidgetsByFields extends Element {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {String} tagName - Specifies the wub-widget's element tag-name.
   * @param {String} styleClass - Specifies the style class for custom styling of the sub-widget.
   * @param {String} elementQuerySelector - Specifies the querySelector to find the sub-widget back.
   * @param {UPropName} propId - specifies the property used to get the ids of the to be added sub-widgets.
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, propId) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.styleClass = styleClass;
    this.propId = propId;
    this.registerSubWidgetWorker(widgetClass, this);
    this.registerSetter(widgetClass, "value", this);
    this.registerDefaultValue(widgetClass, "value", null);
    this.registerGetter(widgetClass, "value", this);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @return {HTMLElement[]}
   */
  // getLayout(objectDefinition) {
  //   let excludePropId = this.propId;
  //   let elements = [];
  //   let childDefinitions = objectDefinition.getChildDefinitions();
  //   if (childDefinitions) {
  //     childDefinitions.forEach(childDefinition => {
  //       if (excludePropId && this.toBoolean(childDefinition.getProperty(excludePropId)) != true) {
  //         // Only include if exclude property is not true
  //         if (childDefinition.getType() == "field") {
  //           // Only include fields
  //           let childElements = super.getLayout(childDefinition);
  //           childElements?.forEach(childElement => {
  //             childElement.setAttribute("u-type", childDefinition.getType());
  //             childElement.setAttribute("u-name", childDefinition.getName());
  //             elements.push(childElement);
  //           })
  //         }
  //       }
  //     });
  //   }
  //   return elements;
  // }

  getLayout(objectDefinition) {
    let elements = [];
    let actualSubWidgetIds = [];
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        let propName = `${subWidgetId}:widget-class`;
        let subWidgetClassName = objectDefinition.getProperty(propName);
        if (subWidgetClassName) {
          let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
          if (subWidgetClass) {
            actualSubWidgetIds.push(subWidgetId);
            let element = document.createElement(this.tagName);
            element = subWidgetClass.processLayout(element, objectDefinition);
            let subWidgetStyleClass = `u-sw-${subWidgetId}`;
            element.classList.add(subWidgetStyleClass);
            elements.push(element);
          } else {
            this.warn("getLayout", `Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry.`, `Creation of sub-widget '${subWidgetId}' skipped`);
          }
        } else {
          this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
        }
      });
    } else {
      this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped");
    }
    // Some sub-widgets might not get created -> update the property.
    objectDefinition.setProperty(this.propId, actualSubWidgetIds.join(""));
    return elements;
  }

  /**
   * Collects the subWidget definitions based on the properties and returns them.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Object}
   */
  getSubWidgetDefinitions(objectDefinition) {
    let subWidgetDefinitions = {};
    let subWidgetIds = objectDefinition.getProperty(this.propId);
    if (subWidgetIds) {
      subWidgetIds.split("")?.forEach((subWidgetId) => {
        let subWidgetDefinition = {};
        // Add widget class name to definition.
        let subWidgetClassName = objectDefinition.getProperty(`${subWidgetId}:widget-class`);
        let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
        subWidgetDefinition.class = subWidgetClass;
        // Add subWidgetId as styleClass to definition.
        subWidgetDefinition.styleClass = `u-sw-${subWidgetId}`;
        // Add triggers that need to be enabled to definition.
        let subWidgetTriggers = objectDefinition.getProperty(`${subWidgetId}:widget-triggers`)?.split("") || [];
        subWidgetDefinition.triggers = subWidgetTriggers;
        // Add to set.
        subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
      });
    }
    return subWidgetDefinitions;
  }

  getValue(widgetInstance) {
    let value = {};
    Object.keys(widgetInstance.subWidgets).forEach((subWidgetId) => {
      value[subWidgetId] = widgetInstance.subWidgets[subWidgetId].getValue();
    });
    return JSON.stringify(value);
  }

  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
    return;
  }
}

/**
 * Worker: Html attribute base abstract.
 * This worker is abstract base-class for all workers that maintain an attribute of an element.
 * @export
 * @class BaseHtmlAttribute
 * @abstract
 * @extends {Worker}
 */
export class BaseHtmlAttribute extends Worker {

  /**
   * Creates an instance of BaseHtmlAttribute.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {UPropName | undefined} [propId]
   * @param {String} [attrName]
   * @param {UPropValue} [defaultValue]
   * @param {Boolean} [setAsAttribute]
   */
  constructor(widgetClass, propId, attrName, defaultValue, setAsAttribute) {
    super(widgetClass);
    if (arguments.length > 1) {
      // Generate a unique private prop-id.
      this.propId = propId || `uniface:i${Math.random()}`;
      if (attrName) {
        this.attrName = attrName;
      }
      this.defaultValue = defaultValue;
      this.setAsAttribute = setAsAttribute;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, defaultValue);
      if (this.propId === "value") {
        // This setter maps the Uniface value property -> register getter.
        this.registerGetter(widgetClass, this.propId, this);
      }
    }
  }

  getLayout() {
    return {
      "attrName": this.attrName,
      "attrValue": this.defaultValue
    };
  }

  setHtmlAttribute(element, attrValue) {
    if (this.attrName) {
      const validatedAttributes = ["readonly", "type", "pattern", "min", "max", "minlength", "maxlength"];
      if (validatedAttributes.includes(this.attrName) && element.value !== "") {
        this.warn("refresh", `Property '${this.propId}' influences HTML5 validation rules and cannot be set if control-value is not ""`, "Ignored");
        return;
      }
      if (this.attrName === "innerText") {
        if (attrValue === undefined || attrValue === null) {
          element.innerText = "";
        } else {
          element.innerText = attrValue;
        }
      } else if (attrValue === undefined || attrValue === null) {
        if (this.setAsAttribute) {
          element.removeAttribute(this.attrName);
        } else {
          delete element[this.attrName];
        }
      } else {
        if (this.setAsAttribute) {
          element.setAttribute(this.attrName, attrValue);
        } else {
          element[this.attrName] = attrValue;
        }
      }
    }
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
  }

  getValue(widgetInstance) {
    this.log("getValue", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let value = null;
    if (this.attrName) {
      let element = this.getElement(widgetInstance);
      value = element[this.attrName];
      return value;
    }
  }

  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let element = this.getElement(widgetInstance);
    let updaters = [];
    updaters.push({
      "element": element,
      "event_name": "change",
    });
    return updaters;
  }
}

/**
 * Woker: Html attribute string.
 */
export class HtmlAttribute extends BaseHtmlAttribute {
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    this.setHtmlAttribute(element, value);
  }
}

/**
 * Worker: Html attribute choice.
 */
export class HtmlAttributeChoice extends BaseHtmlAttribute {

  constructor(widgetClass, propId, attrName, choices, defaultValue, setAsAttribute) {
    super(widgetClass, propId, attrName, defaultValue, setAsAttribute);
    this.choices = choices;
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    if (this.choices.includes(value)) {
      this.setHtmlAttribute(element, value);
    } else {
      this.warn("refresh", `Property '${this.propId}' invalid value (${value})`, "Ignored");
    }
  }
}

/**
 * Worker: Html attribute number.
 */
export class HtmlAttributeNumber extends BaseHtmlAttribute {
  constructor(widgetClass, propId, attrName, min, max, defaultValue, setAsAttribute) {
    super(widgetClass, propId, attrName, defaultValue, setAsAttribute);
    this.min = min;
    this.max = max;
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    if (value !== undefined && value !== null) {
      value = parseInt(value);
      if (this.min !== undefined && this.min !== null && value < this.min) {
        this.warn("refresh", `Property '${this.propId}' must be a number >== ${this.min}`, "Ignored");
        return;
      } else if (
        this.max !== undefined &&
        this.max !== null &&
        value > this.max
      ) {
        this.warn("refresh", `Property '${this.propId}' must be a number <== ${this.max}`, "Ignored");
        return;
      }
    }
    this.setHtmlAttribute(element, value);
  }
}

/**
 * Worker: Html attribute boolean.
 */
export class HtmlAttributeBoolean extends BaseHtmlAttribute {
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    if (this.attrName) {
      super.refresh(widgetInstance);
      let element = this.getElement(widgetInstance);
      let value = this.getNode(widgetInstance.data.properties, this.propId);
      element[this.attrName] = this.toBoolean(value);
    }
  }
}

/**
 * Worker: Html value attribute boolean.
 */
export class HtmlValueAttributeBoolean extends BaseHtmlAttribute {
  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let element = this.getElement(widgetInstance);
    let updaters = [];
    updaters.push({
      "element": element,
      "event_name": "change",
      "handler": () => {
        widgetInstance.setProperties({
          "uniface": {
            "format-error": false,
            "format-error-message": ""
          }
        });
        widgetInstance.setProperties({
          "uniface": {
            "error": false,
            "error-message": ""
          }
        });
      }
    });
    return updaters;
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    // Validate value before assigning.
    try {
      this.setHtmlAttribute(element, this.fieldValueToBoolean(value));
      widgetInstance.setProperties({
        "uniface": {
          "format-error": false,
          "format-error-message": ""
        }
      });
    } catch (error) {
      widgetInstance.setProperties({
        "uniface": {
          "format-error": true,
          "format-error-message": error
        }
      });
    }
  }
}

/**
 * Worker: Html minlength/maxlength attribute pair.
 */
export class HtmlAttributeMinMaxLength extends Worker {
  constructor(widgetClass, propMin, propMax, defaultMin, defaultMax) {
    super(widgetClass);
    this.propMin = propMin;
    this.propMax = propMax;
    this.defaultMin = defaultMin;
    this.defaultMax = defaultMax;
    this.registerSetter(widgetClass, propMin, this);
    this.registerSetter(widgetClass, propMax, this);
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrNames": ["minlength", "maxlength"]
    });
    let element = this.getElement(widgetInstance);
    if (this.isHTMLInputElement(element) && element.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    /** @type {Number|null} */
    let minlength = parseInt(this.getNode(widgetInstance.data.properties, this.propMin));
    if (Number.isNaN(minlength)) {
      minlength = null;
    } else if (minlength < 0) {
      this.warn("refresh()", `Property '${this.propMin}' is not a positive number`, "Ignored");
      return;
    }

    /** @type {Number|null} */
    let maxlength = parseInt(this.getNode(widgetInstance.data.properties, this.propMax));
    if (Number.isNaN(maxlength)) {
      maxlength = null;
    } else if (maxlength === 0) {
      // In Uniface means no maximum length.
      maxlength = null;
    } else if (maxlength < 0) {
      this.warn("refresh()", `Property '${this.propMax}' is not a positive number`, "Ignored");
      return;
    }
    // BUG: Once maxlength has been set once, fluent forces it to 0 when being unset (attribute).
    // This causes checks to fail or exceptions to be thrown.
    if (maxlength !== null) {
      // maxlength has been set at least once.
      widgetInstance.widget.maxlengthHasBeenSet = true;
    } else if (widgetInstance.widget.maxlengthHasBeenSet) {
      // Instead of removing the maxlength attribute, force it to a very high number => 10000.
      maxlength = this.defaultMax;
    }
    if (minlength === null && maxlength === null) {
      element.removeAttribute("minlength");
      element.removeAttribute("maxlength");
    } else if (minlength === null && maxlength !== null) {
      element.removeAttribute("minlength");
      element["maxlength"] = maxlength;
    } else if (minlength !== null && maxlength === null) {
      element.removeAttribute("maxlength");
      element["minlength"] = minlength;
    } else if (minlength && maxlength && minlength > maxlength) {
      this.warn("setMinMaxLength()", `Invalid combination of 'html:minlength' (${this.propMin}) and 'html:maxlength' (${this.propMax})`, "Ignored");
    } else {
      element["maxlength"] = 10000;
      element["minlength"] = 0;
      element["minlength"] = minlength;
      element["maxlength"] = maxlength;
    }
  }
}

/**
 * Worker: Html min/max attribute pair - untested.
 */
export class HtmlAttributeMinMax extends BaseHtmlAttribute {
  constructor(widgetClass, propMin, propMax, defaultMin, defaultMax) {
    super(widgetClass);
    this.propMin = propMin;
    this.propMax = propMax;
    this.defaultMin = defaultMin;
    this.defaultMax = defaultMax;
    this.registerSetter(widgetClass, propMin, this);
    this.registerSetter(widgetClass, propMax, this);
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrNames": ["min", "max"]
    });
    let element = this.getElement(widgetInstance);
    if (this.isHTMLInputElement(element) && element.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    // Calculate the property values.
    /** @type {Number|null} */
    let min = parseInt(this.getNode(widgetInstance.data.properties, this.propMin));
    if (Number.isNaN(min)) {
      min = null;
    }

    /** @type {Number|null} */
    let max = parseInt(this.getNode(widgetInstance.data.properties, this.propMax));
    if (Number.isNaN(max)) {
      max = null;
    }

    // Assign the property values to the attributes.
    if (min === null && max === null) {
      element.removeAttribute("min");
      element.removeAttribute("max");
    } else if (min === null && max !== null) {
      element.removeAttribute("min");
      element["max"] = max;
    } else if (min !== null && max === null) {
      element.removeAttribute("max");
      element["min"] = min;
    } else if (min && max && min > max) {
      this.warn("refresh()", `Invalid combination of '${this.propMin}' (${min}) and '${this.propMax}' (${max})`, "Ignored");
    } else {
      element["min"] = this.defaultMin;
      element["max"] = this.defaultMax;
      element["min"] = min;
      element["max"] = max;
    }
  }
}

/**
 * Worker: All style classes.
 */
export class StyleClass extends Worker {
  constructor(widgetClass, defaultClassList) {
    super(widgetClass);
    this.registerSetter(widgetClass, "classes", this);
    defaultClassList.forEach((className) => {
      this.registerDefaultValue(widgetClass, `classes:${className}`, true);
    });
  }

  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    let classNames = widgetInstance.data.properties.classes;
    Object.keys(classNames).forEach((className) => {
      let value = widgetInstance.data.properties.classes[className];
      if (value) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    });
  }
}

/**
 * Worker: All style property.
 */
export class StyleProperty extends Worker {
  constructor(widgetClass, property) {
    super(widgetClass);
    this.defaultStyleProperty = property;
    this.registerSetter(widgetClass, "style", this);
    let key = Object.keys(property)[0];
    this.registerDefaultValue(widgetClass, `style:${key}`, property[key]);
  }

  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let styleProperty = widgetInstance.data.properties.style;
    let element = this.getElement(widgetInstance);
    Object.keys(styleProperty).forEach((key) => {
      element.style[key] = styleProperty[key];
    });
  }
}

/**
 * Worker: Trigger mapping.
 */
export class Trigger extends Worker {
  constructor(widgetClass, triggerName, eventName, validate) {
    super(widgetClass);
    this.triggerName = triggerName;
    this.eventName = eventName;
    this.validate = validate;
    this.registerTrigger(widgetClass, triggerName, this);
  }

  getTriggerMapping(widgetInstance) {
    this.log("getTriggerMapping", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    return {
      "element": element,
      "event_name": this.eventName,
      "validate": this.validate
    };
  }
}

/**
 * Worker: Adds Element for each valrep.
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure.
 * - the element is being slotted into the web-component (the parent element).
 * @export
 * @class SlottedElementsByValRep
 * @extends {Element}
 */
export class SlottedElementsByValRep extends Element {

  /**
   * Creates an instance of SlottedElementsByValRep.
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;

    this.registerSetter(widgetClass, "valrep", this);
    this.registerDefaultValue(widgetClass, "valrep", []);

    this.registerSetter(widgetClass, "uniface:display-format", this);
    this.registerDefaultValue(widgetClass, "uniface:display-format", "rep");

    this.registerSetter(widgetClass, "value", this);
    this.registerDefaultValue(widgetClass, "value", null);
  }

  /**
   * Formats error message if valrep is not defined.
   */
  reformatErrorText(widgetInstance) {
    const displayFormat = this.getNode(widgetInstance.data.properties, "uniface:display-format");
    let data = widgetInstance.data.properties;
    let text = "";
    switch (displayFormat) {
      case "valrep":
        text = "ERROR: Unable to show representation of value " + (data.value || "null");
        break;
      case "val":
        text = "ERROR: Invalid value " + (data.value || "null");
        break;
      case "rep":
      default:
        text = "ERROR: Unable to show representation of value";
    }
    return text;
  }

  /**
   * Removes all valrep elements from this worker.
   */
  removeValRepElements(widgetInstance) {
    let element =  this.getElement(widgetInstance);
    let valrepElements = element.querySelectorAll(this.tagName);
    valrepElements.forEach((element) => {
      element.remove();
    });
  }

  /**
   * Formats the valrep based on the display format property.
   */
  formatValRepElements(widgetInstance, childElement, value, representation) {
    const displayFormat = this.getNode(widgetInstance.data.properties, "uniface:display-format");
    switch (displayFormat) {
      case "valrep":
        childElement.innerHTML ='<span class="u-valrep-representation">' + representation + '</span> <span class="u-valrep-value">' + (value || "null") + '</span>';
        break;
      case "val":
        childElement.innerHTML = '<span class="u-valrep-value">' + (value || "") + '</span>';
        break;
      case "rep":
      default:
        childElement.innerHTML = '<span class="u-valrep-representation">' + representation + '</span>';
    }
  }

  /**
   * Creates all valrep elements from this worker.
   */
  createValRepElements(widgetInstance) {
    let element = this.getElement(widgetInstance);
    let valrep = this.getNode(widgetInstance.data.properties, "valrep");

    if (valrep.length > 0) {
      valrep.forEach((valRepObj) => {
        const childElement = document.createElement(this.tagName);
        element.appendChild(childElement);
        childElement.setAttribute("value", valRepObj.value);
        childElement.setAttribute("class", this.styleClass);
        this.formatValRepElements(widgetInstance, childElement, valRepObj.value, valRepObj.representation);
      });
    }
  }

  refresh(widgetInstance) {
    this.removeValRepElements(widgetInstance);
    this.createValRepElements(widgetInstance);
  }
}