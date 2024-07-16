/* global UX uniface _uf */
(function () {
  "use strict";

  const camelCaseProps = {
    "readonly": "readOnly",
    "tabindex": "tabIndex"
  };

  class Base {

    constructor() { }

    /**
     * Sets minlength and maxlength properties of an HTMLElement.
     * @param {Object} properties - Object describing the properties.
     * @param {HTMLElement} element - The element of which to set the properties.
     */
    setMinMaxLengthProperty(properties, element) {
      let minlength = element.minlength;
      let maxlength = element.maxlength;

      // If minlength is greater than maxlength, or either is negative, then the
      // Fluent web component throws an exception. Here we catch that, issue a uniface
      // console error message and restore minlength and maxlength to their previous values.
      try {
        if ((properties.minlength || properties.minlength === 0) && (properties.maxlength || properties.maxlength === 0)) {
          if (properties.minlength <= maxlength) {
            element.minlength = properties.minlength;
            element.maxlength = properties.maxlength;
          } else {
            element.maxlength = properties.maxlength;
            element.minlength = properties.minlength;
          }
        } else if (properties.minlength || properties.minlength === 0) {
          element.minlength = properties.minlength;
        } else if (properties.maxlength || properties.maxlength === 0) {
          element.maxlength = properties.maxlength;
        }
      } catch (e) {
        _uf.uconsole.error(`Failed to set the minlength or maxlength property on ${element.id}.
              The minlength and maxlength values are conflicting.`);
        element["minlength"] = minlength;
        element["maxlength"] = maxlength;
      }
    }

    /**
     * Sets html properties of an HTMLElement.
     * By specifying "{{undefined}}" as a property value, that value is reset rather than set.
     * @param {Object} properties - Object describing the properties (names and values).
     *   to be set or reset.
     * @param {HTMLElement} element - The element of which to set or reset properties.
     * @param {Object} defaults - Optional, the object with the default property values.
     */
    setHtmlProperties(properties, element, defaults) {
      if (properties) {
        if (!defaults) { // optional argument
          defaults = {};
        }
        Object.keys(properties).forEach(id => {
          var value = properties[id];
          var name = this.convertToCamelCase(id);
          if (value === undefined || value === "{{undefined}}") {
            console.warn("UX.Base: The property 'html:" + id + "' is " + value);
            value = uniface.RESET;
          }
          if (value === uniface.RESET) {
            if (defaults[id] === undefined && element.hasAttribute(name)) {
              element.removeAttribute(name);
            } else {
              element[name] = defaults[id];
            }
            delete properties[id];
          } else {
            if (id !== "minlength" && id !== "maxlength") {
              element[name] = value;
            }
          }
        });
        // Treat the minlength and maxlength property separately, as the combination
        // of minlength and maxlength could be incorrect, we need to handle it.
        if (properties.minlength || properties.maxlength) {
          this.setMinMaxLengthProperty(properties, element);
        }
      }
    }

    /**
     * Resets html properties of an HTMLElement. Properties are reset by setting them
     * to undefined and also removing the corresponding attribute.
     * @param {Object} propertyNames - Array of strings specifying the names of the properties
     *   that should be reset.
     * @param {HTMLElement} element - The element of which to reset properties.
     * @param {Object} defaultProps - Properties in this optional map are applied to the element,
     *   rather than that they are reset.
     */
    resetHtmlProperties(propertiesNames, element, defaultProps) {
      let removeMinLength = false;
      let removeMaxLength = false;

      if (propertiesNames) {
        propertiesNames.forEach(propertyName => {
          // To prevent that the element temporarily has
          // a minlength that is greater than its maxlength,
          // remove these attributes separately.
          if (propertyName === "minlength") {
            removeMinLength = true;
          } else if (propertyName === "maxlength") {
            removeMaxLength = true;
          } else {
            const defaultPropValue = defaultProps ? defaultProps[propertyName] : undefined;
            element[propertyName] = defaultPropValue;
            if (!defaultPropValue) {
              element.removeAttribute(propertyName);
            }
          }
        });

        if (removeMinLength) {
          element.minlength = undefined;
          element.removeAttribute("minlength");
        }

        if (removeMaxLength) {
          element.maxlength = undefined;
          element.removeAttribute("maxlength");
        }
      }
    }

    /**
     * Sets style properties of an HTMLElement.
     * By specifying "unset" as a property value, that value is reset rather than set.
     * @param {Object} properties - Object describing the properties (names and values).
     *   to be set or reset.
     * @param {HTMLElement} element - The element of which to set or reset properties.
     * @param {Object} defaults - Optional, the object with the default property values.
     */
    setStyleProperties(properties, element, defaults) {
      if (!defaults) { // optional argument
        defaults = {};
      }
      Object.keys(properties).forEach(id => {
        var value = properties[id];
        if (value === undefined) {
          console.warn("UX.Base: The property 'style:" + id + "' is undefined.");
          value = uniface.RESET;
        }
        if (value === uniface.RESET) {
          value = (defaults[id] === undefined) ? "unset" : defaults[id];
        }
        element.style[id] = value;
      });
    }

    /**
     * Resets style properties of an HTMLElement.
     * @param {Object} propertyNames - Array of strings specifying the names of the properties
     *   that should be reset.
     * @param {HTMLElement} element - The element of which to reset properties.
     */
    resetStyleProperties(propertiesNames, element) {
      if (propertiesNames) {
        propertiesNames.forEach(propertyName => {
          element.style[propertyName] = "unset";
        });
      }
    }

    /**
     * Sets class properties of an HTMLElement.
     * @param {Object} properties - Object describing the properties (class names and values).
     *   to be added or removed based on its value weather its true or false.
     * @param {HTMLElement} element - The element of which to add or remove classes.
     * @param {Object} defaults - Optional, the object with the default class property values.
     */
    setClassProperties(properties, element, defaults) {
      if (!defaults) { // optional argument
        defaults = {};
      }
      Object.keys(properties).forEach(name => {
        var value = properties[name];
        if (value == undefined) { // pragma(allow-loose-compare)
          console.warn("UX.Base: The property 'classes:" + name + "' is " + value);
          value = uniface.RESET;
        }
        if (value && (value !== uniface.RESET || defaults[name])) {
          element.classList.add(name);
        } else {
          element.classList.remove(name);
        }
      });
    }

    /**
     * Resets class properties of an HTMLElement.
     * @param {HTMLElement} element - The element of which to reset properties.
     */
    resetClassProperties(element) {
      // We simply clear all the classes currently set on this widget element
      element.className = '';
    }

    /**
     * Create slot for element with className, slot-location and attributes.
     */
    static createSlot(element, tagName, className, slotLocation, defaultAttributes) {
      let slotElement = document.createElement(tagName);
      slotElement.classList.add(className);
      if (slotLocation) {
        slotElement.slot = slotLocation;
      }

      if (defaultAttributes) {
        Object.keys(defaultAttributes).forEach((key) => {
          slotElement.setAttribute(key, defaultAttributes[key]);
        });
      }
      slotElement.hidden = true;
      element.appendChild(slotElement);
      return slotElement;
    }

    /**
     * Unhide an element and set text and icon.
     * ms-Icon is icon class from Fabric Core Icon package.
     * @param {HTMLElement} element - The element of which to set properties
     * @param {String} text - text content, or undefined which means set icon instead
     * @param {String} icon - icon name (must not be undefined if text is undefined)
     */
    static setElementContent(element, text, icon) {
      if ((text !== "" && text !== undefined) || icon !== undefined) {
        element.removeAttribute("hidden");
        // Set element content to the text value if defined, or leave it empty if not.
        element.textContent = text ? text : "";
      } else {
        element.hidden = true;
        //  Set element content to empty.
        element.textContent = "";
      }
      // Remove the classes that begin with 'ms-'. These classes are associated with icon.
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("ms-")) {
          element.classList.remove(className);
        }
      });
      // Add the appropriate classes associated with icons if an icon is defined.
      if (icon) {
        element.classList.add(`ms-Icon`, `ms-Icon--${icon}`);
      }
    }

    /**
     * Hide an element and remove text and icon.
     */
    static resetElementContent(element) {
      element.hidden = true;
      //  Set element content to empty.
      element.textContent = "";
      // Remove the classes that begin with 'ms-'. These classes are associated with icon.
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("ms-")) {
          element.classList.remove(className);
        }
      });
    }

    /**
     * Same as setElementContent but for slots.
     * Additionally set the slot attribute to slotName.
     */
    static setSlotContent(slot, text, icon, slotName) {
      Base.setElementContent(slot, text, icon);
      if ((text === "" || text === undefined) && icon === undefined) {
        // Reset the slot.
        slotName = "";
      }
      // Set the slot attribute to the slotName value if defined or move it to default slot.
      slot.setAttribute("slot", slotName || "");
    }

    /**
     * Same as resetElementContent but for slots.
     * Additionally move the slot element to default slot.
     */
    static resetSlotContent(slot) {
      Base.resetElementContent(slot);
      // Move it to default slot.
      slot.setAttribute("slot", "");
    }


    /**
     * Log or trace functions.
     */
    static staticLog(functionName, data) {
      // To enable tracing for processLayout(),
      // set the processLayout property of "log" object to true.
      // If you want to trace all static functions, simply set "all" property to true.
      const log = {
        all: false,
        processLayout: false,
      };
      if (log.all || log[functionName]) {
        if (data) {
          if (data instanceof HTMLElement) {
            console.log(`[${this.name}:static].${functionName}("${data.outerHTML}")`);
          } else {
            console.log(`[${this.name}:static].${functionName}(${JSON.stringify(data)})`);
          }
        } else {
          console.log(`[${this.name}:static].${functionName}()`);
        }
      }
    }

    log(functionName, data) {
      // Add the class name(s) you want to trace to the classNames set.
      // Example: const classNames = new Set(["Button", "Checbox", ...]).
      // If you want to trace all classes, simply add "all" to the classNames set.
      // Example: const classNames = new Set(["all"]).
      const classNames = new Set([""]);
      // Add the API function name(s) you want to trace to the functionNames set.
      // Example: const functionNames = new Set(["constructor", "onConnect", ...]).
      // If you want to trace all API functions, simply add "all" to the functionNames set.
      // Example: const functionNames = new Set(["all"]).
      // Note: Make sure to add at least one class name to the classNames set.
      // Otherwise, no trace messages will be available, even if API function name(s) are added to the functionNames set.
      const functionNames = new Set([""]);
      if ((classNames.has("all") || classNames.has(this.constructor.name)) && (functionNames.has("all") || functionNames.has(functionName))) {
        var widgetId = "not-connected";
        var dataId = "no-data";
        var data_ = "";
        if (this.widget && this.widget.id) {
          widgetId = this.widget.id;
        }
        if (this.data && this.data.id) {
          dataId = this.data.id;
        }
        if (data) {
          data_ = JSON.stringify(data);
        }
        console.log(`[${this.constructor.name}:${widgetId}:${dataId}].${functionName}(${data_})`);
      }
    }

    /**
     * Convert various 'Uniface' values into a JS Boolean.
     */
    toBoolean(value) {
      let type = typeof value;
      switch (type) {
        case "boolean":
          return value;
        case "string":
          value = value.toUpperCase();
          if (value.substring(0, 1) === "1" || value.substring(0, 1) === "T" || value.substring(0, 1) === "Y" || value.substring(0, 1) === "J") {
            return true;
          }
          break;
        case "number":
          if (value) {
            return true;
          }
      }
      return false;
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
          if (['1', 't', 'true', 'on', 'yes'].includes(value)) {
            return true;
          }
          if (['0', 'f', 'false', 'off', 'no'].includes(value)) {
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
     * This function will convert hyphen-separated-property to camelCase.
     */
    convertToCamelCase(property) {
      let prop = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return camelCaseProps[prop] || prop;
    }

    /**
     * Insert Node after other node.
     */
    insertNodeAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
      return newNode;
    }

    /**
     * Remove node if it exists.
     */
    removeNode(node) {
      if (node != null) {
        node.remove();
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
      const newElement = document.createElement(tagName);
      if (copyChildren) {
        const childNodes = sourceElement.childNodes;
        childNodes.forEach(node => {
          newElement.appendChild(node.cloneNode(true));
        });
      }
      if (copyAttributes) {
        const attributeNames = sourceElement.getAttributeNames();
        attributeNames.forEach(name => {
          if (name === "class") {
            newElement["className"] = sourceElement.getAttribute(name);
          } else {
            newElement.setAttribute(name, sourceElement.getAttribute(name));
          }
        });
      }
      return newElement;
    }

    /**
     * Converts a string format valrep into [{"value": "representation"},....] format.
     * @param {string} valrep - The valrep string to be formatted.
     * @returns {Array} An array of objects with "value" and "representation" properties.
     */
    static getFormattedValrep(valrep) {
      let formattedValrep;
      // Check if valrep exists and is not equal to uniface.RESET.
      if (valrep && valrep !== uniface.RESET) {
        formattedValrep = [];
        valrep.split("").forEach((keyVal) => {
          // Split each key-value pair by "="
          let [key, val] = keyVal.split("=");
          // Push an object with "value" and "representation" properties to the formattedValrep array.
          formattedValrep.push({ value: key, representation: val });
        });
      }
      // Return the formattedValrep array if it exists, otherwise return uniface.RESET.
      return formattedValrep || uniface.RESET;
    }
  }

  // Add the Base class to the UX namespace.
  if (typeof window.UX === "undefined") {
    window.UX = {};
  }
  UX.Base = Base;

}());
