// @ts-check

/**
 * @typedef {Object} UClassRegistry
 *  @property {function(UWidgetClassName): *} get - Return class definition of widget.
 *  @property {function(UWidgetClassName, *): void} add - Add class definition of widget to registry.
 *
 * @typedef {Object} UTYPE_UNIFACE
 *  @property {UClassRegistry} ClassRegistry
 *
 * @typedef {"component"|"entity"|"collection"|"occurrence"|"field"} UObjectType
 * @typedef {String} UObjectName
 * @typedef {String} UPropName
 * @typedef {any} UPropValue
 * @typedef {String} UWidgetClassName
 *
 * @typedef {Object} UObjectDefinition
 *  @property {function(): UObjectType} getType - Returns type of the object.
 *  @property {function(): UObjectName} getName - Returns full qualified object name.
 *  @property {function(): UObjectName} getShortName - Returns unqualified object name.
 *  @property {function(): UPropName[]} getPropertyNames - Returns array of property names.
 *  @property {function(UPropName): UPropValue} getProperty - Returns property value.
 *  @property {function(UPropName, UPropValue): void} setProperty - Sets property value.
 *  @property {function(): UWidgetClassName} getWidgetClass - Returns widget class of a field.
 *  @property {function(): UWidgetClassName} getCollectionWidgetClass - Returns collection widget class of an entity.
 *  @property {function(): UWidgetClassName} getOccurrenceWidgetClass - Returns occurrence widget class of an entity.
 *  @property {function(UWidgetClassName): void} widgetClassName - Sets the widget class.
 *  @property {function(UWidgetClassName): void} setCollectionWidgetClass - Sets the collection widget class of an entity.
 *  @property {function(UWidgetClassName): void} setOccurrenceWidgetClass - Sets the occurrence widget class of an entity.
 *  @property {function(): UObjectDefinition[]} getChildDefinitions - Returns array of child object definitions.
  *
 * @typedef {Object[] | undefined} Updaters
 *  @property {Element} Updaters[].element
 *  @property {Event} Updaters[].event_name
 *
 * @typedef {Object} TriggerMapping
 *  @property {Element} TriggerMapping.element
 *  @property {Event} TriggerMapping.event_name
 *  @property {Boolean} TriggerMapping.validate
 *
 * @typedef {Object} UData
 *  @property {any} [value]
 *  @property {Object} [valrep]
 *  @property {Object} [uniface]
 *  @property {Object} [html]
 *  @property {Object} [style]
 *  @property {Object} [class]
 *  @property {Object} [classes]
 *
 * @typedef {String} UDataError
 *
 */

/** @type {UTYPE_UNIFACE} */
let UNIFACE;  // eslint-disable-line no-unused-vars
let uniface;  // eslint-disable-line no-unused-vars
