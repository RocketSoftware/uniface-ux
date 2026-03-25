// @ts-check

/**
 * @typedef {import("../common/widget.js").Widget} Widget
 */

import { WorkerBase } from "../common/worker_base.js";

/**
 * ChildWidgets Worker - Processes child widgets and distributes them into optional slots.
 *
 * Constructor signature:
 * new ChildWidgets(widgetClass, tagName, slotId, slotConfig)
 *
 * @export
 * @class ChildWidgets
 * @extends {WorkerBase}
 */
export class ChildWidgets extends WorkerBase {

  /**
   * Creates an instance of ChildWidgets.
   *
   * @param {typeof import("../common/widget.js").Widget} widgetClass - The widget class (required)
   * @param {string} tagName - HTML tag name for created elements (required)
   * @param {string|null} [slotId=null] - Slot identifier for distribution mode (optional)
   * @param {Object|null} [slotConfig=null] - Slot configuration object (optional, required if slotId provided)
   */
  constructor(widgetClass, tagName, slotId = null, slotConfig = null) {
    super(widgetClass);

    // Validate required parameters.
    if (!tagName) {
      this.error("constructor", "tagName is required", "Worker cannot function");
      this._isValid = false;
      return;
    }

    // Validate slot configuration.
    if (slotId !== null && !slotConfig) {
      this.error("constructor", "slotConfig is required when slotId is specified", "Worker cannot function");
      this._isValid = false;
      return;
    }
    if (slotId === null && slotConfig) {
      this.warn("constructor", "slotConfig provided but slotId is null", "slotConfig will be ignored");
    }

    // Store parameters.
    this.tagName = tagName;
    this.slotId = slotId;
    this._isValid = true;

    // Set default values for slot configuration.
    if (slotConfig) {
      this.slotConfig = {
        "propertyName": slotConfig.propertyName || "area-slot",
        "defaultSlot": slotConfig.defaultSlot !== undefined ? slotConfig.defaultSlot : null,
        "validSlots": slotConfig.validSlots || [],
        "indexRules": slotConfig.indexRules || {}
      };
    } else {
      this.slotConfig = null;
    }

    this.log("constructor", {
      "slotId": this.slotId,
      "tagName": this.tagName,
      "slotConfig": this.slotConfig
    });
  }

  /**
   * Distributes children using property-based assignment.
   * Reads the configured property from each child and assigns to corresponding slot.
   * Falls back to defaultSlot if property is missing or invalid.
   *
   * @param {Array<UObjectDefinition>} childDefinitions - Array of child object definitions
   * @returns {Object} Object with slot names as keys and arrays of children as values
   */
  distributeByProperty(childDefinitions) {
    if (!this.slotConfig) {
      return {};
    }
    const { propertyName, defaultSlot, validSlots } = this.slotConfig;
    const groups = {};

    childDefinitions.forEach(child => {
      let slotValue = child.getProperty(propertyName);

      // Validate slot value.
      if (slotValue && validSlots.length > 0 && !validSlots.includes(slotValue)) {
        this.warn(
          "distributeByProperty",
          `Child '${child.getName()}' has invalid slot '${slotValue}'`,
          `Using default: ${defaultSlot}`
        );
        slotValue = null;
      }

      // Use default slot if no valid slot assigned.
      const targetSlot = slotValue || defaultSlot;

      // Add to group if target slot exists.
      if (targetSlot) {
        if (!groups[targetSlot]) {
          groups[targetSlot] = [];
        }
        groups[targetSlot].push(child);
      }
      // If targetSlot is null, child is excluded (not added to any group)
    });

    this.log("distributeByProperty", {
      "propertyName": propertyName,
      "groups": Object.keys(groups),
      "counts": Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length]))
    });

    return groups;
  }

  /**
   * Distributes children using index-based assignment.
   * Uses position rules from indexRules based on total number of children.
   * Returns empty groups if no rule exists for child count.
   *
   * @param {Array<UObjectDefinition>} childDefinitions - Array of child object definitions
   * @returns {Object} Object with slot names as keys and arrays of children as values
   */
  distributeByIndex(childDefinitions) {
    if (!this.slotConfig) {
      return {};
    }
    const { indexRules } = this.slotConfig;
    const childCount = childDefinitions.length;
    const groups = {};

    // Check if rule exists for this child count.
    if (!indexRules[childCount]) {
      this.warn(
        "distributeByIndex",
        `No index rules defined for ${childCount} children`,
        "Returning empty groups"
      );
      // Return empty groups as per spec.
      return groups;
    }

    // Apply index rules.
    const rule = indexRules[childCount];
    Object.entries(rule).forEach(([slot, indices]) => {
      groups[slot] = indices.map(i => childDefinitions[i]).filter(Boolean);
    });

    this.log("distributeByIndex", {
      "childCount": childCount,
      "rule": rule,
      "groups": Object.keys(groups),
      "counts": Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length]))
    });

    return groups;
  }

  /**
   * Determines whether to use property-based or index-based assignment.
   * Property-based is used if at least one child has the configured property.
   *
   * @param {Array<UObjectDefinition>} childDefinitions - Array of child object definitions
   * @returns {boolean} True if property-based assignment should be used
   */
  shouldUsePropertyBased(childDefinitions) {
    if (!this.slotConfig) {
      return false;
    }
    const { propertyName } = this.slotConfig;
    return childDefinitions.some(child => child.getProperty(propertyName) != null);
  }

  /**
   * Distributes children into slots and caches the result.
   * Automatically detects whether to use property-based or index-based assignment.
   * Caches distribution results in objectDefinition._slottedGroups for reuse.
   *
   * @param {UObjectDefinition} objectDefinition - The parent object definition
   * @returns {Object} Object with slot names as keys and arrays of children as values
   */
  distributeChildren(objectDefinition) {
    // Check cache first.
    // @ts-ignore - _slottedGroups is dynamically added for caching
    if (objectDefinition._slottedGroups) {
      this.log("distributeChildren", {
        "cached": true
      });
      // @ts-ignore - _slottedGroups is dynamically added for caching
      return objectDefinition._slottedGroups;
    }

    const childDefinitions = objectDefinition.getChildDefinitions() || [];
    let groups = {};

    if (childDefinitions.length > 0) {
      if (this.shouldUsePropertyBased(childDefinitions)) {
        this.log("distributeChildren", { "strategy": "property-based" });
        groups = this.distributeByProperty(childDefinitions);
      } else {
        this.log("distributeChildren", { "strategy": "index-based" });
        groups = this.distributeByIndex(childDefinitions);
      }
    }

    // Cache the result.
    // @ts-ignore - _slottedGroups is dynamically added for caching
    objectDefinition._slottedGroups = groups;
    return groups;
  }

  /**
   * Substitutes placeholders in template string with child definition values.
   * @param {UObjectDefinition} childObjectDefinition - Child object definition
   * @param {string} template - Template string with {{placeholders}}
   * @returns {string} Substituted string
   */
  substituteInstructions(childObjectDefinition, template) {
    return template.replace(/\{\{getName\(\)\}\}/g, childObjectDefinition.getName());
  }

  /**
   * Creates child elements from object definitions.
   * Creates elements with hardcoded binding templates for entity and field types.
   * @param {Array<UObjectDefinition>} childObjectDefinitions - Array of child definitions
   * @returns {Array<HTMLElement>} Array of created HTML elements
   */
  createChildElements(childObjectDefinitions) {
    // Guard: Return empty array if worker wasn't properly initialized.
    if (!this._isValid) {
      return [];
    }

    const elements = [];
    childObjectDefinitions.forEach((childObjectDefinition) => {
      const childType = childObjectDefinition.getType();

      // Use hardcoded binding templates based on type.
      let bindingTemplate;
      if (childType === "entity") {
        bindingTemplate = "uent:{{getName()}}";
      } else if (childType === "field") {
        bindingTemplate = "ufld:{{getName()}}";
      }

      if (bindingTemplate) {
        const element = document.createElement(/** @type {string} */ (this.tagName));
        element.id = this.substituteInstructions(childObjectDefinition, bindingTemplate);
        elements.push(element);
      }
    });
    return elements;
  }

  /**
   * Generate and return layout for this worker.
   * Creates HTMLElements with proper binding IDs for child widgets.
   *
   * @param {UObjectDefinition} objectDefinition - The parent object definition
   * @returns {Array<HTMLElement>} Array of HTMLElements
   * @override
   */
  getLayout(objectDefinition) {
    // Guard: Return empty array if worker wasn't properly initialized.
    if (!this._isValid) {
      this.error("getLayout", "Worker not properly initialized", "Returning empty layout");
      return [];
    }

    let childObjectDefinitions;

    if (this.slotId !== null) {
      const groups = this.distributeChildren(objectDefinition);
      childObjectDefinitions = (this.slotId && groups[this.slotId]) || [];
    } else {
      childObjectDefinitions = objectDefinition.getChildDefinitions() || [];
    }

    const elements = this.createChildElements(childObjectDefinitions);

    this.log("getLayout", {
      "slotId": this.slotId,
      "created": elements.length
    });

    return elements;
  }
}
