# RELEASE NOTE - Uniface UX

## Release 10.4.03.039

- Uniface release: 10.4.03.039
- UX Interface Version: 2

### Bug Fixes

- `uxHeaderFooter`, `uxLayout`:
  - When `horizontal-align` or `vertical-align` was set to `stretch`, child widgets did not expand as expected; grow-capable widgets failed to fill the available space while fixed-size widgets behaved the same.
- `uxLayout`: When a label was positioned above or below the content area and the widget had a fixed height, the content area consumed the full widget height rather than the remaining space after the label. Content was clipped at the bottom of the widget for certain vertical alignments.

For older releases, see [CHANGELOG.md](CHANGELOG.md)
