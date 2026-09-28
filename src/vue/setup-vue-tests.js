import { afterEach, expect } from "vite-plus/test";
import { cleanupMountedWrappers } from "./create-mount.js";
import { installDataTestPlugin } from "./data-test-plugin.js";
import { wrapperMatchers } from "./wrapper-matchers.js";

/**
 * Adds the `getByData` and `getAllByData` lookups to Vue Test Utils wrappers
 * and registers the `toExist` and `toHaveAttribute` matchers for them. It also
 * registers an `afterEach` hook that unmounts wrappers from `createMount`,
 * `createDeepMount`, and `mountComposable`.
 *
 * Call once in the project's Vitest setup file.
 */
export function setupVueTests() {
	installDataTestPlugin();
	expect.extend(wrapperMatchers);

	afterEach(() => {
		cleanupMountedWrappers();
	});
}

/**
 * The earlier name for `setupVueTests`, kept so existing setup files keep
 * working until the next major release.
 *
 * @deprecated Use setupVueTests instead.
 */
export function setupVueMounting() {
	setupVueTests();
}
