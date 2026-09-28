# Changelog

## 1.3.0 — 2026-09-28

### Added

- `mountComposable` runs a composable inside a mounted test component, so it can use lifecycle hooks and `inject`.
- `createStubs` creates component stubs that render their slots.
- `setupVueTests` installs `getByData` and `getAllByData` wrapper lookups, and `toExist` and `toHaveAttribute` wrapper matchers.
- `mockGet`, `mockPost`, `mockPut`, `mockPatch`, `mockDelete`, `mockHead`, `mockOptions`, `mockSetAuthToken`, `mockHasAuthToken`, `mockIsLoading`, and `mockIsReady` provide shared API spies. `mockApiModule` combines them for module mocks.
- `mockRouter`, `mockRoute`, `setRoute`, and `mockRouterModule` provide router mocks for component tests.
- `createMount` accepts a list of components to stub.

### Changed

- `mockLocalStorage` now stores values like browser storage while keeping its methods as spies. Missing keys return `null` instead of `undefined`, so tests expecting `undefined` will fail. Stored values last until the next `mockLocalStorage()` call, so call it in `beforeEach` to give each test an empty store.
- The published package no longer includes test files.

### Deprecated

- `setupVueMounting` is now a deprecated alias of `setupVueTests` and will be removed in the next major release.

## 1.2.1 — 2026-08-03

### Fixed

- `chromiumProject` no longer imports Playwright's device registry just to define Chromium, preventing conflicts when consumers resolve multiple Playwright versions.

## 1.2.0 — 2026-07-02

### Added

- `setupVueMounting` in `@lewishowles/testing/vue` — registers Vue wrapper cleanup after each test for suites using `createMount` or `createDeepMount`.
- `setupConsole` in `@lewishowles/testing/vitest` — registers console suppression hooks once and exposes stable spies for assertions.
- `withAppContext` now accepts optional `plugins` and `provides` for composables that need extra Vue app context.

### Documentation

- Added README recipe links, a Vitest API composable mocking recipe, and a Playwright shared config recipe.

## 1.1.2 — 2026-06-29

### Fixed

- `createMount` (both Vue and Playwright) now preserves component definition references in `global.stubs` and `global.components` when merging options. Previously `deepMerge` recursed into those objects, creating copies that broke `findComponent(stubDef)` by object identity.

## 1.1.1 — 2026-06-28

### Fixed

- `deepMerge` no longer flattens class instances (e.g. `Date`, custom classes) and Vue refs passed through `createMount` options. Previously, objects with `constructor === Object` were recursed into, which silently broke refs in `global.provide` and other non-plain-object values.

## 1.1.0 — 2026-06-27

### Added

- Type declarations (`.d.ts`) for all three subpath exports (`./vitest`, `./vue`, `./playwright`), referencing peer dependency types (`vitest`, `@vue/test-utils`, `@playwright/test`, `vue`).
- `types` conditions in `package.json` `exports` field so TypeScript consumers resolve types automatically.

### Changed

- Removed `@lewishowles/helpers` runtime dependency. `deepMerge` is now a local utility in `src/shared/deep-merge.js`, keeping the package zero-dependency.
- Migrated publishing from GitHub Packages to NPM with tokenless trusted publishing (provenance).
- Removed `.npmrc` and GitHub Packages auth from CI workflows.
- Extracted shared direct-props detection into `src/shared/create-mount-options.js`, removing duplication between Vue and Playwright `createMount` implementations.

## 1.0.0 — 2026-06-19

Given the recent migration from Cypress to Playwright, this version re-architects everything from the ground up, providing useful features for Vitest, Vue, and Playwright.

### `@lewishowles/testing/vue`

Utilities for mounting Vue components in Vitest:

- `createMount` — returns a mount function for a single component, using `shallowMount` by default. Pass a plain object and it's treated as props, or use the full `{ props, slots, global, attrs }` shape when you need more control. Default options deep-merge with per-test overrides, so you set shared props once and only override what changes.
- `createDeepMount` — the same idea, but uses full `mount` so child components render in full.
- `cleanupMountedWrappers` — unmounts every wrapper created during the test run. Call it in `afterEach` to prevent things like `@vueuse/core` listeners from accumulating between tests.
- `withAppContext` — runs a composable inside a real Vue app with Pinia and Pinia Colada installed. Useful when you're testing a composable that calls `useQuery` or `useStore` outside of a component.

### `@lewishowles/testing/vitest`

A few helpers that come up in many test suites:

- `mockLocalStorage` — replaces `window.localStorage` with a Vitest mock and returns it so you can assert against it.
- `setupPinia` — registers a `beforeEach` hook that creates a fresh Pinia instance before every test, so store state can't leak between them.
- `mockConsole` — spies on console methods and suppresses their output. The spies are returned so you can assert on them, and they're restored automatically when `vi.restoreAllMocks()` runs.

### `@lewishowles/testing/playwright`

Config presets and a mount helper for Playwright component tests:

- `chromiumProject` — a Desktop Chrome project definition ready to drop into `defineConfig`'s `projects` array.
- `sharedUse` — shared `use` options that set `testIdAttribute` to `data-test`, so `getByTestId` works with your existing `data-test` attributes.
- `loadTestEnv(configDir)` — loads your project's `.env` file for Playwright workers. Pass `dirname(fileURLToPath(import.meta.url))` so the path resolves relative to your project, not this package. Does nothing silently in CI, where environment variables come from the environment directly.
- `snapshotDir(configDir)` — returns the absolute path to a `snapshots/` directory, resolved from your config file's location.
- `createMount` — the Playwright CT counterpart to the Vue `createMount`. Same prop shorthand and deep-merge behaviour; takes Playwright's `mount` fixture as its first argument.
- `slotSvg` — a minimal SVG string for slot tests. Playwright CT's slot API only accepts strings, so this gives you a valid placeholder wherever an icon or image slot is required.

## 0.10.0 - 2025-10-27

### Cypress

Added one new command:

- `getComponent()` - Used to easily retrieve the mounted component in Cypress component testing. e.g. `cy.getComponent().then(component => { ... });`

## 0.9.1 - 2025-10-21

### Cypress

Minor change to the way commands are imported, which should fix error "failed to resolve only because it was resolved as fully specified".

## 0.9.0 - 2025-01-29

### Cypress

Added two new commands:

- `shouldBeChecked()` - Assert that a checkbox (or checkbox contained in the element) is checked.
- `shouldNotBeChecked()` - Assert that a checkbox (or checkbox contained in the element) is not checked.

## 0.8.0 - 2025-01-02

### Cypress

Added one new command:

- `shouldNotExist()` - Assert that an element does not exist on the page.

## 0.7.0 - 2024-11-01

### Cypress

Added two new commands:

- `shouldHaveFocus()` - Assert that an element has focus in the document.
- `shouldNotHaveFocus()` - Assert that an element does not have focus in the document.

## 0.6.0 - 2024-09-02

### Cypress

Added two new commands:

- `fillFormField(selector, value)` - Fill a text-based form field with `data-test` attribute `selector` with `value`.
- `shouldHaveValue(value)` - Assert that a previous form field has `value`.

## 0.5.0 - 2024-08-24

### Cypress

Added three new commands:

- `shouldNotHaveClass(className)` - Assert that an element does not have the given `className`.
- `shouldNotHaveAttribute(attribute, value)` - Assert that an element does not have an `attribute` with a given `value`.
- `shouldNotHaveText(text)` - Assert that the element does not _contain_ the given `text` (including partial matches).

## 0.4.0 - 2024-08-17

### Cypress

Added one new command:

- `shouldHaveClass(className)` - Assert that an element has the given `className`.

## 0.3.0 - 2024-08-15

### Cypress

- `shouldHaveAttribute` can now accept only an attribute, in which case the existence of that attribute is checked.
- `getFormField(selector)` can now be used without a previous element, in which case a provided selector will be used to first select the element, then find a form field within it.

## 0.2.1 - 2024-08-14

### Cypress

Fixed an incorrect command name that would stop `getFormField` from working.

## 0.2.0 - 2024-08-14

### Cypress

Added two new commands:

- `shouldNotBeVisible()` - Assert that an element is not visible.
- `getFormField()` - Get the underlying form field (`input`, `select`, `textarea`) for a previous subject.

## 0.1.0 - 2024-08-13

### Cypress

Added five initial commands:

- `getByData(selector)` - Retrieve an element by its `data-test` attribute.
- `shouldBeVisible()` - Assert that an element is visible.
- `shouldHaveAttribute(attribute, value)` - Assert that an element has an `attribute` with a given `value`.
- `shouldHaveCount(count)` - Assert that there are `count` elements.
- `shouldHaveText(text)` - Assert that the element _contains_ the given `text` (including partial matches).
