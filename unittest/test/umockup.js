// UNIFACE.ClassRegistry.add

(function (global) {
    'use strict';
    var classRegistry = {};

    /**
     * Mockup of the UNIFACE private namespace
     *
     * @name UNIFACE
     * @namespace
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
     * Mockup of the uniface public namespace
     */
    global.uniface = {
        RESET: {}
    };

    /**
     * Mockup of the relevant part of private _uf namespace
     *
     * @name _uf
     * @namespace
     * @private
     */
    global._uf = {
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

})(this);
