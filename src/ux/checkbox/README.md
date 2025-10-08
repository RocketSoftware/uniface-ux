# Checkbox

## Overview

The `Checkbox` widget is a toggle-style UI component used to represent and switch between Boolean states like _checked_, _unchecked_, or _indeterminate_. The widget is implemented using the Fluent Web Component `fluent-checkbox` and follows the Fluent Design System.

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not provided by the Fluent Web Component.

### Error Visualization

The widget has been extended to include an error icon in the default slot which is used for the label-text inside the shadow root. This enables
proper visualization of validation or formatting errors. An error icon is shown next to the Checkbox, with a tooltip showing the message on hover.

### Tri-State Support

A standard checkbox has two states: checked and unchecked. However, there is a third state called _indeterminate_, which represents a state that is
neither checked nor unchecked.

While the Fluent UI library allows setting the indeterminate state programmatically via the indeterminate attribute, it does not support toggling this
state through user interaction.

To address this, a new tri-state property has been added to the widget.

- When tri-state is _false_ (default):  
  The checkbox toggles between checked and unchecked states.
- When tri-state is _true_:  
  The checkbox cycles through all three states: checked -> unchecked -> indeterminate -> checked -> ...

This enhancement allows users to manually set the checkbox to any of the three states, making it more flexible for complex UI scenarios.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/xyj1709198004166.html)
2. [Fluent Web Components](https://learn.microsoft.com/en-us/fluent-ui/web-components/)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm/` folder.

#### `usys.ini` – Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-CheckBox=uxCheckbox
```

#### `web.ini` – Physical Widget Configuration
```ini
[uxCheckbox]
widget_class=UX.Checkbox
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_checkbox;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget’s behavior. It is recommended to extend the widget class rather than modify it directly.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the Checkbox Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
