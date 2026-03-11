import { html, when } from "@microsoft/fast-element";

/**
 * Template for the Layout web component.
 * Defines the HTML structure with two main sections:
 * - A label section for displaying layout label.
 * - A root section for the main layout content.
 */
const labelTemplate = html`
  <div part="label" class="label">
    <slot name="label"></slot>
  </div>
`;

export const layoutTemplate = html`
  <template class="u-wc">
    ${when(x => x.showLabel, labelTemplate)}
    <div part="root" class="root">
      <slot></slot>
    </div>
  </template>
`;
