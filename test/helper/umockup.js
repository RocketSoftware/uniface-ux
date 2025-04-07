/* global _uf UNIFACE URLSearchParams  */
(function (global) {
  "use strict";

  /**
   * Mockup of the uniface public namespace
   *
   * @namespace uniface
   * @public
   */
  global.uniface = {
    "RESET": {}
  };


  // ---------------------------------------
  // Mockup of private namespaces of UNIFACE
  // ---------------------------------------
  const classRegistry = {};

  /**
   * Mockup of the UNIFACE private namespace
   *
   * @namespace UNIFACE
   * @private
   */
  global.UNIFACE = {   // Global

    "ClassRegistry" : {
      "add" : function(class_name, the_class) {
        classRegistry[class_name] = the_class;
      },
      "get" : function(class_name) {
        return classRegistry[class_name];
      }
    }
  };

  /**
   * Mockup of the relevant part of private _uf namespace
   *
   * @namespace _uf
   * @private
   */
  global._uf = {
    "DOMNodeManager" : {

      /**
       * get custom widget processed layout
       * @param {String} customWidgetName custom widget name
       * @param {Boolean} mockUp optional, default is undefined or false;
       *       and true if this function is used for mockup;
       * @param {Array} args arguments for processLayout.
       */
      "getCustomWidgetLayout": function (customWidgetName, mockUp, args) {
        var layout = args[0];
        var customPluginClass = UNIFACE.ClassRegistry.get(customWidgetName);
        if (customPluginClass) {
          if (typeof(customPluginClass.processLayout) === "function") {
            if (!mockUp) {
              // original implementation, will cause error if called in mockup env.
              layout = UNIFACE.widget.custom_widget_container.callStaticPluginFunction("processLayout", customPluginClass, args);
            } else {
              layout = customPluginClass.processLayout.apply(customPluginClass, [args[0], _uf.createUxDefinitions(args[1], true)]);
            }
          }
        } else {
          throw new Error("Getting custom widget class  \"" + customPluginClass + "\" failed");
        }
        return layout;
      },

      /**
       * Parses a the node containing IDs with "uent:" or "uocc:" or "ufld:"
       * that indicate they are relevant to the Uniface entity, occurrence and field.
       * If it is custom widget then get custom widget processed layout for given node
       * and return processed node.
       * @param {String} customWidgetName optional, default is undefined or false for
       *      DSP front-end runtime; the custom widget name for umockup module.
       * @param {Array} args the arguments for processLayout
       */
      "parseCustomWidgetNode": function(customWidgetName, args) {
        let node = args[0];
        if (customWidgetName) { // mockup
          if (typeof customWidgetName === "string" && customWidgetName.length > 0) {
            // If its custom widget then call getCustomWidgetLayout
            const layout = this.getCustomWidgetLayout(customWidgetName, true, args);
            if (layout instanceof HTMLElement) {
              layout.id = node.id;
              var parentNode = node.parentNode;
              parentNode.replaceChild(layout, node);
              node = layout;
            } else {
              throw new Error("Function processLayout of " + customWidgetName + " does not return an HTMLElement.");
            }
          }
        } else {
          // throw error
          // See the original function implementation of this function in uniface.js
        }
        return node;
      }
    },

    /**
     * This is a mock function same as uniface to create the UX-definition object,
     * and define its getter functions and setter functions.
     * @param {Object} defs The properties defined for the widget.
     * @param {Boolean} isUpdatable Allowed only in process layout.
     * @returns {Object} Return definition object.
     */
    "createUxDefinitions" : function (defs, isUpdatable = false) {
      let children;
      const definition = {
        "getProperty" : function (propertyName) {
          return defs[propertyName];
        },
        "getPropertyNames" : function () {
          // This  relies on the syntax and valrep-range having been translated into html properties.
          var propertyNames;
          var prop;
          if (Object.keys(defs).length > 0) {
            propertyNames = [];
            for (prop in defs) {
              if (defs.hasOwnProperty(prop)) {
                propertyNames.push(externalizePropertyName(prop));
              }
            }
            // Make sure that the property names are in a defined order.
            propertyNames.sort();
          }
          return propertyNames;
        },
        "getName": function() {
          return defs.nm;
        },
        "getType": function() {
          return defs.type ?? "";
        },
        "getChildDefinitions": function() {
          if (children === undefined && defs.occs) {
            children = [];
            for (var prop in defs.occs) {
              if (typeof defs.occs[prop] === "object") {
                var child_def = defs.occs[prop];
                if (child_def.nm !== undefined) {
                  children.push(_uf.createUxDefinitions(child_def, isUpdatable));
                }
              }
            }
          }
          return children;
        }
      };
      if (isUpdatable) {
        definition.setProperty = function (propertyName, propertyValue) {
          defs[propertyName] = propertyValue;
        };
      }
      if (defs  && defs.type  === "field") {
        definition.getWidgetClass = function() {
          return defs.widget_class;
        };
        if (isUpdatable) {
          definition.setWidgetClass = function(widgetClass) {
            defs.widget_class = widgetClass;
          };
        }
      } else if (defs  && defs.type === "entity") {
        definition.getOccurrenceWidgetClass = function() {
          if (defs.occs) {
            return defs.occs.widget_class;
          }
          return undefined;
        };
        definition.getCollectionWidgetClass = function() {
          return defs.widget_class;
        };
        if (isUpdatable) {
          definition.setOccurrenceWidgetClass = function(widgetClass) {
            if (!defs.occs) {
              defs.occs = {};
            }
            defs.occs.widget_class = widgetClass;
          };
          definition.setCollectionWidgetClass = function(widgetClass) {
            defs.widget_class = widgetClass;
          };
        }
      }
      return definition;
    },

    "uconsole" : (function() {
      var _log, _error, _warn;

      if ((typeof console === "undefined") || (typeof console.log === "undefined")) {
        _log = function(_aMessage) {
          // This empty function is in case the browser does not support console logging.
        };
        _error = _log;
        _warn = _log;
      } else {

        /* console.log */
        _log = function(aMessage) {
          console.log(aMessage);
        };

        /* console.error */
        if (typeof console.error === "undefined") {
          _error = function(aMessage) {
            _log("Error: " + aMessage);
          };
        } else {
          _error = function(aMessage) {
            console.error(aMessage);
          };
        }

        /* console.warn */
        if (typeof console.warn === "undefined") {
          _error = function(aMessage) {
            _log("Warning: " + aMessage);
          };
        } else {
          _warn = function(aMessage) {
            console.warn(aMessage);
          };
        }
      }

      return {
        "log" : _log,
        "error" : _error,
        "warn" : _warn
      };
    })()
  };

  const widgetId = "ux-widget";
  let widgetName;
  let scriptName;

  let _debug = false;

  function debugLog(message) {
    if (_debug) {
      console.log(message);
    }
  }

  function getUrlParam(name) {
    const urlString = window.location.href;
    const paramString = urlString.split("?")[1];
    const queryString = new URLSearchParams(paramString);
    return queryString.get(name);
  }

  function externalizePropertyName(propertyName) {
    var colon = propertyName.indexOf(":");
    if (colon > 0) {
      var prefix = propertyName.slice(0, colon).toLowerCase();
      if (prefix === "class") {
        // Return lower case "class:" followed by case sensitive name.
        return prefix + propertyName.slice(colon);
      }
      if (prefix === "html" || prefix === "style") {
        // Property name is case insensitive. Return it in lower case.
        return propertyName.toLowerCase();
      }
    }
    // The property name has no known prefix.
    return propertyName.toLowerCase();
  }

  function getWidgetName() {
    if (!widgetName) {
      const value = getUrlParam("widget_name");
      widgetName = value ;
    }
    return widgetName;
  }

  function getFileName(widgetName) {
    let name = widgetName.substr(3);
    return name.replace(/[A-Z]/g, (letter, offset) => {
      return (offset ? "_" : "") + letter.toLowerCase();
    });
  }

  /**
   * Run asynchronous test actions.
   *
   * @param {Function} testFunction a function including test actions;
   * @returns a promise.
   */
  async function asyncRun(testFunction, delay = 0) {
    debugLog("asyncRun");

    return new Promise(function (resolve, _reject) {
      let startTime;

      function callback(timestamp) {
        if (!startTime) {
          startTime = timestamp;
        }
        const elapsed = timestamp - startTime;

        if (elapsed >= delay) {
          debugLog("Callback done");
          // Resolve with the timestamp after the delay.
          resolve(timestamp);
        } else {
          // Call requestAnimationFrame again to continue the loop until the elapsed time is greater than the delay.
          window.requestAnimationFrame(callback);
        }
      }

      // Call the function that updates the DOM.
      testFunction();

      // Ask browser to callback before next repaint.
      window.requestAnimationFrame(callback);
    });
  }

  /**
   * Utility functions of mockup
   */
  global.umockup = {

    "setDebug" : function(b) {
      _debug = b;
    },

    "getWidgetName" : getWidgetName,
    "getTestJsName" : function () {
      if (!scriptName) {
        scriptName = getUrlParam("test_script");
        if (!scriptName) {
          const widgetName = getWidgetName();
          if (!widgetName) {
            return null;
          }
          scriptName = "test_ux_" + getFileName(getWidgetName()) + ".js";
        }
      }
      return scriptName;
    },

    "asyncRun" : asyncRun,

    /**
     * Helper class for testing widget.
     */
    "WidgetTester" : class {

      // widget, element, uxTagName;

      constructor() {
        this.widgetId = widgetId;
        this.widgetName = getWidgetName();
        this.widgetProperties = {};
        this.layoutArgs = [];
      }

      getWidgetClass() {
        return UNIFACE.ClassRegistry.get(this.widgetName);
      }

      processLayout() {
        let args = [...arguments];
        if (!this.uxTagName) {
          if (args.length) {
            // This is to check explicitly if null param is passed.
            if (!args[0]) {
              args[0] = document.getElementById(this.widgetId);
            }
            // This will always keep a check that first parameter should always be HTML element.
            if (!(args[0] instanceof HTMLElement)) {
              args.unshift(document.getElementById(this.widgetId));
            }
          } else {
            args = [document.getElementById(this.widgetId)];
          }
          this.element = _uf.DOMNodeManager.parseCustomWidgetNode(this.widgetName, args);
          this.uxTagName = this.element.tagName;
          this.layoutArgs = args;
        }

        return this.element;
      }

      construct() {
        if (!this.widget) {
          const widgetClass = this.getWidgetClass(this.widgetName);
          this.widget = new widgetClass();
        }
        return this.widget;
      }

      onConnect() {
        if (!this.widget || !this.widget.elements) {
          const element = this.processLayout.apply(this, this.layoutArgs);
          const widget = this.construct();
          widget.onConnect(element, _uf.createUxDefinitions(this.layoutArgs[1]));
        }
        return this.widget;
      }


      /** The Widgets onConnect API method returns an array of event descriptions that indicate,
       * when a value has changed, enabling Uniface to respond accordingly.
       * bindUpdatorsEventToElement method binds the returned updaters to elements using addEventListener.
       * This will allow element to react on defined event type on user interaction.
       */
      bindUpdatorsEventToElement() {
        const element = this.processLayout.apply(this, this.layoutArgs);
        const widget = this.construct();
        let updaters = widget.onConnect(element);
        updaters.forEach((updater) => {
          element.addEventListener(updater.event_name, updater.handler);
        });
      }

      dataInit() {
        const widget = this.onConnect();
        widget.dataInit();
        return widget;
      }

      createWidget() {
        return this.dataInit();
      }

      getDefaultValues() {
        if (!this.defaultValues) {
          const widgetClass = this.getWidgetClass();
          this.defaultValues = widgetClass.defaultValues;
          if (!this.defaultValues) {
            this.defaultValues = {};
          }
        }
        return this.defaultValues;
      }

      getDefaultClasses() {
        const widgetClass = this.getWidgetClass();
        this.defaultValues = widgetClass.defaultValues;
        const classes = Object.keys(this.defaultValues).reduce((accumulator, key) => {
          if (key.startsWith("class:")) {
            let newKey = key.replace("class:", "");
            accumulator[newKey] = this.defaultValues[key];
          }
          return accumulator;
        }, {});
        return classes;
      }

      dataUpdate(data) {
        // This is to remember the updated value from widget test so that this.widgetProperties can be used in dataCleanup()
        Object.keys(data).forEach((key) => {
          if (!this.widgetProperties[key]) {
            this.widgetProperties[key] = new Set();
          }
          data[key] !== null && data[key] !== undefined && Object.keys(data[key]).forEach((childKey) => {
            this.widgetProperties[key].add(childKey);
          });
        });
        this.widget.dataUpdate(data);
      }

    }

  };

})(this);
