import { afterEach } from "vite-plus/test";
import { cleanupMountedWrappers } from "./create-mount.js";

/**
 * Registers an `afterEach` hook that unmounts wrappers created by
 * `createMount` and `createDeepMount`.
 *
 * Call once at the top of a setup file or test suite.
 */
export function setupVueMounting() {
	afterEach(() => {
		cleanupMountedWrappers();
	});
}
