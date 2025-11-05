# Change log - Uniface UX

## Release 10.4.03.027

- Uniface release: 10.4.03.027
- UX Interface Version: 2

## Features

- Added `README.md` file for all workers.

## Release 10.4.03.026

- Uniface release: 10.4.03.026
- UX Interface Version: 2

## Features

- Added `README.md` files for all `UX-Widgets`.

## Release 10.4.03.025

- Uniface release: 10.4.03.025
- UX Interface Version: 2

## Bug Fixes

- uxTextArea: When resizing the widget, associated label text does not wrap to fit the new dimensions. This issue occurs only when the label position is set to above or below the widget.
- uxSelect: When the widget was in readonly mode, opening the dropdown to view available options via mouse clicks or the Enter key was not possible.
- uxNumberField: When the widget’s initial state is set to read-only and an initial value is provided, the value does not display, preventing correct rendering of the initial value.

## Currency

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
