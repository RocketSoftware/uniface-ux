// @ts-check

/**
 * @typedef {"component"|"entity"|"collection"|"occurrence"|"field"} UObjectType
 * @typedef {String} UObjectName
 * @typedef {String | undefined} UPropName
 * @typedef {String} UTriggerName
 * @typedef {any} UPropValue
 * @typedef {String} UWidgetClassName
 *
 * @typedef {Object} UObjectDefinition
 *  @property {function(): UObjectType} getType - Returns type of the object.
 *  @property {function(): UObjectName} getName - Returns full qualified object name.
 *  @property {function(): UObjectName} getShortName - Returns unqualified object name.
 *  @property {function(): UPropName[]|undefined} getPropertyNames - Returns array of property names.
 *  @property {function(UPropName): UPropValue} getProperty - Returns property value.
 *  @property {function(UPropName, UPropValue): void} setProperty - Sets property value.
 *  @property {function(): UWidgetClassName} getWidgetClass - Returns widget class of a field.
 *  @property {function(): UWidgetClassName} getCollectionWidgetClass - Returns collection widget class of an entity.
 *  @property {function(): UWidgetClassName} getOccurrenceWidgetClass - Returns occurrence widget class of an entity.
 *  @property {function(UWidgetClassName): void} setWidgetClass - Sets the widget class.
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
 *
 * @typedef {Set<string>} UPropertyNames
 *
 * @typedef {String} UDataError
 *
 * @typedef {Object} UValueFormatting - Object describing the formatting of a widget value.
 *  @property {String} [primaryPlainText] - Primary value representation (not between parentheses) as plain text (secure).
 *  @property {String} [primaryHtmlText] - Primary value representation (not between parentheses) as HTML formatted text (not secure).
 *  @property {String} [secondaryPlainText] - Secondary value representation (between parentheses) as plain text (secure).
 *  @property {String} [secondaryHtmlText] - Secondary  value representation (between parentheses) as HTML formatted text (not secure).
 *  @property {String} [prefixText] - Prefix as plain text.
 *  @property {String} [prefixIcon] - Prefix icon name.
 *  @property {String} [suffixText] - Suffix as plain text.
 *  @property {String} [suffixIcon] - Suffix icon name.
 *  @property {String} [errorMessage] - (Format) Error message.
 *  @property {String} [labelText] - Unformatted label-text.
 */
