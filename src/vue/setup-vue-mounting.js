import { afterEach, expect } from "vite-plus/test";
import { cleanupMountedWrappers } from "./create-mount.js";
import { installDataTestPlugin } from "./data-test-plugin.js";
import { wrapperMatchers } from "./wrapper-matchers.js";

/**
 * Adds data-test lookups to Vue Test Utils wrappers, registers the
 * `toExist()` and `toHaveAttribute()` matchers, and registers an
 * `afterEach` hook that unmounts wrappers created by `createMount` and
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
