# `@lewishowles/testing`

Shared testing conventions and utilities for Lewis Howles projects, covering Vitest, Vue/component tests, and Playwright.

## Status

Version 1.0.0 — Cypress surface removed. Vitest, Vue, and Playwright helpers are in progress.

## Planned exports

| Subpath                           | Purpose                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@lewishowles/testing/vitest`     | Browser API mocks, Pinia setup, mount cleanup, API mock factories, console suppression           |
| `@lewishowles/testing/vue`        | `createMount` (unit), `cleanupMountedWrappers`, `withAppContext`, slot helpers                   |
| `@lewishowles/testing/playwright` | Shared config presets, `createMount` (CT), route interceptors, accessibility interaction helpers |
| `@lewishowles/testing/recipes`    | Agent-facing recipes — what/how/what not to test, per component type                             |

No exports ship yet. Subpaths will be added as each phase lands.
