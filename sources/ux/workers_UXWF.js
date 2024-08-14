//@ts-check

import { Widget_UXWF } from "./widget_UXWF.js";
import { Base_UXWF } from "./base_UXWF.js";


/**
 * WORKER BASE CLASS
 * This worker is the abstract base-class for all workers as used by widget class definitions.
 * All worker classes need to extend this class.
 *
 * @export
 * @class Worker
 * @abstract
 * @extends {Base_UXWF}
 */
export class Worker extends Base_UXWF {

  /**
   * Creates an instance of Worker.
   * @param {typeof Widget_UXWF} widgetClass
   * @memberof Worker
   */
  constructor(widgetClass) {
    super();
    this.isSetter = true;
    this.widgetClass = widgetClass;
    this.log("constructor", null);
  }

  /**
   * Sets the styleClass that identifies the element this setters work on.
   *
   * @param {String} elementQuerySelector
   * @memberof Worker
   */
  setElementQuerySelector(elementQuerySelector) {
    this.elementQuerySelector = elementQuerySelector;
  }

  /**
   * Uses the provided styleClass, which should be unique within the widget, to return the element this setter work on.
   *
   * @param {Widget_UXWF} widgetInstance
   * @return {HTMLElement} 
   * @memberof Worker
   */
  getElement(widgetInstance) {
    let element = widgetInstance.elements.widget;
    if (this.elementQuerySelector && this.elementQuerySelector !== "") {
      element = element.querySelector(this.elementQuerySelector);
    }
    return element;
  }

  /**
   * Refresh widget parts this setter is responsible for based on the widget properties.
   *
   * @param {Widget_UXWF} widgetInstance
   * @memberof Worker
   */
  refresh(widgetInstance) {
  }

  /**
   * Provides setter-specific tracing.
   *
   * @param {String} functionName
   * @param {Object} data
   * @memberof Worker
   */
  log(functionName, data) {
    const classNames = {
      all: true,
    };
    if (classNames.all || classNames[this.constructor.name]) {
      let data_ = "";
      if (data) data_ = JSON.stringify(data);
      console.log(`SETTER[${this.widgetClass.name}.${this.constructor.name}].${functionName}(${data_})`);
    }
  }
}

/**
 * WORKER: ELEMENT
 * Adds and maintains an element where the element is added as a child according the structure
 *
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
   * @memberof Element
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
    // Attributes and triggers work on an element
    /// Make sure the setters can find the element by providing the element query selector.
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
   * Generate and return layout for this setter
   *
   * @param {UObjectDefinition} definitions
   * @return {HTMLElement[] | HTMLElement} 
   * @memberof SlotsWidgetByProperty
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
          childLayout.forEach(childElement => {
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
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), styleClass: this.styleClass });
    super.refresh(widgetInstance);
  }
}

/**
 * WORKER: ICON OR TEXT SLOT
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure
 * - the element is being slotted into the web-component (the parent element).
 * - the element has innerText and Icon capabilities
 * 
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
   * @memberof SlottedElement
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, propText, defaultText, propIcon, defaultIcon) {
    super(widgetClass, tagName, styleClass, elementQuerySelector, undefined, undefined, undefined);
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
      element.slot = ""; // force to default slot to avoid unwanted paddings and margins
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
 * WORKER: ERROR SLOT
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure
 * - the element is being slotted into the web-component (the parent element).
 * - the element provides the data-validation error visualization of the widget.
 *
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
   * @memberof SlottedError
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot) {
    super(widgetClass, tagName, styleClass, elementQuerySelector, undefined, undefined, undefined);
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
 * WORKER: SUB-WIDGET SLOT
 * This setter adds an element to your widget, where:
 * - the element is added as a child according the structure
 * - the element is a UX widget
 * - the element is being slotted into the web-component (the parent element).
 *
 * @export
 * @class SlottedWidget
 * @extends {Element}
 */
export class SlottedWidget extends Element {

  /**
   * Creates an instance of SlottedWidget.
   * 
   * @param {typeof Widget_UXWF} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   * @param {String} subWidgetId
   * @param {String} subWidgetName
   * @param {Object} subWidgetDefaultValues
   * @param {Boolean} visible
   * @param {Array} subWidgetTriggers
   * @memberof SlottedWidget
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, subWidgetId, subWidgetName, subWidgetDefaultValues, visible, subWidgetTriggers) {
    super(widgetClass, tagName, styleClass, elementQuerySelector, undefined, undefined, undefined);
    this.subWidget = UNIFACE.ClassRegistry.get(subWidgetName);
    if (this.subWidget) {
      if (subWidgetDefaultValues) {
        Object.keys(subWidgetDefaultValues).forEach((propId) => {
          this.registerDefaultValue(widgetClass, `${subWidgetId}:${propId}`, subWidgetDefaultValues[propId]);
        });
      }
      this.slot = slot;
      this.styleClass = styleClass;
      // Register setter that makes sub-widget visible and register default value for it
      this.propId = `uniface:${subWidgetId}`;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, visible);
      // Register sub-widget with current widget
      this.registerSubWidget(widgetClass, subWidgetId, this.subWidget, this.styleClass, subWidgetTriggers);
    } else {
      this.error("constructor", `Widget with name '${subWidgetName}' not found in UNIFACE.widgetRepository.`, "Not available")
    }
  }

  getLayout() {
    let element = document.createElement(this.tagName);
    element = this.subWidget.processLayout(element);
    element.hidden = true;
    if (this.styleClass) element.classList.add(this.styleClass);
    return element;
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    if (element) {
      if (this.toBoolean(this.getNode(widgetInstance.data.properties, this.propId))) {
        element.hidden = false;
        element.slot = this.slot || "";
        widgetInstance.elements.widget.classList.add(`${this.styleClass}-shown`);
      } else {
        element.hidden = true;
        element.slot = "";
        widgetInstance.elements.widget.classList.remove(`${this.styleClass}-shown`);
      }
    } else {
      this.error("refresh", `No sub-widget element found for styleClass '${this.styleClass}'`, "Ignored");
    }
  }
}

/**
 * WORKER: SUB-WIDGET SLOT GENERATED BY UNIFACE PROPERTIES
 * This setter adds one or more slotted sub-widgets to the widget based on web-defnitions.
 * This happens statically during processLayout and cannot be changed dynamically.
  * The property, of which the name is specified by propId, holds an array of subWidgetIds of the to be added sub-widgets:
 *   ["sub-widget1", "sub-widget2", "sub-widget3", "sub-widget4"]
 * For every sub-widget, a separate property needs to be available thatto specify the widget-class of the sub-widgets as registered with UNIFACE.classRegistry,
 * where the property name is prefixed by the subWidgetId: "<subWidgetId>:widget-class"
 *   "sub-widget1:widget-class" - Must specify the name of the sub-widget as registered with UNIFACE.classRegistry
 *
 * @export
 * @class SlottedWidgetsByProperty
 * @extends {Element}
 */
export class SlottedWidgetsByProperty extends Element {

  /**
   * Creates an instance of SlottedWidgetsByProperty.
   * 
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget class definition the setter is created for
   * @param {String} tagName - Specifies the wub-widget's element tag-name
   * @param {String} styleClass - Specifies the style class for custom styling of the sub-widget
   * @param {String} elementQuerySelector - Specifies the questySelector to find the sub-eidget back
   * @param {String} slot - Specifies the slot in which the sub-widget needs to be slotted
   * @param {UPropName} propId - specifies the property used to add sub-widgets.
   * @param {Object} [subWidgetDefaultValues] - specifies default values for the sub-widget
   * @memberof SlottedWidgetsByProperty
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, propId, subWidgetDefaultValues) {
    super(widgetClass, tagName, styleClass, elementQuerySelector, undefined, undefined, undefined);
    this.subWidgetDefaultValues = subWidgetDefaultValues;
    this.slot = slot;
    this.styleClass = styleClass;
    this.propId = propId;
  }

  /**
   * Generate and reurn layout for this setter
   *
   * @param {UObjectDefinition} definitions
   * @return {HTMLElement[]}
   * @memberof SlotsWidgetByProperty
   */
  getLayout(definitions) {
    let elements = [];
    let actualSubWidgetIds = [];
    let subWidgetIds = definitions.getProperty(this.propId);
    if (subWidgetIds) {
      // Convert Uniface list into array
      subWidgetIds = subWidgetIds.split("");
      subWidgetIds.forEach(subWidgetId => {
        let propName = `${subWidgetId}:widget-class`;
        let subWidgetClassName = definitions.getProperty(propName);
        if (subWidgetClassName) {
          let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
          if (subWidgetClass) {
            actualSubWidgetIds.push(subWidgetId);
            let element = document.createElement(this.tagName);
            element = subWidgetClass.processLayout(element, definitions);
            if (this.styleClass) element.classList.add(this.styleClass);
            elements.push(element);
          } else {
            this.warn("getLayout", `Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry.`, `Creation of sub-widget '${subWidgetId}' skipped`);
          }
        } else {
          this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
        }
      });
    } else {
      this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped")
    }
    // Some sub-widgets might not get created -> update the property
    definitions.setProperty(this.propId, actualSubWidgetIds);
    return elements;
  }
}

export class WidgetsByProperty extends Element {

  /**
   * Creates an instance of WidgetsByProperty.
   * 
   * @param {typeof Widget_UXWF} widgetClass - Specifies the widget class definition the setter is created for
   * @param {String} tagName - Specifies the wub-widget's element tag-name
   * @param {String} styleClass - Specifies the style class for custom styling of the sub-widget
   * @param {String} elementQuerySelector - Specifies the questySelector to find the sub-eidget back
   * @param {UPropName} propId - specifies the property used to get the ids of the to be added sub-widgets.
   * @memberof SlottedWidgetsByProperty
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, propId) {
    super(widgetClass, tagName, styleClass, elementQuerySelector, undefined, undefined, undefined);
    this.styleClass = styleClass;
    this.propId = propId;
  }

  /**
   * Generate and return layout for this setter
   *
   * @param {UObjectDefinition} definitions
   * @return {HTMLElement[]}
   * @memberof SlotsWidgetByProperty
   */
  getLayout(definitions) {
    let elements = [];
    let actualSubWidgetIds = [];
    let subWidgetIds = definitions.getProperty(this.propId);
    if (subWidgetIds) {
      // Convert Uniface list into array
      subWidgetIds = subWidgetIds.split("");
      subWidgetIds.forEach(subWidgetId => {
        let propName = `${subWidgetId}:widget-class`;
        let subWidgetClassName = definitions.getProperty(propName);
        if (subWidgetClassName) {
          let subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
          if (subWidgetClass) {
            actualSubWidgetIds.push(subWidgetId);
            let element = document.createElement(this.tagName);
            element = subWidgetClass.processLayout(element, definitions);
            if (this.styleClass) element.classList.add(this.styleClass);
            elements.push(element);
          } else {
            this.warn("getLayout", `Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry.`, `Creation of sub-widget '${subWidgetId}' skipped`);
          }
        } else {
          this.warn("getLayout", `Property '${propName}' not defined for object.`, `Creation of sub-widget '${subWidgetId}' skipped`);
        }
      });
    } else {
      this.warn("getLayout", `Property '${this.propId}' not defined for object.`, "Creation of sub-widgets skipped")
    }
    // Some sub-widgets might not get created -> update the property
    definitions.setProperty(this.propId, actualSubWidgetIds);
    return elements;
  }
}

/**
 * WORKER: HTML ATTRIBUTE - BASE - ABSTRACT
 * This setter is abstract base-class for all setters that maintain an attribute of an element.
 *
 * @export
 * @class BaseHtmlAttribute
 * @abstract
 * @extends {Worker}
 */
export class BaseHtmlAttribute extends Worker {

  constructor(widgetClass, propId, attrName, defaultValue) {
    super(widgetClass);
    this.propId = propId;
    this.attrName = attrName;
    this.defaultValue = defaultValue;
    this.registerSetter(widgetClass, propId, this);
    this.registerDefaultValue(widgetClass, propId, defaultValue);
    if (propId === "value") {
      // This setter maps the Uniface value property -> register getter
      this.registerGetter(widgetClass, propId, this);
    }
  }

  getLayout() {
    return { attrName: this.attrName, attrValue: this.defaultValue };
  }

  setHtmlAttribute(element, value) {
    const validatedAttributes = ["readonly", "type", "pattern", "min", "max", "minlength", "maxlength"];
    if (validatedAttributes.includes(this.attrName) && element.value !== "") {
      this.warn("refresh", `Property '${this.propId}' influences HTML5 validation rules and cannot be set if control-value is not ""`, "Ignored");
      return;
    }
    if (value === undefined || value === null) {
      element.removeAttribute(this.attrName);
    } else {
      element[this.attrName] = value;
    }
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
  }

  getValue(widgetInstance) {
    this.log("getValue", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
    let element = this.getElement(widgetInstance);
    let value = element[this.attrName];
    return value;
  }

  getValueUpdaters(widgetInstance) {
    this.log("getValueUpdaters", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
    let element = this.getElement(widgetInstance);
    let updaters = [];
    updaters.push({
      element: element,
      event_name: "change",
    });
    return updaters;
  }
}

/**
    WORKER: HTML ATTRIBUTE STRING
  **/
export class HtmlAttribute extends BaseHtmlAttribute {

  constructor(widgetClass, propId, attrName, defaultValue) {
    super(widgetClass, propId, attrName, defaultValue);
  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    this.setHtmlAttribute(element, value);
  }
}

/**
    WORKER: HTML ATTRIBUTE CHOICE
  **/
export class HtmlAttributeChoice extends BaseHtmlAttribute {

  constructor(widgetClass, propId, attrName, choices, defaultValue) {
    super(widgetClass, propId, attrName, defaultValue);
    this.choices = choices;
  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
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
    WORKER: HTML ATTRIBUTE NUMBER
  **/
export class HtmlAttributeNumber extends BaseHtmlAttribute {

  constructor(widgetClass, propId, attrName, min, max, defaultValue) {
    super(widgetClass, propId, attrName, defaultValue);
    this.min = min;
    this.max = max;
  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
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
    WORKER: HTML ATTRIBUTE BOOLEAN
  **/
export class HtmlAttributeBoolean extends BaseHtmlAttribute {

  constructor(widgetClass, propId, attrName, defaultValue) {
    super(widgetClass, propId, attrName, defaultValue);
  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    element[this.attrName] = this.toBoolean(value);
  }
}

/**
    SETTER: HTML Value ATTRIBUTE BOOLEAN
  **/
export class HtmlValueAttributeBoolean extends HtmlAttributeBoolean {

  constructor(widgetClass, propId, attrName, defaultValue) {
    super(widgetClass, propId, attrName, defaultValue);
  }


  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrName: this.attrName });
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data.properties, this.propId);
    //Validate value before assigning
    try {
      element[this.attrName] = this.fieldValueToBoolean(value);
      widgetInstance.setProperties({ uniface: { "format-error": false, "format-error-message": "" } })
    } catch (error) {
      widgetInstance.setProperties({ uniface: { "format-error": true, "format-error-message": error } })
    }
  }
}

/**
    SETTER: HTML MINLENGTH/MAXLENGTH ATTRIBUTE PAIR
  **/
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
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrNames: ["minlength", "maxlength"] });
    /** @type {HTMLInputElement} */
    let element = this.getElement(widgetInstance);
    if (element.value != "") {
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
      // In Uniface means no maximum length
      maxlength = null;
    } else if (maxlength < 0) {
      this.warn("refresh()", `Property '${this.propMax}' is not a positive number`, "Ignored");
      return;
    }
    // BUG: Once maxlength has been set once, fluent forces it to 0 when being unset (attribute).
    // This causes checks to fail or exceptions to be thrown.
    if (maxlength !== null) {
      // maxlength has been set at least once
      widgetInstance.widget.maxlengthHasBeenSet = true;
    } else if (widgetInstance.widget.maxlengthHasBeenSet) {
      // Instead of removing the maxlength attribute, force it to a very high number => 10000
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
    } else if (minlength > maxlength) {
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
    WORKER: HTML MIN/MAX ATTRIBUTE PAIR - UNTESTED
  **/
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
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription(), attrNames: ["min", "max"] });
    /** @type {HTMLSelectElement} */
    let element = this.getElement(widgetInstance);
    if (element.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }
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

    if (min === null && max === null) {
      element.removeAttribute("min");
      element.removeAttribute("max");
    } else if (min === null && max !== null) {
      element.removeAttribute("min");
      element["max"] = max;
    } else if (min !== null && max === null) {
      element.removeAttribute("max");
      element["min"] = min;
    } else if (min > max) {
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
    WORKER: ALL STYLE CLASSES
  **/
export class StyleClass extends Worker {

  constructor(widgetClass, defaultClassList) {
    super(widgetClass);
    this.registerSetter(widgetClass, "classes", this);
    defaultClassList.forEach((className) => {
      this.registerDefaultValue(widgetClass, `classes:${className}`, true);
    });
  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription() });
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
    SETTER: ALL STYLE Property
  **/
export class StyleProperty extends Worker {
  constructor(widgetClass, property) {
    super(widgetClass);
    this.defaultStyleProperty = property;
    this.registerSetter(widgetClass, "style", this);
    let key = Object.keys(property)[0]
    this.registerDefaultValue(widgetClass, `style:${key}`, property[key]);

  }

  refresh(widgetInstance) {
    this.log("refresh", { widgetInstance: widgetInstance.getTraceDescription() });
    let styleProperty = widgetInstance.data.properties.style;
    let element = this.getElement(widgetInstance);
    Object.keys(styleProperty).forEach(key => {
      element.style[key] = styleProperty[key];
    })
  }
}

/**
    SETTER: TRIGGER MAPPING
  **/
export class Trigger extends Worker {

  constructor(widgetClass, triggerName, eventName, validate) {
    super(widgetClass);
    this.triggerName = triggerName;
    this.eventName = eventName;
    this.validate = validate;
    this.registerTrigger(widgetClass, triggerName, this);
  }

  getTriggerMapping(widgetInstance) {
    this.log("getTriggerMapping", { widgetInstance: widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    return {
      element: element,
      event_name: this.eventName,
      validate: this.validate
    };
  }
}