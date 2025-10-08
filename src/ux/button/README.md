# Button

## Overview

The `Button` widget is a clickable control that triggers an action or event when pressed. It allows users to initiate commands or submit data. The widget is implemented using the Fluent Web Component `fluent-button` and follows the Fluent Design System.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/adi1709199038344.html)
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` - Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-Button=uxButton[syntax=ned]
```

#### `web.ini` - Physical Widget Configuration
```ini
[uxButton]
widget_class=UX.Button
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_button;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly.
This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the Button widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
