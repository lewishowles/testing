# `@lewishowles/testing/vitest`

Vitest helpers for browser API mocking, Pinia setup, and console suppression.

## Requirements

- `vitest`
- `pinia`

## Exports

### `mockLocalStorage()`

Replaces `window.localStorage` with a Vitest mock and returns the mock object for assertions.

Call once in a setup file or at the top of a describe block. Individual mock calls reset automatically when `vi.clearAllMocks()` runs (e.g. via `clearMocks: true` in your Vitest config).

```js
import { mockLocalStorage } from "@lewishowles/testing/vitest";

const localStorage = mockLocalStorage();

it("saves the token", () => {
	saveToken("abc123");

	expect(localStorage.setItem).toHaveBeenCalledWith("token", "abc123");
});
```

The returned mock exposes `getItem`, `setItem`, `removeItem`, `clear`, `key`, and `length`.

### `setupPinia()`

Registers a `beforeEach` hook that creates a fresh Pinia instance before every test, preventing store state from leaking between tests.

Call once at the top of a setup file or describe block.

```js
import { setupPinia } from "@lewishowles/testing/vitest";

setupPinia();

it("starts with empty items", () => {
	const store = useMyStore();

	expect(store.items).toEqual([]);
});
```

### `mockConsole(methods?)`

Spies on the given console methods and suppresses their output, returning the spies for assertions.

Uses `vi.spyOn`, so the original implementation is restored automatically when `vi.restoreAllMocks()` runs (e.g. via `restoreMocks: true` in your Vitest config). Call inside `beforeEach` to get a fresh spy per test.

Defaults to `["error"]`.

```js
import { mockConsole } from "@lewishowles/testing/vitest";

let console;

beforeEach(() => {
	console = mockConsole(["warn", "error"]);
});

it("warns on invalid input", () => {
	processInput(null);

	expect(console.warn).toHaveBeenCalled();
});
```
