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
 * @typedef {object} UValueFormatting - Object describing the formatting of a widget value.
 *  @property {string} [primaryPlainText] - Primary value representation (not between parentheses) as plain text (secure).
 *  @property {string} [primaryHtmlText] - Primary value representation (not between parentheses) as HTML formatted text (not secure).
 *  @property {string} [secondaryPlainText] - Secondary value representation (between parentheses) as plain text (secure).
 *  @property {string} [secondaryHtmlText] - Secondary  value representation (between parentheses) as HTML formatted text (not secure).
 *  @property {string} [prefixText] - Prefix as plain text.
 *  @property {string} [prefixIcon] - Prefix icon name.
 *  @property {string} [suffixText] - Suffix as plain text.
 *  @property {string} [suffixIcon] - Suffix icon name.
 *  @property {string} [errorMessage] - (Format) Error message.
 *  @property {string} [labelText] - Unformatted label-text.
 *  @property {string|undefined} [labelText] - Unformatted label-text.
 *  @property {boolean|undefined} [isNotSupported] - Whether this representation is supported in the parent widget or not.
 */
