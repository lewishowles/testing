import type { Mock } from "vitest";

/**
 * The current route that the mocked `useRoute` returns.
 */
export interface MockRoute {
	/**
	 * The route name, or `null` when the test has not set one.
	 */
	name: string | symbol | null;
	/**
	 * The dynamic path segments, such as `{ id: "7" }`.
	 */
	params: Record<string, string | string[]>;
	/**
	 * The query string values.
	 */
	query: Record<string, string | string[] | null>;
	/**
	 * The URL path, which starts as `"/"`.
	 */
	path: string;
	/**
	 * The matched route records, used by breadcrumbs and nested layouts.
	 */
	matched: unknown[];
	/**
	 * The route meta, such as a page title.
	 */
	meta: Record<string, unknown>;
}

/**
 * A resolved location with the link target that callers can read.
 */
export interface MockResolvedRoute extends Omit<MockRoute, "params"> {
	/**
	 * The path segments passed to `resolve`, including numeric values.
	 */
	params: Record<string, string | number | (string | number)[]>;
	/**
	 * The link target, taken from the location's path.
	 */
	href: string;
}

/**
 * Router methods that tests can inspect and control as Vitest spies.
 */
export interface MockRouter {
	/**
	 * Records navigation to a new route.
	 */
	push: Mock;
	/**
	 * Records navigation that replaces the current history entry.
	 */
	replace: Mock;
	/**
	 * Records a step back in history.
	 */
	back: Mock;
	/**
	 * Returns a route-like object whose `href` is the location's path.
	 */
	resolve: Mock<
		(
			to:
				| string
				| (Omit<Partial<MockRoute>, "params"> & {
						params?: Record<string, string | number | (string | number)[]>;
				  }),
		) => MockResolvedRoute
	>;
	/**
	 * Returns an empty list of route records unless a test changes it.
	 */
	getRoutes: Mock<() => unknown[]>;
}

// The reactive route shared by every mocked `useRoute` call.
export declare const mockRoute: MockRoute;

// The router spies shared by every mocked `useRouter` call.
export declare const mockRouter: MockRouter;

// The exports to return from a project's `vue-router` module mock.
export declare const mockRouterModule: {
	useRoute: () => MockRoute;
	useRouter: () => MockRouter;
};

/**
 * Sets the current route, returns omitted fields to their defaults, and removes
 * extra fields left by earlier changes. The route keeps its identity so
 * existing route readers see the new values.
 *
 * @param  fields  The route fields to set for the current test.
 *
 * @example
 * setRoute({ name: "member", params: { id: "7" } });
 */
export declare function setRoute(fields: Partial<MockRoute>): void;
