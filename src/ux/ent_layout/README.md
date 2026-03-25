# Entity Layout Widget

## Overview

The Entity Layout widget provides the layout mechanism used to position an entity’s occurrences on the screen and arrange the entity’s child objects (fields and nested entities) within each occurrence.
The Entity Layout system therefore consists of two layout widgets, both offering similar layout capabilities but at different levels:

- **CollectionLayout**: Arranges the occurrence widgets within the collection’s area.
- **OccurrenceLayout**: Arranges the child widgets (fields and nested entities) within the occurrence’s area.

The widget is implemented using the web component `uf-layout` built on FASTElement and follows the Fluent Design System.

## Features

- **Flexible Layout Directions**: Vertical and horizontal layouts with scroll or wrap options.
- **Dynamic Labels**: Optional labels with customizable size, position, and alignment for collection entity.
- **Alignment Control**: Fine-grained control over horizontal and vertical alignment.
- **Responsive Design**: Built on CSS Flexbox for responsive layouts.

### Comprehensive Layout Controls for Collection and Occurrence widget

- **Layout Type**: Choose between vertical-scroll, horizontal-scroll, vertical-wrap, horizontal-wrap, or auto.
- **Horizontal Align**: Controls how child widgets (entities, fields or occurrences) are positioned in horizontal direction (reversed in RTL) when not overflowing.
  The options are start, center, end, space-between, space-around, space-evenly, stretch, and auto.
- **Vertical Align**: Controls how child widgets (entities, fields or occurrences) are positioned in vertical direction when not overflowing. 
  The options are start, center, end, space-between, space-around, space-evenly, stretch, and auto.

These properties allow control over how content is arranged and displayed within each section.

### Label Support for Collection widget

- **Label Text**: The text content of the label.
- **Label Size**: Specifies the size (and corresponding HTML tag) used to render the label text.
  The options are small, medium, large, and normal.
- **Label Align**: Specifies how the label text is aligned based on the label position.
  The options are start, center, and end.
- **Label Position**: Specifies the position of the label with respect to its element.
  The options are above, below, before, and after.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/daf1771568797099.html)
2. [Fluent Design System](https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm/` folder.

#### `usys.ini` – Logical to Physical Widget Mapping

```ini
[webentitywidgets]
ux-Layout=uxEntLayout
```

#### `web.ini` – Physical Widget Configuration

```ini
[uxEntLayout]
collection_widget_class=UX.CollectionLayout
occurrence_widget_class=UX.OccurrenceLayout
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS= ;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_entlayout;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget's JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly.  
This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

Extending `Entity Layout Widget` will involve customizing multiple widget classes that work together to render the full structure. The general steps
are:

1. Create one or more widget classes that inherit from the base classes. For example:- `CollectionLayout` or `OccurrenceLayout`
2. Override, remove, or add functionality as needed in each class to support your specific layout, behavior, or data handling.
3. Add the widget configuration in `web.ini` to reference your custom classes and ensure they are correctly mapped.
4. If needed, define additional properties in `uproperties.ini` to expose new customization options in the IDE.

> Note: Since entity-level widgets encapsulate multiple field-level widgets, extensions may vary depending on which part of the entity you want to
> customize, collection layout, occurrences, or individual field behavior.
