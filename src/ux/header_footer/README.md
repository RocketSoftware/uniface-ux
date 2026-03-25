# HeaderFooter

## Overview

The `HeaderFooter` widget is a layout container that manages a header-main-footer structure. It provides a flexible and intuitive way to organize
content across three distinct sections: header, main, and footer. The widget uses reusable web components, such as `uf-shell`, `uf-header`, `uf-main`,
and `uf-footer`, and is designed to follow consistent layout patterns with powerful child widget management capabilities.

## Features

The HeaderFooter widget is built with several advanced features to provide flexible layout management and child widget organization.

### Dynamic Slot-Based Child Distribution

The widget uses a flexible slot-based system to place child widgets in the header, main, and footer sections. The child widgets can be assigned to
these sections using:

- **Property-based assignment**: Using the `area-slot` property to explicitly assign widgets to "header", "main", or "footer" slots.
- **Index-based assignment**: Automatically distributing the child widgets based on their order:
  - 1 child widget: Assigned to **main** section.
  - 2 child widgets: First → **header**, second → **main**.
  - 3+ child widgets: First → **header**, last → **footer**, all others → **main**.

This dynamic distribution ensures intuitive layout management regardless of the number of child widgets.

### Section Placement Control

Each section (header and footer) supports flexible placement options:

- **scroll**: Stays in the normal document flow and scrolls with the page.
- **sticky**: Remains fixed to the top/bottom of the viewport.
- **hidden**: Section is hidden from view.

### Comprehensive Layout Controls

Each section (header, main, footer) provides full control over layout behavior:

- **Layout Type**: Choose between vertical-scroll, horizontal-scroll, vertical-wrap, horizontal-wrap, or auto.
- **Horizontal Align**: Controls how child widgets (fields or entities) are positioned in horizontal direction (reversed in RTL) when not overflowing.
  The options are start, center, end, space-between, space-around, space-evenly, stretch, and auto.
- **Vertical Align**: Controls how child widgets (fields or entities) are positioned in vertical direction when not overflowing. The options are start,
  center, end, space-between, space-around, space-evenly, stretch, and auto.

These properties allow control over how content is arranged and displayed within each section.

### ChildWidgets Framework Integration

The widget leverages the ChildWidgets API to manage dynamic child widget insertion, slot assignment, and lifecycle management. This ensures seamless
integration with the UX widget framework and enables complex nested layouts.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/eei1768821828342.html)
2. [Fluent Design System](https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` - Logical to Physical Widget Mapping

```ini
[webcomponentwidgets]
ux-HeaderFooter=uxHeaderFooter
```

#### `web.ini` - Physical Widget Configuration

```ini
[uxHeaderFooter]
component_widget_class=UX.HeaderFooter
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
properties=grp:ux_header_footer;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget's JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly.
This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.
