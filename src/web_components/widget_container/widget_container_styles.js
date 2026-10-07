import { bodyFont, designUnit, neutralForegroundRest } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";

export const widgetContainerStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    box-sizing: border-box;

    font-family: ${bodyFont};
    color: ${neutralForegroundRest};

    /* Header spacing */
    --u-header-spacing-normal: calc(${designUnit} * 1px);
    --u-header-spacing-sm: calc(${designUnit} * 2px);
    --u-header-spacing-md: calc(${designUnit} * 3px);
    --u-header-spacing-lg: calc(${designUnit} * 4px);

    /* Header icon size */
    --u-header-icon-size-sm: calc(${designUnit} * 4px);
    --u-header-icon-size-md: calc(${designUnit} * 5px);
    --u-header-icon-size-lg: calc(${designUnit} * 6px);

    --header-spacing: var(--u-header-spacing-normal);

    /* Default Density for spacing. */
    --u-density: 0;
    --u-spacing: calc(var(--design-unit) * (var(--u-density) + 4) * 1px);
  }

  /* Header spacing and icon size by label size */
  :host([label-size="small"]) {
    --header-spacing: var(--u-header-spacing-sm);
    --header-icon-size: var(--u-header-icon-size-sm);
  }

  :host([label-size="medium"]) {
    --header-spacing: var(--u-header-spacing-md);
    --header-icon-size: var(--u-header-icon-size-md);
  }

  :host([label-size="large"]) {
    --header-spacing: var(--u-header-spacing-lg);
    --header-icon-size: var(--u-header-icon-size-lg);
  }

  .header {
    display: flex;
    align-items: center;
  }

  .start,
  .end {
    display: flex;
    align-items: center;
  }

  .label {
    display: flex;
    flex: 1;
    align-items: center;
  }

  /* ============================================
     Label Alignment - Controls label content alignment
     ============================================ */

  :host([label-align="start"]) .label {
    justify-content: start;
  }

  :host([label-align="center"]) .label {
    justify-content: center;
  }

  :host([label-align="end"]) .label {
    justify-content: end;
  }

  ::slotted([slot="label"]) {
    margin: 0;
  }

  /* Vertical spacing */
  ::slotted([slot="start"]),
  ::slotted([slot="label"]),
  ::slotted([slot="end"]) {
    margin-block-end: var(--header-spacing);
  }

  /* Horizontal spacing */
  ::slotted([slot="start"]),
  ::slotted([slot="label"]) {
    margin-inline-end: var(--header-spacing);
  }

  ::slotted([slot="start"].ms-Icon),
  ::slotted([slot="end"].ms-Icon) {
    font-size: var(--header-icon-size);
  }

  :host([hidden]) {
    display: none;
  }
`;
