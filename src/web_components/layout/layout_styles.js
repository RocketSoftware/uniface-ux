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
    flex-direction: column;
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
     Auto Layout - Inherit from parent layout's .root
     ============================================ */
  :host([layout-type="auto"]) .root {
    flex-direction: var(--u-layout-flex-direction, column);
    flex-wrap: var(--u-layout-flex-wrap, nowrap);
    justify-content: var(--u-layout-justify-content, start);
    align-items: var(--u-layout-align-items, start);
    flex-shrink: var(--u-layout-shrink, 1);
  }

  :host([vertical-align="auto"]) .root,
  :host([horizontal-align="auto"]) .root {
    justify-content: var(--u-layout-justify-content, start);
    align-items: var(--u-layout-align-items, start);
  }

  /* ============================================
     Layout Direction & Wrapping
     ============================================ */

  /* Vertical layouts. */
  :host([layout-type="vertical-scroll"]) .root,
  :host([layout-type="vertical-wrap"]) .root {
    --u-layout-flex-direction: column;
    flex-direction: var(--u-layout-flex-direction);
  }

  /* Horizontal layouts. */
  :host([layout-type="horizontal-scroll"]) .root,
  :host([layout-type="horizontal-wrap"]) .root {
    --u-layout-flex-direction: row;
    flex-direction: var(--u-layout-flex-direction);
  }

  /* Wrap layouts. */
  :host([layout-type="vertical-wrap"]) .root,
  :host([layout-type="horizontal-wrap"]) .root {
    --u-layout-flex-wrap: wrap;
    flex-wrap: var(--u-layout-flex-wrap);
  }

  /* Scroll layouts. */
  :host([layout-type="vertical-scroll"]) .root,
  :host([layout-type="horizontal-scroll"]) .root {
    --u-layout-flex-wrap: nowrap;
    flex-wrap: var(--u-layout-flex-wrap);
  }

  :host([layout-type="horizontal-scroll"]) {
    overflow-x: auto;
    overflow-y: hidden;
    --u-layout-horizontal-overflow: auto;
  }

  :host([layout-type="vertical-scroll"]) {
    --u-layout-vertical-overflow: auto;
    overflow-y: var(--u-layout-vertical-overflow);
    overflow-x: hidden;
  }

  /* ============================================
     Vertical scroll/wrap + vertical alignment
     ============================================ */

  :host([layout-type="vertical-scroll"][vertical-align="start"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="start"]) .root {
    --u-layout-justify-content: start;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="vertical-scroll"][vertical-align="center"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="center"]) .root {
    --u-layout-justify-content: safe center;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="vertical-scroll"][vertical-align="end"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="end"]) .root {
    --u-layout-justify-content: safe end;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="vertical-scroll"][vertical-align="space-between"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="space-between"]) .root {
    --u-layout-justify-content: space-between;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="vertical-scroll"][vertical-align="space-around"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="space-around"]) .root {
    --u-layout-justify-content: space-around;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="vertical-scroll"][vertical-align="space-evenly"]) .root,
  :host([layout-type="vertical-wrap"][vertical-align="space-evenly"]) .root {
    --u-layout-justify-content: space-evenly;
    justify-content: var(--u-layout-justify-content);
  }

  /* ============================================
     Vertical scroll/wrap + horizontal alignment
     ============================================ */

  :host([layout-type="vertical-scroll"][horizontal-align="start"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="start"]) .root {
    --u-layout-align-items: start;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="vertical-scroll"][horizontal-align="center"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="center"]) .root {
    --u-layout-align-items: center;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="vertical-scroll"][horizontal-align="end"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="end"]) .root {
    --u-layout-align-items: end;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="vertical-scroll"][horizontal-align="stretch"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="stretch"]) .root {
    --u-layout-align-items: stretch;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="vertical-scroll"][horizontal-align="space-between"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="space-between"]) .root,
  :host([layout-type="vertical-scroll"][horizontal-align="space-around"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="space-around"]) .root,
  :host([layout-type="vertical-scroll"][horizontal-align="space-evenly"]) .root,
  :host([layout-type="vertical-wrap"][horizontal-align="space-evenly"]) .root {
    --u-layout-align-items: start;
    align-items: var(--u-layout-align-items);
  }

  /* ============================================
     Horizontal scroll/wrap + horizontal alignment
     ============================================ */

  :host([layout-type="horizontal-scroll"][horizontal-align="start"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="start"]) .root {
    --u-layout-justify-content: start;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="horizontal-scroll"][horizontal-align="center"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="center"]) .root {
    --u-layout-justify-content: safe center;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="horizontal-scroll"][horizontal-align="end"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="end"]) .root {
    --u-layout-justify-content: safe end;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="horizontal-scroll"][horizontal-align="space-between"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="space-between"]) .root {
    --u-layout-justify-content: space-between;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="horizontal-scroll"][horizontal-align="space-around"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="space-around"]) .root {
    --u-layout-justify-content: space-around;
    justify-content: var(--u-layout-justify-content);
  }

  :host([layout-type="horizontal-scroll"][horizontal-align="space-evenly"]) .root,
  :host([layout-type="horizontal-wrap"][horizontal-align="space-evenly"]) .root {
    --u-layout-justify-content: space-evenly;
    justify-content: var(--u-layout-justify-content);
  }

  /* ============================================
     Horizontal scroll/wrap + vertical alignment
     ============================================ */

  :host([layout-type="horizontal-scroll"][vertical-align="start"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="start"]) .root {
    --u-layout-align-items: start;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="horizontal-scroll"][vertical-align="center"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="center"]) .root {
    --u-layout-align-items: center;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="horizontal-scroll"][vertical-align="end"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="end"]) .root {
    --u-layout-align-items: end;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="horizontal-scroll"][vertical-align="stretch"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="stretch"]) .root {
    --u-layout-align-items: stretch;
    align-items: var(--u-layout-align-items);
  }

  :host([layout-type="horizontal-scroll"][vertical-align="space-between"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="space-between"]) .root,
  :host([layout-type="horizontal-scroll"][vertical-align="space-around"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="space-around"]) .root,
  :host([layout-type="horizontal-scroll"][vertical-align="space-evenly"]) .root,
  :host([layout-type="horizontal-wrap"][vertical-align="space-evenly"]) .root {
    --u-layout-align-items: start;
    align-items: var(--u-layout-align-items);
  }

   :host([layout-type="horizontal-scroll"]) {
    --u-layout-shrink: 0;
    flex-shrink: var(--u-layout-shrink);
  }

  :host([layout-type="horizontal-wrap"]) {
    --u-layout-shrink: 1;
    flex-shrink: var(--u-layout-shrink);
  }

`;
