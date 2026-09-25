import { vi } from "vite-plus/test";

/**
 * Replaces `window.localStorage` with a Vitest mock, returning the mock object
 * for use in assertions.
 *
 * Call once at the top of a setup file or test suite. Individual mock function
 * calls are reset by `vi.clearAllMocks()` in `beforeEach`.
 *
 * @returns  {import("./mock-local-storage.d.ts").MockLocalStorage}
 *     The mock localStorage, whose methods are Vitest mock functions.
 */
export function mockLocalStorage() {
	// The stand-in storage, where each method is a Vitest mock function.
	const mock = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		key: vi.fn(),
		length: 0,
	};

	vi.stubGlobal("localStorage", mock);

	return mock;
}
