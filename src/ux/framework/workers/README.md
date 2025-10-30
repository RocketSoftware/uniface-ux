# Workers

A worker is a functional service module that performs a specific task, such as fetching data, processing information, handling APIs interactions, monitoring. Instead of consolidating all logic in single huge file, the project is modularized into multiple workers, each handling a single responsibility.

- Workers do not provide end-user features themselves. They are supporting components that run jobs in the background to keep the system up to date and responsive.

- Workers listen to widget changes. For example, a new value typed by a user.

- Workers validate if the new value is correct. For example, check if a number is in range or if a choice is valid.

- Workers log warnings/errors if something invalid happens. For example, wrong data type.

- Workers apply updates to the DOM or element attributes. For example, set disabled, add/remove maxlength, show text/icon.

## How it's Used

- Workers are used whenever widgets need to sync or update data (for example, refresh or update jobs), or run periodic tasks automatically without manual input.

- Each worker is designed with isolated responsibility, which includes:

  - Handling a specific task such as checking minimum/maximum length.
  - Validating boolean data.
  - Enforcing input ranges.

- Widgets delegate tasks to the appropriate worker when a specific job needs to be executed.

- Workers expose `refresh()` methods that re-initialize or update the worker’s state/data. These methods enable the system to maintain up-to-date information without restarting the entire application. For example, if data becomes outdated the system can call a worker’s refresh() to reload the latest values.

## 📑 UX Widget Framework Workers

| Worker Name                                         | Source File                                                    |
| --------------------------------------------------- | -------------------------------------------------------------- |
| [AttributeBooleanValue](#attributebooleanvalue)     | [attribute_boolean_value.js](./attribute_boolean_value.js)     |
| [AttributeBoolean](#attributeboolean)               | [attribute_boolean.js](./attribute_boolean.js)                 |
| [AttributeChoice](#attributechoice)                 | [attribute_choice.js](./attribute_choice.js)                   |
| [AttributeFormattedValue](#attributeformattedvalue) | [attribute_formatted_value.js](./attribute_formatted_value.js) |
| [AttributeLength](#attributelength)                 | [attribute_length.js](./attribute_length.js)                   |
| [AttributeNumber](#attributenumber)                 | [attribute_number.js](./attribute_number.js)                   |
| [AttributeRange](#attributerange)                   | [attribute_range.js](./attribute_range.js)                     |
| [AttributeString](#attributestring)                 | [attribute_string.js](./attribute_string.js)                   |
| [AttributeUIBlocking](#attributeuiblocking)         | [attribute_ui_blocking.js](./attribute_ui_blocking.js)         |
| [Element](#element)                                 | [element.js](./element.js)                                     |
| [ElementIconText](#elementicontext)                 | [element_icon_text.js](./element_icon_text.js)                 |
| [ElementError](#elementerror)                       | [element_error.js](./element_error.js)                         |
| [ElementsValrep](#elementsvalrep)                   | [elements_valrep.js](./elements_valrep.js)                     |
| [EventTrigger](#eventtrigger)                       | [event_trigger.js](./event_trigger.js)                         |
| [PropertyFilter](#propertyfilter)                   | [property_filter.js](./property_filter.js)                     |
| [StyleClassManager](#styleclassmanager)             | [style_class_manager.js](./style_class_manager.js)             |
| [StyleClassToggle](#styleclasstoggle)               | [style_class_toggle.js](./style_class_toggle.js)               |
| [SubWidget](#subwidget)                             | [sub_widget.js](./sub_widget.js)                               |

## Worker Descriptions

### AttributeBooleanValue

AttributeBooleanValue manages boolean HTML attributes tied to an element’s value property. It ensures only valid boolean values are applied and sets format error properties when unexpected or invalid values are encountered.

---

### AttributeBoolean

AttributeBoolean handles and updates boolean-based attribute values on HTML elements. It applies or removes attributes like `readonly`, `hidden`, etc.

---

### AttributeChoice

AttributeChoice manages choice-based HTML attributes by validating and applying only predefined values. It logs warnings for invalid inputs to help maintain data integrity and aid debugging.

---

### AttributeFormattedValue

AttributeFormattedValue renders a widget’s value as rich, formatted HTML using its original widget’s formatting logic, including icons, text, and error indicators.

---

### AttributeLength

AttributeLength manages `minlength` and `maxlength` constraints on HTML elements. It validates input ranges, applies defaults when necessary, and issues warnings for invalid or conflicting configurations.

---

### AttributeNumber

AttributeNumber manages `numeric` attributes. It ensures proper parsing, formatting, and type safety for numbers.

---

### AttributeRange

AttributeRange validates numeric ranges with `min` and `max`. It prevents invalid values and applies constraints to input elements.

---

### AttributeString

AttributeString handles string-based attributes (general purpose). It is used for attributes like `placeholder`, `title`, etc.

---

### AttributeUIBlocking

AttributeUIBlocking controls UI blocking behavior (disabled/readonly states). It adds or removes `u-blocked` class and toggles between different states, such as disabled, read-only.

---

### Element

Element manages the creation and placement of DOM elements within a widget’s structure. It ensures each element is correctly inserted and maintained according to the widget’s hierarchy and configuration rules.

---

### ElementError

ElementError manages the insertion and display of error element within a widget. It slots the error element into the worker's parent element and ensures it follows the widget’s structure, providing clear visual feedback for data-validation issues.

---

### ElementIconText

ElementIconText inserts slotted content, such as icons or inner text, into a widget’s structure. It adds the element as a child, slots it into the worker's parent element, and supports both textual and icon-based enhancements.

---

### ElementsValrep

ElementsValrep dynamically inserts elements into a widget based on a list of values and representations (valrep). It maps values to formatted content such as options or labels, and inserts them into the component’s structure, enabling flexible, data-driven rendering.

---

### EventTrigger

EventTrigger adds a trigger mapping to the widget. It supports mapping of the worker's parent element event to a Uniface trigger and optionally enforces validation. The EventTrigger worker is useful for managing dynamic interactions where widgets respond to specific events.

---

### PropertyFilter

PropertyFilter allows the suppression of a property identified by propertyId, preventing the console from displaying an unknown property warning when the property is received.

---

### StyleClassManager

StyleClassManager dynamically updates the CSS class list of a widget based on its data properties. It listens for properties prefixed with `class:` and toggles the corresponding class on the widget’s DOM element.

---

### StyleClassToggle

StyleClassToggle toggles the desired CSS class on a widget’s DOM element based on the Boolean property. It resets the class attribute depending on the property’s value.

---

### SubWidget

Subwidget creates and manages a static UX widget that is slotted into the parent element of the worker.

