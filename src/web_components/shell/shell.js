import { FASTElement } from "@microsoft/fast-element";
import { Layout, layoutDefinition } from "../layout/layout.js";

/**
 * Generic shell web components for creating structured layouts.
 * Provides reusable Shell, Header, Main, and Footer components.
 *
 * These components extend uf-layout to provide semantic structure for application layouts.
 * Each component inherits the Layout's template, styles, and attributes (e.g., show-label).
 */

/**
 * Shell Web Component.
 * Root container for application structure with header, main, and footer sections.
 */
export class Shell extends Layout { }

/**
 * Header Web Component.
 * Generic header section that can be used with any role or purpose.
 */
export class Header extends Layout { }

/**
 * Main Web Component.
 * Generic main section that can be used for primary content.
 */
export class Main extends Layout { }

/**
 * Footer Web Component.
 * Generic footer section that can be used with any role or purpose.
 */
export class Footer extends Layout { }

/**
 * Register all shell web components as FAST custom elements.
 * Each component is registered with a unique tag name and shares the same definition from Layout.
 */
FASTElement.define(Shell, {
  ...layoutDefinition,
  "name": "uf-shell"
});
FASTElement.define(Header, {
  ...layoutDefinition,
  "name": "uf-header"
});
FASTElement.define(Main, {
  ...layoutDefinition,
  "name": "uf-main"
});
FASTElement.define(Footer, {
  ...layoutDefinition,
  "name": "uf-footer"
});