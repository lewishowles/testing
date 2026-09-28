# `@lewishowles/testing/vue`

Component mounting utilities for Vitest + `@vue/test-utils`.

## Requirements

- `@vue/test-utils`
- `pinia`
- `@pinia/colada`

`vue-router` is needed in a test project that uses the shared router mocks.

## Exports

### `setupVueTests()`

Adds `getByData(name)` and `getAllByData(name)` to Vue Test Utils component and element wrappers, registers `toExist()` and `toHaveAttribute(name, value?)` with Vitest, and unmounts tracked wrappers and resets the shared API mocks after each test.

Call it once in your project's Vitest setup file, such as `test/unit/setup.js`. List that file in `test.setupFiles` so Vitest loads it before each test file. `setupVueMounting()` remains available as a deprecated alias.

```js
// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./test/unit/setup.js"],
	},
});
```

```js
// test/unit/setup.js
import { setupVueTests } from "@lewishowles/testing/vue";

setupVueTests();
```

Use the methods to find descendants by their `data-test` value. `getByData` returns a wrapper whose `exists()` returns `false` when nothing matches. `getAllByData` returns an empty array when nothing matches. Both methods also work on an element returned by a lookup.

```js
const form = wrapper.getByData("profile.form");
const email = form.getByData("profile.email");
const errors = form.getAllByData("profile.error");

expect(email.exists()).toBe(true);
expect(errors).toHaveLength(2);
```

Use `toExist()` to check whether a lookup found an element. Use `toHaveAttribute(name)` to check that an existing element has an attribute, or pass a value to check for an exact match. Both matchers support `.not`. An attribute check on a missing element fails even with `.not`; check for absence with `toExist()` instead.

```js
expect(email).toExist();
expect(email).toHaveAttribute("type", "email");
expect(email).not.toHaveAttribute("disabled");
expect(form.getByData("profile.missing")).not.toExist();
```

Failures name the `data-test` value when the wrapper came from `getByData`. Other wrappers get a generic element message.

### `createMount(component, defaultOptions?)`

Returns a mount function for a single component. Every call deep-merges your per-test options on top of `defaultOptions`, so you set shared props once and override only what changes per test.

Uses `shallowMount` by default, which stubs child components. `RouterLink` is always stubbed via `RouterLinkStub`.

Pass options as a flat object to treat them as props, or use the full `{ props, slots, global, attrs }` shape when you need more control.

```js
import { createMount } from "@lewishowles/testing/vue";

import MyButton from "./my-button.vue";

const mount = createMount(MyButton, { props: { label: "Save" } });

it("renders the label", () => {
	// Flat object → treated as props
	const wrapper = mount({ label: "Delete" });

	expect(wrapper.text()).toContain("Delete");
});

it("emits click", async () => {
	const wrapper = mount({ label: "Save" }); // uses default

	await wrapper.trigger("click");

	expect(wrapper.emitted("click")).toBeTruthy();
});
```

### `createStubs(entries)`

Creates named stubs that render slots inside Vue Test Utils style `<kebab-name-stub>` elements. Spread the returned object into `global.stubs` alongside ordinary `true` or `false` entries. A string renders the default slot. Use an array to choose slots and their render order, or an object to declare props as well. Other attributes pass through to the stub element.

```js
import { createMount, createStubs } from "@lewishowles/testing/vue";

const mount = createMount(Page, {
	global: {
		stubs: {
			...createStubs([
				"UiButton",
				{ PageTitle: ["default", "introduction"] },
				{ AlertMessage: { props: ["type"] } },
			]),
			IconClose: true,
		},
	},
});
```

The generated component keeps its name for `findComponent({ name: "PageTitle" })`. Declared props are available through `wrapper.props()` on that stub. Listed slots render directly inside the stub element, without slot props or extra wrappers.

### Shared router mocks

The package exports `mockRoute`, `mockRouter`, `setRoute`, and `mockRouterModule`. The reactive route starts with `name: null`, empty `params`, `query`, `matched`, and `meta`, and `path: "/"`. The router has `push`, `replace`, `back`, `resolve`, and `getRoutes` spies. By default, `resolve` returns a route-like object with an `href`, and `getRoutes` returns an empty array.

Mock `vue-router` once in your project's Vitest setup file, alongside `setupVueTests()`:

```js
import { vi } from "vitest";
import { setupVueTests } from "@lewishowles/testing/vue";

setupVueTests();

vi.mock("vue-router", async () => (await import("@lewishowles/testing/vue")).mockRouterModule);
```

Tests import the shared objects to set the route and check navigation calls:

```js
import { expect, test } from "vitest";
import { mockRoute, mockRouter, setRoute } from "@lewishowles/testing/vue";

test("navigates from the member route", () => {
	setRoute({ name: "member", params: { id: "7" } });

	expect(mockRoute.params.id).toBe("7");
	expect(mockRouter.push).not.toHaveBeenCalled();
});
```

`setRoute` changes the same route object and restores defaults for omitted fields. After each test, `setupVueTests()` clears router spy calls and overrides, drops queued one-off responses, and restores the default route. The route, router, and spies keep their identities.

If your code also imports other `vue-router` exports, such as `createRouter`, use this partial mock in the setup file instead of the full mock above. It keeps the real exports and replaces only `useRoute` and `useRouter`:

```js
vi.mock("vue-router", async (importOriginal) => ({
	...(await importOriginal()),
	...(await import("@lewishowles/testing/vue")).mockRouterModule,
}));
```

### Shared API mocks

The package exports `mockGet`, `mockPost`, `mockPut`, `mockPatch`, `mockDelete`, `mockHead`, `mockOptions`, `mockSetAuthToken`, and `mockHasAuthToken` as shared spies. `mockIsLoading` and `mockIsReady` are plain `{ value: false }` objects. `mockApiModule.default()` returns one API object holding exactly those members.

Mock your app's API composable once in its Vitest setup file, alongside `setupVueTests()`:

```js
// test/unit/setup.js
import { vi } from "vitest";
import { setupVueTests } from "@lewishowles/testing/vue";

vi.mock(
	"@/composables/api/use-api",
	async () => (await import("@lewishowles/testing/vue")).mockApiModule,
);

setupVueTests();
```

Tests import the spies by name. After each test, `setupVueTests()` clears every shared spy's calls and the responses a test set, including queued one-off responses, and sets `mockIsLoading` and `mockIsReady` back to `false`. It also puts back any shared member a test replaced and removes any member a test added. The spies and state objects stay the same, so references a test holds stay valid. To change what a method returns, set it on the spy (for example `mockGet.mockResolvedValue(...)`) rather than replacing the method on the API object, because a project that adds extra methods returns its own copy of that object, and that copy isn't restored.

```js
import { expect, test } from "vitest";
import { mockGet } from "@lewishowles/testing/vue";
import useApi from "@/composables/api/use-api";

test("loads the member", async () => {
	mockGet.mockResolvedValue({ id: "7" });

	expect(await useApi().get("/members/7")).toEqual({ id: "7" });
	expect(mockGet).toHaveBeenCalledWith("/members/7");
});
```

If your app's composable has extra methods, spread `mockApiModule` in your setup file and add them to its default export. Clear your extra spies in your own `afterEach` hook; `setupVueTests()` resets only the shared members.

```js
// test/unit/setup.js
import { afterEach, vi } from "vitest";
import { setupVueTests } from "@lewishowles/testing/vue";

const mockUpload = vi.hoisted(() => vi.fn());

vi.mock("@/composables/api/use-api", async () => {
	const { mockApiModule } = await import("@lewishowles/testing/vue");
	const api = { ...mockApiModule.default(), upload: mockUpload };

	return {
		...mockApiModule,
		default: () => api,
	};
});

setupVueTests();
afterEach(() => mockUpload.mockReset());
```

A test can call the extra method through `useApi().upload`. To inspect its calls directly, export `mockUpload` from a shared module and import it in both the setup file and the test.

For one test that calls the real module directly, use `const { default: useRealApi } = await vi.importActual("@/composables/api/use-api")` inside that test. Ordinary imports in the same file still use the shared mock.

For an entire test file that needs the real module, place `vi.unmock(path)` at the top of that file before importing it:

```js
import { vi } from "vitest";

vi.unmock("@/composables/api/use-api");

import useApi from "@/composables/api/use-api";
```

### `createDeepMount(component, defaultOptions?)`

Same as `createMount` but uses `mount` instead of `shallowMount`, rendering child components in full. Use when the test needs to reach into child component output.

```js
const mount = createDeepMount(MyForm);
```

### `cleanupMountedWrappers()`

Unmounts every wrapper created by `createMount`, `createDeepMount`, or `mountComposable` in the current suite, then clears the tracking list.

Call in `afterEach` to prevent things like `@vueuse/core` event listeners from accumulating across tests.

```js
afterEach(cleanupMountedWrappers);
```

### `mountComposable(fn, options?)`

Returns `{ result, wrapper }`: the composable's return value and the mounted wrapper. The composable runs inside a fully mounted component, so lifecycle hooks and `inject` work as they do in a component. It is called without arguments. You can unmount the wrapper yourself or leave it to `cleanupMountedWrappers`.

Options pass directly to Vue Test Utils `mount`. Use `global.provide` for injected values; `slots` and `attrs` are available through `useSlots` and `useAttrs`. The component declares no props, so values in `props` appear in its attrs. No plugins are installed by default.

```js
import { expect, vi } from "vitest";
import { inject, onMounted } from "vue";
import { mountComposable } from "@lewishowles/testing/vue";

it("reads the provided value after mounting", () => {
	const mounted = vi.fn();
	const { result, wrapper } = mountComposable(
		() => {
			const message = inject("message");
			onMounted(mounted);

			return message;
		},
		{ global: { provide: { message: "Hello" } } },
	);

	expect(result).toBe("Hello");
	expect(mounted).toHaveBeenCalledOnce();
	expect(wrapper.exists()).toBe(true);
});
```

### `withAppContext(callback, options?)`

Runs a composable inside a real Vue app with Pinia and Pinia Colada installed, matching the context those composables expect at runtime.

Use this when testing a composable that calls `useQuery`, `useMutation`, or `useStore` outside of a mounted component.

Pass `plugins` or `provides` when the composable needs extra app context.

```js
import { useMyStore } from "./my-store.js";
import { withAppContext } from "@lewishowles/testing/vue";

it("initialises with default state", () => {
	const store = withAppContext(() => useMyStore());

	expect(store.items).toEqual([]);
});

it("reads injected config", () => {
	const config = withAppContext(() => inject("config"), {
		provides: {
			config: { apiBase: "/api" },
		},
	});

	expect(config.apiBase).toBe("/api");
});
```
