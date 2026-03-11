import { FASTElement } from "@microsoft/fast-element";
import { layoutTemplate as template } from "./layout_template";
import { layoutStyles as styles } from "./layout_styles";

/**
 * Layout web component that extends FASTElement.
 */
export class Layout extends FASTElement { }

/**
 * Layout definition object for registering the custom element.
 * Defines the element name, template, styles, and attributes.
 */
export const layoutDefinition = {
  "name": "uf-layout",
  template,
  styles,
  "attributes": [
    {
      "attribute": "show-label",
      "property": "showLabel"
    }
  ]
};

// Register the Layout web component as a FAST custom element.
FASTElement.define(Layout, layoutDefinition);
