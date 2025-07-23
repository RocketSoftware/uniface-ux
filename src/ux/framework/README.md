# UX Widget Framework

## Overview

The **UX Widget Framework** provides reusable functional building blocks, called Workers. Workers allow widget developers to construct widget JS classes in a consistent and productive way. The UX Widget Framework takes care of the lifecycle methods of the UX Interface, allowing developers to focus on functionality.

Each widget has a unique DOM structure. Accompanied by CSS and events this makes up the look and feel of the widget; the UX or User experience. Simple widgets may have a structure consisting of a single HTML element and a single event, whereas complex (entity) widgets typically contain a large complex structure of nested HTML elements with many events, but the concept is the same.

By using the UX Widget Framework, the DOM structure is defined using Workers. There are Element Workers, Attribute Workers, and Trigger Workers. By nesting Workers into a structure, these Workers are organized hierarchically to build the widget’s structure logically. Each Worker can be configured through parameters that control its behavior, including how it binds to Uniface properties, handles field values, manages errors, and responds to (web)triggers.

Uniface takes care of occurrence repetition, so there is no need for entity widgets to provide that functionality. Implementing the collection and occurrence widget JS class is sufficient.

The UX Widget Framework comes with an extensive library of pre-built Workers, each defined as a JS Class in their own JS file, and provide functionality such as:

- Element creation
- Element attribute manipulation including **hidden**, **disabled**, and **readonly**
- Field value binding including value-changed handling
- Validation and Format Error visualization
- UI Blocking to avoid race conditions – see doc on scope-endscope
- Tracing
- UI state control
- Reuse of JS widget classes as sub-widgets
- Shadow DOM creation and manipulation (used for 3rd party Web Components or Custom HTML Elements)
For the full set of UX Workers, please see the [**`workers`**](./workers/) folder.

For full UX widget interface specifications, refer to the official Uniface documentation:  
 [Uniface UX Widget Interface – APIs: DSP UX Widget Class](https://docs.rocketsoftware.com/bundle/uniface_104/page/evh1701459402966.html)


## Folder Structure

**[`base.js`](./common/base.js)**  
  Defines the foundational logic of the UX Widget Framework and is shared by all UX widgets and workers.
 
**[`widget.js`](./common/widget.js)**  
  Defines the widget base class and is shared by all UX widgets. It implements all UX Interface life cycle methods and acts as the glue between Uniface and the workers.
 
[**`workers`**](./workers/)
The **workers** directory contains JavaScript files that define specific Worker classes. For example, Element, ElementError, SubWidget, each responsible for handling specific widget behavior.


## UX Interface to Workers mapping

To participate in specific UX Interface lifecycle methods, a Worker can implement the Worker API, which is provided by the Worker base class. As part of their execution, Workers also construct an internal representation that stores relevant information. This context allows them to access info during different stages of the UX Interface lifecycle. The table below outlines which Worker methods correspond to each UX lifecycle method and how they are used to execute the required functionality at the appropriate stage.

| **UX Interface method** | **Description**
| ----------------------- | --------------------------- |
| **Widget load**         | During widget load, the static widget definition gets extended with information taken from the static structure(the pre-defined configuration of the widget that does not change at runtime). This includes:<br> - `defaultValues` – Used to reset widget for reuse<br> - `setters` – Used to map property updates to workers<br> - `getters` – Used to map a value change to Uniface<br> - `triggers` – Used to map triggers to events<br> - `uiBlocking` – Used to map UI-blocking to workers<br> - `subWidgets` – Used to manage sub-widgets statically defined<br> - `subWidgetWorkers` – Used to manage sub-widgets dynamically added |
| `processLayout()`       | Creates the widget’s static DOM structure and applies query attributes for both widget and its sub-widgets.|
| `onConnect()`           | Connects both the widget instance and any sub-widget instances to their respective DOM elements.<br>Returns value update event handlers to Uniface.|
| `mapTrigger()`          | Maps Uniface (web) triggers to (sub)widget events.|
| `dataInit()`            | Initializes the widget’s default data and prepares sub-widgets.|
| `dataUpdate()`          | Applies property updates to both the widget and sub-widgets.|
| `dataCleanup()`         | Cleans up widget state and resets properties to their default value.|
| `getValue()`            | Returns the current value using the registered getter.|
| `validate()`            | Performs widget-level validation.|
| `showError()`           | Parses and shows error messages, including sub-widget mapping.|
| `hideError()`           | Clears all active errors from the widget and sub-widgets.|
| `blockUI()`             | Disables user interaction across the widget and sub-widgets.|
| `unblockUI()`           | Re-enables user interaction.|


## Sub-Widget Composition
Widgets can include sub-widgets to enable reuse of existing widget functionality. Sub-widgets make it possible to:

- Reuse of existing widgets within other widgets
- Automatic delegation of properties to sub-widgets.
- Automatic delegation of triggers of sub-widgets.

Sub-widgets are standard JavaScript widget classes, but unlike top-level widgets, they are not directly bound to a Uniface data object. Instead, they are plugged into a parent widget, making their functionality available in a modular and reusable way. Sub-widgets can be defined statically or dynamically

* `Static` sub-widgets are defined as part of the static widget structure of the parent widget. There are several workers that provide the definition of a static sub-widget. They are resolved during the loading (parsing) of the static widget class. All objects using this widget will get the same set of sub-widgets.

* `Dynamic` sub-widgets are defined from object definitions (properties and/or the component structure). There are several workers available that read object definitions in a specific way and create sub-widgets accordingly. This happens as part the `processLayout()` and `onConnect()` lifecycle methods. Every objects has its own set of sub-widgets as defined in their object definition.

Both static and dynamic sub-widgets feed the sub-widget definition of the widget instance. After the `onConnect()` method, both static and dynamic sub-widgets are treated by the UX Widget Framework in the same way.

To make use of implicit property and trigger delegation, properties and trigger names need to be prefixed by the sub-widget ID. For static sub-widgets, the sub-widget ID is defined as part of the worker that defines the sub-widget. For dynamic sub-widgets, the sub-widget ID is provided by the object definition. It is the Worker that creates the sub-widgets that controls this and typically varies. Check out the Worker’s documentation.

- Property names of sub-widgets need to be of the following syntax: subWidgetId:propName
- Trigger names of sub-widgets need to be of the following syntax: trigger subWidgetId_propName

Sub-widget IDs need to be unique within the context of its parent widget.

## Formatted Value Support

Often, widgets are accessed by other widgets to provide a limited service to that widget, for example formatted, text-based representation of the value or a simplified single-click-actionable variation to be used as menu item.

- `getValueFormatted(properties)` returns a normalized object with value and optional errorMessage.

## Tracing & Debugging Utilities

- Controlled via the static `Widget.tracing` object.
- `log()` and `staticLog()` provide conditional trace output for debugging.

## UI State Control

- `blockUI()` and `unblockUI()` propagate interaction locks to all sub-widgets.


## Extending the UX Widget Framework

The UX Widget Framework is maintained by Rocket Uniface, but can be extended and/or modified. We do not advise  directly changing the provided source files. Instead, create your own widget base class by extended the Uniface one. This will make upgrading to newer versions easier.


## Extending Workers

Uniface provides a library of pre-built Worker classes. These Worker classes are maintained by Uniface but can be extended and/or modified. It is not advised to directly change the sources as provide by Uniface. Instead, create your own worker classes by extended the base Worker class or any other Worker class. This allows upgrading to newer versions in the future easier.
