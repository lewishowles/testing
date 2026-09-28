import { vi } from "vite-plus/test";

/**
 * Creates a module mock for an app's API composable. Every call to its default
 * export returns the same API object, so tests can set responses and inspect
 * calls through `api`.
 *
 * @param  {object}  [overrides]
 *     API members to replace or add, such as a `get` spy that resolves with
 *     test data, or a method only one app's composable has.
 *
 * @returns  {object}
 *     The module exports for `vi.mock`, the shared `api` object, and `reset`.
 *
 * @example
 * const apiMock = await vi.hoisted(async () =>
 *     (await import("@lewishowles/testing/vue")).createApiMock());
 * vi.mock("@/composables/api/use-api", () => apiMock);
 */
export function createApiMock(overrides = {}) {
	// The API returned to every caller of the mocked composable.
	const api = {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
		head: vi.fn(),
		options: vi.fn(),
		setAuthToken: vi.fn(),
		hasAuthToken: vi.fn(),
		isLoading: { value: false },
		isReady: { value: false },
		...overrides,
	};

	// The creation-time members restored by reset.
	const initialMembers = { ...api };

	// The starting loading and ready values, which reset writes back into the
	// same state objects so references held by tests stay valid.
	const initialStateValues = {
		isLoading: api.isLoading.value,
		isReady: api.isReady.value,
	};

	// The creation-time spy implementations restored by reset.
	const initialImplementations = new Map(
		Object.values(initialMembers)
			.filter((member) => vi.isMockFunction(member))
			.map((spy) => [spy, spy.getMockImplementation()]),
	);

	/**
	 * Returns the shared API object for code importing the app's composable.
	 *
	 * @returns  {object}
	 *     The same API object on each call.
	 */
	function useApi() {
		return api;
	}

	/**
	 * Puts the API back as it was created. Removes members added since,
	 * restores replaced members, spy implementations, and state values, and
	 * clears spy calls and queued responses. The API and state objects stay the
	 * same, so references tests hold still work.
	 */
	function reset() {
		for (const key of Object.keys(api)) {
			if (!(key in initialMembers)) {
				delete api[key];
			}
		}

		Object.assign(api, initialMembers);

		for (const [spy, implementation] of initialImplementations) {
			spy.mockReset();

			if (implementation) {
				spy.mockImplementation(implementation);
			}
		}

		api.isLoading.value = initialStateValues.isLoading;
		api.isReady.value = initialStateValues.isReady;
	}

	return { default: useApi, api, reset };
}
