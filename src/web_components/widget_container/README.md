# Widget Container Web Component

## Overview

The `WidgetContainer` is a FASTElement base class for widgets with a shared header and body layout.
It provides three named header slots (`start`, `label`, and `end`) and one default slot for body
content.

The module registers concrete elements from the `containerTypes` list. The currently supported
element is:

- `uf-accordion-container`

The examples below use that registered element. A new container type uses the same template, slots,
attributes, and CSS parts.

## Features

- **Flexible Layout**: Consistent header and body structure for container-based widgets.
- **Header Slots**: `start`, `label`, and `end` slots for composing header content.
- **Configurable Header**: Label size and alignment can be selected through attributes.

## Usage

### Basic Example

```html
<uf-accordion-container>
  <span slot="label">Accordion Title</span>
  <div>Body content goes here</div>
</uf-accordion-container>
```

### With Start and End Slots

```html
<uf-accordion-container label-size="medium" label-align="center">
  <span slot="start">[expand]</span>
  <span slot="label">Section title</span>
  <span slot="end">[menu]</span>
  <div>Expandable content</div>
</uf-accordion-container>
```

## Attributes

These attributes are consumed by the shared styles. The container does not define reflected
properties for them, so an omitted attribute leaves the corresponding CSS custom properties unset.
The accordion widget supplies `large` for `label-size` and `start` for `label-align`.

### `label-size`

- **Type**: `string`
- **Values**: `"small"` | `"medium"` | `"large"`

Controls the spacing around header content.

```html
<uf-accordion-container label-size="large">
  <span slot="label">Large Header</span>
</uf-accordion-container>
```

### `label-align`

- **Type**: `string`
- **Values**: `"start"` | `"center"` | `"end"`

Controls the horizontal alignment of the label slot content.

```html
<uf-accordion-container label-align="center">
  <span slot="label">Centered Label</span>
</uf-accordion-container>
```

## Slots

### Default Slot

Body content rendered below the header.

```html
<uf-accordion-container>
  <div>Body content</div>
</uf-accordion-container>
```

### `start`

Content displayed at the beginning of the header, such as an icon or control.

```html
<uf-accordion-container>
  <span slot="start">[expand]</span>
</uf-accordion-container>
```

### `label`

Main label or title content in the header.

```html
<uf-accordion-container>
  <span slot="label">Section title</span>
</uf-accordion-container>
```

### `end`

Content displayed at the end of the header, such as an action or menu.

```html
<uf-accordion-container>
  <span slot="end">[menu]</span>
</uf-accordion-container>
```

## CSS Parts

### `header`

The header container element.

```css
uf-accordion-container::part(header) {
  background: var(--neutral-layer-2);
}
```

### `start`

The start section of the header.

### `label`

The label section of the header.

### `end`

The end section of the header.

### `body`

The body content container.

```css
uf-accordion-container::part(body) {
  padding: var(--u-spacing);
}
```

## Extending

To register another container type, append its suffix to the `containerTypes` array in
`widget_container.js`:

```js
const containerTypes = ["accordion", "new-type"];
```

This registers `uf-new-type-container` with the shared template and styles. The suffix must be a
valid custom-element name segment and must not already be registered.

## Files

- `widget_container.js` - Web component class definition and custom-element registration.
- `widget_container_template.js` - HTML template and slot definitions.
- `widget_container_styles.js` - Web component styles and attribute selectors.

## API Reference

### Class: `WidgetContainer`

Extends `FASTElement`.
