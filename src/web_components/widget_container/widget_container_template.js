import { html } from "@microsoft/fast-element";

/**
 * Template for the widget container component.
 *
 * Structure:
 * - Header section containing optional start, label, and end content slots.
 * - Body section containing the default slot for widget content.
 *
 * Slots:
 * @slot start - Content displayed at the beginning of the header.
 * @slot label - Main label or title content displayed in the header.
 * @slot end - Content displayed at the end of the header.
 * @slot - Default content rendered inside the widget body.
 */
export const widgetContainerTemplate = html`
  <div part="header" class="header">
    <div part="start" class="start">
      <slot name="start"></slot>
    </div>

    <div part="label" class="label">
      <slot name="label"></slot>
    </div>

    <div part="end" class="end">
      <slot name="end"></slot>
    </div>
  </div>

  <div part="body" class="body">
    <slot></slot>
  </div>
`;
