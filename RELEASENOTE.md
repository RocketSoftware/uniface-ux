# RELEASE NOTE - Uniface UX

## Release 10.4.03.043

- Uniface release: 10.4.03.043
- UX Interface Version: 2

### Bug Fixes

- `uxTextField` (`uxEmailField`, `uxUrlField`):
  - A `TypeError` was thrown when a value that did not conform to the field type was assigned to an `html:type="email"` or `html:type="url"` field while the widget was in read-only mode, leaving the widget in a non-functional state.

For older releases, see [CHANGELOG.md](CHANGELOG.md)
