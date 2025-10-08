# NumberField

## Overview

The `NumberField` widget is an input control designed for numerical entry and validation, supporting integer and decimal values. The widget is implemented using the Fluent Web Component `fluent-number-field` and follows the Fluent Design System.

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not provided by the Fluent Web Component.

### Label Support

The widget has been extended with a group-level label using a label slot inside the shadow root. This improves accessibility and clarity in form layouts. The label slot is mapped to the `label-text` widget property.

### Error Visualization

The widget has been extended with an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the NumberField, with a tooltip showing the message on hover.

### Prefix and Suffix Support

The widget has been extended to provide dedicated slots for prefix and suffix content within the shadow root. This improves clarity and guides user input.

### Sub-Widget Button Capability

The NumberField widget supports an optional action button rendered alongside the input field as a sub-widget. This button uses the UX.Button widget and provides users with enhanced interactivity.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/ndt1709294595416.html)
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)  
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` – Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-NumberField=uxNumberField
```

#### `web.ini` – Physical Widget Configuration
```ini
[uxNumberField]
widget_class=UX.NumberField
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_number_field;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly. This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the NumberField Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
