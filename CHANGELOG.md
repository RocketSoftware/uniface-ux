# Change log - Uniface UX

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
