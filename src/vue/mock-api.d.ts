import type { Mock } from "vitest";

// Stands in for the API's `get` method, so tests can set responses and check
// GET requests.
export declare const mockGet: Mock;
// Stands in for the API's `post` method, so tests can set responses and check
// POST requests.
export declare const mockPost: Mock;
// Stands in for the API's `put` method, so tests can set responses and check
// PUT requests.
export declare const mockPut: Mock;
// Stands in for the API's `patch` method, so tests can set responses and check
// PATCH requests.
export declare const mockPatch: Mock;
// Stands in for the API's `delete` method, so tests can set responses and check
// DELETE requests.
export declare const mockDelete: Mock;
// Stands in for the API's `head` method, so tests can set responses and check
// HEAD requests.
export declare const mockHead: Mock;
// Stands in for the API's `options` method, so tests can set responses and
// check OPTIONS requests.
export declare const mockOptions: Mock;
// Stands in for the API's `setAuthToken` method, so tests can check the token
// the app sets.
export declare const mockSetAuthToken: Mock;
// Stands in for the API's `hasAuthToken` method, so tests can choose whether a
// token is present.
export declare const mockHasAuthToken: Mock;
// Whether the mocked API reports a request in progress. Tests change `value` to
// simulate loading.
export declare const mockIsLoading: { value: boolean };
// Whether the mocked API reports that it is ready. Tests change `value` to
// simulate readiness.
export declare const mockIsReady: { value: boolean };

/**
 * The shared API object returned by the mocked composable.
 */
export interface MockApi {
	/**
	 * Handles GET requests.
	 */
	get: typeof mockGet;
	/**
	 * Handles POST requests.
	 */
	post: typeof mockPost;
	/**
	 * Handles PUT requests.
	 */
	put: typeof mockPut;
	/**
	 * Handles PATCH requests.
	 */
	patch: typeof mockPatch;
	/**
	 * Handles DELETE requests.
	 */
	delete: typeof mockDelete;
	/**
	 * Handles HEAD requests.
	 */
	head: typeof mockHead;
	/**
	 * Handles OPTIONS requests.
	 */
	options: typeof mockOptions;
	/**
	 * Changes the authentication token.
	 */
	setAuthToken: typeof mockSetAuthToken;
	/**
	 * Checks whether an authentication token is present.
	 */
	hasAuthToken: typeof mockHasAuthToken;
	/**
	 * Indicates whether a request is in progress.
	 */
	isLoading: typeof mockIsLoading;
	/**
	 * Indicates whether the API is ready.
	 */
	isReady: typeof mockIsReady;
}

// The module to return from a project's `vi.mock` factory for its API
// composable.
export declare const mockApiModule: { default: () => MockApi };
