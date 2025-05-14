// @ts-check

/**
 * @typedef {"component"|"entity"|"collection"|"occurrence"|"field"} UObjectType
 * @typedef {string} UObjectName
 * @typedef {string | undefined} UPropName
 * @typedef {string} UTriggerName
 * @typedef {any} UPropValue
 * @typedef {string} UWidgetClassName
 *
 * @typedef {object} UObjectDefinition
 *  @property {function(): UObjectType} getType - Returns type of the object.
 *  @property {function(): UObjectName} getName - Returns full qualified object name.
 *  @property {function(): UObjectName} getShortName - Returns unqualified object name.
 *  @property {function(): Array<UPropName> | undefined} getPropertyNames - Returns array of property names.
 *  @property {function(UPropName): UPropValue} getProperty - Returns property value.
 *  @property {function(UPropName, UPropValue): void} setProperty - Sets property value.
 *  @property {function(): UWidgetClassName} getWidgetClass - Returns widget class of a field.
 *  @property {function(): UWidgetClassName} getCollectionWidgetClass - Returns collection widget class of an entity.
 *  @property {function(): UWidgetClassName} getOccurrenceWidgetClass - Returns occurrence widget class of an entity.
 *  @property {function(UWidgetClassName): void} setWidgetClass - Sets the widget class.
 *  @property {function(UWidgetClassName): void} setCollectionWidgetClass - Sets the collection widget class of an entity.
 *  @property {function(UWidgetClassName): void} setOccurrenceWidgetClass - Sets the occurrence widget class of an entity.
 *  @property {function(): Array<UObjectDefinition>} getChildDefinitions - Returns array of child object definitions.
 *
 * @typedef {object} Updater
 *  @property {Element} element
 *  @property {Event} event_name
 *
 * @typedef {object} TriggerMapping
 *  @property {Element} TriggerMapping.element
 *  @property {Event} TriggerMapping.event_name
 *  @property {boolean} TriggerMapping.validate
 *
 * @typedef {object} UData
 *
 * @typedef {Set<string>} UPropertyNames
 *
 * @typedef {string} UDataError
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
 *  @property {String|undefined} [labelText] - Unformatted label-text.
 *  @property {Boolean|undefined} [isNotSupported] - Whether this representation is supported in the parent widget or not.
 */
