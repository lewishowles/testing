import { afterEach, expect } from "vite-plus/test";
import { cleanupMountedWrappers } from "./create-mount.js";
import { installDataTestPlugin } from "./data-test-plugin.js";
import { wrapperMatchers } from "./wrapper-matchers.js";

/**
 * Adds the `getByData` and `getAllByData` lookups to Vue Test Utils wrappers
 * and registers the `toExist` and `toHaveAttribute` matchers for them. It also
 * registers an `afterEach` hook that unmounts wrappers from `createMount` and
 * `createDeepMount`.
 *
 * Call once at the top of a setup file or test suite.
 */
export function setupVueMounting() {
	installDataTestPlugin();
	expect.extend(wrapperMatchers);

	afterEach(() => {
		cleanupMountedWrappers();
	});
}
