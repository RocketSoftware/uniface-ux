# RELEASE NOTE - Uniface UX

## Release 10.4.03.023
- Uniface release: 10.4.03.023
- UX Interface Version: 2

## Bug Fixes
- uxTextArea: Validation errors were not triggered when html:minlength or html:maxlength constraints were violated and focus was removed.
- uxSelect: Assigning a value via ProcScript or JavaScript did not work correctly after an invalid value was previously set. 
- uxPlainText: When plaintext-format was set to multi-line, the rendered output did not display each line separately using \<br> tags.
- uxNumberField: The value could still be changed using arrow keys even when the widget was set to readonly.


For older releases, see [CHANGELOG.md](CHANGELOG.md)
