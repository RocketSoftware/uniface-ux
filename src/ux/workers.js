// @ts-check
/* global UNIFACE */

import { Widget } from "./widget.js"; // eslint-disable-line no-unused-vars
import { Base } from "./base.js";

/**
 * Worker base class.
 * This worker is the abstract base class for all workers used by widget class definitions.
 * All worker classes need to extend this class.
 * @export
 * @class Worker
 * @abstract
 * @extends {Base}
 */
export class Worker extends Base {

  /**
   * Creates an instance of Worker.
   * @param {typeof Widget} widgetClass
   */
  constructor(widgetClass) {
    super();
    this.isSetter = true;
    this.widgetClass = widgetClass;
    this.log("constructor", null);
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} _objectDefinition
   * @return {HTMLElement[] | HTMLElement}
   */
  getLayout(_objectDefinition) {
    return [];
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
   * @param {Widget} widgetInstance
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
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) { } // eslint-disable-line no-unused-vars

  /**
   * Provides setter-specific tracing.
   * @param {String} functionName
   * @param {Object} data
   */
  log(functionName, data) {
    const classNames = {
      "all": false
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
 * Adds and maintains an element where the element is added as a child according to the widget structure.
 * @export
 * @class Element
 * @extends {Worker}
 */
export class Element extends Worker {

  /**
   * Creates an instance of Element.
   * @param {typeof Widget} widgetClass
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
   * @param {UObjectDefinition} objectDefinition
   * @return {HTMLElement[] | HTMLElement}
   */
  getLayout(objectDefinition) {
    this.log("getLayout", null);

    // Allow any child attribute-worker to process the objectDefinition.
    this.attributeDefines?.forEach((define) => {
      // eslint-disable-next-line no-unused-vars
      const ignore = define.getLayout(objectDefinition);
    });

    // Create element
    let element = document.createElement(this.tagName);
    element.hidden = this.hidden;
    if (this.styleClass) {
      element.classList.add(this.styleClass);
    }

    // Allow any child element-workers to add child elements.
    this.elementDefines?.forEach((define) => {
      let childLayout = define.getLayout(objectDefinition);
      if (childLayout instanceof Array) {
        childLayout.forEach((childElement) => {
          element.appendChild(childElement);
        });
      } else if (childLayout) {
        element.appendChild(childLayout);
      }
    });
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
 * Worker: Slotted element with icon or inner text.
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
   * @param {typeof Widget} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   * @param {UPropName} [textPropId]
   * @param {UPropValue} [textDefaultValue]
   * @param {UPropName} [iconPropId]
   * @param {UPropValue} [iconDefaultValue]
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot, textPropId, textDefaultValue, iconPropId, iconDefaultValue) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.textPropId = textPropId;
    this.textDefaultValue = textDefaultValue;
    this.iconPropId = iconPropId;
    this.iconDefaultValue = iconDefaultValue;
    if (this.iconPropId) {
      this.registerSetter(widgetClass, this.iconPropId, this);
      this.registerDefaultValue(widgetClass, this.iconPropId, iconDefaultValue);
    }
    if (this.textPropId) {
      this.registerSetter(widgetClass, this.textPropId, this);
      this.registerDefaultValue(widgetClass, this.textPropId, textDefaultValue);
    }
  }

  getLayout(_objectDefinition) {
    this.log("getLayout", null);
    let element = document.createElement(this.tagName);
    element.hidden = this.hidden;
    if (this.styleClass) {
      element.classList.add(this.styleClass);
    }
    return element;
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let icon = this.getNode(widgetInstance.data, this.iconPropId);
    let text = this.getNode(widgetInstance.data, this.textPropId);
    this.setIconOrText(element, this.slot, icon, text);
  }

  setIconOrText(element, slot, icon, text) {
    this.deleteIconClasses(element);
    if (icon) {
      element.hidden = false;
      element.slot = slot;
      element.classList.add("ms-Icon");
      element.classList.add(`ms-Icon--${icon}`);
      element.innerText = "";
    } else if (text) {
      element.hidden = false;
      element.slot = slot;
      element.innerText = text;
    } else {
      element.hidden = true;
      // Force to default slot to avoid unwanted paddings and margins.
      element.slot = "";
      element.innerText = "";
    }
  }

  deleteIconClasses(element) {
    Array.from(element.classList).forEach((className) => {
      if (className.startsWith("ms-")) {
        element.classList.remove(className);
      }
    });
  }
}

/**
 * Worker: Slotted error element.
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
   * @param {typeof Widget} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector, slot) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;
    this.slot = slot;
    this.registerSetter(widgetClass, "error", this);
    this.registerSetter(widgetClass, "error-message", this);
    this.registerSetter(widgetClass, "format-error", this);
    this.registerSetter(widgetClass, "format-error-message", this);
  }

  refresh(widgetInstance) {
    super.refresh(widgetInstance);
    let error = this.toBoolean(this.getNode(widgetInstance.data, "error"));
    let errorMessage = this.getNode(widgetInstance.data, "error-message");
    let formatError = this.toBoolean(this.getNode(widgetInstance.data, "format-error"));
    let formatErrorMessage = this.getNode(widgetInstance.data, "format-error-message");
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
 * Worker: Slotted sub-widget.
 * This worker adds and maintains a sub-widget to the widget, where:
 * - the element is added as a child according the structure.
 * - the element is a UX widget.
 * - the element is being slotted into the web-component (the parent element).
 * @export
 * @class SlottedWidget
 * @extends {Element}
 */
export class SlottedSubWidget extends Element {

  /**
   * Creates an instance of SlottedWidget.
   * @param {typeof Widget} widgetClass
   * @param {String} tagName
   * @param {String} subWidgetStyleClass
   * @param {String} elementQuerySelector
   * @param {String} slot
   * @param {String} subWidgetId
   * @param {String} subWidgetClassName
   * @param {Object} subWidgetDefaultValues
   * @param {Boolean} visible
   * @param {Array} subWidgetTriggers
   * @param {Array} subWidgetDelegatedProperties
   */
  constructor(
    widgetClass,
    tagName,
    subWidgetStyleClass,
    elementQuerySelector,
    slot,
    subWidgetId,
    subWidgetClassName,
    subWidgetDefaultValues,
    visible,
    subWidgetTriggers,
    subWidgetDelegatedProperties = []
  ) {
    // Redefine subWidgetStyleClass with hard-coded values based on sub-widget id
    subWidgetStyleClass = `u-sw-${subWidgetId}`;
    elementQuerySelector = `.${subWidgetStyleClass}`;
    super(widgetClass, tagName, subWidgetStyleClass, elementQuerySelector);
    this.subWidgetId = subWidgetId;
    this.subWidgetClass = UNIFACE.ClassRegistry.get(subWidgetClassName);
    this.subWidgetDelegatedProperties = subWidgetDelegatedProperties;
    if (this.subWidgetClass) {
      if (subWidgetDefaultValues) {
        Object.keys(subWidgetDefaultValues).forEach((propId) => {
          this.registerDefaultValue(widgetClass, `${subWidgetId}:${propId}`, subWidgetDefaultValues[propId]);
        });
      }
      this.slot = slot;
      // Register sub-widget and the property workers that toggle the sub-widget visible attribute.
      this.propId = subWidgetId;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, visible);
      this.registerSubWidget(widgetClass, subWidgetId, this.subWidgetClass, this.styleClass, subWidgetTriggers, subWidgetDelegatedProperties);
    } else {
      this.error("constructor", `Widget class with name '${subWidgetClassName}' not found in UNIFACE.widgetRepository.`, "Not available");
    }
  }

  getLayout(_objectDefinition) {
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
    if (this.toBoolean(this.getNode(widgetInstance.data, this.propId))) {
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
 * Worker: Generated sub-widgets based on Uniface properties.
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
export class SubWidgetsByProperty extends Element {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof Widget} widgetClass - Specifies the widget class definition the setter is created for.
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
            if (this.styleClass) {
              element.classList.add(this.styleClass);
            }
            element.setAttribute("sub-widget-id", subWidgetId);
            elements.push(element);
          } else {
            this.warn(
              "getLayout",
              `Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry.`,
              `Creation of sub-widget '${subWidgetId}'skipped`
            );
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
        const classNamePropId = `${subWidgetId}:widget-class`;
        const triggersPropId = `${subWidgetId}:widget-triggers`;
        const delegatedPropertiesPropId = `${subWidgetId}_delegated-properties`;
        const className = objectDefinition.getProperty(classNamePropId);
        const subWidgetClass = UNIFACE.ClassRegistry.get(className);
        const subWidgetTriggers = objectDefinition.getProperty(triggersPropId);
        const delegatedProperties = objectDefinition.getProperty(delegatedPropertiesPropId);
        let subWidgetDefinition = {};
        subWidgetDefinition.class = subWidgetClass;
        subWidgetDefinition.styleClass = `u-sw-${subWidgetId}`;
        subWidgetDefinition.triggers = subWidgetTriggers?.split("") || [];
        subWidgetDefinition.propPrefix = subWidgetId;
        subWidgetDefinition.delegatedProperties = delegatedProperties ? delegatedProperties.split("") : [];
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
 * Worker: Creates a sub-widget for every child object of type field in objectDefinition.
 * The widget definition is established during processLayout() and cannot be changed afterwards.
 * An exclude property, of which the id is specified by propId, allows exclusion of fields to this process.
 * This property can be set as part of field properties in the IDE. If it evaluates to true, the field is excluded.
 * @export
 * @class WidgetsByProperty
 * @extends {Worker}
 */
export class SubWidgetsByFields extends Worker {

  /**
   * Creates an instance of WidgetsByProperty.
   * @param {typeof Widget} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {UPropName} propId - Specifies the id of a Boolean property that, if true, excludes the field from the process.
   * @param {String} subWidgetClassName - Specifies the name of the sub-widget to be included for every field.
   */
  constructor(widgetClass, propId, subWidgetClassName) {
    super(widgetClass);
    this.propId = propId;
    this.subWidgetClassName = subWidgetClassName;
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
    let excludePropId = this.propId;
    let elements = [];
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      let subWidgetClass = UNIFACE.ClassRegistry.get(this.subWidgetClassName);
      if (subWidgetClass) {
        childObjectDefinitions.forEach((childObjectDefinition) => {
          const childType = childObjectDefinition.getType();
          let exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
          if (!exclude) {
            const childName = childObjectDefinition.getName().toLowerCase();
            const subWidgetId = `${childType}-${childName}`;
            const subWidgetStyleClass = `u-sw-${childType}-${childName.replace(/\./g, "-")}`;
            let element = document.createElement("span");
            element = subWidgetClass.processLayout(element, childObjectDefinition);
            element.classList.add(subWidgetStyleClass);
            elements.push(element);

            /**
             * Iterate through the properties in childObjectDefinitions and check whether
             * it exists as sub-widget property in the sub-widget.
             * If so, move the property from childObjectDefinition to objectDefinition and set child version to undefined.
             */
            childObjectDefinition.getPropertyNames()?.forEach((propId) => {
              // Look it up in the sub-widget's definition.
              if (this.getNode(subWidgetClass.setters, propId)) {
                const childPropValue = childObjectDefinition.getProperty(propId);
                childObjectDefinition.setProperty(propId, undefined);
                objectDefinition.setProperty(`${subWidgetId}:${propId}`, childPropValue);
              }
            });
            childObjectDefinition.setProperty("org-widget-class", childObjectDefinition.getWidgetClass());
            childObjectDefinition.setWidgetClass("UX.DataGridField");
          }
        });
      } else {
        this.warn(
          "getLayout",
          `Widget definition with name '${this.subWidgetClassName}' not found in UNIFACE.classRegistry.`,
          "Creation of sub-widget(s) skipped"
        );
      }
    }
    return elements;
  }

  /**
   * Returns the subWidget definitions.
   * @param {UObjectDefinition} objectDefinition
   * @returns {Object}
   */
  getSubWidgetDefinitions(objectDefinition) {
    let excludePropId = this.propId;
    let subWidgetDefinitions = {};
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      let subWidgetClass = UNIFACE.ClassRegistry.get(this.subWidgetClassName);
      if (subWidgetClass) {
        childObjectDefinitions.forEach((childObjectDefinition) => {
          const childType = childObjectDefinition.getType();
          const exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
          if (!exclude) {
            const childName = childObjectDefinition.getName().toLowerCase();
            const subWidgetId = `${childType}-${childName}`;
            const subWidgetStyleClass = `u-sw-${childType}-${childName.replace(/\./g, "-")}`;
            let subWidgetDefinition = {};
            subWidgetDefinition.class = subWidgetClass;
            subWidgetDefinition.styleClass = subWidgetStyleClass;
            subWidgetDefinition.triggers = [];
            subWidgetDefinition.propPrefix = subWidgetId;
            subWidgetDefinitions[subWidgetId] = subWidgetDefinition;
          }
        });
      }
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
 * Worker: Creates a placeholder element for every child object of type field in objectDefinition.
 * Every placeholder element will be directly bound to that field object after which Uniface fully maintains the widgets.
 * The widget-classes are provided by Uniface (usys.ini and web.ini).
 * @export
 * @class WidgetsByFields
 * @extends {Worker}
 */
export class WidgetsByFields extends Worker {

  /**
   * Creates an instance of WidgetsByFields.
   * @param {typeof Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {String} tagName - Specifies the widget's element tag-name in the skeleton layout.
   * @param {UPropName} propId - Specifies the exclude property id.
   * @param {String} bindingId - Specifies the binding id.
   */
  constructor(widgetClass, tagName, propId, bindingId) {
    super(widgetClass);
    this.tagName = tagName;
    this.propId = propId;
    this.bindingId = bindingId;
  }

  /**
   * Generate and return layout for this worker.
   * @param {UObjectDefinition} objectDefinition
   * @return {HTMLElement[]}
   */
  getLayout(objectDefinition) {
    let excludePropId = this.propId;
    let elements = [];
    let childObjectDefinitions = objectDefinition.getChildDefinitions();
    if (childObjectDefinitions) {
      childObjectDefinitions.forEach((childObjectDefinition) => {
        const childType = childObjectDefinition.getType();
        let exclude = this.toBoolean(childObjectDefinition.getProperty(excludePropId)) || childType !== "field" || false;
        if (!exclude) {
          let element = document.createElement(this.tagName);
          element.id = this.substituteInstructions(childObjectDefinition, this.bindingId);
          elements.push(element);
        }
      });
    }
    return elements;
  }
}

/**
 * Worker: Creates a placeholder element for an object as specified by the provided bindingId.
 * The placeholder element will be directly bound to that object after which Uniface fully maintains the widgets.
 * The widget-class is provided by Uniface (usys.ini and web.ini).
 * @export
 * @class WidgetForOccurrence
 * @extends {Worker}
 */
export class WidgetForOccurrence extends Worker {

  /**
   * Creates an instance of WidgetForOccurrence.
   * @param {typeof Widget} widgetClass - Specifies the widget class definition the worker is created for.
   * @param {String} tagName - Specifies the sub-widget's element tag-name in the skeleton layout.
   * @param {String} bindingId - Specifies the binding id.
   */
  constructor(widgetClass, tagName, bindingId) {
    super(widgetClass);
    this.tagName = tagName;
    this.bindingId = bindingId;
  }

  /**
   * Generate and return layout for this setter.
   * @param {UObjectDefinition} objectDefinition
   * @return {HTMLElement[]}
   */
  getLayout(objectDefinition) {
    let elements = [];
    let element = document.createElement(this.tagName);
    element.id = this.substituteInstructions(objectDefinition, this.bindingId);
    elements.push(element);
    return elements;
  }
}

/**
 * Worker : Used to register setter and default value for properties that do not need to execute any code on refresh.
 * @export
 * @class IgnoreProperty
 * @extends {Worker}
 */
export class IgnoreProperty extends Worker {

  /**
   * Creates an instance of IgnoreProperty
   * @param {typeof Widget} widgetClass
   * @param {UPropName} propId
   * @param {UPropValue} defaultValue
   */
  constructor(widgetClass, propId, defaultValue = null) {
    super(widgetClass);
    this.propId = propId;
    this.defaultValue = defaultValue;
    this.registerSetter(widgetClass, propId, this);
    this.registerDefaultValue(widgetClass, propId, defaultValue);
  }

  /**
   * Method that will be invoked when there is an update to any of the registered properties.
   * @param {Object} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "propId": this.propId,
      "value": this.getNode(widgetInstance.data, this.propId)
    });
  }
}

/**
 * Worker: Abstract Html-attribute base worker.
 * This worker is the abstract base class for all workers that maintain an attribute of an element.
 * @export
 * @class BaseHtmlAttribute
 * @abstract
 * @extends {Worker}
 */
export class BaseHtmlAttribute extends Worker {

  /**
   * Creates an instance of BaseHtmlAttribute.
   * @param {typeof Widget} widgetClass
   * @param {UPropName} [propId]
   * @param {String} [attrName]
   * @param {UPropValue} [defaultValue]
   * @param {Boolean} [setAsAttribute]
   * @param {String} [valueChangedEventName]
   */
  constructor(widgetClass, propId, attrName, defaultValue, setAsAttribute, valueChangedEventName) {
    super(widgetClass);
    if (arguments.length > 1) {
      // Generate a unique private prop-id.
      this.propId = propId || Math.random().toString();
      if (attrName) {
        this.attrName = attrName;
      }
      this.defaultValue = defaultValue;
      this.setAsAttribute = setAsAttribute;
      this.valueChangedEventName = valueChangedEventName;
      this.registerSetter(widgetClass, this.propId, this);
      this.registerDefaultValue(widgetClass, this.propId, defaultValue);
      if (this.propId === "value") {
        // This setter maps the Uniface value property -> register getter.
        this.registerGetter(widgetClass, this.propId, this);
      }
    }
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
          if (element.hasAttribute(this.attrName)) {
            // Some properties are also set as attributes internally by browsers.
            // These attributes are not removed when the property is deleted.
            // Check if the element has such an attribute and remove it.
            element.removeAttribute(this.attrName);
          }
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

  getValueAsFormattedHTML(widgetInstance) {
    this.log("getValueAsFormattedHTML", {
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
    this.log("getValueUpdaters", { "widgetInstance": widgetInstance.getTraceDescription() });
    let updaters = [];
    updaters.push({
      "element": this.getElement(widgetInstance),
      "event_name": this.valueChangedEventName || ""
    });
    return updaters;
  }
}

/**
 * Worker: String html-attribute.
 */
export class HtmlAttribute extends BaseHtmlAttribute {

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrName": this.attrName
    });
    super.refresh(widgetInstance);
    let element = this.getElement(widgetInstance);
    let value = this.getNode(widgetInstance.data, this.propId);
    this.setHtmlAttribute(element, value);
  }
}

/**
 * Worker: Choice html-attribute.
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
    let value = this.getNode(widgetInstance.data, this.propId);
    if (this.choices.includes(value)) {
      this.setHtmlAttribute(element, value);
    } else {
      this.warn("refresh", `Property '${this.propId}' invalid value (${value})`, "Ignored");
    }
  }
}

/**
 * Worker: Number html-attribute.
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
    let value = this.getNode(widgetInstance.data, this.propId);
    if (value !== undefined && value !== null) {
      value = parseInt(value);
      if (this.min !== undefined && this.min !== null && value < this.min) {
        this.warn("refresh", `Property '${this.propId}' must be a number >== ${this.min}`, "Ignored");
        return;
      } else if (this.max !== undefined && this.max !== null && value > this.max) {
        this.warn("refresh", `Property '${this.propId}' must be a number <== ${this.max}`, "Ignored");
        return;
      }
    }
    this.setHtmlAttribute(element, value);
  }
}

/**
 * Worker: Boolean html-attribute.
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
      let value = this.getNode(widgetInstance.data, this.propId);
      element[this.attrName] = this.toBoolean(value);
    }
  }
}

/**
 * Worker: readonly and disabled html-attribute pair.
 */
export class HtmlAttributeReadonlyDisabled extends Worker {
  constructor(widgetClass, readonlyPropId, disabledPropId, uiblockedPropId, readonlyDefaultValue, disabledDefaultValue, uiblockedDefaultValue) {
    super(widgetClass);
    this.propReadonly = readonlyPropId;
    this.propDisabled = disabledPropId;
    this.propUiblocked = uiblockedPropId;
    this.registerSetter(widgetClass, readonlyPropId, this);
    this.registerSetter(widgetClass, disabledPropId, this);
    this.registerSetter(widgetClass, uiblockedPropId, this);
    this.registerDefaultValue(widgetClass, readonlyPropId, readonlyDefaultValue);
    this.registerDefaultValue(widgetClass, disabledPropId, disabledDefaultValue);
    this.registerDefaultValue(widgetClass, uiblockedPropId, uiblockedDefaultValue);
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription()
    });

    let element = this.getElement(widgetInstance);
    let readonly = this.getNode(widgetInstance.data, this.propReadonly);
    let disabled = this.getNode(widgetInstance.data, this.propDisabled);
    let uiblocked = this.getNode(widgetInstance.data, this.propUiblocked);

    // Ensure widget and control is not disabled before checking validity since html always returns true on checkValidity for disabled field.
    element["disabled"] = false;
    element["control"].disabled = false;
    // During uiblocked phase, set element to readonly or disabled based on validity.
    if (uiblocked) {
      if (!element["control"].checkValidity()) {
        element["disabled"] = true;
      } else {
        element["readOnly"] = true;
        element["disabled"] = this.toBoolean(disabled);
      }
    } else {
      // Reset properties based on initial values when not uiblocked.
      if (!element["control"].checkValidity()) {
        element["disabled"] = this.toBoolean(disabled);
      } else {
        element["readOnly"] = this.toBoolean(readonly);
        element["disabled"] = this.toBoolean(disabled);
      }
    }
  }
}

/**
 * Worker: Boolean html-attribute that maps to the Uniface value property.
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
      "event_name": this.valueChangedEventName || "",
      "handler": () => {
        widgetInstance.setProperties({
          "format-error": false,
          "format-error-message": ""
        });
        widgetInstance.setProperties({
          "error": false,
          "error-message": ""
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
    let value = this.getNode(widgetInstance.data, this.propId);
    // Validate value before assigning.
    try {
      this.setHtmlAttribute(element, this.fieldValueToBoolean(value));
      widgetInstance.setProperties({
        "format-error": false,
        "format-error-message": ""
      });
    } catch (error) {
      widgetInstance.setProperties({
        "format-error": true,
        "format-error-message": error
      });
    }
  }
}

/**
 * Worker: minlength and maxlength html-attribute pair.
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
    // @ts-ignore
    if (element.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    /** @type {Number|null} */
    let minlength = parseInt(this.getNode(widgetInstance.data, this.propMin));
    if (Number.isNaN(minlength)) {
      minlength = null;
    } else if (minlength < 0) {
      this.warn("refresh()", `Property '${this.propMin}' is not a positive number`, "Ignored");
      return;
    }

    /** @type {Number|null} */
    let maxlength = parseInt(this.getNode(widgetInstance.data, this.propMax));
    if (Number.isNaN(maxlength)) {
      maxlength = null;
    } else if (maxlength === 0) {
      // In Uniface means no maximum length.
      maxlength = null;
    } else if (maxlength < 0) {
      this.warn("refresh()", `Property '${this.propMax}' is not a positive number`, "Ignored");
      return;
    }
    // BUG: Once maxlength has been set, fluent forces it to 0 when being unset (attribute).
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
 * Worker: Html min/max attribute pair.
 */
export class HtmlAttributeMinMax extends Worker {
  constructor(widgetClass, propMin, propMax, defaultMin, defaultMax) {
    super(widgetClass);
    this.propMin = propMin;
    this.propMax = propMax;
    this.defaultMin = defaultMin;
    this.defaultMax = defaultMax;
    this.registerSetter(widgetClass, propMin, this);
    this.registerSetter(widgetClass, propMax, this);
    this.registerDefaultValue(widgetClass, propMin, defaultMin);
    this.registerDefaultValue(widgetClass, propMax, defaultMax);
  }

  refresh(widgetInstance) {
    this.log("refresh", {
      "widgetInstance": widgetInstance.getTraceDescription(),
      "attrNames": ["min", "max"]
    });

    let element = this.getElement(widgetInstance);

    // @ts-ignore
    if (element?.value !== "") {
      this.warn("refresh()", `Property '${this.propMin}' or '${this.propMax}' cannot be set if control-value is not ""`, "Ignored");
      return;
    }

    let min = this.getNode(widgetInstance.data, this.propMin);
    let max = this.getNode(widgetInstance.data, this.propMax);

    let isMinUndefined = min === undefined;
    let isMaxUndefined = max === undefined;

    min = parseInt(min);
    if (Number.isNaN(min)) {
      min = null;
    }

    max = parseInt(max);
    if (Number.isNaN(max)) {
      max = null;
    }

    if (!isMinUndefined && !isMaxUndefined && min === null && max === null) {
      this.warn(
        "refresh()",
        `Fluent does not allow setting'${this.propMin}' (${min}) and '${this.propMax}' (${max}) to undefined/null, a number must be provided`,
        "Ignored"
      );
    } else if (min === null && max !== null) {
      element.setAttribute("max", max);
      // If min is null defined by user.
      if (!isMinUndefined) {
        this.warn("refresh()", `Fluent does not allow setting'${this.propMin}' (${min}) to undefined/null, a number must be provided`, "Ignored");
      }
    } else if (min !== null && max === null) {
      element.setAttribute("min", min);
      // If max is null defined by user.
      if (!isMaxUndefined) {
        this.warn("refresh()", `Fluent does not allow setting'${this.propMax}' (${max}) to undefined/null, a number must be provided`, "Ignored");
      }
    } else if (min > max) {
      this.warn("refresh()", `Invalid combination of '${this.propMin}' (${min}) and '${this.propMax}' (${max})`, "Ignored");
    } else if (min !== null && max !== null) {
      element.setAttribute("min", min);
      element.setAttribute("max", max);
    }
  }
}

/**
 * Worker: Shows the widget-value as formatted HTML elements.
 * Formatting information is provided by the object's original widget and used to construct the formatting HTML.
 * @export
 * @class HtmlAttributeFormattedValue
 * @extends {BaseHtmlAttribute}
 */
export class HtmlAttributeFormattedValue extends BaseHtmlAttribute {

  /**
   * Creates an instance of HtmlAttributeFormattedValue.
   * @param {typeof Widget} widgetClass - Specifies the widget class definition the setter is created for.
   * @param {UPropName} propId - Specifies the id of the property that holds the object's original widget-class name.
   */
  constructor(widgetClass, propId) {
    super(widgetClass);
    this.propId = propId;
    this.registerSetter(widgetClass, propId, this);
  }

  /**
   * This method appends the element with text or icon at the given position.
   * @param {HTMLElement} element
   * @param {UValueFormatting} formattedValue
   * @param {string} position
   */
  appendIconOrTextAtPosition(element, formattedValue, position) {
    const iconKey = `${position}Icon`;
    const textKey = `${position}Text`;

    if (formattedValue[iconKey]) {
      let iconElement = document.createElement("span");
      iconElement.classList.add(`u-${position}-icon`, "ms-Icon", `ms-Icon--${formattedValue[iconKey]}`);
      element.appendChild(iconElement);
    } else if (formattedValue[textKey]) {
      let textElement = document.createElement("span");
      textElement.classList.add(`u-${position}-text`);
      textElement.innerText = formattedValue[textKey];
      element.appendChild(textElement);
    }
  }

  /**
   * This method appends the element as innerText or innerHTML at the given position.
   * @param {HTMLElement} textElement
   * @param {UValueFormatting} formattedValue
   * @param {string} position
   */
  appendHtmlOrPlainTextAtPosition(textElement, formattedValue, position) {
    const plainTextKey = `${position}PlainText`;
    const htmlTextKey = `${position}HtmlText`;

    if (formattedValue[plainTextKey]) {
      let textSpan = document.createElement("span");
      textSpan.classList.add(`u-${position}-text`);
      textSpan.innerText = formattedValue[plainTextKey];
      textElement.appendChild(textSpan);
    } else if (formattedValue[htmlTextKey]) {
      let textSpan = document.createElement("span");
      textSpan.classList.add(`u-${position}-text`);
      textSpan.innerHTML = formattedValue[htmlTextKey];
      textElement.appendChild(textSpan);
    }
  }

  /**
   * This method refreshes the innerHTML of the element with the new HTML-formatted value.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    const orgWidgetClassName = this.getNode(widgetInstance.data, this.propId);
    const orgWidgetClass = UNIFACE.ClassRegistry.get(orgWidgetClassName);
    const element = this.getElement(widgetInstance);
    element.innerHTML = "";
    element.classList.remove("u-invalid");
    element.classList.remove("u-hidden");
    element.classList.remove("u-read-only");
    element.classList.remove("u-disabled");
    element.title = this.getNode(widgetInstance.data, "html:title") || "";
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:hidden"))) {
      element.classList.add("u-hidden");
      element.title = "";
    }
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:readonly"))) {
      element.classList.add("u-read-only");
    }
    if (this.toBoolean(this.getNode(widgetInstance.data, "html:disabled"))) {
      element.classList.add("u-disabled");
    }

    /** @type {UValueFormatting} */
    let formattedValue = {};
    if (typeof orgWidgetClass.getValueFormatted == "function") {
      formattedValue = orgWidgetClass.getValueFormatted(widgetInstance.data);
    } else {
      // Fallback if org widget does not provide this function.
      formattedValue.primaryPlainText = this.getNode(widgetInstance.data, "value");
    }

    this.appendIconOrTextAtPosition(element, formattedValue, "prefix");

    let valueElement = document.createElement("span");
    valueElement.classList.add("u-value");
    let textElement = document.createElement("span");
    textElement.classList.add("u-text");
    this.appendHtmlOrPlainTextAtPosition(textElement, formattedValue, "primary");
    this.appendHtmlOrPlainTextAtPosition(textElement, formattedValue, "secondary");
    valueElement.appendChild(textElement);

    if (formattedValue.errorMessage) {
      let errorElement = document.createElement("span");
      errorElement.classList.add("u-error-icon", "ms-Icon", "ms-Icon--AlertSolid");
      errorElement.title = formattedValue.errorMessage;
      valueElement.appendChild(errorElement);
      element.classList.add("u-invalid");
    }
    element.appendChild(valueElement);

    this.appendIconOrTextAtPosition(element, formattedValue, "suffix");
  }

}

/**
 * Worker: Use property to update (re)set class attribute.
 */
export class HtmlAttributeClass extends Worker {
  constructor(widgetClass, propId, styleClassName, defaultValue) {
    super(widgetClass);
    this.propId = propId;
    this.styleClassName = styleClassName;
    this.registerSetter(widgetClass, propId, this);
    this.registerDefaultValue(widgetClass, propId, this.toBoolean(defaultValue));
  }

  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    if (this.toBoolean(this.getNode(widgetInstance.data, this.propId))) {
      element.classList.add(this.styleClassName);
    } else {
      element.classList.remove(this.styleClassName);
    }
  }
}

/**
 * Worker: All style classes.
 */
export class StyleClass extends Worker {
  constructor(widgetClass, defaultClassList) {
    super(widgetClass);
    this.registerSetter(widgetClass, "class", this);
    defaultClassList.forEach((className) => {
      this.registerDefaultValue(widgetClass, `class:${className}`, true);
    });
  }

  refresh(widgetInstance) {
    this.log("refresh", { "widgetInstance": widgetInstance.getTraceDescription() });
    let element = this.getElement(widgetInstance);
    for (let property in widgetInstance.data) {
      if (property.startsWith("class")) {
        let value = this.toBoolean(widgetInstance.data[property]);
        let pos = property.search(":");
        property = property.substring(pos + 1);
        if (value) {
          element.classList.add(property);
        } else {
          element.classList.remove(property);
        }
      }
    }
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
    let element = this.getElement(widgetInstance);

    for (let property in widgetInstance.data) {
      if (property.startsWith("style")) {
        let value = widgetInstance.data[property];
        let pos = property.search(":");
        property = property.substring(pos + 1);
        element.style[property] = value || "unset";
      }
    }
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
   * @param {typeof Widget} widgetClass
   * @param {String} tagName
   * @param {String} styleClass
   * @param {String} elementQuerySelector
   */
  constructor(widgetClass, tagName, styleClass, elementQuerySelector) {
    super(widgetClass, tagName, styleClass, elementQuerySelector);
    this.hidden = true;

    this.registerSetter(widgetClass, "valrep", this);
    this.registerDefaultValue(widgetClass, "valrep", []);

    this.registerSetter(widgetClass, "display-format", this);
    this.registerDefaultValue(widgetClass, "display-format", "rep");
  }

  /**
   * Removes all valrep elements from this worker.
   */
  removeValRepElements(widgetInstance) {
    let element = this.getElement(widgetInstance);
    let valrepElements = element.querySelectorAll(this.tagName);
    valrepElements.forEach((element) => {
      element.remove();
    });
  }

  /**
   * Creates all valrep elements from this worker.
   * Since fluent uses empty string to clear the selection, presence of an empty string as an actual valid option causes confusion.
   * So, when setting the value attribute of fluent-option elements, we use the corresponding index as the value.
   * And this will be mapped back to its original value before storing and sending to Uniface.
   */
  createValRepElements(widgetInstance) {
    let element = this.getElement(widgetInstance);
    let valrep = this.getNode(widgetInstance.data, "valrep");
    let displayFormat = this.getNode(widgetInstance.data, "display-format");
    if (valrep.length > 0) {
      valrep.forEach((valRepObj, index) => {
        const childElement = document.createElement(this.tagName);
        element.appendChild(childElement);
        childElement.setAttribute("value", index);
        childElement.setAttribute("class", this.styleClass);
        childElement.appendChild(this.getFormattedValrepItemAsHTML(displayFormat, valRepObj.value, valRepObj.representation));
      });
    }
  }

  refresh(widgetInstance) {
    this.removeValRepElements(widgetInstance);
    this.createValRepElements(widgetInstance);
  }
}
