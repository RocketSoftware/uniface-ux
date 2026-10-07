// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { AttributeString } from "./attribute_string.js";
import { PropertyFilter } from "./property_filter.js";

/**
 * AttributeSlot is the worker that maintains the 'html:slot' property of a widget.
 *
 * The slot places the widget in an area of the widget it is placed in. Only that widget knows which
 * areas it offers, so it declares them on the object definition of each of its children, under
 * 'slot-placement'. A widget that places its children without slots declares nothing.
 *
 * A slot that is not offered is not applied, because the browser renders nothing for an element
 * assigned to a slot that does not exist: applying it would leave the widget unrendered. The value
 * is reported instead, and the widget stays where it is.
 *
 * 'slot' is assigned by the browser, so the value has to be on the element before it is inserted
 * into the document. It is therefore applied while the layout is created, from the object
 * definition. A value that arrives while the widget runs is applied only when the widget it is
 * placed in declared that it moves its children, and is reported and ignored otherwise. The
 * placement is read from the object definition while the layout is created and kept by this worker,
 * because dataInit() rebuilds the data of a widget and would reset it.
 * @exports
 * @class AttributeSlot
 * @extends AttributeString
 */
export class AttributeSlot extends AttributeString {

  /**
   * The property the widget a widget is placed in declares its placement of children under:
   * '{ "allowedSlots": [...], "isStatic": true }'.
   * @type {UPropName}
   * @static
   */
  static slotPlacementPropId = "slot-placement";

  /**
   * Creates an instance of AttributeSlot.
   * @param {typeof import("../common/widget.js").Widget} widgetClass
   */
  constructor(widgetClass) {
    super(widgetClass, "html:slot", "slot", undefined, true);
    // The placement the widget it is placed in declared, as initializeLayout() read it.
    this.placement = undefined;
    // The placement reaches the widget as a property as well, and is accepted by a worker of its
    // own: registering it on this worker would refresh this worker a second time whenever the
    // placement and the slot arrive together.
    new PropertyFilter(widgetClass, AttributeSlot.slotPlacementPropId);
  }

  /**
   * Applies the slot of the object definition to the created layout element, before the widget is
   * inserted into the document, and keeps the placement for refresh().
   * @param {HTMLElement} widgetElement - The root widget element created by getLayout().
   * @param {UObjectDefinition} [objectDefinition] - The definition of the object the widget is created for.
   */
  initializeLayout(widgetElement, objectDefinition) {
    // The slot of the object definition is where the widget starts, whether or not the widget it is
    // placed in moves it later: 'slot' is assigned by the browser, so it has to be on the element
    // before it is inserted, or the widget is first rendered in the wrong place.
    const placement = objectDefinition?.getProperty?.(AttributeSlot.slotPlacementPropId);
    // Kept, and left on the object definition: the sub-widgets of a widget create their layout from
    // the same definition and before it does, so removing it here would take it away from the widget
    // it was declared for.
    this.placement = placement;
    const value = this.getDefinitionValue(objectDefinition);
    if (this.isEmptyValue(value) || !this.isAllowedSlot(placement?.allowedSlots, value)) {
      // A slot that is not offered is reported by setProperties(), which the value reaches as a
      // property as well, so the same slot is not reported twice.
      return;
    }
    super.refresh(this.getLayoutInstance(widgetElement, value));
  }

  /**
   * Reports a slot that arrives while the widget runs, instead of moving the widget.
   * @param {Widget} widgetInstance
   */
  refresh(widgetInstance) {
    const value = this.getNode(widgetInstance.data, this.propId);
    // The value the layout was created with arrives as a property whenever the widget binds to new
    // data, and the default value is the reset of dataInit(); neither is a change.
    if (this.isEmptyValue(value) || value === this.defaultValue || this.isConfiguredValue(widgetInstance, value)) {
      return;
    }
    if (!this.placement?.isStatic) {
      // The widget it is placed in moves its children while it runs.
      if (this.isAllowedSlot(this.placement?.allowedSlots, value)) {
        super.refresh(widgetInstance);
      } else {
        this.warn("setProperties", `Parent widget does not offer slot '${value}'`, "Ignored");
      }
      return;
    }
    // The widget it is placed in places its children while it creates the layout. A widget that
    // carries a slot was placed in one, so the value is refused as a change; one that carries none
    // was never placed, because the slot it asks for is not offered.
    const isPlaced = Boolean(this.attrName && this.getElement(widgetInstance)?.getAttribute(this.attrName));
    const message = isPlaced
      ? `Property '${this.propId}' cannot be changed at runtime`
      : `Parent widget does not offer slot '${value}'`;
    this.warn("setProperties", message, "Ignored");
  }

  /**
   * Tells whether a slot is one the widget it is placed in offers.
   * @param {any} allowedSlots - The slots the widget it is placed in declared.
   * @param {any} value - The requested slot.
   * @returns {boolean}
   */
  isAllowedSlot(allowedSlots, value) {
    return Array.isArray(allowedSlots) && allowedSlots.includes(`${value}`.trim());
  }

  /**
   * Returns the value the object definition carries for the slot.
   * @param {UObjectDefinition} [objectDefinition] - The definition of the object the widget is created for.
   * @returns {UPropValue} The value, or the default value when the object definition carries none.
   */
  getDefinitionValue(objectDefinition) {
    const definedValue = objectDefinition?.getProperty?.(this.propId);
    const trimmedValue = typeof definedValue === "string" ? definedValue.trim() : definedValue;
    // An object definition that carries no value falls back to the default value, which dataInit()
    // does not apply while the layout is created.
    return this.isEmptyValue(trimmedValue) ? this.defaultValue : trimmedValue;
  }

  /**
   * Returns a widget instance that holds the slot, to refresh an element that is not connected to
   * a widget instance yet.
   * @param {HTMLElement} widgetElement - The root widget element created by getLayout().
   * @param {UPropValue} value
   * @returns {Widget}
   */
  getLayoutInstance(widgetElement, value) {
    const data = /** @type {UData} */ ({});
    data[`${this.propId}`] = value;
    return /** @type {any} */ ({
      "data": data,
      "elements": { "widget": widgetElement },
      "getTraceDescription": () => `${this.widgetClass.name}.processLayout`
    });
  }

  /**
   * Tells whether the element carries the slot already, which it does for the value the layout was
   * created with, and for a cloned occurrence layout.
   * @param {Widget} widgetInstance
   * @param {any} value
   * @returns {boolean}
   */
  isConfiguredValue(widgetInstance, value) {
    const element = this.getElement(widgetInstance);
    const configuredValue = this.attrName ? element?.getAttribute(this.attrName) : undefined;
    return `${configuredValue}`.trim() === `${value}`.trim();
  }
}
