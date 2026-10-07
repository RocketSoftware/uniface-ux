// @ts-check
import { Widget } from "../framework/common/widget.js";
import { Element } from "../framework/workers/element.js";
import { StyleClassManager } from "../framework/workers/style_class_manager.js";
import { AttributeBoolean } from "../framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../framework/workers/attribute_choice.js";
import { ElementIconText } from "../framework/workers/element_icon_text.js";
import { ChildWidgets } from "../framework/workers/child_widgets.js";
import { AttributeSlot } from "../framework/workers/attribute_slot.js";
import { WidgetOccurrence } from "../framework/workers/widget_occurrence.js";
import { AttributeFormattedValue } from "../framework/workers/attribute_formatted_value.js";
import { getWidgetClass, registerWidgetClass } from "../framework/common/dsp_connector.js";

// Optimized way to reduce the size of bundle, only import necessary fluent-ui components.
import { fluentAccordion, fluentAccordionItem, provideFluentDesignSystem } from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentAccordion(), fluentAccordionItem());

/**
 * Accordion Widget.
 * Acts as the parent container that hosts the accordion header (prefix, label, suffix) and the
 * fluent-accordion body. It manages the accordion expansion behavior and creates occurrence
 * placeholders so Uniface can bind and manage individual AccordionItem panels.
 * @export
 * @class Accordion
 * @extends {Widget}
 */
export class Accordion extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * Widget structure.
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "uf-accordion-container", "", "", [
    new StyleClassManager(this, ["u-accordion-container"]),
    new AttributeSlot(this),
    new AttributeBoolean(this, "html:hidden", "hidden", false),
    new AttributeChoice(this, "label-size", "label-size", ["small", "medium", "large", "normal"], "large", true),
    new AttributeChoice(this, "label-align", "label-align", ["start", "center", "end"], "start", true),

    // Header content, slotted into the container's start / label / end areas.
    new ElementIconText(this, "span", "u-accordion-prefix", ".u-accordion-prefix", "start", undefined, undefined, "prefix-icon", ""),
    new ElementIconText(this, "span", "u-accordion-label", ".u-accordion-label", "label", "label-text", "", undefined, undefined, true),
    new ElementIconText(this, "span", "u-accordion-suffix", ".u-accordion-suffix", "end", undefined, undefined, "suffix-icon", ""),

    // Accordion body (default slot) hosting the occurrence placeholders.
    new Element(this, "fluent-accordion", "u-accordion", ".u-accordion", [
      new AttributeChoice(this, "expand-mode", "expand-mode", ["single", "multi"], "multi", true),
      new WidgetOccurrence(this, "span", "uocc:{{getName()}}")
    ])
  ]);
}

/**
 * Accordion Item Widget.
 * Represents a single collapsible accordion panel (fluent-accordion-item) with a clickable header
 * and a collapsible content region. The header exposes property-driven heading, start, and end
 * content, while the content region hosts the child field/entity widgets according to the
 * configured layout.
 * @export
 * @class AccordionItem
 * @extends {Widget}
 */
export class AccordionItem extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * The slots this widget offers to its child widgets, next to the default slot that holds the
   * collapsible body.
   * @static
   */
  static childSlotConfig = {
    "propertyName": "html:slot",
    "validSlots": ["start", "end", "heading"],
    // The default slot of fluent-accordion-item, which is its collapsible body.
    "defaultSlot": ""
  };

  /**
   * Private Worker: Resolves the slot of every child widget while the layout of this occurrence is
   * created, the way HeaderFooter resolves the area of its children.
   * A slot this widget does not offer is reported and replaced by the default slot in the object
   * definition of the child, which is what the child applies when its own layout is created.
   * Extends ChildWidgets so that any child slotted into the accordion-item
   * "heading" slot is reclassified to the internal `UX.AccordionHeadingField` widget. That widget
   * renders the child's original widget as read-only formatted text (see AccordionHeadingField).
   * The original widget class is recorded under `org-widget-class` so the heading field can ask it
   * for its formatted value. Standard ChildWidgets cannot do this because it preserves each child's
   * declared widget class.
   * @class ChildSlots
   * @extends {ChildWidgets}
   */
  static ChildSlots = class extends ChildWidgets {

    /**
     * Creates an instance of ChildSlots.
     * @param {typeof Widget} widgetClass
     * @param {string} tagName
     * @param {object} slotConfig - The slots this widget offers, as declared by childSlotConfig.
     */
    constructor(widgetClass, tagName, slotConfig) {
      // The slot config is not passed on, because this worker resolves the slots itself instead of
      // distributing its children over them.
      super(widgetClass, tagName);
      this.slotConfig = slotConfig;
    }

    /**
     * Generate and return layout for this setter.
     * @param {UObjectDefinition} objectDefinition
     * @returns {Array<HTMLElement>}
     */
    getLayout(objectDefinition) {
      this.resolveChildSlots(objectDefinition);
      return super.getLayout(objectDefinition);
    }

    /**
     * Replaces the slot of every child widget that this widget does not offer by the default slot.
     * Reclassifies heading-slot children to the heading field widget before delegating to the base
     * layout. The child's original widget class is recorded under `org-widget-class`; `html:slot`
     * is preserved so the base ChildWidgets worker still routes the child to the heading slot. All
     * other properties are passed through untouched and interpreted by the original widget's
     * getValueFormatted() (unrelated properties are ignored by the transparent heading field).
     * @param {UObjectDefinition} objectDefinition
     */
    resolveChildSlots(objectDefinition) {
      const propertyName = this.slotConfig.propertyName;
      const validSlots = this.slotConfig.validSlots;
      const childObjectDefinitions = objectDefinition?.getChildDefinitions?.() ?? [];
      childObjectDefinitions.forEach((childObjectDefinition) => {
        // The child applies its slot itself, so it is told which slots this occurrence offers.
        // The occurrence places its children while it creates the layout: ChildSlots reclassifies a
        // child in the "heading" slot, which cannot be undone.
        childObjectDefinition.setProperty(AttributeSlot.slotPlacementPropId, {
          "allowedSlots": validSlots,
          "isStatic": true
        });
        const requestedSlot = childObjectDefinition.getProperty(propertyName);
        const slot = typeof requestedSlot === "string" ? requestedSlot.trim() : "";
        // A slot this widget does not offer is replaced by the default slot.
        if (slot !== "" && !validSlots.includes(slot)) {
          const defaultSlot = this.slotConfig.defaultSlot;
          this.warn(
            "resolveChildSlots",
            `Child '${childObjectDefinition.getName()}' has invalid slot '${slot}'`,
            defaultSlot ? `Using default: ${defaultSlot}` : "Using the default slot"
          );
          childObjectDefinition.setProperty(propertyName, defaultSlot);
          return;
        }
        if (slot === "heading") {
          // Record the original widget class, then reclassify to the transparent heading field
          // widget that renders the original widget's formatted value as read-only text.
          childObjectDefinition.setProperty("org-widget-class", childObjectDefinition.getWidgetClass());
          childObjectDefinition.setWidgetClass("UX.AccordionHeadingField");
        }
      });
    }
  };

  /**
   * Private Worker: Maps the semantic "item:label-size" choice to the Fluent
   * accordion-item "heading-level" attribute so headings expose the correct aria-level for
   * accessibility.
   * @class AttributeHeadingLevel
   * @extends {AttributeChoice}
   */
  static AttributeHeadingLevel = class extends AttributeChoice {
    constructor(widgetClass) {
      super(widgetClass, "item:label-size", "heading-level", ["small", "medium", "large"], "medium", true);
      this.levelMap = {
        "small": "3",
        "medium": "2",
        "large": "1"
      };
    }

    /**
     * Refreshes the widget based on properties.
     * @param {Widget} widgetInstance
     */
    refresh(widgetInstance) {
      let element = this.getElement(widgetInstance);
      let value = this.getNode(widgetInstance.data, this.propId);
      let level = this.levelMap[value] || this.levelMap["medium"];
      this.setHtmlAttribute(element, level);
    }
  };

  /**
   * Widget structure.
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "fluent-accordion-item", "", "", [
    new StyleClassManager(this, ["u-accordion-item"]),
    new AttributeBoolean(this, "item:hidden", "hidden", false),
    new AttributeBoolean(this, "item:expanded", "expanded", false),
    new this.AttributeHeadingLevel(this),

    new AttributeChoice(this, "item:panel:layout-type", "panel-layout-type", ["horizontal", "vertical"], "vertical", true),
    new AttributeChoice(this, "item:panel:horizontal-align", "panel-horizontal-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch"], "start", true),
    new AttributeChoice(this, "item:panel:vertical-align", "panel-vertical-align", ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch"], "start", true),

    // Label text content, slotted into the header button's 'heading' area.
    new ElementIconText(this, "span", "u-label-text", ".u-label-text", "heading", "item:label-text", ""),
    new AttributeChoice(this, "item:label-size", "label-size", ["small", "medium", "large"], "medium", true),

    // Start content, slotted before the label text.
    new ElementIconText(this, "span", "u-prefix-icon", ".u-prefix-icon", "start", undefined, undefined, "item:prefix-icon", ""),
    new ElementIconText(this, "span", "u-prefix-text", ".u-prefix-text", "start", "item:prefix-text", ""),

    // End content, slotted after the label text.
    new ElementIconText(this, "span", "u-suffix-text", ".u-suffix-text", "end", "item:suffix-text", ""),
    new ElementIconText(this, "span", "u-suffix-icon", ".u-suffix-icon", "end", undefined, undefined, "item:suffix-icon", ""),

    // Child widgets fall into fluent-accordion-item's default slot (collapsible body), unless
    // they select one of the slots of childSlotConfig through their 'html:slot' property.
    // children slotted into "heading" are reclassified to the read-only heading field widget.
    new this.ChildSlots(this, "span", this.childSlotConfig)
  ]);

  /**
   * Blocks user interaction by disabling the Fluent accordion item's internal heading button.
   * The host element does not expose a disabled property, so the base class handles widget state
   * while this override applies the native disabled state to the actual interactive control.
   */
  blockUI() {
    this.log("blockUI");
    super.blockUI();
    this.setBlockedState(true);
  }

  /**
   * Restores interaction on the Fluent accordion item's internal heading button.
   * AccordionItem has no "html:disabled" property of its own, so this always re-enables it.
   */
  unblockUI() {
    this.log("unblockUI");
    super.unblockUI();
    this.setBlockedState(false);
  }

  /**
   * Applies the blocked state to the widget element and to its internal heading button.
   * @param {boolean} isBlocked
   */
  setBlockedState(isBlocked) {
    const element = this.elements.widget;
    if (isBlocked) {
      element.classList.add("u-blocked");
    } else {
      element.classList.remove("u-blocked");
    }
    const button = /** @type {HTMLButtonElement | null} */ (element.shadowRoot?.querySelector("[part='button']"));
    if (button) {
      button.disabled = isBlocked;
    }
  }

}

/**
 * Accordion Heading Field widget.
 * Internal, runtime-only widget used to represent a child field that is slotted into the
 * accordion-item heading. It does not render an interactive control; instead it asks the child's
 * original widget class (recorded under `org-widget-class`) for its formatted value and renders
 * that read-only representation. The set of properties that affect the rendering is therefore
 * dynamic per original widget (see `getValueFormattedSetters()`); all other properties are
 * accepted but ignored.
 * @export
 * @class AccordionHeadingField
 * @extends {Widget}
 */
export class AccordionHeadingField extends Widget {

  /**
   * Initialize as static at derived level, so definitions are unique per widget class.
   * @static
   */
  static subWidgets = {};
  static subWidgetWorkers = [];
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "";

  /**
   * This widget transparently maintains the properties and triggers of the original widget.
   * To avoid unwanted warnings on unknown properties/triggers, these are suppressed here.
   */
  static reportUnsupportedPropertyWarnings = false;
  static reportUnsupportedTriggerWarnings = false;

  /**
   * Base properties that always affect the heading's formatted representation, independent of the
   * original widget class. The effective set is this list plus the original widget's
   * getValueFormattedSetters().
   * @type {Array<UPropName>}
   * @static
   */
  static baseFormattedSetters = [
    "html:title",
    "html:disabled",
    "html:readonly",
    "html:hidden",
    "value",
    "error",
    "error-message"
  ];

  /**
   * Widget structure.
   * @static
   */
  // prettier-ignore
  static structure = new Element(this, "span", "", "", [
    new StyleClassManager(this, ["u-accordion-heading-field"]),
    new AttributeSlot(this),
    // The accordion "heading" slot renders the original widget's formatted value.
    new AttributeFormattedValue(this, "org-widget-class")
  ]);

  /**
   * Specializes setProperties() to re-render the formatted value whenever a property that affects
   * it changes. The relevant properties are the base set plus those reported by the original
   * widget class via getValueFormattedSetters(). When one of those properties is present in the
   * update, the AttributeFormattedValue worker (registered on "org-widget-class") is refreshed.
   * @param {UData} data
   */
  setProperties(data) {
    super.setProperties(data);
    const objectClassNamePropId = "org-widget-class";
    const objectWidgetName = this.getNode(this.data, objectClassNamePropId);
    if (objectWidgetName) {
      let setterPropIds = [...AccordionHeadingField.baseFormattedSetters];
      const objectWidgetClass = getWidgetClass(objectWidgetName);
      if (objectWidgetClass) {
        setterPropIds.push(...objectWidgetClass.getValueFormattedSetters());
      }
      const formattedValueChange = setterPropIds.some((propId) => this.getNode(data, propId) !== undefined);
      if (formattedValueChange) {

        /** @type {object} */
        const widgetClass = this.constructor;
        const setter = this.getNode(widgetClass.setters, objectClassNamePropId)[0];
        setter.refresh(this);
      }
    }
  }
}

// Although used internally, this registration is still needed.
registerWidgetClass("UX.AccordionHeadingField", AccordionHeadingField);
