# TextField

## Overview

The `TextField` widget is an input control that allows entry of various types, formats, and syntaxes, including single-line text, date, tel, email, password, and URL. The widget is implemented using the Fluent Web Component `fluent-text-field` and follows the Fluent Design System.

## Extensions

### Label Support

We have extended the widget to provide a label using a label slot inside the shadow root. This improves accessibility and clarity in form layouts.

### Error Visualization

We have extended the widget to include an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the TextField, with a tooltip showing the message on hover.

### Prefix and Sufix Support

We have extended widget to provide a prefix and sufix using a Prefix and sufix slot inside the shadow root. This improve clarity and guide user input.

### Subwidget Button Support

TODO

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/ylt1708331916696.html)  
2. [Fluent Web Components](https://learn.microsoft.com/en-us/fluent-ui/web-components/)  
3. UX Widget Framework: See `README.md` in the framework folder.

## Configuration

In a default installation, configuration files are located in the `uniface_install/uniface/adm/` folder.

#### `usys.ini` – Logical to Physical Widget Mapping
```ini
[widgets]
ux-DatePicker=uxTextField(html:type=date)
ux-EmailField=uxTextField(html:type=email)
ux-PasswordField=uxTextField(html:type=password)
ux-TelField=uxTextField(html:type=tel)
ux-TextField=uxTextField(html:type=text)
ux-UrlField=uxTextField(html:type=url)
```

#### `web.ini` – Widget Configuration
```ini
[uxTextField]
widget_class=UX.TextField
module=$LIBURL/../unifaceux/dist/unifaceux.min.js
css=$LIBURL/../unifaceux/dist/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_text_field;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `upproperties.ini` – IDE Property Inspector Configuration

## Customization

There are several ways to customize or enhance the widget’s behavior. It is recommended to extend the widget class rather than modify it directly. This ensures easier maintenance and compatibility with future updates to the base widget.


#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the TextField Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.

Refer to the section in `README.md` that explains the sub-widget concept.