# RELEASE NOTE - Uniface UX

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

For older releases, see [CHANGELOG.md](CHANGELOG.md)
