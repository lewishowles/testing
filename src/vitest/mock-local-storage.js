import { vi } from "vite-plus/test";

/**
 * Replaces `window.localStorage` with a Vitest mock, returning the mock object
 * for use in assertions.
 *
 * Call once at the top of a setup file or test suite. Individual mock function
 * calls are reset by `vi.clearAllMocks()` in `beforeEach`.
 */
export function mockLocalStorage() {
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
