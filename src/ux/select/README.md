# Select

## Overview

The `Select` widget is a listbox control that presents a list of possible values. Users can select a value within the widget. This widget is implemented using the Fluent Web Component `fluent-select` and follows the Fluent Design System.

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not provided by the Fluent Web Component.

### Label Support

The widget has been extended with a group-level label using a label slot inside the shadow root. This improves accessibility and clarity in form layouts. The label slot is mapped to the `label-text` widget property.

### Error Visualization

The widget has been extended with an error element slot inside the shadow root. This enables proper visualization of validation or formatting errors. An error icon is shown next to the select element, with a tooltip showing the message on hover.

### Placeholder Option Handling
 
The widget has been extended to support a placeholder option when no value is selected. In the default Fluent behavior, the first item is automatically selected if no value is provided. This enhancement changes behavior by inserting a dedicated placeholder option when the value is empty. If the user does not select anything, the placeholder remains visible. Otherwise, if no value or placeholder is set, a format error is displayed.

### Pop-up Position Handling
 
The widget has been extended to manually control the pop-up position due to limitations in Fluent’s default layout. The pop-up, rendered inside a shadow DOM, does not position correctly when parent elements have overflow settings. To fix this, its position is now calculated and applied dynamically using JavaScript, ensuring consistent and predictable placement across all layouts

### Read-only Support
 
The widget has been extended to support a read-only state, which is not natively available in the Fluent component. A custom class is applied based on the read-only property to visually reflect this state.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/yzp1709198831196.html)  
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)  
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` - Logical to Physical Widget Mapping
```ini
[webwidgets]
ux-select=uxSelect
```

#### `web.ini` - Physical Widget Configuration
```ini
[uxSelect]
widget_class=UX.Select
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS=placeholder;HTMLATTRIBUTES=id=ubinding
properties=grp:ux_select;clientsyntaxcheck
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` – IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are multiple ways to customize or enhance the widget’s behavior. It is recommended to extend the widget class instead of modifying it directly. This helps ensure easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

1. Create a new widget class that inherits (extends) the base widget.  
2. Override, remove, or add functionality as required.  
3. Add your widget configuration.

#### Using the Select Widget as a Sub-Widget

Alternatively, depending on the use case, widgets can also be used as **sub-widget**.  
Learn more about sub-widgets by checking out the framework folder.
