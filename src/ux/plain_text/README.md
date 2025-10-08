# PlainText

## Overview

The `PlainText` widget displays unformatted, plain text content in the user interface. It is explicitly configured as non-editable, ensuring users cannot modify its content. Although not implemented using any Fluent Web Component, it works well with Fluent Design System.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/mqe1709206149119.html)  
2. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` – Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-PlainText=uxPlainText[syntax=ned]
```

#### `web.ini` – Physical Widget Configuration
```ini
[uxPlainText]
widget_class=UX.PlainText
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_plain_text;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are multiple ways to enhance the widget's behavior. To ensure maintainability and compatibility with future versions, it is recommended to extend the base widget class instead of directly modifying it.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the PlainText Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
