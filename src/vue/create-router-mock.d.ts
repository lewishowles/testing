import type { Mock } from "vitest";

/**
 * The route fields that tests can replace between assertions.
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
 * A resolved location with the link target that consumers can read.
 */
export interface MockResolvedRoute extends MockRoute {
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

/**
 * Creates a reactive route and router spies for a `vue-router` module mock.
 * `setRoute` restores omitted fields to their defaults. `reset` clears every
 * router spy and undoes any overrides set by a test.
 *
 * @returns  The mock module exports and controls for each test.
 */
export declare function createRouterMock(): {
	route: MockRoute;
	router: MockRouter;
	useRoute: () => MockRoute;
	useRouter: () => MockRouter;
	setRoute: (fields: Partial<MockRoute>) => void;
	reset: () => void;
};
