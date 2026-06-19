# `@lewishowles/testing/playwright`

Playwright config presets and a component test mount helper.

## Requirements

- `@playwright/test`

## Exports

### `chromiumProject`

A Playwright project definition targeting Desktop Chrome. Pass it as an entry in the `projects` array of `defineConfig`.

```js
import { defineConfig } from "@playwright/test";
import { chromiumProject } from "@lewishowles/testing/playwright";

export default defineConfig({
	projects: [chromiumProject],
});
```

### `sharedUse`

Shared `use` options for Playwright E2E and component test configs. Spread into the `use` key of `defineConfig`.

Sets `testIdAttribute` to `data-test`, so `page.getByTestId("submit")` matches `data-test="submit"`.

```js
import { defineConfig } from "@playwright/test";
import { sharedUse } from "@lewishowles/testing/playwright";

export default defineConfig({
	use: { ...sharedUse },
});
```

### `loadTestEnv(configDir)`

Loads the project's `.env` file for Playwright workers. Pass `dirname(fileURLToPath(import.meta.url))` so the path resolves relative to the project root rather than this package.

Silently does nothing when `.env` is absent — in CI, environment variables come from the environment directly.

```js
import { dirname } from "node:path";
import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { loadTestEnv } from "@lewishowles/testing/playwright";

loadTestEnv(dirname(fileURLToPath(import.meta.url)));

export default defineConfig({ ... });
```

### `snapshotDir(configDir)`

Returns the absolute path to a `snapshots/` directory, resolved relative to the calling config file. Pass `dirname(fileURLToPath(import.meta.url))`.

```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/experimental-ct-vue";
import { snapshotDir } from "@lewishowles/testing/playwright";

const configDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	snapshotDir: snapshotDir(configDir), // → /your-project/test/snapshots
});
```

### `createMount(component, defaultOptions?)`

Returns a mount function for a single component in a Playwright component test. Per-test options deep-merge on top of `defaultOptions`.

Pass options as a flat object to treat them as props, or use the full `{ props, slots, global }` shape when you need more control.

The returned function takes Playwright's `mount` fixture as its first argument, so call it inside a `test` block where `mount` is available.

```js
import { createMount } from "@lewishowles/testing/playwright";
import { expect, test } from "@playwright/experimental-ct-vue";

import MyButton from "./my-button.vue";

const mountButton = createMount(MyButton, { props: { label: "Save" } });

test("renders the label", async ({ mount }) => {
	// Flat object → treated as props
	const component = await mountButton(mount, { label: "Delete" });

	await expect(component).toContainText("Delete");
});

test("uses default props", async ({ mount }) => {
	const component = await mountButton(mount);

	await expect(component).toContainText("Save");
});
```

### `slotSvg`

A minimal SVG string for use in slot tests. Playwright CT's slot API only accepts strings, not component references, so this provides a valid placeholder where an icon or image slot is required.

```js
import { createMount, slotSvg } from "@lewishowles/testing/playwright";
import { expect, test } from "@playwright/experimental-ct-vue";

import IconButton from "./icon-button.vue";

const mount = createMount(IconButton);

test("renders with an icon slot", async ({ mount: mountFn }) => {
	const component = await mount(mountFn, {
		slots: { icon: slotSvg },
	});

	await expect(component).toBeVisible();
});
```
