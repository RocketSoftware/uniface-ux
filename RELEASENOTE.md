# RELEASE NOTE - Uniface UX

## Release 10.4.03.047

- Uniface release: 10.4.03.047
- UX Interface Version: 2

### Features

- `UX-Widgets`:
  - All UX widgets now support dark mode. Widgets automatically respond to the application-level `color-mode` setting, which can be set to `light`, `dark`, or `auto` (follows system color scheme preference), providing a consistent color scheme across the framework.

- `uxHeaderFooter`:
  - A dark theme variation has been added to the existing default theme for seamless integration with dark mode.

### Bug Fixes

- `UX-Widgets`:
  - With the introduction of dark mode support, error-state colors have been standardized across both light and dark mode to ensure consistent contrast compliance and accessible error indication behavior across all widgets and themes.

- `uxCompLayout`, `uxEntLayout`, `uxDataGrid`:
  - Background colors for the `section` appearance and the data grid header have been adjusted to improve visual contrast and readability in dark mode.

For older releases, see [CHANGELOG.md](CHANGELOG.md)
