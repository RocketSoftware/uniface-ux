# Shell Web Components

A collection of semantic web components built on FASTElement that provide structured layout containers for application shells. These web components extend the Layout web component to provide meaningful names for header-main-footer layouts.

## Overview

The shell web components (`uf-shell`, `uf-header`, `uf-main`, and `uf-footer`) are specialized web components designed for creating application layouts with clear semantic meaning. They extend the `uf-layout` web component, inheriting all its features while providing better naming and developer experience.

**All features from Layout are available**: layout controls, alignment, spacing, labels, etc. See the [Layout Web Component README](../layout/README.md) for complete documentation.

## Features

- **Semantic Naming**: Web component names clearly indicate their purpose.
- **Layout Inheritance**: All features from `uf-layout` available out of the box.
- **Better Developer Experience**: Easy to identify web components in DevTools.
- **Generic & Reusable**: Can be used by any widget with or without additional features.
- **No Code Duplication**: Single shared implementation via inheritance.

## Web Components

### `uf-shell`
Main container for application structure. Typically wraps the entire layout.

### `uf-header`
Header section for navigation, branding, and top-level controls.

### `uf-main`
Primary content area for the main application content.

### `uf-footer`
Footer section for metadata, links, and auxiliary information.

## Usage

### Basic Shell Layout

```html
<uf-shell>
  <uf-header>
    <nav>Navigation</nav>
  </uf-header>
  <uf-main>
    <h1>Main Content</h1>
    <p>Content goes here</p>
  </uf-main>
  <uf-footer>
    <p>Footer content</p>
  </uf-footer>
</uf-shell>
````

## Attributes

All attributes from Layout are inherited. See the [Layout Web Component README](../layout/README.md) for details.

## Slots

Inherited from Layout:

- **Default slot**: Main content area.
- **`label` slot**: Optional label (shown when `show-label` attribute is present).

## CSS Parts

Inherited from Layout:

- **`root`**: Main content container.
- **`label`**: Label container (when `show-label` is present).

## Layout Patterns

### Header-Main-Footer (Classic)

```html
<uf-shell>
  <uf-header layout-type="horizontal-wrap">
    <!-- Header content -->
  </uf-header>
  <uf-main layout-type="vertical-scroll">
    <!-- Main content -->
  </uf-main>
  <uf-footer layout-type="horizontal-wrap">
    <!-- Footer content -->
  </uf-footer>
</uf-shell>
```

### Header-Main Only

```html
<uf-shell>
  <uf-header layout-type="horizontal-wrap">
    <!-- Header content -->
  </uf-header>
  <uf-main layout-type="vertical-scroll">
    <!-- Main content -->
  </uf-main>
</uf-shell>
```

### Main Only (Simple Page)

```html
<uf-shell>
  <uf-main layout-type="vertical-scroll">
    <!-- All content -->
  </uf-main>
</uf-shell>
```

## Comparison with uf-layout

Shell Web components extend `uf-layout` with better naming:

| Feature | `uf-layout` | Shell web components |
|---------|---------------|------------------|
| **Purpose** | Generic layout | Semantic layout structure |
| **Naming** | Generic | Meaningful (`shell`, `header`, `main`, and `footer`) |
| **Features** | All layout features | Inherits all layout features |
| **Implementation** | Base class | Extends Layout |
| **DevTools** | Generic name | Clear identification |

## Why Use Shell Web Components?

- **Self-documenting web component names**: `uf-header`, `uf-main`, and `uf-footer` clearly indicate purpose.
- **Easy to identify in DevTools**: No need to read class names or IDs.
- **Clear semantic structure**: Web component names match their intended use.
- **Generic & reusable**: Widgets can add their own features (roles, attributes, etc.) as needed.

## Files

- `shell.js` - Web component class definitions (Shell, Header, Main, and Footer).
- Inherits from `../layout/layout.js`.
- Uses `../layout/layout_template.js` for HTML template.
- Uses `../layout/layout_styles.js` for styles.

## See Also

- **[Layout Web Component](../layout/README.md)** - Complete documentation of all inherited features, attributes, and capabilities.
- [FASTElement Documentation](https://www.fast.design/docs/fast-element/getting-started).
