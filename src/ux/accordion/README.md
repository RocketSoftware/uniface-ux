# Accordion

## Overview

The `Accordion` widget is an entity-level control that organizes occurrence data into a stack of
expandable and collapsible sections. Each section shows a clickable header and a content panel that
holds the child widgets for that occurrence, so users can focus on one group of data at a time and 
expand only the sections they need. The widget is implemented using the Fluent Web Component
`fluent-accordion` and follows the Fluent Design System.

The widget consists of two widget classes that work together:

- **Accordion** — the container for an entire accordion. It provides an optional group
  label with optional prefix and suffix icons, hosts the individual panels, and controls whether users can
  expand multiple panels at once or only one at a time.
- **AccordionItem** — a single collapsible panel. It provides a header with a label and
  optional prefix and suffix content, and a content panel that lays out the child field and entity
  widgets for that occurrence.

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not
provided by the Fluent Web Component.

### Group Label

The accordion has been extended with a group-level label shown above the panels, with room for a
prefix and suffix icon. This improves clarity in form layouts and lets an entire accordion group have a 
title and icon. The label is driven by the `label-text`, `label-size`, `label-align`, `prefix-icon`, and `suffix-icon`
properties.

### Rich Panel Headers

Each panel header goes beyond a plain title. In addition to the `item:label-text` and `item:label-size`, a panel
can show an icon and text before the label and an icon and text after it, driven by the
`item:prefix-*` and `item:suffix-*` properties. This makes it easy to surface
status, counts, or actions directly in the collapsed header.

### Configurable Panel Layout

The content panel of every occurrence can arrange its child widgets horizontally or vertically and
align them independently in both directions, using the `item:panel:layout-type`,
`item:panel:horizontal-align`, and `item:panel:vertical-align` properties. Child
widgets can also opt in to the header areas instead of the body, keeping related content and its
controls together.

### Expand Behavior

The `expand-mode` property lets the accordion behave as a multi-expand group, where any number of
panels can be open at once, or a single-expand group, where opening one panel automatically closes
the others.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/csh?context=60021&pubname=uniface2_104)
2. [Fluent Web Component — Accordion](https://learn.microsoft.com/en-us/fluent-ui/web-components/components/accordion)
3. [W3C WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
4. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm/`
folder.

#### `usys.ini` - Logical to Physical Widget Mapping
```ini
[webentitywidgets]
ux-Accordion=uxAccordion
```

#### `web.ini` - Physical Widget Configuration
```ini
[uxAccordion]
collection_widget_class=UX.Accordion
occurrence_widget_class=UX.AccordionItem
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS= ;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_accordion
uxInterfaceVersion=2
```

> Note: The location of the widget's JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended that you extend the
widget classes rather than modify them directly. This ensures easier maintenance and compatibility
with future updates to the base widget.

#### Steps to Extend a Widget

Extending `Accordion` involves customizing the two widget classes that work together to render the
full structure. The general steps are:

1. Create one or more widget classes that inherit from the base classes `Accordion` and
   `AccordionItem`.
2. Override, remove, or add functionality as needed to support your specific layout, behavior, or
   data handling.
3. Add the widget configuration in `web.ini` to reference your custom classes and ensure they are
   correctly mapped.
4. If needed, define additional properties in `uproperties.ini` to expose new customization options
   in the IDE.

> Note: Since entity-level widgets encapsulate multiple field-level widgets, extensions may vary
> depending on which part of the accordion you want to customize — the collection layout, the panel
> header, or the panel content.
