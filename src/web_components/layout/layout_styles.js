import { bodyFont, designUnit, neutralForegroundRest } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";

/**
 * Styles for the Layout web component.
 */
export const layoutStyles = css`
  /* Host styles. */
  :host {
    display: flex;
    flex-direction: column;
    flex-shrink: var(--u-layout-shrink, 1);
    box-sizing: border-box;
    font-family: ${bodyFont};
    color: ${neutralForegroundRest};

    /* Label spacing variables. */
    --u-label-spacing-sm: calc(${designUnit} * 2px);
    --u-label-spacing-md: calc(${designUnit} * 3px);
    --u-label-spacing-lg: calc(${designUnit} * 4px);

    /* Default Density for spacing. */
    --u-density: 0;
    --u-spacing: calc(var(--design-unit) * (var(--u-density) + 4) * 1px);
  }

  /* ============================================
     Label Container & Slotted Label
     ============================================ */
  .label {
    display: flex;
  }

  ::slotted([slot="label"]) {
    margin: 0;
  }

  /* ============================================
     Root Container
     ============================================ */
  .root {
    display: flex;
    flex-direction: var(--u-layout-flex-direction, column);
    flex-wrap: var(--u-layout-flex-wrap, nowrap);
    justify-content: var(--u-layout-justify-content, normal);
    align-items: var(--u-layout-align-items, normal);
    height: 100%;
    flex: 1 var(--u-layout-shrink, 1) auto;
  }

  /* ============================================
     Label Size - Controls spacing around label
     ============================================ */
  :host([label-size="small"]) {
    --label-spacing: var(--u-label-spacing-sm);
  }

  :host([label-size="medium"]) {
    --label-spacing: var(--u-label-spacing-md);
  }

  :host([label-size="large"]) {
    --label-spacing: var(--u-label-spacing-lg);
  }

  /* ============================================
     Label Position - Controls label placement
     ============================================ */

  /* Order: Place label after content for below/after positions. */
  :host([label-position="below"]) .label,
  :host([label-position="after"]) .label {
    order: 2;
  }

  /* Vertical positioning. */
  :host([label-position="above"]) .label {
    margin-block-end: var(--label-spacing);
  }

  :host([label-position="below"]) .label {
    margin-block-start: var(--label-spacing);
  }

  /* Horizontal positioning. */
  :host([label-position="before"]),
  :host([label-position="after"]) {
    flex-direction: row;
  }

  :host([label-position="before"]) .label {
    margin-inline-end: var(--label-spacing);
  }

  :host([label-position="after"]) .label {
    margin-inline-start: var(--label-spacing);
  }

  /* ============================================
     Label Alignment - Controls label self-alignment
     ============================================ */
  :host([label-align="start"]) .label {
    align-self: start;
  }

  :host([label-align="center"]) .label {
    align-self: center;
  }

  :host([label-align="end"]) .label {
    align-self: end;
  }

  /* ============================================
     Computed alignment classes (applied by JS based on resolved direction).
     u-jc-* drives justify-content (main axis).
     u-ai-* drives align-items (cross axis).
     ============================================ */
  :host(.u-jc-start) {
    --u-layout-justify-content: start;
  }

  :host(.u-jc-center) {
    --u-layout-justify-content: safe center;
  }

  :host(.u-jc-end) {
    --u-layout-justify-content: safe end;
  }

  :host(.u-jc-stretch) {
    --u-layout-justify-content: stretch;
  }

  :host(.u-jc-space-between) {
    --u-layout-justify-content: space-between;
  }

  :host(.u-jc-space-around) {
    --u-layout-justify-content: space-around;
  }

  :host(.u-jc-space-evenly) {
    --u-layout-justify-content: space-evenly;
  }

  :host(.u-ai-start) {
    --u-layout-align-items: start;
  }

  :host(.u-ai-center) {
    --u-layout-align-items: safe center;
  }

  :host(.u-ai-end) {
    --u-layout-align-items: safe end;
  }

  :host(.u-ai-stretch) {
    --u-layout-align-items: stretch;
  }

  /* ============================================
     Layout Direction & Wrapping
     ============================================ */

  /* Vertical layouts. */
  :host(.u-layout-type-vs),
  :host(.u-layout-type-vw) {
    --u-layout-flex-direction: column;
  }

  :host(.u-layout-type-vs) {
    --u-layout-flex-wrap: nowrap;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :host(.u-layout-type-vw) {
    --u-layout-flex-wrap: wrap;
  }

  /* Horizontal layouts. */
  :host(.u-layout-type-hs),
  :host(.u-layout-type-hw) {
    --u-layout-flex-direction: row;
  }

  :host(.u-layout-type-hs) {
    --u-layout-flex-wrap: nowrap;
    --u-layout-shrink: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }

  :host(.u-layout-type-hw) {
    --u-layout-flex-wrap: wrap;
    --u-layout-shrink: 1;
  }
`;
