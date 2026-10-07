# RELEASE NOTE - Uniface UX

## Release 10.4.04.003

- Uniface release: 10.4.04.003
- UX Interface Version: 2

#### New Accordion Widget

Uniface UX now includes a new entity-level widget that organizes occurrence data into a stack of expandable and collapsible sections:

- **uxAccordion** (entity level) —  Each section shows a clickable header and a content panel that holds the child widgets for that occurrence, so users can focus on one group of data at a time and expand only the sections they need.

### Features

- `UX-Widgets`:
  - UX-Widgets can now remove properties directly from the object definition during `processLayout()` using the new `removeProperty()` API, preventing them from being passed to widgets and avoiding unnecessary warnings. This simplifies cleanup of occurrence-specific, unsupported, and slotting-related properties, resulting in a cleaner metadata structure.

For older releases, see [CHANGELOG.md](CHANGELOG.md)
