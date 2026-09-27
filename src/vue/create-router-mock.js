import { vi } from "vite-plus/test";
import { reactive } from "vue";

/**
 * Creates a fresh route with the fields used by app composables and views.
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
 * Creates a route and router for tests that mock `vue-router`. The route keeps
 * its identity when `setRoute` or `reset` changes it, so existing composables
 * see the new values.
 *
 * @returns  {object}
 *     The route, router spies, module exports, and controls for each test.
 *
 * @example
 * const routerMock = await vi.hoisted(async () =>
 *     (await import("@lewishowles/testing/vue")).createRouterMock());
 * vi.mock("vue-router", () => routerMock);
 */
export function createRouterMock() {
	// The route shared by every useRoute call from this mock.
	const route = reactive(defaultRoute());

	// The router, with every method a spy so tests can check navigation calls.
	const router = {
		push: vi.fn(),
		replace: vi.fn(),
		back: vi.fn(),
		resolve: vi.fn((to) => {
			// Vue-router accepts a path string or a location object, so a
			// string becomes an object with that path.
			const location = typeof to === "string" ? { path: to } : to;

			return { ...defaultRoute(), ...location, href: location.path ?? "/" };
		}),
		getRoutes: vi.fn(() => []),
	};

	/**
	 * Reads the current route for code importing `useRoute`.
	 *
	 * @returns  {object}
	 *     The same reactive route on each call.
	 */
	function useRoute() {
		return route;
	}

	/**
	 * Reads the router spies for code importing `useRouter`.
	 *
	 * @returns  {object}
	 *     The same router on each call.
	 */
	function useRouter() {
		return router;
	}

	/**
	 * Sets the current route, returning omitted fields to their defaults.
	 *
	 * @param  {object}  fields
	 *     Route fields to set for the current test.
	 */
	function setRoute(fields) {
		Object.assign(route, defaultRoute(), fields);
	}

	/**
	 * Restores the default route, clears every router spy's calls, and undoes
	 * any spy overrides set by a test.
	 */
	function reset() {
		setRoute({});
		Object.values(router).forEach((spy) => spy.mockReset());
	}

	return { route, router, useRoute, useRouter, setRoute, reset };
}
