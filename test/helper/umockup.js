/* global _uf UNIFACE URLSearchParams */
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
              layout = customPluginClass.processLayout.apply(customPluginClass, args);
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

  /**
   * Mockup of UNIFACE.widget.custom_widget_container in ucustomwidgetcontainer.js
   */
  const customWidgetContainer = {
    "apiCallDepth" : 0,
    "isBlocked" : function() {
      return false;
    },

    /**
     * Mockup of custom_widget_container.addListener without the part related to validation.
     *
     * Adds an event listener that can execute a handler,
     * and returns it to caller.
     *
     * Remark: This listener wrapper would cause redundant registration of listener when
     * this function is called second time, because this wrapper will always be
     * a new instance. Hence each caller will register a different instance.
     * element.addEventListener is managed by instance of listener.
     */
    "addListener" : function(element, event_name, validateAndUpdate, bubbleEvent, handler) {
      // Sanity check.
      if (element === undefined || event_name === undefined) {
        return;
      }

      debugLog("widgetContainer.addListener: element '"
        + element.tagName + "." + element.id + "', event '" + event_name + "'");
      // Add the event listener.
      element.addEventListener(event_name, handler);
      return handler;
    },

    /**
     * Mock up the function custom_widget_container.mapTriggers
     * Map triggers with widget
     *
     * @param {*} triggers the triggers
     */
    "mapTriggers" : function(widget, triggers) {
      // Loop through the callback's triggers.
      Object.keys(triggers).forEach((trg) => {
        // Ask the widget for a mapping for the trigger.
        let mappings = widget.mapTrigger(trg);
        if (mappings) {
          // Make sure we have an *array* of mappings.
          if (!(mappings instanceof Array)) {
            mappings = [mappings];
          }
          mappings.forEach((mapping) => {
            // mapping.element.addEventListener(mapping.event_name, triggers[trg]);
            this.addListener(mapping.element, mapping.event_name, mapping.validate, false, triggers[trg]);
          });
        }
      });
    }

  };

  // Implementation and private functions of WidgetTester class

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

  function initTriggerProxy() {
    this.triggers = {};
    this.triggerProxies = {};
    this.getTriggerProxy = function(triggerName) {
      const _this = this;
      if (typeof this.triggers[triggerName] === "function"
        && !this.triggerProxies[triggerName]) {
        this.triggerProxies[triggerName] = function (event) {
          event.stopPropagation();
          _this.triggers[triggerName].apply(this, arguments);
        };
      }
      return this.triggerProxies[triggerName];
    };
  }

  /**
   * Run asynchronous test actions.
   *
   * @param {Function} testFunction a function including test actions;
   * @returns a promise.
   */
  async function asyncRun(testFunction) {

    debugLog("asyncRun");

    return new Promise(function(resolve, _reject) {
      function callback(_timestamp) {
        debugLog("Callback done");

        resolve();  // resolve immediately
      }

      // Call the function that updates the DOM
      testFunction();

      // Ask browser to callback before next repaint
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

        // introduce triggerProxies for avoiding duplicated registration of trigger handlers
        initTriggerProxy.call(this);
      }

      getWidgetClass() {
        return UNIFACE.ClassRegistry.get(this.widgetName);
      }

      processLayout() {
        let args = [...arguments];
        if (!this.uxTagName) {
          if (args.length) {
            if (!args[0]) {
              args[0] = document.getElementById(this.widgetId);
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
        if (!this.widget || !this.widget.elements || !this.widget.elements.widget) {
          const element = this.processLayout.apply(this, this.layoutArgs);
          const widget = this.construct();
          this.updaters = widget.onConnect(element);
        }
        return this.widget;
      }

      /**
       * Map and register the trigger event handlers
       * @param {*} triggerMap the given trigger handler map, a object with
       *     key is trigger name and value is trigger handler.
       */
      mapTriggers(triggerMap) {
        if (triggerMap) {
          const _this = this;
          const widget = this.onConnect();

          Object.keys(triggerMap).forEach((trg) => {
            if (typeof triggerMap[trg] === "function") {
              _this.triggers[trg] = triggerMap[trg];
              const trigger = {};
              trigger[trg] = _this.getTriggerProxy(trg);
              customWidgetContainer.mapTriggers(widget, trigger);
            }
          });
        }
      }

      dataInit(triggerMap) {
        const widget = this.onConnect();
        this.mapTriggers(triggerMap);
        widget.dataInit();
        return widget;
      }

      createWidget(triggerMap) {
        const widget = this.dataInit(triggerMap);
        let updaters = this.updaters;
        if (!this.updatersNotConnected && updaters !== undefined) {
          // Make sure we have an *array* of validators.
          if (!(updaters instanceof Array)) {
            updaters = [updaters];
          }
          // Create the event listeners for the updaters.
          updaters.forEach((updater) => {
            customWidgetContainer.addListener(updater.element, updater.event_name, true, false, updater.handler);
          });
          this.updatersNotConnected = true;
        }

        return widget;
      }

      dispatchEventFor(triggerName, options) {
        const trigger = this.widget.mapTrigger(triggerName);
        if (this.widgetName === "UX.Button") {
          if (!options) {
            options = {
              "event" : trigger.event_name,
              "element" : trigger.element
            };
          }
        }
        if (options.event === "click") {
          if (!options.element) {
            options.element = trigger.element;
          }
          options.element.click();
        }
      }

      /**
       * Emulate the user click on the item with the given itemIndex as its index (start from 1);
       *
       * @param {Number} itemIndex the index of the item to click on. Optional, default means
       *                 the top item or element, or the first item.
       */
      userClick(itemIndex) {
        let control;
        if (itemIndex && (this.widgetName === "UX.Listbox")) {
          control = this.element.querySelector("fluent-option[role='option']");
          const id = control.id;
          if (id.startsWith("option-") && id.length > 7) {
            let index = Number.parseInt(id.substr(7)) + itemIndex - 1;
            control = this.element.querySelector(`fluent-option#option-${index}`);
          }
        } else { // UX.Button
          control = this.element;
        }
        if (control) {
          control.click();
        }
      }

      /**
       * Emulate the user input on an editable widget.
       *
       * @param {String} value the new input value;
       */
      userInput(value) {
        const currentValue = this.widget.getValue();
        if (this.widgetName === "UX.TextField" && value !== currentValue) {
          const control = this.element.shadowRoot.querySelector("#control.control");
          control.value = value;
          control.dispatchEvent(new window.Event("input"));

          debugLog("userInput(" + value + "): dispatch event 'change'!");
          control.dispatchEvent(new window.Event("change"));
        }
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
