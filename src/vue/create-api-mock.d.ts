import type { Mock } from "vitest";

/**
 * The shared API shape supplied by the mock before any overrides.
 */
export interface MockApi {
	/**
	 * Records GET requests.
	 */
	get: Mock;
	/**
	 * Records POST requests.
	 */
	post: Mock;
	/**
	 * Records PUT requests.
	 */
	put: Mock;
	/**
	 * Records PATCH requests.
	 */
	patch: Mock;
	/**
	 * Records DELETE requests.
	 */
	delete: Mock;
	/**
	 * Records HEAD requests.
	 */
	head: Mock;
	/**
	 * Records OPTIONS requests.
	 */
	options: Mock;
	/**
	 * Records changes to the authentication token.
	 */
	setAuthToken: Mock;
	/**
	 * Records checks for an authentication token.
	 */
	hasAuthToken: Mock;
	/**
	 * Indicates whether an API request is in progress.
	 */
	isLoading: { value: boolean };
	/**
	 * Lets app code check whether the API is ready to use.
	 */
	isReady: { value: boolean };
}

/**
 * Creates a module mock for an app's API composable. The default export returns
 * one shared API object. `reset` puts that object back as it was created and
 * returns state values to their starting values.
 *
 * @param  overrides
 *     API members to replace or add, such as a `get` spy that resolves with
 *     test data, or a method only one app's composable has.
 *
 * @returns  The module exports for `vi.mock`, the shared `api` object, and `reset`.
 */
export declare function createApiMock<T extends Record<string, unknown> = Record<string, never>>(
	overrides?: T,
): {
	default: () => MockApi & T;
	api: MockApi & T;
	reset: () => void;
};
