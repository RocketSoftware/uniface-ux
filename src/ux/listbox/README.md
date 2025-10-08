# Listbox

## Overview

The `Listbox` widget is a control element that displays a list of items and allows the user to select a single option from a short list. The widget is implemented using the Fluent Web Component `fluent-listbox` and follows the Fluent Design System.

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not provided by the Fluent Web Component.

### Label Support

The widget has been extended with a group-level label using a label slot inside the shadow root. This improves accessibility and clarity in form layouts. The label slot is mapped to the `label-text` widget property.

### Error Visualization

The widget has been extended with an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the Listbox, with a tooltip showing the message on hover.

### Read-only Support
 
The widget has been extended to support a read-only state, which is not natively available in the Fluent component. The read-only behavior is applied explicitly using custom attributes. When read-only is enabled, the widget becomes non-editable while still allowing users to view the selected option.

### Disabled Support

Fluent Listbox does not natively support the disabled attribute. The widget has been extended to implement disable behavior and visual styles for disabling the Listbox and its options. When disabled, interaction and event firing are blocked.

### Size Attribute
 
The widget supports a size attribute that allows the dropdown height to reflect a specific number of visible options — not natively supported in Fluent Listbox.
 
## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/qkk1744107469814.html)  
2. [Fluent Web Components](https://learn.microsoft.com/en-us/fluent-ui/web-components/)  
3. [UX Widget Framework](../framework/README.md)

> Note: When the user tabs into the widget, the current Fluent documentation suggests that the first option will be focused. However, this is not the actual behavior — the entire component gets focus, and users navigate with arrow keys. This differs from the documented Fluent behavior.

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` – Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-Listbox=uxListbox
```

#### `web.ini` – Physical Widget Configuration
```ini
[uxListbox]
widget_class=UX.Listbox
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_listbox;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget’s behavior. It is recommended to extend the widget class rather than modify it directly. This ensures easier maintenance and compatibility with future updates to the base widget.


#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.
2. Override, remove, or add functionality as needed.
3. Add your widget configuration.

#### Using the Listbox Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
