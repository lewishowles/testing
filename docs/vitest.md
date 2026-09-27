# `@lewishowles/testing/vitest`

Vitest helpers for browser API mocking, Pinia setup, and console suppression.

## Requirements

- `vitest`
- `pinia`

## Exports

## Recipes

### Mock API composables

Keep API module mocks in your project, close to the module shape they replace. `@lewishowles/testing` provides the general Vitest helpers; the local test helper should own the literal `vi.mock(...)` call and the adapter for your composable, SDK, class, or named exports.

Use `vi.hoisted` for mock handlers referenced by `vi.mock(...)`, then export the handlers so tests can set responses and assert calls.

```js
import { beforeEach, vi } from "vite-plus/test";

const mockGet = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockIsLoading = vi.hoisted(() => ({ value: false }));
const mockIsReady = vi.hoisted(() => ({ value: false }));

vi.mock("@/composables/api/use-api", () => ({
	default: () => ({
		get: mockGet,
		isLoading: mockIsLoading,
		isReady: mockIsReady,
		post: mockPost,
	}),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

export default {
	get: mockGet,
	isLoading: mockIsLoading,
	isReady: mockIsReady,
	post: mockPost,
};
```

Tests can import the local helper and use normal Vitest mock APIs.

```js
import mockApi from "@test/unit/support/mock-api";

test("loads items", async () => {
	mockApi.get.mockResolvedValue({ items: [] });

	await loadItems();

	expect(mockApi.get).toHaveBeenCalledWith("items");
});
```

For SDK clients, keep the SDK-specific shape in the local helper too.

```js
const mockGet = vi.hoisted(() => vi.fn());

vi.mock("@vendor/sdk", () => ({
	Client: class {
		get = mockGet;
	},
}));
```

Do not hide `vi.mock(...)` inside an imported package helper. Vitest needs to see literal mock calls in the test module or its local helper so they can be hoisted before imports.

### `mockLocalStorage()`

Replaces `window.localStorage` with an in-memory store and returns the mock object for assertions. Its methods are Vitest spies.

Call it in `beforeEach` so every test starts with an empty store. `vi.clearAllMocks()` resets spy calls but does not clear stored values.

```js
import { beforeEach, expect, it } from "vite-plus/test";
import { mockLocalStorage } from "@lewishowles/testing/vitest";

let localStorage;

beforeEach(() => {
	localStorage = mockLocalStorage();
});

it("saves the token", () => {
	saveToken("abc123");

	expect(localStorage.setItem).toHaveBeenCalledWith("token", "abc123");
});
```

The returned mock exposes `getItem`, `setItem`, `removeItem`, `clear`, `key`, and a live `length`. Missing keys return `null`, values are stored as strings, and `key(index)` returns `null` outside the stored keys.

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

### `setupConsole(methods?)`

Registers hooks that suppress selected console methods during each test and restore them afterwards.

The returned object stays stable, so it can be declared once and used for assertions in every test. Spy instances are refreshed before each test.

Defaults to `["error"]`.

```js
import { setupConsole } from "@lewishowles/testing/vitest";

const console = setupConsole(["warn", "error"]);

it("warns on invalid input", () => {
	processInput(null);

	expect(console.warn).toHaveBeenCalled();
});
```

### `mockConsole(methods?)`

Spies on the given console methods and suppresses their output, returning the spies for assertions.

Uses `vi.spyOn`, so the original implementation is restored automatically when `vi.restoreAllMocks()` runs (e.g. via `restoreMocks: true` in your Vitest config). Call inside `beforeEach` to get a fresh spy per test, or use `setupConsole()` when you want the hook registration handled for you.

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
