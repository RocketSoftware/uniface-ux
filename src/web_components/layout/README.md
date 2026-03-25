# Layout Web Component

## Overview

The `Layout` is a versatile web component built on FASTElement that provides comprehensive layout and positioning capabilities along with dynamic label support, including configurable label positioning, sizing, and alignment.

## Features

- **Flexible Layout**: Vertical and horizontal layouts with scroll or wrap options.
- **Dynamic Labels**: Configurable label size, position, and alignment.
- **Alignment Control**: Horizontal and vertical alignment options.

## Usage

### Basic Example

```html
<uf-layout>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</uf-layout>
```

### With Label

```html
<uf-layout show-label label-size="medium" label-position="above">
  <span slot="label">My Layout</span>
  <div>Content goes here</div>
</uf-layout>
```

### Horizontal Layout

```html
<uf-layout layout-type="horizontal-wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</uf-layout>
```

### Centered Content

```html
<uf-layout horizontal-align="center" vertical-align="center">
  <div>Centered content</div>
</uf-layout>
```

## Attributes

### Label Attributes

#### `show-label`

Controls whether the label is displayed.

- **Type**: `boolean`

```html
<!-- Label will not be shown -->
<uf-layout>
  <span slot="label">Hidden Label</span>
  <div>Content</div>
</uf-layout>

<!-- Label will be shown -->
<uf-layout show-label>
  <span slot="label">Visible Label</span>
  <div>Content</div>
</uf-layout>
```

#### `label-size`

Controls the spacing around the label.

- **Type**: `string`
- **Values**: `"small"` | `"medium"` | `"large"`

```html
<uf-layout show-label label-size="large"></uf-layout>
```

#### `label-position`

Controls the position of the label relative to content.

- **Type**: `string`
- **Values**: `"above"` | `"below"` | `"before"` | `"after"`

```html
<uf-layout show-label label-position="before"></uf-layout>
```

#### `label-align`

Controls the label's self-alignment.

- **Type**: `string`
- **Values**: `"start"` | `"center"` | `"end"`

```html
<uf-layout show-label label-align="center"></uf-layout>
```

### Layout Attributes

#### `layout-type`

Controls the layout direction and scrolling/wrapping behavior.

- **Type**: `string`
- **Values**: `"vertical-scroll"` | `"horizontal-scroll"` | `"vertical-wrap"` | `"horizontal-wrap"` | `"auto"`

```html
<uf-layout layout-type="horizontal-wrap"></uf-layout>

<uf-layout layout-type="vertical-wrap">
  <!-- Follows the layout of parent layout -->
  <uf-layout layout-type="auto"></uf-layout>
</uf-layout>
```

#### `horizontal-align`

Controls how child widgets (fields or entities) are positioned in horizontal direction (reversed in RTL) when not overflowing.

- **Type**: `string`
- **Values**: `"start"` | `"center"` | `"end"` | `"space-between"` | `"space-around"` | `"space-evenly"` | `"stretch"` | `"auto"`

```html
<uf-layout horizontal-align="space-between"></uf-layout>

<uf-layout horizontal-align="center">
  <!-- Follows the alignment of parent layout -->
  <uf-layout horizontal-align="auto"></uf-layout>
</uf-layout>
```

#### `vertical-align`

Controls how child widgets (fields or entities) are positioned in vertical direction when not overflowing.

- **Type**: `string`
- **Values**: `"start"` | `"center"` | `"end"` | `"space-between"` | `"space-around"` | `"space-evenly"` | `"stretch"` | `"auto"`

```html
<uf-layout vertical-align="stretch"></uf-layout>

<uf-layout vertical-align="center">
  <!-- Follows the alignment of parent layout -->
  <uf-layout vertical-align="auto"></uf-layout>
</uf-layout>
```

## Slots

### Default Slot

The main content area for child elements.

```html
<uf-layout>
  <div>Child content</div>
</uf-layout>
```

### `label`

Slot for label content. Positioning and spacing controlled by label attributes.

```html
<uf-layout show-label label-size="medium">
  <span slot="label">Label Text</span>
  <div>Main content</div>
</uf-layout>
```

## CSS Parts

### `root`

The main content container that holds child elements.

```css
uf-layout::part(root) {
  gap: 20px;
  background: var(--neutral-layer-1);
}
```

### `label`

The label container element.

```css
uf-layout::part(label) {
  color: var(--accent-fill-rest);
  font-weight: bold;
}
```

## Layout Modes

### Vertical Scroll

- **Direction**: Column (top to bottom).
- **Overflow**: Vertical scrolling enabled.
- **Wrapping**: Disabled.

### Horizontal Scroll

- **Direction**: Row (left to right).
- **Overflow**: Horizontal scrolling enabled.
- **Wrapping**: Disabled.

### Vertical Wrap

- **Direction**: Column.
- **Wrapping**: Enabled.
- **Overflow**: Visible.

### Horizontal Wrap

- **Direction**: Row.
- **Wrapping**: Enabled.
- **Overflow**: Visible.

### Auto Layout

- **Behavior**: Follows the last explicitly set layout in the DOM. If no such layout exists, defaults to:
  - **Direction**: Column (top to bottom).
  - **Overflow**: Vertical scrolling enabled.
  - **Wrapping**: Disabled.

## Files

- `layout.js` - Web component class definition.
- `layout_template.js` - HTML template.
- `layout_styles.js` - Web component styles.

## API Reference

### Class: `Layout`

Extends `FASTElement`
