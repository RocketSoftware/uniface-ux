# NumberField

## Overview

The `NumberField` widget is a Fluent UI input component designed for entering and editing numeric values with built-in validation and formatting. The widget is implemented using the Fluent Web Component `fluent-number-field` and follows the Fluent Design System.

## Extensions

### Error Visualization

We have extended the widget to include an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the number-field, with a tooltip showing the message on hover.

### Extending Widgets with Slotted Sub-Widgets

We have enhanced the widget by adding an action button as a static sub-widget, enabling quick interactions such as setting a max value, converting units, or performing calculations. This addition improves usability and streamlines user workflows.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/ndt1709294595416.html)
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)
3. UX Widget Framework: [See README.md in the framework folder]

## Configuration

In a default installation, configuration files are located in the `uniface_install/uniface/adm` folder.

#### `usys.ini` - Logical To Physical Widget Mapping
```ini
ux-NumberField=uxNumberField
```

#### `web.ini` - Widget Configuration
```ini
[uxNumberField]
widget_class=UX.NumberField
module=$LIBURL/../unifaceux/dist/unifaceux.min.js
css=$LIBURL/../unifaceux/dist/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_number_field;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly. This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the NumberField widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.
Refer to the section in `README.md` that explains the sub-widget concept.
