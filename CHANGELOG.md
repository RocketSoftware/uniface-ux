# Change log - Uniface UX

## Release 10.4.03.042

- Uniface release: 10.4.03.042
- UX Interface Version: 2

### Bug Fixes

- `uxTextField` (`uxTimePicker`, `uxDateTimePicker`):
  - A `TypeError` occurred when setting a field value with seconds precision (`HH:MM:SS` format) for `html:type="time"` or `html:type="datetime-local"` fields, resulting in the widget value not being rendered correctly.

## Release 10.4.03.041

- Uniface release: 10.4.03.041
- UX Interface Version: 2

### Features

- `uxTextField`:
  - The `html:type` property now supports `datetime-local` and `time` in addition to the existing types. Two new logical widget mappings have been added: `ux-DateTimePicker` (mapped to `uxTextField(html:type=datetime-local)`) provides a combined date and time picker, and `ux-TimePicker` (mapped to `uxTextField(html:type=time)`) provides a time-only picker.

- `uxCompLayout`:
  - The `appearance` property is added. Controls the visual style of the layout container. Options: `transparent` (no background, border, or shadow), `outline` (border only, no fill), `card` (border, filled background, and drop shadow), `section` (tinted background for grouping, no border), `panel` (border with subtle layered background, no shadow). Default: `transparent`.
  
- `uxEntLayout`:
  - The `appearance` property is added to `CollectionLayout`. Controls the visual style of the collection container. Same options as `uxCompLayout`. Default: `transparent`.
  - The `appearance-occurrences` property is added to `OccurrenceLayout`. Controls the visual style of each occurrence container. Same options as `uxCompLayout`. Default: `transparent`.
  
- `uxTextArea`:
  - The `html:resize` property now explicitly defaults to `auto`. When used outside a `uf-layout`, `auto` behaves the same as `both`. When placed inside a `uf-layout`, the effective resize direction is determined by the layout's stretch alignment: vertical stretch limits resizing to horizontal only, horizontal stretch limits resizing to vertical only, and stretch on both axes disables resizing entirely.

### Bug Fixes

- `uxTextArea`:
  - When placed inside a `uf-layout`, the widget did not stretch to fill the available width or height when `horizontal-align` or `vertical-align` was set to `stretch`. The text area now correctly stretches along each axis according to the stretch alignment configured on the parent layout.
  
## Release 10.4.03.040

- Uniface release: 10.4.03.040
- UX Interface Version: 2

### Bug Fixes

- `uxDataGrid`, `uxLayout`:
  - The blockUI and unblockUI interface APIs applied the uiblocked property to all UX widgets, including those that do not support it, resulting in redundant unsupported-property warnings in the console.
  
## Release 10.4.03.039
 
- Uniface release: 10.4.03.039
- UX Interface Version: 2
 
### Bug Fixes
 
- `uxHeaderFooter`, `uxLayout`:
  - When `horizontal-align` or `vertical-align` was set to `stretch`, child widgets did not expand as expected; grow-capable widgets failed to fill the available space while fixed-size widgets behaved the same.
- `uxLayout`: When a label was positioned above or below the content area and the widget had a fixed height, the content area consumed the full widget height rather than the remaining space after the label. Content was clipped at the bottom of the widget for certain vertical alignments.

## Release 10.4.03.038

- Uniface release: 10.4.03.038
- UX Interface Version: 2

### What's new?:

#### New Layout Widgets

Uniface UX now includes three new layout widgets that streamline the construction of page, component, and entity layouts:

- **uxHeaderFooter** (page level) — Provides a header–main–footer structure with intelligent slot distribution and sticky positioning.
- **uxCompLayout** (component level) — Supports organized component-level layouts with labels and flexible alignment.
- **uxEntLayout** (entity level) — Offers layout options for collections and occurrences with configurable arrangement and alignment.

**Action required:** Run `npm install` after pulling this update to ensure all dependencies are installed.

### Features

- The UX Widget Framework uses the new wrapper function setOccurrenceProperties from the entity object definition to automatically copy all supported occurrence‑level properties from a collection widget to its occurrence widgets.

### Bug Fixes

- `uxHeaderFooter`, `uxLayout`:
  - In nested layouts, alignment was not applied correctly when the `layout-type` property or one of the alignment properties (`horizontal-align` or `vertical-align`) was set to `auto`.

## Release 10.4.03.030

- Uniface release: 10.4.03.030
- UX Interface Version: 2

### Bug Fixes

- uxPlainText: Standardized value formatting across plaintext formats (representation-only, valrep-text, valrep-html) to ensure consistent styling with other widgets.

## Release 10.4.03.029

- Uniface release: 10.4.03.029
- UX Interface Version: 2

### Bug Fixes

- uxSelect: The widget now includes support for the aria-readonly attribute when rendered in read-only mode, enhancing accessibility compliance.

### Currency

- NPM: Development packages have been upgraded to the latest available versions.

## Release 10.4.03.028

- Uniface release: 10.4.03.028
- UX Interface Version: 2

### Bug Fixes

- uxRadioGroup:  If valrep is empty, users can still interact with the radio group and select a placeholder option, which fires the onChange trigger. 

## Release 10.4.03.027

- Uniface release: 10.4.03.027
- UX Interface Version: 2

### Features

- Added `README.md` file for all workers.

## Release 10.4.03.026

- Uniface release: 10.4.03.026
- UX Interface Version: 2

### Features

- Added `README.md` files for all `UX-Widgets`.

## Release 10.4.03.025

- Uniface release: 10.4.03.025
- UX Interface Version: 2

### Bug Fixes

- uxTextArea: When resizing the widget, associated label text does not wrap to fit the new dimensions. This issue occurs only when the label position is set to above or below the widget.
- uxSelect: When the widget was in readonly mode, opening the dropdown to view available options via mouse clicks or the Enter key was not possible.
- uxNumberField: When the widget’s initial state is set to read-only and an initial value is provided, the value does not display, preventing correct rendering of the initial value.

### Currency

- NPM: Development packages have been upgraded to the latest available versions.

## Release 10.4.03.024

- Uniface release: 10.4.03.024
- UX Interface Version: 2

### Bug Fixes

- uxTextField: An exception was triggered when the uxTextField widget was set to read-only mode while it had an active validation error.

## Release 10.4.03.023

- Uniface release: 10.4.03.023
- UX Interface Version: 2

### Bug Fixes

- uxTextArea: Validation errors were not triggered when html:minlength or html:maxlength constraints were violated and focus was removed.
- uxSelect: Assigning a value via ProcScript or JavaScript did not work correctly after an invalid value was previously set.
- uxPlainText: When plaintext-format was set to multi-line, the rendered output did not display each line separately using \<br> tags.
- uxNumberField: The value could still be changed using arrow keys even when the widget was set to readonly.

## Release 10.4.03.022

- Uniface release: 10.4.03.022
- UX Interface Version: 2

### What's new?:

- Initial version: this release contains the source files of Uniface UX as distributed in Uniface 10.4.03.022.

For the current release, see [RELEASENOTE.md](RELEASENOTE.md).
