/* global _uf UNIFACE URLSearchParams Node */
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

      /**
       * Registers a widget class under the given name.
       * @param {string} class_name The class name to register (e.g. "UX.Button").
       * @param {Function} the_class The widget class constructor.
       */
      "add" : function(class_name, the_class) {
        classRegistry[class_name] = the_class;
      },

      /**
       * Retrieves a registered widget class by name.
       * @param {string} class_name  The class name to look up.
       * @returns {Function|undefined} The widget class, or undefined if not registered.
       */
      "get" : function(class_name) {
        return classRegistry[class_name];
      }
    }
  };

  // Storage for DOMNodeManager — mirrors the private `storage` variable in
  // dom_node_manager.js.  Keyed as storage[instanceName][viewName][prefix+name].
  const _domNodeStorage = {};
  const _DOM_DEFAULT_VIEW = "default";

  /**
   * Mockup of the relevant part of private _uf namespace
   *
   * @namespace _uf
   * @private
   */
  global._uf = {
    "DOMNodeManager" : {

      /**
       * Get custom widget processed layout.
       * Mirrors the private getCustomWidgetLayout() in dom_node_manager.js.
       *
       * @param {HTMLElement} node The placeholder DOM node.
       * @param {string} customWidgetName The custom widget class name.
       * @param {object} nodeDefinition Definition object (or raw defs) for the widget.
       */
      "getCustomWidgetLayout": function (node, customWidgetName, nodeDefinition) {
        var layout = node;
        var customPluginClass = UNIFACE.ClassRegistry.get(customWidgetName);
        if (customPluginClass) {
          if (typeof (customPluginClass.processLayout) === "function") {
            // If nodeDefinition is already a wrapped definition object (has getProperty),
            // pass it directly. Otherwise wrap the raw defs so the widget receives
            // a proper definition API — mirrors uxDefs_updatable from the real runtime.
            const objDef = (nodeDefinition && typeof nodeDefinition.getProperty === "function")
              ? nodeDefinition
              : _uf.createUxDefinitions(nodeDefinition, true);
            layout = customPluginClass.processLayout.apply(customPluginClass, [node, objDef]);
          }
        } else {
          // Mirror the actual API: return an error div rather than throw, so that
          // layout generation continues and the error is visible in the rendered page.
          layout = document.createElement("div");
          layout.innerHTML = "<div style=\"color:red;\">Widget class '" + customWidgetName
            + "' not found for node " + node.id + "</div>";
        }
        return layout;
      },

      /**
       * Adds a node reference to the mock store.
       * Mirrors _uf.DOMNodeManager.add() in dom_node_manager.js.
       *
       * @param {string} name Plain name of the item (without prefix).
       * @param {string} typePrefix The Uniface id prefix (e.g. "uent:").
       * @param {string} instanceName Name of the instance the node belongs to.
       * @param {HTMLElement} nodeReference The node to store.
       * @param {string} [viewName] Name of the view; defaults to "default".
       */
      "add": function (name, typePrefix, instanceName, nodeReference, viewName) {
        viewName = viewName || _DOM_DEFAULT_VIEW;
        if (!_domNodeStorage[instanceName]) {
          _domNodeStorage[instanceName] = {};
        }
        if (!_domNodeStorage[instanceName][viewName]) {
          _domNodeStorage[instanceName][viewName] = {};
        }
        _domNodeStorage[instanceName][viewName][typePrefix + name] = nodeReference;
      },

      /**
       * Retrieves a node reference from the mock store.
       * Mirrors _uf.DOMNodeManager.fetch() in dom_node_manager.js.
       *
       * @param {string} name Plain name of the item (without prefix).
       * @param {string} typePrefix The Uniface id prefix (e.g. "uent:").
       * @param {string} instanceName Name of the instance the node belongs to.
       * @param {string} [viewName] Name of the view; defaults to "default".
       * @returns {HTMLElement|undefined}
       */
      "fetch": function (name, typePrefix, instanceName, viewName) {
        viewName = viewName || _DOM_DEFAULT_VIEW;
        if (!_domNodeStorage[instanceName] || !_domNodeStorage[instanceName][viewName]) {
          return undefined;
        }
        return _domNodeStorage[instanceName][viewName][typePrefix + name];
      },

      /**
       * Full mock of _uf.DOMNodeManager.parse().
       *
       * Mirrors the two real call sites in dom_node_manager.js:
       *   – view.js: parse(rootElement, instanceName, viewName, true)
       *     Page-load path: initialise custom widgets, append
       *     instanceName suffix to ids, register nodes in storage.
       *   – instance_manager.js: parse(clonedNode, instanceName, viewName, false)
       *     Clone-occurrence path: suffix + store only, no widget init.
       *
       * The optional 5th argument `definitionsMap` substitutes the real runtime's
       * `_uf.definitionsManager` — it is a plain object keyed by the placeholder's
       * full id (e.g. "uent:MY_ENTITY"), with each value being a definition object
       * that exposes getCollectionWidgetClass() / getOccurrenceWidgetClass() /
       * getWidgetClass() / getComponentWidgetClass().
       *
       * @param {Node} node Root node whose children to walk.
       * @param {string} instanceName Uniface instance name — used as the id suffix
       *   and as the storage key.
       * @param {string} viewName View name used as the secondary storage key.
       * @param {boolean} isPageLoad true → widget init + suffix + store;
       *   false → suffix + store only (clone path).
       * @param {Object} [definitionsMap] Optional map of placeholder-id → definition.
       */
      "parse": function (node, instanceName, viewName, isPageLoad, definitionsMap) {
        const self = this;
        // Separator between name and instanceName — matches _uf.constants.UINS_SEPARATOR = ":" in the real runtime.
        const UINS_SEPARATOR = ":";
        // Map of all recognised Uniface id prefixes — mirrors UID_PREFIXES in dom_node_manager.js.
        const UID_PREFIX_TYPES = {
          "ucpt:": "component",
          "uent:": "entity",
          "uocc:": "occurrence",
          "ufld:": "field"
        };

        /**
         * Resolves the widget class name from a definition, dispatching on prefix type.
         * @param {string} typePrefix  The prefix extracted from the node id.
         * @param {object} def         Definition object.
         * @returns {string|null}
         */
        function resolveWidgetClass(typePrefix, def) {
          if (!def) {
            return null;
          }
          switch (UID_PREFIX_TYPES[typePrefix]) {
            case "component":
              if (typeof def.getComponentWidgetClass === "function") {
                return def.getComponentWidgetClass() || null;
              }
              break;
            case "entity":
              if (typeof def.getCollectionWidgetClass === "function") {
                return def.getCollectionWidgetClass() || null;
              }
              break;
            case "occurrence":
              if (typeof def.getOccurrenceWidgetClass === "function") {
                return def.getOccurrenceWidgetClass() || null;
              }
              break;
            case "field":
              if (typeof def.getWidgetClass === "function") {
                return def.getWidgetClass() || null;
              }
              break;
          }
          return null;
        }

        /**
         * Mirrors addSuffix() from dom_node_manager.js:
         *   1. On page load, replaces the placeholder with the live widget element
         *      (keeping the full prefixed id on the widget element).
         *   2. Appends ":<instanceName>" suffix to the node id when not already present.
         *   3. Stores the node in the DOMNodeManager storage.
         *
         * @param {HTMLElement} aNode
         * @returns {HTMLElement} The (possibly replaced) node.
         */
        function addSuffix(aNode) {
          if (!aNode.id) {
            return aNode;
          }
          const colonIdx = aNode.id.indexOf(":");
          if (colonIdx < 0) {
            return aNode;
          }
          const typePrefix = aNode.id.substring(0, colonIdx + 1).toLowerCase();
          if (!Object.prototype.hasOwnProperty.call(UID_PREFIX_TYPES, typePrefix)) {
            return aNode;
          }

          // Page-load: replace the placeholder with the live widget element.
          if (isPageLoad && definitionsMap) {
            const def = definitionsMap[aNode.id];
            const widgetClassName = resolveWidgetClass(typePrefix, def);
            if (widgetClassName) {
              const layout = self.getCustomWidgetLayout(aNode, widgetClassName, def);
              if (layout instanceof HTMLElement) {
                layout.id = aNode.id; // Keep full prefixed id — mirrors actual API.
                const parentNode = aNode.parentNode;
                if (parentNode) {
                  parentNode.replaceChild(layout, aNode);
                }
                aNode = layout;

                // For uent: nodes: if the entity has multiple occurrences, inject extra
                // uocc: placeholders into the freshly created CollectionLayout element
                // (mirrors _injectOccurrencePlaceholders for the top-level entity, but scoped to nested entities).
                if (typePrefix === "uent:") {
                  const entName = aNode.id.substring("uent:".length);
                  const occCount = definitionsMap["_occ_count:" + entName];
                  if (occCount && occCount > 1) {
                    const firstOcc = aNode.querySelector("[id^='uocc:']");
                    if (firstOcc && firstOcc.parentNode) {
                      const baseOccId = firstOcc.id;
                      firstOcc.id = baseOccId + ".1";
                      let insertAfter = firstOcc;
                      for (let _oi = 1; _oi < occCount; _oi++) {
                        const extra = document.createElement(firstOcc.tagName.toLowerCase());
                        extra.id = baseOccId + "." + (_oi + 1);
                        insertAfter.parentNode.insertBefore(extra, insertAfter.nextSibling);
                        insertAfter = extra;
                      }
                    }
                  }
                }
              }
            }
          }

          // Append instanceName suffix when not already present — mirrors addSuffix.
          if (instanceName) {
            const suffix = aNode.id.charAt(aNode.id.length - 1) !== ":"
              ? UINS_SEPARATOR + instanceName
              : instanceName;
            const idLen = aNode.id.length;
            const sfxLen = suffix.length;
            let name;
            if (idLen < sfxLen || aNode.id.substring(idLen - sfxLen) !== suffix) {
              // Suffix not yet present — compute name before mutating id.
              name = typePrefix === "ucpt:"
                ? instanceName
                : aNode.id.substring(typePrefix.length);
              aNode.id = aNode.id + suffix;
            } else {
              // Suffix already present — reconstruct the plain name.
              const full = aNode.id.substring(0, idLen - sfxLen);
              name = typePrefix === "ucpt:"
                ? instanceName
                : full.substring(typePrefix.length);
            }
            self.add(name, typePrefix, instanceName, aNode, viewName);
          }

          return aNode;
        }

        /**
         * Recursively processes the DOM subtree rooted at `n`, visiting every
         * element node it encounters.  This is the test-only equivalent of the
         * internal traversal loop inside _uf.DOMNodeManager.parse() in the real
         * Uniface runtime (dom_node_manager.js).
         *
         * For each element child it:
         *   1. Captures `nextSibling` BEFORE calling addSuffix(), because
         *      addSuffix() may replace the node in the DOM (on page load), which
         *      would otherwise break sibling iteration.
         *   2. If the child has a shadow root, processes the shadow tree first —
         *      matching the order used by the real runtime's parse().  Each shadow
         *      element is passed through addSuffix() and then walked recursively.
         *   3. Passes the light-DOM child through addSuffix(), which:
         *        – On page load: replaces a Uniface placeholder (uent:, uocc:,
         *          ufld:, ucpt:) with the live widget element returned by the
         *          widget's own processLayout().
         *        – When instanceName is set: appends the ":<instanceName>" suffix
         *          to the node id and registers the node in DOMNodeManager storage
         *          via add().  In tests instanceName is null, so this step is skipped.
         *   4. Recurses into the (possibly replaced) child to process its
         *      descendants, so the entire subtree is covered depth-first.
         *
         * Entry point: called once as processSubtree(node) at the bottom of parse() to
         * kick off traversal from the root node passed in.
         *
         * @param {Node} n  The node whose direct children should be processed.
         */
        function processSubtree(n) {
          let child = n.firstChild;
          while (child !== null) {
            // Capture next sibling before any DOM mutation.
            const next = child.nextSibling;
            if (child.nodeType === Node.ELEMENT_NODE) {
              if (child.shadowRoot) {
                // Walk shadow children first — mirrors the shadow-root loop in actual parse().
                let shadowChild = child.shadowRoot.firstChild;
                while (shadowChild !== null) {
                  const shadowNext = shadowChild.nextSibling;
                  if (shadowChild.nodeType === Node.ELEMENT_NODE) {
                    shadowChild = addSuffix(shadowChild);
                    processSubtree(shadowChild);
                  }
                  shadowChild = shadowNext;
                }
              }
              let current = addSuffix(child);
              processSubtree(current);
            }
            child = next;
          }
        }

        processSubtree(node);
      },

      /**
       * Parses a the node containing IDs with "uent:", "uocc:", "ufld:", or "ucpt:"
       * that indicate they are relevant to the Uniface entity, occurrence, field and component.
       * If it is custom widget then get custom widget processed layout for given node
       * and return processed node.
       * @param {string} customWidgetName optional, default is undefined or false for
       *   DSP front-end runtime; the custom widget name for umockup module.
       * @param {Array} args the arguments for processLayout
       */
      "parseCustomWidgetNode": function(customWidgetName, args) {
        let node = args[0];
        if (customWidgetName) { // mockup
          if (typeof customWidgetName === "string" && customWidgetName.length > 0) {
            // If its custom widget then call getCustomWidgetLayout
            const layout = this.getCustomWidgetLayout(node, customWidgetName, args[1]);
            if (layout instanceof HTMLElement) {
              // Strip the Uniface placeholder prefix ("uent:", "uocc:", "ufld:") so the
              // live widget element carries only the plain widget id, mirroring the
              // production runtime where the widget element does not inherit the
              // placeholder's typed prefix.
              layout.id = node.id;
              var parentNode = node.parentNode;
              if (parentNode) {
                parentNode.replaceChild(layout, node);
              }
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
     * @param {object} defs The properties defined for the widget.
     * @param {boolean} isUpdatable Allowed only in process layout.
     * @returns {object} Return definition object.
     */
    "createUxDefinitions" : function (defs, isUpdatable = false) {
      defs = defs || {};
      let children;
      const definition = {
        "getProperty" : function (propertyName) {
          return defs.properties[propertyName];
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
        "getName" : function () {
          var name = defs.type === "component" ? defs["componentName"] : defs.nm;
          return name;
        },
        "getType" : function () {
          return defs ? defs.type : undefined;
        },

        "getChildDefinitions": function() {
          if (children !== undefined) {
            return children;
          }
          children = [];
          if (defs.type === "component") {
            // Component: direct children are entity/field defs identified by nm.
            for (var _cprop in defs) {
              if (typeof defs[_cprop] === "object") {
                var _cdef = defs[_cprop];
                if (_cdef && _cdef.nm !== undefined) {
                  children.push(_uf.createUxDefinitions(_cdef, isUpdatable));
                }
              }
            }
          } else if (defs.occs && typeof defs.occs === "object") {
            // Entity: occs is { "#2": { type: "occurrence", "#3": field/entity, ... } }
            // Use the first occurrence value as the child-definition source.
            // Children can be fields (type === "field") or nested entities (type === "entity").
            var _firstOcc = Object.values(defs.occs)[0];
            if (_firstOcc) {
              for (var _fkey in _firstOcc) {
                var _fdef = _firstOcc[_fkey];
                if (_fdef && typeof _fdef === "object" &&
                    (_fdef.type === "field" || _fdef.type === "entity")) {
                  children.push(_uf.createUxDefinitions(_fdef, isUpdatable));
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
      if (defs.type === "field") {
        definition.getWidgetClass = function () {
          return defs.widget_class;
        };
        if (isUpdatable) {
          definition.setWidgetClass = function (widgetClass) {
            defs.widget_class = widgetClass;
          };
        }
      } else if (defs.type === "entity") {
        definition.getOccurrenceWidgetClass = function () {
          if (defs.occs && typeof defs.occs === "object") {
            // Object format: { "#2": { type: "occurrence", widget_class: "...", ... } }
            // Return the widget_class from the first occurrence entry.
            const _firstOcc = Object.values(defs.occs)[0];
            return _firstOcc ? _firstOcc.widget_class : undefined;
          }
          return undefined;
        };
        definition.getCollectionWidgetClass = function () {
          return defs.widget_class;
        };

        if (isUpdatable) {
          definition.setOccurrenceWidgetClass = function (widgetClass) {
            if (!defs.occs) {
              defs.occs = {};
            }
            // Object format: update widget_class on every occurrence entry.
            Object.keys(defs.occs).forEach(function (key) {
              if (defs.occs[key]) {
                defs.occs[key].widget_class = widgetClass;
              }
            });
          };
          definition.setCollectionWidgetClass = function (widgetClass) {
            defs.widget_class = widgetClass;
          };
        }
      } else if (defs.type === "component") {
        definition.getName = function () {
          return defs.componentname;
        };
        definition.getShortName = function () {
          return defs.componentname;
        };
        definition.getComponentWidgetClass = function () {
          return defs.widget_class;
        };
        if (isUpdatable) {
          definition.setComponentWidgetClass = function (widgetClass) {
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
     *
     * @param {HTMLElement} element The DOM element to attach the listener to.
     * @param {string} event_name The event type (e.g. "click", "change").
     * @param {boolean} validateAndUpdate Whether to validate before updating (unused in mock).
     * @param {boolean} bubbleEvent Whether the event should bubble (unused in mock).
     * @param {Function} handler The event handler function.
     * @returns {Function} The registered handler.
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
     * @param {object} widget The widget instance (must implement mapTrigger()).
     * @param {object} triggers Map of trigger name → handler function.
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

  let widgetName;
  let scriptName;

  let _debug = false;

  function debugLog(message) {
    if (_debug) {
      console.log(message);
    }
  }

  /**
   * Reads a named query parameter from the current page URL.
   * @param {string} name The parameter name.
   * @returns {string|null} The parameter value, or null if absent.
   */
  function getUrlParam(name) {
    const urlString = window.location.href;
    const paramString = urlString.split("?")[1];
    const queryString = new URLSearchParams(paramString);
    return queryString.get(name);
  }

  /**
   * Converts an internal property name to its external (lower-case) form.
   * Prefixes "class:", "html:" and "style:" are normalised; unknown prefixes
   * are returned in lower case.
   * @param {string} propertyName The raw property name.
   * @returns {string} The normalised external property name.
   */
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

  /**
   * Returns the widget class name, reading it from the "widget_name" URL
   * parameter on first call and caching the result.
   * @returns {string|null} The widget class name, or null if not set.
   */
  function getWidgetName() {
    if (!widgetName) {
      const value = getUrlParam("widget_name");
      widgetName = value ;
    }
    return widgetName;
  }

  /**
   * Derives the test file base name from a widget class name.
   * Strips the "UX." prefix and converts CamelCase to snake_case.
   * @param {string} widgetName The widget class name (e.g. "UX.MyWidget").
   * @returns {string} The snake_case file name fragment (e.g. "my_widget").
   */
  function getFileName(widgetName) {
    let name = widgetName.substr(3);
    return name.replace(/[A-Z]/g, (letter, offset) => {
      return (offset ? "_" : "") + letter.toLowerCase();
    });
  }

  /**
   * Returns a proxy function for the named trigger that increments a call
   * counter each time it is invoked, then forwards to the real handler.
   * Creates the proxy on first call and caches it in this.triggerProxies.
   * @param {string} triggerName The trigger name.
   * @returns {Function|undefined} The proxy function, or undefined if the
   *   trigger has no registered handler.
   */
  function getTriggerProxy(triggerName) {
    const _this = this;
    const triggerInfo = this.triggers[triggerName];
    if (triggerInfo && typeof triggerInfo.handler === "function"
      && !this.triggerProxies[triggerName]) {
      this.triggerProxies[triggerName] = function (event) {
        event.stopPropagation();
        const _triggerInfo = _this.triggers[triggerName];
        if (_triggerInfo) {
          if (typeof _triggerInfo.countOfCall !== "number") {
            _triggerInfo.countOfCall = 0;
          }
          _triggerInfo.countOfCall++;
          _triggerInfo.handler.apply(this, arguments);
        }
      };
      triggerInfo.countOfCall = 0;
    }
    return this.triggerProxies[triggerName];
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
   * Helper class for testing widget.
   */
  class WidgetTester {

    // widget, element, uxTagName;
    static debug = false;

    /**
     * Creates a new WidgetTester for the given widget class.
     * @param {string} [widgetName] Optional widget class name. When omitted the
     *   name is read from the "widget_name" URL parameter, matching the legacy
     *   single-widget-per-page convention.
     * @param {string} [widgetId] Optional element id for the placeholder node.
     *   Defaults to "ufld:<widgetName in lower case>".
     */
    constructor(widgetName, widgetId) {
      this.widgetName = widgetName || getWidgetName();
      this.widgetId = widgetId || `ufld:${this.widgetName.toLowerCase()}`;
      this.widgetProperties = {};
      this.initialValues = {};
      this.layoutArgs = [];

      // introduce triggerProxies for avoiding duplicated registration of trigger handlers
      this.triggerProxies = {};
      this.getTriggerProxy = getTriggerProxy;
      this.resetMapTriggers();
    }

    /**
     * Enables or disables debug logging for this tester instance.
     * @param {boolean} mode true to enable, false to disable.
     */
    setDebug(mode) {
      this.debug = mode;
    }

    debugLog(message) {
      if (WidgetTester.debug) {
        console.log(message);
      }
    }

    /**
     * Looks up and returns the widget class from the UNIFACE class registry.
     * @returns {Function} The widget class constructor.
     */
    getWidgetClass() {
      return UNIFACE.ClassRegistry.get(this.widgetName);
    }

    /**
     * Normalises the processLayout argument list and wires up the placeholder
     * element, mirroring how the real Uniface runtime resolves the root node.
     * @param {Array} args The spread arguments passed to processLayout.
     * @returns {Array} The (possibly mutated) args array.
     */
    _prepareLayoutArgs(args) {
      const defaultTestWidget = document.getElementById("ux-widget");
      if (args.length) {
        if (args[0] instanceof HTMLElement && defaultTestWidget) {
          defaultTestWidget.replaceWith(args[0]);
        } else if (!(args[0] instanceof HTMLElement) && defaultTestWidget) {
          defaultTestWidget.id = this.widgetId;
          args = args[0] ? [defaultTestWidget, args[0]] : [defaultTestWidget, args[1]];
        }
      } else {
        defaultTestWidget.id = this.widgetId;
        args = [defaultTestWidget];
      }
      return args;
    }

    /**
     * Inject extra uocc: placeholder elements for multi-occurrence entities.
     * CollectionLayout always produces exactly ONE uocc: placeholder (via
     * WidgetOccurrence.getLayout). This method clones it so each occurrence gets
     * its own live element. IDs follow the Uniface convention "uocc:NAME.N" (1-based).
     * @param {Object|null} rawOccs The raw occs object; null when not applicable.
     * @param {number} occCount Number of occurrences (Object.keys(rawOccs).length).
     */
    _injectOccurrencePlaceholders(rawOccs, occCount) {
      if (!rawOccs || occCount < 1) {
        return;
      }
      const firstPlaceholder = this.element.querySelector("[id^='uocc:']");
      if (!firstPlaceholder || !firstPlaceholder.parentNode) {
        return;
      }
      const basePlaceholderId = firstPlaceholder.id;
      firstPlaceholder.id = basePlaceholderId + ".1";
      let insertAfter = firstPlaceholder;
      for (let i = 1; i < occCount; i++) {
        const extra = document.createElement(firstPlaceholder.tagName.toLowerCase());
        extra.id = basePlaceholderId + "." + (i + 1);
        insertAfter.parentNode.insertBefore(extra, insertAfter.nextSibling);
        insertAfter = extra;
      }
    }

    /**
     * Build the definition map passed to DOMNodeManager.parse() so that
     * placeholder nodes can be replaced with live widget elements.
     * Handles three cases: entity (occs format), component, and field-child fallback.
     * @param {object} wrappedDef The wrapped definition object.
     * @param {object} rawDef The raw plain-object definition (or wrappedDef
     *   when the caller already passed a definition).
     * @param {Object|null} rawOccs The raw occs object extracted from rawDef.
     * @returns {Object} Map of placeholder-id → definition.
     */
    _buildDefMap(wrappedDef, rawDef, rawOccs) {
      const defMap = {};

      // Map each uocc: placeholder → entity def (getOccurrenceWidgetClass resolves it).
      this.element.querySelectorAll("[id^='uocc:']").forEach(function (el) {
        defMap[el.id] = wrappedDef;
      });

      const rawOccFields = rawOccs ? Object.values(rawOccs)[0] : null;

      if (rawOccFields) {
        // Entity path: pre-populate ufld: and uent: entries from the first occurrence's children.
        Object.keys(rawOccFields).forEach(function (key) {
          const rawChild = rawOccFields[key];
          if (!rawChild || typeof rawChild !== "object") {
            return;
          }

          if (rawChild.type === "field") {
            const fieldDef = _uf.createUxDefinitions(rawChild, true);
            const fieldName = fieldDef.getName();
            if (fieldName) {
              defMap["ufld:" + fieldName] = fieldDef;
            }
          } else if (rawChild.type === "entity" && rawChild.nm) {
            // Nested entity: register uent:, uocc: and its own field children.
            const entWrapped = _uf.createUxDefinitions(rawChild, true);
            const entName = rawChild.nm;
            defMap["uent:" + entName] = entWrapped;

            const rawEntOccs = (rawChild.occs && typeof rawChild.occs === "object" && !Array.isArray(rawChild.occs))
              ? rawChild.occs : null;
            const entOccCount = rawEntOccs ? Object.keys(rawEntOccs).length : 1;

            if (entOccCount > 1) {
              defMap["_occ_count:" + entName] = entOccCount;
              for (let i = 1; i <= entOccCount; i++) {
                defMap["uocc:" + entName + "." + i] = entWrapped;
              }
            } else {
              defMap["uocc:" + entName] = entWrapped;
            }

            const rawEntOccFields = rawEntOccs ? Object.values(rawEntOccs)[0] : null;
            if (rawEntOccFields) {
              Object.keys(rawEntOccFields).forEach(function (fKey) {
                const rawField = rawEntOccFields[fKey];
                if (!rawField || typeof rawField !== "object" || rawField.type !== "field") {
                  return;
                }
                const fieldDef = _uf.createUxDefinitions(rawField, true);
                const fieldName = fieldDef.getName();
                if (fieldName) {
                  defMap["ufld:" + fieldName] = fieldDef;
                }
              });
            }
          }
        });
      } else if (!rawDef.getProperty && rawDef.type === "component") {
        // Component path: entity children sit directly as numbered keys in the raw def.
        Object.keys(rawDef).forEach(function (key) {
          const child = rawDef[key];
          if (!child || typeof child !== "object" || child.type !== "entity" || !child.nm) {
            return;
          }

          const entWrapped = _uf.createUxDefinitions(child, true);
          const entName = child.nm;
          defMap["uent:" + entName] = entWrapped;

          const rawEntOccs = (child.occs && typeof child.occs === "object" && !Array.isArray(child.occs))
            ? child.occs : null;
          const entOccCount = rawEntOccs ? Object.keys(rawEntOccs).length : 1;

          if (entOccCount > 1) {
            defMap["_occ_count:" + entName] = entOccCount;
            for (let i = 1; i <= entOccCount; i++) {
              defMap["uocc:" + entName + "." + i] = entWrapped;
            }
          } else {
            defMap["uocc:" + entName] = entWrapped;
          }

          const rawEntOccFields = rawEntOccs ? Object.values(rawEntOccs)[0] : null;
          if (rawEntOccFields) {
            Object.keys(rawEntOccFields).forEach(function (fKey) {
              const rawField = rawEntOccFields[fKey];
              if (!rawField || typeof rawField !== "object" || rawField.type !== "field") {
                return;
              }
              const fieldDef = _uf.createUxDefinitions(rawField, true);
              const fieldName = fieldDef.getName();
              if (fieldName) {
                defMap["ufld:" + fieldName] = fieldDef;
              }
            });
          }
        });
      } else if (typeof wrappedDef.getChildDefinitions === "function") {
        wrappedDef.getChildDefinitions().forEach(function (childDef) {
          if (typeof childDef.getName === "function") {
            defMap["ufld:" + childDef.getName()] = childDef;
          }
        });
      }

      return defMap;
    }

    /**
     * Calls processLayout() on the widget class and stores the resulting element.
     * On the first call it also walks child placeholders
     * and invokes their widget's processLayout, mirroring the real runtime's
     * page-load path (view.parseTemplate). Subsequent calls are no-ops and
     * return the cached element.
     * @param {...*} args Arguments forwarded to the widget's processLayout.
     *   The first argument may be an HTMLElement (skeleton) or a raw definition
     *   object; see _prepareLayoutArgs for the full normalisation logic.
     * @returns {HTMLElement} The live widget element.
     */
    processLayout() {
      let args = [...arguments];
      if (!this.uxTagName) {
        args = this._prepareLayoutArgs(args);
        this.element = _uf.DOMNodeManager.parseCustomWidgetNode(this.widgetName, args);
        this.uxTagName = this.element.tagName;
        this.layoutArgs = args;

        // Mirror view.parseTemplate(): walk child placeholder nodes (uocc:, ufld:,
        // ucpt:) and invoke their widget processLayout — matching the real API's
        // page-load path. instanceName is null so no id suffix is appended in tests.
        const _rawDef = args[1];
        if (_rawDef) {
          const _wrappedDef = (typeof _rawDef.getProperty === "function")
            ? _rawDef
            : _uf.createUxDefinitions(_rawDef, true);

          const _rawOccs = (!_rawDef.getProperty && _rawDef.occs
            && typeof _rawDef.occs === "object")? _rawDef.occs : null;

          this._injectOccurrencePlaceholders(_rawOccs, _rawOccs ? Object.keys(_rawOccs).length : 0);

          const _defMap = this._buildDefMap(_wrappedDef, _rawDef, _rawOccs);
          if (Object.keys(_defMap).length > 0) {
            _uf.DOMNodeManager.parse(this.element, null, null, true, _defMap);
          }
        }
      }

      return this.element;
    }

    /**
     * Instantiates the widget class and caches the result.
     * Subsequent calls return the cached widget instance.
     * @returns {object} The widget instance.
     */
    construct() {
      if (!this.widget) {
        const widgetClass = this.getWidgetClass(this.widgetName);
        this.widget = new widgetClass();
      }
      return this.widget;
    }

    /**
     * Calls processLayout() and construct() if needed, then invokes onConnect()
     * on the widget with the processed element and definition object.
     * @param {HTMLElement|object} [skeletonOrElement] Optional skeleton element or
     *   raw definition to forward to processLayout.
     * @param {object} [rawDefOverride] Optional raw definition object that overrides
     *   the one stored in layoutArgs.
     * @returns {object} The connected widget instance.
     */
    onConnect(skeletonOrElement, rawDefOverride) {
      if (!this.widget || !this.widget.elements || !this.widget.elements.widget) {
        // If a skeleton/element is passed, forward it through processLayout so
        // layoutArgs is updated before we read it below (mirrors the real API
        // where onConnect always follows a processLayout call with the same args).
        if (skeletonOrElement) {
          this.processLayout(skeletonOrElement, rawDefOverride);
        }
        const element = this.processLayout.apply(this, this.layoutArgs);
        const widget = this.construct();
        const rawDef = this.layoutArgs[1];
        const objDef = rawDef
          ? (typeof rawDef.getProperty === "function" ? rawDef : _uf.createUxDefinitions(rawDef, true))
          : _uf.createUxDefinitions({}, false);
        this.updaters = widget.onConnect(element, objDef);
      }
      return this.widget;
    }

    /**
     * Map and register the trigger event handlers.
     * @param {Object} triggerMap the given trigger handler map, a object with
     *   key is trigger name and value is trigger handler.
     */
    mapTriggers(triggerMap) {
      if (triggerMap) {
        const _this = this;
        const widget = this.onConnect();

        Object.keys(triggerMap).forEach((trg) => {
          if (typeof triggerMap[trg] === "function") {
            _this.triggers[trg] = {
              "handler" : triggerMap[trg],
              "countOfCall" : 0
            };
            const trigger = {};
            trigger[trg] = _this.getTriggerProxy(trg);
            customWidgetContainer.mapTriggers(widget, trigger);
          }
        });
      } else {
        this.resetMapTriggers();
      }
    }

    /**
     * Connects the widget (onConnect), registers trigger handlers (mapTriggers),
     * calls dataInit() on the widget, and optionally records initial property values.
     * @param {Object|null} triggerMap Map of trigger name → handler function,
     *   or null to skip trigger registration.
     * @param {HTMLElement|object} [skeletonOrElement] Forwarded to onConnect.
     * @param {object} [rawDefOverride] Forwarded to onConnect.
     * @param {object} [initialData] Property values to remember as the
     *   "initial" state for subsequent resetWidget() calls.
     * @returns {object} The widget instance.
     */
    dataInit(triggerMap, skeletonOrElement, rawDefOverride, initialData) {
      const widget = this.onConnect(skeletonOrElement, rawDefOverride);
      this.mapTriggers(triggerMap);
      widget.dataInit();
      if (initialData) {
        this.initialValues = Object.assign({}, initialData);
      }
      return widget;
    }

    /**
     * Convenience method that calls dataInit() and then wires up the updater
     * event listeners returned by onConnect().
     * @param {Object|null} triggerMap Map of trigger name → handler, or null.
     * @param {HTMLElement|object} [skeletonOrElement] Forwarded to dataInit.
     * @param {object} [rawDefOverride] Forwarded to dataInit.
     * @returns {object} The fully initialised widget instance.
     */
    createWidget(triggerMap, skeletonOrElement, rawDefOverride) {
      const widget = this.dataInit(triggerMap, skeletonOrElement, rawDefOverride);
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

    /**
     * Resets one or more widget properties.
     * Each property reverts to its value from the last dataInit call ("initial value")
     * when one was recorded, or to uniface.RESET otherwise — which instructs the widget
     * to apply its own defaultValue, mirroring the semantics of Uniface's "!" property
     * prefix.
     *
     * @param {string|string[]} [properties] Property name or array of property names to
     *   reset. When omitted, all properties declared in the widget's defaultValues are
     *   reset.
     */
    resetWidget(properties) {
      let propList;
      if (properties === undefined || properties === null) {
        propList = Object.keys(this.getDefaultValues());
      } else {
        propList = Array.isArray(properties) ? properties : [properties];
      }
      const initialValues = this.initialValues;
      const resetData = {};
      propList.forEach(function (prop) {
        resetData[prop] = (initialValues && initialValues[prop] !== undefined)
          ? initialValues[prop]
          : global.uniface.RESET;
      });
      this.dataUpdate(resetData);
    }

    /**
     * Reset the trigger map (which has been set by mapTriggers()).
     */
    resetMapTriggers() {
      this.triggers = {};
      debugLog("Reset the trigger map");
    }

    /**
     * Returns the count of the specified trigger called.
     * @param {String} triggerName the trigger name;
     * @returns the count of the specified trigger called.
     */
    countOfTriggerCalled(triggerName) {
      const triggerInfo = this.triggers[triggerName];
      return triggerInfo ? triggerInfo.countOfCall : 0;
    }

    /**
     * Reset the count of the specified trigger called to 0.
     * @param {String} triggerName the trigger name;
     */
    resetTriggerCalled(triggerName) {
      if (triggerName) {
        const triggerInfo = this.triggers[triggerName];
        if (triggerInfo) {
          triggerInfo.countOfCall = 0;
        }
      } else {
        const _this = this;
        Object.keys(this.triggers).forEach((trg) => {
          _this.resetTriggerCalled(trg);
        });
      }
    }

    /**
     * Return true if the specified trigger has been called once.
     * @param {String} triggerName the trigger name;
     */
    calledOnce(triggerName) {
      return (this.countOfTriggerCalled(triggerName) === 1);
    }

    /**
     * Emulate the user click on the item with the given itemIndex as its index (start from 1);
     * @param {Number} itemIndex the index of the item to click on. Optional, default means the top item or element, or the first item.
     */
    userClick(itemIndex) {
      let control;
      let openClick = (this.widgetName === "UX.Select");
      if (itemIndex && (this.widgetName === "UX.Listbox" || this.widgetName === "UX.Select")) {
        control = this.element.querySelector(`fluent-option[aria-posinset='${itemIndex}']`);
      } else if (itemIndex && this.widgetName === "UX.NumberField") {
        let controlClass;
        if (itemIndex === 1) {
          controlClass = "step-up";
        } else if (itemIndex === -1) {
          controlClass = "step-down";
        }
        if (controlClass) {
          control = this.element.shadowRoot.querySelector(".controls ." + controlClass);
        }
      } else if (itemIndex && this.widgetName === "UX.RadioGroup") {
        control = this.element.querySelector(`fluent-radio[current-value='${itemIndex - 1}']`);
      } else { // UX.Button, UX.Checkbox, UX.Switch
        control = this.element;
      }
      if (openClick) {
        this.element.click();
      }
      if (control) {
        control.click();
      }
    }

    /**
     * Internal helper that builds and dispatches a KeyboardEvent of the given type.
     * @param {string} eventType the event type ("keydown" or "keypress").
     * @param {string} key the key value (e.g. "Enter", " ", "ArrowDown", "ArrowUp").
     * @param {HTMLElement} [target] optional target element; defaults to the widget element.
     */
    _dispatchKeyboardEvent(eventType, key, target) {
      const keyMap = {
        "Enter": {
          "code": "Enter",
          "which": 13,
          "keyCode": 13
        },
        " ": {
          "code": "Space",
          "which": 32,
          "keyCode": 32
        },
        "ArrowUp": {
          "code": "ArrowUp",
          "which": 38,
          "keyCode": 38
        },
        "ArrowDown": {
          "code": "ArrowDown",
          "which": 40,
          "keyCode": 40
        },
        "ArrowLeft": {
          "code": "ArrowLeft",
          "which": 37,
          "keyCode": 37
        },
        "ArrowRight": {
          "code": "ArrowRight",
          "which": 39,
          "keyCode": 39
        },
        "Escape": {
          "code": "Escape",
          "which": 27,
          "keyCode": 27
        },
        "Tab": {
          "code": "Tab",
          "which": 9,
          "keyCode": 9
        }
      };
      const mapped = keyMap[key] || {
        "code": key,
        "which": 0,
        "keyCode": 0
      };
      const event = new window.KeyboardEvent(eventType, {
        "key": key,
        "code": mapped.code,
        "which": mapped.which,
        "keyCode": mapped.keyCode,
        "bubbles": true,
        "cancelable": true
      });
      (target || this.element).dispatchEvent(event);
    }

    /**
     * Emulate a keyboard keydown event on the widget element or a given target.
     * @param {string} key the key value (e.g. "Enter", " ", "ArrowDown", "ArrowUp").
     * @param {HTMLElement} [target] optional target element; defaults to the widget element.
     */
    userKeyDown(key, target) {
      this._dispatchKeyboardEvent("keydown", key, target);
    }

    /**
     * Asynchronous version of userKeyDown();
     * @param {string} key the key value (e.g. "Enter", " ", "ArrowDown").
     * @param {HTMLElement} [target] optional target element; defaults to the widget element.
     * @returns a promise.
     */
    asyncUserKeyDown(key, target) {
      const _this = this;
      return asyncRun(function() {
        _this.userKeyDown(key, target);
      });
    }

    /**
     * Emulate a keyboard keypress event on the widget element or a given target.
     * @param {string} key the key value (e.g. "Enter", " ", "ArrowDown", "ArrowUp").
     * @param {HTMLElement} [target] optional target element; defaults to the widget element.
     */
    userKeyPress(key, target) {
      this._dispatchKeyboardEvent("keypress", key, target);
    }

    /**
     * Asynchronous version of userKeyPress();
     * @param {string} key the key value (e.g. "Enter", " ", "ArrowDown").
     * @param {HTMLElement} [target] optional target element; defaults to the widget element.
     * @returns a promise.
     */
    asyncUserKeyPress(key, target) {
      const _this = this;
      return asyncRun(function() {
        _this.userKeyPress(key, target);
      });
    }

    /**
     * Asynchronous version of userClick();
     * @param {Number} itemIndex the index of the item to click on. Optional, default means the top item or element, or the first item.
     * @returns a promise.
     */
    asyncUserClick(itemIndex) {
      const _this = this;
      return asyncRun(function() {
        _this.userClick(itemIndex);
      });
    }

    /**
     * Emulate the user input on an editable widget.
     * @param {String} value the new input value;
     */
    userInput(value) {
      const currentValue = this.widget.getValue();
      if (
        (this.widgetName === "UX.NumberField"
          || this.widgetName === "UX.TextArea"
          || this.widgetName === "UX.TextField"
        ) && value !== currentValue) {
        const control = this.element.shadowRoot.querySelector("#control.control");
        control.value = value;
        control.dispatchEvent(new window.Event("input"));

        debugLog("userInput(" + value + "): dispatch event 'change'!");
        control.dispatchEvent(new window.Event("change"));
      }
    }

    /**
     * Asynchronous version of userInput();
     * @param {String} value the new input value;
     * @returns a promise.
     */
    asyncUserInput(value) {
      const _this = this;
      return asyncRun(function() {
        _this.userClick(value);
      });
    }

    /**
     * Returns the widget class's defaultValues map, fetching and caching it
     * from the class registry on first call.
     * @returns {object} Map of property name → default value.
     */
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

    /**
     * Returns only the CSS class entries from the widget's defaultValues,
     * keyed without the "class:" prefix.
     * @returns {object} Map of class name → default value.
     */
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

    /**
     * Calls dataUpdate() on the widget and records each updated property name
     * for later use by dataCleanup().
     * @param {object} data Map of property name → value to update.
     */
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

    /**
     * Cleans up widget state for the given property names.
     * When called with no arguments, derives the property list from all properties
     * previously passed to dataUpdate().
     * Mirrors the Uniface widget lifecycle.
     * @param {string[]} [propertyNames] - Optional array of property name strings.
     */
    dataCleanup(propertyNames) {
      if (!propertyNames) {
        propertyNames = Object.keys(this.widgetProperties);
      }
      this.widget.dataCleanup(propertyNames);
    }

  }

  /**
   * Creates a plain <div> skeleton element with the given id.
   * Convenience helper shared across entity/widget tests.
   * @param {string} id  The element id to assign.
   * @returns {HTMLDivElement}
   */
  function createSkeleton(id) {
    const skeleton = document.createElement("div");
    skeleton.id = id;
    return skeleton;
  }

  /**
   * Utility functions of mockup
   */
  global.umockup = {

    "setDebug" : function(b) {
      _debug = b;
    },

    "setTestDebug" : function(b) {
      this.WidgetTester.debug = !!(b);
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

    "createSkeleton" : createSkeleton,

    "WidgetTester" : WidgetTester

  };

})(this);
