# `@lewishowles/testing/vue`

Component mounting utilities for Vitest + `@vue/test-utils`.

## Requirements

- `@vue/test-utils`
- `pinia`
- `@pinia/colada`

## Exports

### `setupVueMounting()`

Adds `getByData(name)` and `getAllByData(name)` to Vue Test Utils component and element wrappers, registers `toExist()` and `toHaveAttribute(name, value?)` with Vitest, and registers `afterEach(cleanupMountedWrappers)` for suites that use `createMount` or `createDeepMount`.

Call once in a shared setup file, or at the top of a test suite.

```js
import { setupVueMounting } from "@lewishowles/testing/vue";

setupVueMounting();
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
import { createMount, setupVueMounting } from "@lewishowles/testing/vue";

import MyButton from "./my-button.vue";

const mount = createMount(MyButton, { props: { label: "Save" } });

setupVueMounting();

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

### `createDeepMount(component, defaultOptions?)`

Same as `createMount` but uses `mount` instead of `shallowMount`, rendering child components in full. Use when the test needs to reach into child component output.

```js
const mount = createDeepMount(MyForm);
```

### `cleanupMountedWrappers()`

Unmounts every wrapper created by `createMount` or `createDeepMount` in the current suite, then clears the tracking list.

Call in `afterEach` to prevent things like `@vueuse/core` event listeners from accumulating across tests.

```js
afterEach(cleanupMountedWrappers);
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
