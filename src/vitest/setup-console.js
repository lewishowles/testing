import { afterEach, beforeEach } from "vite-plus/test";
import { mockConsole } from "./mock-console.js";

/**
 * Registers hooks that suppress the selected console methods during each test
 * and restore them afterwards.
 *
 * The returned object is stable, so tests can keep one reference while the spy
 * instances are refreshed before each test.
 *
 * @param  {string[]}  methods
 *     The console methods to suppress. Defaults to `["error"]`.
 */
export function setupConsole(methods = ["error"]) {
	const spies = {};

	beforeEach(() => {
		Object.assign(spies, mockConsole(methods));
	});

	afterEach(() => {
		for (const spy of Object.values(spies)) {
			spy.mockRestore();
		}
	});

	return spies;
}
