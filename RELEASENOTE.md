# RELEASE NOTE - Uniface UX

## Release 10.4.03.040

- Uniface release: 10.4.03.040
- UX Interface Version: 2

### Bug Fixes

- `uxDataGrid`, `uxLayout`:
  - The blockUI and unblockUI interface APIs applied the uiblocked property to all UX widgets, including those that do not support it, resulting in redundant unsupported-property warnings in the console.

For older releases, see [CHANGELOG.md](CHANGELOG.md)
