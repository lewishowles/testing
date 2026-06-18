# `@lewishowles/testing` — agent instructions

## Purpose

Shared testing toolkit for Lewis Howles projects. Covers Vitest utilities, Vue/component-test helpers, and Playwright config presets and helpers.

Target consumers: `@lewishowles/components`, `@lewishowles/helpers`, `@lewishowles/boilerplate`, and app projects such as ANPR `gatekeeper-admin`.

## Current state (Phase 1 complete)

Cypress surface fully removed. No exports ship yet — `"files": []` and `"exports": {}` are intentional placeholders. Subpath exports are added as each phase lands.

## Planned exports

| Subpath                           | Phase | Purpose                                                                            |
| --------------------------------- | ----- | ---------------------------------------------------------------------------------- |
| `@lewishowles/testing/vitest`     | 2     | `mockLocalStorage`, `setupPinia`, `mockConsole`, `createRouterMock`                |
| `@lewishowles/testing/vue`        | 3     | `createMount` (unit), `cleanupMountedWrappers`, `withAppContext`, `createApiMock`  |
| `@lewishowles/testing/playwright` | 4     | Shared config presets, `createMount` (CT), route helpers, a11y interaction helpers |
| `@lewishowles/testing/recipes`    | 5     | Agent-facing recipes per component type                                            |

## Stack

- Runtime: none yet (Phase 1 is metadata + removal only)
- Linter: ESLint with `@eslint/js` + `@stylistic/eslint-plugin`
- Planned dev deps at Phase 2: Vitest (for Testing's own tests)
- Planned peer deps at Phase 3: `@vue/test-utils`, `vitest`, `pinia`, `@pinia/colada`
- Planned peer dep at Phase 4: `@playwright/test`

## Key decisions

- No assertion aliases and no `getByData` wrapper — native Playwright style only.
- Both `createMount` variants named `createMount`; unit lives in `/vue`, CT lives in `/playwright`.
- `createApiMock` lives in `/vue` (groups with composable-testing helpers like `withAppContext`).
- Version `1.0.0` = clean break; prior Cypress exports fully removed.

## Gotchas

- `"files": []` means nothing is published yet — correct until Phase 2/3 adds real source files.
- `"exports": {}` is a reserved placeholder; populate entries as subpaths land.
- No `index.js` exists and none is expected until an export surface is added.
- ANPR `gatekeeper-admin` still declares `"@lewishowles/testing": "^0.10.0"` as a dead dep — remove it when Phase 2/3 adoption lands.
- See `PROGRESS.md` for the full roadmap, evidence base, and implementation prompts.
