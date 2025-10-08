# Datagrid

## Overview

The `Datagrid` widget is a composite of several widget classes that work together to deliver a dynamic, structured tabular control that displays and organizes data in rows and columns. Each class plays a distinct role in rendering and managing different parts of the grid. The widget is implemented using the Fluent Web Component `fluent-data-grid` and follows the Fluent Design System.

## Widget Breakdown

The below breakdown highlights how the DataGrid is assembled from multiple widget classes, each responsible for a specific layer of the grid's functionality. These classes interact with Fluent Web Components to render the final UI, but the core logic and structure are defined within the UX Widget Framework.

### Widget Class Roles

| Widget Class           | Role Description                                                                 |
|------------------------|----------------------------------------------------------------------------------|
| `DataGridCollection`   | Acts as the container for the entire grid. It wraps the Fluent Web Component `fluent-data-grid` component and manages layout and structure. |
| `DataGridColumnHeader` | Represents individual column headers. It maps the column’s `label-text` to a span inside `fluent-data-grid-cell`. |
| `DataGridOccurrence`   | Represents a single row in the grid. It dynamically injects field widgets into `fluent-data-grid-row` elements. |
| `DataGridField`        | Represents individual data cells. It maps field content into `fluent-data-grid-cell` elements for display. |

## Extensions

To improve consistency and overall usability, the widget has been extended with several features not provided by the Fluent Web Component.

### Label Support

The widget has been extended with a group-level label using a label slot inside the shadow root. This improves accessibility and clarity in form layouts. The label slot is mapped to the `label-text` widget property.

### Value Refresh Support

The `Datagrid` widget extends the `setProperties()` method to support dynamic value formatting and refresh behavior. This enhancement ensures that when certain properties change, such as `value`, `error`, or `readonly`. This allows the widget to respond intelligently to runtime changes and maintain accurate, formatted content in the grid cells.

## Documentation

1. [Uniface Widget](https://docs.rocketsoftware.com/bundle/uniface_104/page/qrf1726470825903.html)
2. [Fluent Web Component](https://learn.microsoft.com/en-us/fluent-ui/web-components/)
3. [UX Widget Framework](../framework/README.md)

## Configuration

In a default installation, configuration files are located in the `<uniface_install>/uniface/adm` folder.

#### `usys.ini` - Logical to Physical Widget Mapping
```ini
[webentitywidgets]
ux-DataGrid=uxDataGrid
```

#### `web.ini` - Physical Widget Configuration
```ini
[uxDataGrid]
widget_class=UX.DataGridCollection
collection_widget_class=UX.DataGridCollection
occurrence_widget_class=UX.DataGridOccurrence
module=$LIBURL/ux/unifaceux.min.js
css=$LIBURL/ux/unifaceux.min.css
ulayout=TAG=span;CHARACTERS= ;HTMLATTRIBUTES=id=ubinding
properties=grp:datagrid;html:base-layer-luminance
uxInterfaceVersion=2
```

> Note: The location of the widget’s JavaScript and CSS files may vary depending on bundling. The path is relative to the virtual-root.

#### `uproperties.ini` - IDE Property Inspector Configuration

The properties supported by the widget can be found in uproperties.ini.

## Customization

There are several ways to customize or enhance the widget's behavior. It is recommended to extend the widget class rather than modify it directly.
This ensures easier maintenance and compatibility with future updates to the base widget.

#### Steps to Extend a Widget

Extending `DataGrid` will involve customizing multiple widget classes that work together to render the full structure. The general steps are:

1. Create one or more widget classes that inherit from the base classes. For example:- `DataGridCollection`, `DataGridOccurrence`, `DataGridField`, or `DataGridColumnHeader`.
2. Override, remove, or add functionality as needed in each class to support your specific layout, behavior, or data handling.
3. Add the widget configuration in `web.ini` to reference your custom classes and ensure they are correctly mapped.
4. If needed, define additional properties in `uproperties.ini` to expose new customization options in the IDE.

> Note: Since entity-level widgets encapsulate multiple field-level widgets, extensions may vary depending on which part of the grid you want to customize, collection layout, row rendering, or individual cell behavior.
