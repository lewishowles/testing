import { vi } from "vite-plus/test";
import { reactive } from "vue";

// The route returned by every mocked useRoute call. setRoute and the after-each
// reset change its fields in place, so a route a test or component already
// holds shows the new values.
export const mockRoute = reactive(defaultRoute());

// The router returned by every mocked useRouter call. Each method is a spy.
export const mockRouter = {
	push: vi.fn(),
	replace: vi.fn(),
	back: vi.fn(),
	resolve: vi.fn(resolveRoute),
	getRoutes: vi.fn(() => []),
};

// The exports to return from a project's vue-router module mock.
export const mockRouterModule = {
	useRoute,
	useRouter,
};

/**
 * Sets the current route, returns omitted fields to their defaults, and removes
 * extra fields left by earlier changes. The route keeps its identity so
 * existing route readers see the new values.
 *
 * @param  {object}  fields
 *     The route fields to set for the current test.
 *
 * @example
 * setRoute({ name: "member", params: { id: "7" } });
 */
export function setRoute(fields) {
	const defaults = defaultRoute();

	// Remove fields such as hash that an earlier test set, so they do not carry
	// over into later tests.
	for (const key of Object.keys(mockRoute)) {
		if (!Object.hasOwn(defaults, key)) {
			delete mockRoute[key];
		}
	}

	Object.assign(mockRoute, defaults, fields);
}

/**
 * Restores the default route and router behaviour after a test. The router,
 * route, and spies keep their identities, while calls, overrides, and queued
 * one-off responses are removed.
 */
export function resetRouterMocks() {
	setRoute({});

	for (const spy of Object.values(mockRouter)) {
		spy.mockReset();
	}

	mockRouter.resolve.mockImplementation(resolveRoute);
	mockRouter.getRoutes.mockImplementation(() => []);
}

/**
 * Returns the shared reactive route for code importing `useRoute`.
 *
 * @returns  {object}
 *     The shared route.
 */
function useRoute() {
	return mockRoute;
}

/**
 * Returns the shared router for code importing `useRouter`.
 *
 * @returns  {object}
 *     The router spies.
 */
function useRouter() {
	return mockRouter;
}

/**
 * Creates the route fields that each test starts with.
 *
 * @returns  {object}
 *     The default route values.
 */
function defaultRoute() {
	return {
		name: null,
		params: {},
		query: {},
		path: "/",
		matched: [],
		meta: {},
	};
}

/**
 * Resolves a path or location to a route-like object with an href.
 *
 * @param  {string|object}  to
 *     The location to resolve.
 *
 * @returns  {object}
 *     The resolved route.
 */
function resolveRoute(to) {
	// A string location is a path; an object already has route fields.
	const location = typeof to === "string" ? { path: to } : to;

	return { ...defaultRoute(), ...location, href: location.path ?? "/" };
}
