# Component Layout Widget

## Overview

The Component Layout widget is a flexible widget for arranging direct child elements with customizable layout and positioning options. It also
provides dynamic label support, including configurable label positioning, sizing, and alignment. The widget is implemented using the web component
`uf-layout` built on FASTElement and follows the Fluent Design System.

## Features

- **Flexible Layout Directions**: Vertical and horizontal layouts with scroll or wrap options.
- **Dynamic Labels**: Optional labels with customizable size, position, and alignment.
- **Alignment Control**: Fine-grained control over horizontal and vertical alignment.
- **Responsive Design**: Built on CSS Flexbox for responsive layouts.

### Comprehensive Layout Controls

- **Layout Type**: Choose between vertical-scroll, horizontal-scroll, vertical-wrap, horizontal-wrap, or auto.
- **Horizontal Align**: Controls how child widget entities are positioned in horizontal direction (reversed in RTL) when not overflowing.
  The options are start, center, end, space-between, space-around, space-evenly, stretch, and auto.
- **Vertical Align**: Controls how child widget entities are positioned in vertical direction when not overflowing. The options are start,
  center, end, space-between, space-around, space-evenly, stretch, and auto.

These properties allow control over how content is arranged and displayed within each section.

### Label Support

- **Label Text**: The text content of the label.
- **Label Size**: Specifies the size (and corresponding HTML tag) used to render the label text.
  The options are small, medium, large, and normal.
- **Label Align**: Specifies how the label text is aligned based on the label position.
  The options are start, center, and end.
- **Label Position**: Specifies the position of the label with respect to its element.
  The options are above, below, before, and after.

### ChildWidgets Framework Integration

The widget leverages the ChildWidgets API to manage dynamic child widget insertion, slot assignment, and lifecycle management. This ensures seamless
integration with the UX widget framework and enables complex nested layouts.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/cyr1771221673419.html)
2. [Fluent Design System](https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm/` folder.

#### `usys.ini` – Logical to Physical Widget Mapping

```ini
[webwidgets]
ux-Layout=uxCompLayout[syntax=ned]
```

#### `web.ini` – Physical Widget Configuration

```ini
[uxCompLayout]
widget_class=UX.CompLayout
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_complayout;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget's JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly.  
This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.
