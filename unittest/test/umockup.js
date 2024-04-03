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
})(this);
