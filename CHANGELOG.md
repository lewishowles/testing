# Changelog

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
