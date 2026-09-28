# `@lewishowles/testing/vue`

Component mounting utilities for Vitest + `@vue/test-utils`.

## Requirements

- `@vue/test-utils`
- `pinia`
- `@pinia/colada`

`vue-router` is needed in a test project that uses `createRouterMock`.

## Exports

### `setupVueTests()`

Adds `getByData(name)` and `getAllByData(name)` to Vue Test Utils component and element wrappers, registers `toExist()` and `toHaveAttribute(name, value?)` with Vitest, and registers `afterEach(cleanupMountedWrappers)` for suites that use `createMount`, `createDeepMount`, or `mountComposable`.

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

### `createRouterMock()`

Creates a reactive route and router spies for tests that replace `vue-router`. The route starts with `name: null`, empty `params`, `query`, `matched`, and `meta`, and `path: "/"`. The router has `push`, `replace`, `back`, `resolve`, and `getRoutes` spies. By default, `resolve` returns a route-like object with an `href`, and `getRoutes` returns an empty array.

Create the mock inside `vi.hoisted`, then pass its module exports to `vi.mock` in the test file:

```js
import { expect, vi } from "vite-plus/test";
import { useRoute, useRouter } from "vue-router";

const routerMock = await vi.hoisted(async () =>
	(await import("@lewishowles/testing/vue")).createRouterMock(),
);

vi.mock("vue-router", () => routerMock);

routerMock.setRoute({ name: "member", params: { id: "7" } });

expect(useRoute().params.id).toBe("7");
expect(useRouter()).toBe(routerMock.router);
```

`setRoute` changes the same reactive route object. Fields left out of a call return to their defaults. Call `reset()` in `afterEach` to restore the route, clear all router spy calls, and undo any overrides a test set on the spies.

For a partial mock, keep the real exports and replace only `useRoute` and `useRouter`:

```js
const routerMock = await vi.hoisted(async () =>
	(await import("@lewishowles/testing/vue")).createRouterMock(),
);

vi.mock("vue-router", async (importOriginal) => ({
	...(await importOriginal()),
	useRoute: routerMock.useRoute,
	useRouter: routerMock.useRouter,
}));
```

### `createApiMock(overrides?)`

Creates a mock for an app API composable with one shared API object. It provides spies for `get`, `post`, `put`, `patch`, `delete`, `head`, `options`, `setAuthToken`, and `hasAuthToken`. The `isLoading` and `isReady` members are plain `{ value: false }` objects. Pass `overrides` to replace a member or add an app-specific one.

Create the mock inside `vi.hoisted`, then mock the path your app imports:

```js
import { afterEach, expect, test, vi } from "vite-plus/test";
import useApi from "@/composables/api/use-api";

const apiMock = await vi.hoisted(async () =>
	(await import("@lewishowles/testing/vue")).createApiMock(),
);

vi.mock("@/composables/api/use-api", () => apiMock);

afterEach(() => apiMock.reset());

test("loads the member", async () => {
	apiMock.api.get.mockResolvedValue({ id: "7" });

	expect(await useApi().get("/members/7")).toEqual({ id: "7" });
	expect(apiMock.api.get).toHaveBeenCalledWith("/members/7");
});
```

`reset()` puts the API back as it was created: it removes members added since, restores replaced ones and each spy's implementation, clears call history and one-off queued responses, and returns state values to their starting values. Tests keep the same API and state objects, so references taken before a reset still work.

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
import { expect, vi } from "vite-plus/test";
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
