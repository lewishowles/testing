# `@lewishowles/testing/vue`

Component mounting utilities for Vitest + `@vue/test-utils`.

## Requirements

- `@vue/test-utils`
- `pinia`
- `@pinia/colada`

## Exports

### `createMount(component, defaultOptions?)`

Returns a mount function for a single component. Every call deep-merges your per-test options on top of `defaultOptions`, so you set shared props once and override only what changes per test.

Uses `shallowMount` by default, which stubs child components. `RouterLink` is always stubbed via `RouterLinkStub`.

Pass options as a flat object to treat them as props, or use the full `{ props, slots, global, attrs }` shape when you need more control.

```js
import { createMount, cleanupMountedWrappers } from "@lewishowles/testing/vue";

import MyButton from "./my-button.vue";

const mount = createMount(MyButton, { props: { label: "Save" } });

afterEach(cleanupMountedWrappers);

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

### `withAppContext(callback)`

Runs a composable inside a real Vue app with Pinia and Pinia Colada installed, matching the context those composables expect at runtime.

Use this when testing a composable that calls `useQuery`, `useMutation`, or `useStore` outside of a mounted component.

```js
import { useMyStore } from "./my-store.js";
import { withAppContext } from "@lewishowles/testing/vue";

it("initialises with default state", () => {
	const store = withAppContext(() => useMyStore());

	expect(store.items).toEqual([]);
});
```
