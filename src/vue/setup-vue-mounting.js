import { afterEach } from "vite-plus/test";
import { cleanupMountedWrappers } from "./create-mount.js";
import { installDataTestPlugin } from "./data-test-plugin.js";

/**
 * Adds data-test lookups to Vue Test Utils wrappers and registers an
 * `afterEach` hook that unmounts wrappers created by `createMount` and
 * `createDeepMount`.
 *
 * Call once at the top of a setup file or test suite.
 */
export function setupVueMounting() {
	installDataTestPlugin();

	afterEach(() => {
		cleanupMountedWrappers();
	});
}
