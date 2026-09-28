import { vi } from "vite-plus/test";

// Stands in for the API's `get` method, so tests can set responses and check
// GET requests.
export const mockGet = vi.fn();
// Stands in for the API's `post` method, so tests can set responses and check
// POST requests.
export const mockPost = vi.fn();
// Stands in for the API's `put` method, so tests can set responses and check
// PUT requests.
export const mockPut = vi.fn();
// Stands in for the API's `patch` method, so tests can set responses and check
// PATCH requests.
export const mockPatch = vi.fn();
// Stands in for the API's `delete` method, so tests can set responses and check
// DELETE requests.
export const mockDelete = vi.fn();
// Stands in for the API's `head` method, so tests can set responses and check
// HEAD requests.
export const mockHead = vi.fn();
// Stands in for the API's `options` method, so tests can set responses and
// check OPTIONS requests.
export const mockOptions = vi.fn();
// Stands in for the API's `setAuthToken` method, so tests can check the token
// the app sets.
export const mockSetAuthToken = vi.fn();
// Stands in for the API's `hasAuthToken` method, so tests can choose whether a
// token is present.
export const mockHasAuthToken = vi.fn();
// Whether the mocked API reports a request in progress. Tests change `value` to
// simulate loading.
export const mockIsLoading = { value: false };
// Whether the mocked API reports that it is ready. Tests change `value` to
// simulate readiness.
export const mockIsReady = { value: false };

// The members every test starts with, used to build the shared API object and
// to restore it.
const defaultApiMembers = {
	get: mockGet,
	post: mockPost,
	put: mockPut,
	patch: mockPatch,
	delete: mockDelete,
	head: mockHead,
	options: mockOptions,
	setAuthToken: mockSetAuthToken,
	hasAuthToken: mockHasAuthToken,
	isLoading: mockIsLoading,
	isReady: mockIsReady,
};

// The one API object that every call to the mocked composable returns.
const api = { ...defaultApiMembers };

/**
 * Stands in for the app's API composable, returning the same shared API object
 * on every call.
 *
 * @returns  {object}
 *     The shared API object, whose members are the exported spies and state
 *     objects.
 */
function useApi() {
	return api;
}

// The module to return from a project's `vi.mock` factory for its API
// composable.
export const mockApiModule = { default: useApi };

/**
 * Returns the shared API object to its starting state after a test. Each member
 * points back at its exported spy or state object, every spy loses its recorded
 * calls, the responses a test set and queued one-off responses, and the loading
 * and ready values return to false. Added members are removed from the API
 * object. The same shared objects are kept, so references a test holds stay
 * valid. A project's own extra spies remain for the project to clear.
 */
export function resetApiMocks() {
	for (const key of Object.keys(api)) {
		if (!Object.hasOwn(defaultApiMembers, key)) {
			delete api[key];
		}
	}

	Object.assign(api, defaultApiMembers);

	for (const member of Object.values(defaultApiMembers)) {
		if (vi.isMockFunction(member)) {
			member.mockReset();
		}
	}

	mockIsLoading.value = false;
	mockIsReady.value = false;
}
