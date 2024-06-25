// UNIFACE.ClassRegistry.add

(function (global) {
    'use strict';

    /**
     * Mockup of the uniface public namespace
     * 
     * @namespace uniface
     * @public
     */
    global.uniface = {
        RESET: {}
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

        ClassRegistry : {
            add : function(class_name, the_class) {
                classRegistry[class_name] = the_class;
            },
            get : function(class_name) {
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
        DOMNodeManager : {
            /**
             * get custom widget processed layout
             * @param {Node} node The node
             * @param {String} customWidgetName custom widget name
             * @param {Boolean} mockUp optional, default is undefined or false;
             *       and true if this function is used for mockup, 
             */
            getCustomWidgetLayout: function (node, customWidgetName, mockUp) {
                var layout = node;
                var customPluginClass = UNIFACE.ClassRegistry.get(customWidgetName);
                if (customPluginClass) {
                    if (typeof(customPluginClass.processLayout) === "function") {
                        if (!mockUp) {
                            // original implementation, will cause error if called in mockup env.
                            layout = UNIFACE.widget.custom_widget_container.callStaticPluginFunction("processLayout", customPluginClass, node);
                        } else {
                            layout = customPluginClass.processLayout(node);
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
             * @param {Node} node The node to start parsing at
             * @param {String} customWidgetName optional, default is undefined or false for
             *      DSP front-end runtime; the custom widget name for umockup module. 
             */
            parseCustomWidgetNode: function(node, customWidgetName) {
                if (customWidgetName) { // mockup
                    if (typeof customWidgetName === "string" && customWidgetName.length > 0) {
                        // If its custom widget then call getCustomWidgetLayout
                        const layout = this.getCustomWidgetLayout(node, customWidgetName, true);
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

        uconsole : (function() {
            var _log, _error, _warn;

            if ((typeof console === 'undefined') || (typeof console.log === 'undefined')) {
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
                if (typeof console.error === 'undefined') {
                    _error = function(aMessage) {
                        _log("Error: " + aMessage);
                    };
                } else {
                    _error = function(aMessage) {
                        console.error(aMessage);
                    };
                }
                /* console.warn */
                if (typeof console.warn === 'undefined') {
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
                log : _log,
                error : _error,
                warn : _warn
            };
        })()
    };

    const widgetId = "ux-widget";
    let widgetName;
    let testLoaded = false;

    let _debug = false;

    function debugLog (message) {
        if (_debug) {
            console.log(message);
        }
    }

    function getWidgetName() {
        if (!widgetName) {
            const urlString = window.location.href;
            const paramString = urlString.split('?')[1];
            const queryString = new URLSearchParams(paramString);
            const value = queryString.get("widget_name");
            widgetName = (value ? value : "UX.Button");

            // update test page
            if (document) {
                document.title = "Unit test - " + widgetName;
                let el = document.getElementById("widget-name");
                el.innerHTML = widgetName;
                el = document.getElementById("ux-widget");
                el.innerHTML = widgetName;
            }
        }
        return widgetName;
    }

    function getFileName(widgetName) {
        return widgetName.substr(3).replace(/[A-Z]/g, (letter, offset) => { 
            return (offset ? "_" : "") + letter.toLowerCase(); 
        });
    }

    const defaultAsyncTimeout = 100; //ms

    /**
     * Run asynchronous test actions via setTimeout.
     * 
     * @param {Function} testFunction a function including test actions;
     * @param {Function} timeout the miliseconds delay of setTimeout for resolve 
     *                   the returned promise;
     * @returns a promise.
     */
    async function asyncRunST (testFunction, timeout) {
        if (timeout === undefined) {
            timeout = defaultAsyncTimeout;
        }
        return new Promise(function(resolve, reject) {
            testFunction();
            setTimeout(function(){
                resolve();
            }, timeout);
        });
    }

    /**
     * Run asynchronous test actions via MutationObserver.
     * 
     * @param {Function} testFunction a function including test actions;
     * @param {Function} callbackFunction a callback function;
     * @returns a promise.
     */
    async function asyncRunMO(testFunction, callbackFunction) {
        const container = document.getElementById("widget-container");
        let lastTimeoutId = 0;

        let count = 0;
        
        debugLog("asyncRunMO");

        if (typeof callbackFunction !== "function") {
            callbackFunction = function (records, observer, resolve, reject) {
                const _count = ++count;
                debugLog("Callback " + _count);
                setTimeout(function () {
                    debugLog("Timeout Callback " + _count);
                        
                    if (lastTimeoutId) {
                        clearTimeout(lastTimeoutId);
                    }
                    lastTimeoutId = setTimeout(function () {
                        debugLog("Timeout 2 callback " + _count);
                        resolve();
                        observer.disconnect();
                    });
                });
            };    
        }

        return new Promise(function(resolve, reject){
            const observer = new MutationObserver(function (records, observer) {
                callbackFunction(records, observer, resolve, reject);
            });

            observer.observe(container, {
                "attributes" : true,
                "attributeOldValue" : true,
                "characterData" : true,
                "childList" : true,
                "subtree" : true
            });
            
            testFunction();
        });
    }

    /**
     * The helper function for running asynchronous test actions.
     * 
     * @param {Function} testFunction a function including test actions;
     * @param {Function} option optional, if option is a number, it calls
     *                   asyncRunST(testFunction, option); otherwise, it calls
     *                   asyncRunMO(testFunction, option).
     * @returns a promise.
     */
    async function asyncRun(testFunction, option) {
        if (typeof option === "number") {
            return asyncRunST(testFunction, option);
        } else {
            return asyncRunMO(testFunction, option);
        }
    }

    /**
     * Utility functions of mockup
     */
    global.umockup = {

        setDebug : function(b) {
            _debug = b;
        },

        getTestJsName : function () {
            return "test_ux_" + getFileName(getWidgetName()) + ".js";
        },

        testLoaded : function () {
            const b = testLoaded;
            testLoaded = true;
            return b;
        },
        
        asyncRun : asyncRun,

        /**
         * Helper class for testing widget.
         */
        WidgetTester : class {

            //widget, element, uxTagName;
    
            constructor() {
                this.widgetId = widgetId;
                this.widgetName = getWidgetName();
                this.widgetProperties = {};
            }

            getWidgetClass() {
                return UNIFACE.ClassRegistry.get(this.widgetName);
            }
        
            processLayout() {
                if (!this.uxTagName) {
                    const node = document.getElementById(this.widgetId);
                    this.element = _uf.DOMNodeManager.parseCustomWidgetNode(node, this.widgetName);
                    this.uxTagName = this.element.tagName;
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
                    const element = this.processLayout();
                    const widget = this.construct();
                    widget.onConnect(element);
                }
                return this.widget;
            }
        
            dataInit() {
                const widget = this.onConnect();
                widget.dataInit();
                return widget;
            }
    
            createWidget() {
                return this.dataInit();
            }

            getDefaultProperties() {
                if (!this.defaultProperties) {
                    const widgetClass = this.getWidgetClass();
                    const _widget = new widgetClass();
                    this.defaultProperties = widgetClass.defaultProperties;
                    if (!this.defaultProperties) {
                        this.defaultProperties = {};
                    }
                }
                return this.defaultProperties;
            }

            dataUpdate(data) {
                // This is to remember the updated value from unit test so that this.widgetProperties can be used in dataCleanup()
                Object.keys(data).forEach((key) => {
                    if (!this.widgetProperties[key])
                        this.widgetProperties[key] = new Set();
                    Object.keys(data[key]).forEach((childKey) => {
                        this.widgetProperties[key].add(childKey);
                    });
                });
                this.widget.dataUpdate(data);
            }
    
        }
    
    };

})(this);
