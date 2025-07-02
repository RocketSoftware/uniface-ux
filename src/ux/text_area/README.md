# TextArea

## Overview

The `TextArea` widget provides a multi-line text input control for user-entered content. The widget is implemented using the Fluent Web Component `fluent-text-area` and follows the Fluent Design System.

## Extensions

### Error Visualization

We have extended the widget to include an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the text area, with a tooltip displaying the error message on hover.

### Root Element Wrapping

We have injected a root element into the shadow DOM to wrap the control and error elements. This ensures proper styling and layout alignment consistent with other Uniface widgets.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/fon1724921035618.html)  
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)  
3. UX Widget Framework: [See README.md in the framework folder]

## Configuration

In a default installation, configuration files are located in the `uniface_install/uniface/adm` folder.

#### `usys.ini` - Logical to Physical Widget Mapping
```ini
ux-TextArea=uxTextArea
```

#### `web.ini` - Widget Configuration
```ini
[uxTextArea]
widget_class=UX.TextArea
module=$LIBURL/unifaceux.min.js
css=$LIBURL/css/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_text_area;clientsyntaxcheck
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

#### Using the TextArea widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.
Refer to the section in `README.md` that explains the sub-widget concept.
