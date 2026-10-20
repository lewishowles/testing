# `@lewishowles/testing/vitest`

Vitest helpers for browser API mocking, Pinia setup, and console suppression.

## Requirements

- `vitest`
- `pinia`

## Exports

## Recipes

### Mock API composables

Declare `vi.mock(...)` in each test file that needs the API mock, or in a Vitest setup file that runs before every test file. Vitest hoists the call within the file where it appears. A mock declared in an imported helper depends on that helper loading before the code under test; import sorting can change the order and leave the real module in place without an error.

Import shared fakes normally to set responses and check calls. Inside the mock factory, load the module shape with a dynamic `import()`, because Vitest moves `vi.mock(...)` above the file's imports, so the factory cannot use them. For an API composable whose default export returns `get`, `post`, `isLoading`, and `isReady`, `mockApiModule` provides that shape. See [Shared API mocks](vue.md#shared-api-mocks) for its full API and reset behaviour.

```js
import { expect, test, vi } from "vitest";
import { mockGet } from "@lewishowles/testing/vue";
import { loadItems } from "@/items";

vi.mock(
	"@/composables/api/use-api",
	async () => (await import("@lewishowles/testing/vue")).mockApiModule,
);

test("loads items", async () => {
	mockGet.mockResolvedValue({ items: [] });

	await loadItems();

	expect(mockGet).toHaveBeenCalledWith("items");
});
```

For an SDK client with a different shape, keep only its shared fakes in a local helper. Declare the SDK mock in each test file and import those fakes inside the factory:

```js
// test/unit/support/mock-sdk.js
import { vi } from "vitest";

export const mockGet = vi.fn();
```

```js
// sdk.test.js
import { expect, test, vi } from "vitest";
import { mockGet } from "@test/unit/support/mock-sdk";
import { Client } from "@vendor/sdk";

vi.mock("@vendor/sdk", async () => {
	const { mockGet } = await import("@test/unit/support/mock-sdk");

	return {
		Client: class {
			get = mockGet;
		},
	};
});

test("requests items", async () => {
	await new Client().get("items");

	expect(mockGet).toHaveBeenCalledWith("items");
});
```

Reset these fakes in your own `afterEach` hook (for example `mockGet.mockReset()`), or turn on Vitest's `mockReset` option, because `setupVueTests()` resets only the package's shared spies.

When every test file needs the same mock, declare `vi.mock(...)` in the Vitest setup file instead. Keep the fakes in a shared module so tests can import them for responses and assertions.

### `mockLocalStorage()`

Replaces `window.localStorage` with an in-memory store and returns the mock object for assertions. Its methods are Vitest spies.

Call it in `beforeEach` so every test starts with an empty store. `vi.clearAllMocks()` resets spy calls but does not clear stored values.

```js
import { beforeEach, expect, it } from "vitest";
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
