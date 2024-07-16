//@ts-check

/**
 * @typedef {Object} UClassRegistry
 *   @property {function(UWidgetClassName): *} get - returns class definition of widget
 *   @property {function(UWidgetClassName, *): void} add - add class definition of widget to registry
 * 
 * @typedef {Object} UTYPE_UNIFACE
 *   @property {UClassRegistry} ClassRegistry
 * 
 * @typedef {"component"|"entity"|"collection"|"occurrence"|"field"} UObjectType
 * @typedef {String} UObjectName
 * @typedef {String} UPropName
 * @typedef {any} UPropValue
 * @typedef {String} UWidgetClassName
 * 
 * @typedef {Object} UObjectDefinition
 *   @property {function(): UObjectType} getType - Return type of the object
 *   @property {function(): UObjectName} getName - Return full qualified object name
 *   @property {function(): UObjectName} getShortName - Returns unqualified object name (fields only)
 *   @property {function(): UPropName[]} getPropertNames - Returns array of property names
 *   @property {function(UPropName): UPropValue} getProperty - Return property value
 *   @property {function(UPropName, UPropValue): void} setProperty - Set property value
 *   @property {function(): UWidgetClassName} getWidgetClass - Returns widget class as defined in web.ini
 *   @property {function(): UWidgetClassName} getWidgetCollectionClass - Returns widget class as defined in web.ini
 *   @property {function(): UWidgetClassName} getWidgetOccurrenceClass - Returns widget class as defined in web.ini
 *   @property {function(UWidgetClassName): void} widgetClassName - Set the widget class
 *   @property {function(UWidgetClassName): void} setWidgetCollectionClass - Set the widget class
 *   @property {function(UWidgetClassName): void} setWidgetOccurrenceClass - Set the widget class
 * 
 * @typedef {Object[]} Updaters
 *   @property {Element} Updaters[].element
 *   @property {Event} Updaters[].event_name
 * 
 * @typedef {Object} TriggerMapping
 *   @property {Element} TriggerMapping.element
 *   @property {Event} TriggerMapping.event_name
 *   @property {Boolean} TriggerMapping.validate
 * 
 * @typedef {Object} UData
 *   @property {any} [value]
 *   @property {Object} [valrep]
 *   @property {Object} [uniface]
 *   @property {Object} [html]
 *   @property {Object} [style]
 *   @property {Object} [class]
 *  @property {Object} [classes]
 * 
 * @typedef {String} UDataError
 * 
 */

/** @type {UTYPE_UNIFACE} */
let UNIFACE;
let uniface;
