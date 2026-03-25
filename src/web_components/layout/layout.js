import { FASTElement } from "@microsoft/fast-element";
import { layoutTemplate as template } from "./layout_template";
import { layoutStyles as styles } from "./layout_styles";

/**
 * Layout Web Component.
 * @export
 * @class Layout
 * @extends {FASTElement}
 */
export class Layout extends FASTElement {

  /**
   * Maps the layout-type attribute value to its short suffix used in CSS class names.
   * u-layout-type-* = "Uniface Layout Type": hs = horizontal-scroll, hw = horizontal-wrap,
   *                                           vs = vertical-scroll,   vw = vertical-wrap.
   */
  static #LAYOUT_SHORT = {
    "horizontal-scroll": "hs",
    "horizontal-wrap": "hw",
    "vertical-scroll": "vs",
    "vertical-wrap": "vw"
  };

  // All u-layout-type-* class names derived from the short names above.
  static #LT_CLASSES = Object.values(this.#LAYOUT_SHORT).map((s) => `u-layout-type-${s}`);
  // CSS selector matching any element that carries its own layout direction class.
  static #DIR_SELECTOR = this.#LT_CLASSES.map((c) => `.${c}`).join(", ");
  // Narrows direction selector to horizontal-only layouts.
  static #H_DIR_SELECTOR = ".u-layout-type-hs, .u-layout-type-hw";
  // u-jc-* = "Uniface Justify Content": drives the CSS justify-content property (main axis).
  static #JC_CLASSES = ["u-jc-start", "u-jc-center", "u-jc-end", "u-jc-stretch", "u-jc-space-between", "u-jc-space-around", "u-jc-space-evenly"];
  // u-ai-* = "Uniface Align Items": drives the CSS align-items property (cross axis).
  static #AI_CLASSES = ["u-ai-start", "u-ai-center", "u-ai-end", "u-ai-stretch"];

  // Descendants with no own direction but at least one explicit align — must re-sync when ancestor direction flips.
  static #SYNC_ON_DIR = `:not(${this.#DIR_SELECTOR}):is([horizontal-align]:not([horizontal-align='auto']), [vertical-align]:not([vertical-align='auto']))`;
  // Descendants that inherit h-align (no own explicit h-align) and have own direction or explicit v-align.
  static #SYNC_ON_H_ALIGN = `:not([horizontal-align]:not([horizontal-align='auto'])):is(${this.#DIR_SELECTOR}, [vertical-align]:not([vertical-align='auto']))`;
  // Descendants that inherit v-align (no own explicit v-align) and have own direction or explicit h-align.
  static #SYNC_ON_V_ALIGN = `:not([vertical-align]:not([vertical-align='auto'])):is(${this.#DIR_SELECTOR}, [horizontal-align]:not([horizontal-align='auto']))`;

  connectedCallback() {
    super.connectedCallback();
    this.#setLayoutClass(this.getAttribute("layout-type"));
    this.#syncAlignmentClasses();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "layout-type") {
      this.#setLayoutClass(newValue);
    }
    if (name === "layout-type" || name === "horizontal-align" || name === "vertical-align") {
      this.#syncAlignmentClasses();
      this.#syncDescendants(name);
    }
  }

  /**
   * Re-syncs descendant Layout elements whose alignment classes are affected by a change to `changedAttr`.
   * Skips elements that have an intermediate boundary element between them and `this` for that attribute.
   */
  #syncDescendants(changedAttr) {
    const SYNC_SELECTOR = {
      "layout-type": Layout.#SYNC_ON_DIR,
      "horizontal-align": Layout.#SYNC_ON_H_ALIGN,
      "vertical-align": Layout.#SYNC_ON_V_ALIGN
    };
    const BOUNDARY_SELECTOR = {
      "layout-type": Layout.#DIR_SELECTOR,
      "horizontal-align": "[horizontal-align]:not([horizontal-align='auto'])",
      "vertical-align": "[vertical-align]:not([vertical-align='auto'])"
    };

    const syncSelector = SYNC_SELECTOR[changedAttr];
    const boundarySelector = BOUNDARY_SELECTOR[changedAttr];

    /**
     * The :not(:is(:scope <boundary> *)) part excludes any descendant that sits
     * inside an intermediate element that overrides the changed attribute. Those
     * subtrees are shielded — the ancestor change does not cascade past them.
     */
    for (const el of this.querySelectorAll(`${syncSelector}:not(:is(:scope ${boundarySelector} *))`)) {
      if (!(el instanceof Layout)) {
        continue;
      }
      el.#syncAlignmentClasses();
    }
  }

  #setLayoutClass(value) {
    this.classList.remove(...Layout.#LT_CLASSES);
    const short = Layout.#LAYOUT_SHORT[value];
    if (short) {
      this.classList.add(`u-layout-type-${short}`);
    }
  }

  #syncAlignmentClasses() {
    this.classList.remove(...Layout.#JC_CLASSES, ...Layout.#AI_CLASSES);

    const hasOwnDirection = this.matches(Layout.#DIR_SELECTOR);
    const hAttr = this.getAttribute("horizontal-align");
    const vAttr = this.getAttribute("vertical-align");

    /**
     * Fully auto — no classes are applied and the u-jc-* / u-ai-* CSS variables
     * from the closest ancestor with explicit alignment are inherited automatically
     * through the shadow-DOM custom-property cascade.
     */
    if (!hasOwnDirection && (!hAttr || hAttr === "auto") && (!vAttr || vAttr === "auto")) {
      return;
    }

    /**
     * Walk up to the nearest ancestor that carries a layout direction class.
     * This determines whether the main axis is horizontal or vertical for this element.
     */
    const dirEl = this.closest(Layout.#DIR_SELECTOR);

    const isHorizontal = dirEl?.matches(Layout.#H_DIR_SELECTOR);
    // Walk up to the nearest ancestor (inclusive) that explicitly sets each alignment attribute, skipping "auto" which means "inherit further up".
    const hVal = this.closest("[horizontal-align]:not([horizontal-align='auto'])")?.getAttribute("horizontal-align");
    const vVal = this.closest("[vertical-align]:not([vertical-align='auto'])")?.getAttribute("vertical-align");

    // Map the resolved h/v values onto main-axis (justify-content) and cross-axis (align-items) based on the containing layout's direction.
    const mainVal = isHorizontal ? hVal : vVal;
    const crossVal = isHorizontal ? vVal : hVal;

    if (mainVal) {
      this.classList.add(`u-jc-${mainVal}`);
    }
    if (crossVal) {
      // space-between/around/evenly are only meaningful on the main axis. If one of those values ends up on the cross axis, fall back to "start".
      this.classList.add(`u-ai-${crossVal.startsWith("space-") ? "start" : crossVal}`);
    }
  }
}

export const layoutDefinition = {
  "name": "uf-layout",
  template,
  styles,
  "attributes": [
    {
      "attribute": "show-label",
      "property": "showLabel"
    },
    {
      "attribute": "layout-type",
      "property": "layoutType"
    },
    {
      "attribute": "vertical-align",
      "property": "verticalAlign"
    },
    {
      "attribute": "horizontal-align",
      "property": "horizontalAlign"
    }
  ]
};

FASTElement.define(Layout, layoutDefinition);
