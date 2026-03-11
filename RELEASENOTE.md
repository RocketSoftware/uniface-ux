# RELEASE NOTE - Uniface UX

## Release 10.4.03.037

- Uniface release: 10.4.03.037
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

For older releases, see [CHANGELOG.md](CHANGELOG.md)
