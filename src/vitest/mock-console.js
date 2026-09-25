import { vi } from "vite-plus/test";

/**
 * Spies on the given console methods and suppresses their output, returning the
 * spies for use in assertions.
 *
 * Uses `vi.spyOn` so the original implementation is restored automatically when
 * `vi.restoreAllMocks()` is called (e.g. via `restoreMocks: true` in vitest
 * config, or explicitly in `afterEach`).
 *
 * Call inside `beforeEach` to get a fresh spy per test.
 *
 * @param  {string[]}  methods
 *     The console methods to suppress. Defaults to `["error"]`.
 *
 * @returns  {Record<string, import("vitest").MockInstance>}
 *     The spies, keyed by console method name.
 */
export function mockConsole(methods = ["error"]) {
	// Collect the spies so tests can assert their calls or restore them.
	const spies = {};

	for (const method of methods) {
		spies[method] = vi.spyOn(console, method).mockImplementation(() => {});
	}

	return spies;
}
