import { computed } from "vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
	mockRoute,
	mockRouter,
	mockRouterModule,
	resetRouterMocks,
	setRoute,
} from "./mock-router.js";

// The module mock follows the documented setup-file wiring.
vi.mock("vue-router", async () => (await import("@lewishowles/testing/vue")).mockRouterModule);

import { useRoute, useRouter } from "vue-router";

describe("Shared router mocks", () => {
	afterEach(resetRouterMocks);

	test("updates route readers and restores omitted fields", () => {
		const route = mockRouterModule.useRoute();
		const routeName = computed(() => route.name);

		setRoute({ name: "member", params: { id: "7" }, meta: { title: "Member" } });

		expect(routeName.value).toBe("member");
		expect(route.params).toEqual({ id: "7" });
		expect(route.meta).toEqual({ title: "Member" });

		setRoute({ path: "/about" });

		expect(mockRouterModule.useRoute()).toBe(route);
		expect(route).toBe(mockRoute);
		expect(routeName.value).toBeNull();
		expect(route.params).toEqual({});
		expect(route.path).toBe("/about");
		expect(route.matched).toEqual([]);
		expect(route.meta).toEqual({});
	});

	test("removes extra route fields without replacing the route", () => {
		const route = mockRoute;

		setRoute({ hash: "#top" });
		expect(mockRoute.hash).toBe("#top");

		setRoute({ path: "/next" });
		expect(mockRoute).toBe(route);
		expect(mockRoute).not.toHaveProperty("hash");

		mockRoute.hash = "#later";

		resetRouterMocks();

		expect(mockRoute).toBe(route);
		expect(mockRoute).not.toHaveProperty("hash");
		expect(mockRoute.path).toBe("/");
	});

	test("provides shared router spies and a route-like resolve result", () => {
		mockRouter.push("/next");
		mockRouter.replace("/other");
		mockRouter.back();

		const resolved = mockRouter.resolve({ path: "/member", name: "member" });
		const routes = mockRouter.getRoutes();

		expect(mockRouterModule.useRouter()).toBe(mockRouter);
		expect(mockRouter.push).toHaveBeenCalledWith("/next");
		expect(mockRouter.replace).toHaveBeenCalledWith("/other");
		expect(mockRouter.back).toHaveBeenCalledOnce();
		expect(mockRouter.resolve).toHaveBeenCalledWith({ path: "/member", name: "member" });
		expect(resolved).toMatchObject({ path: "/member", name: "member", href: "/member" });
		expect(mockRouter.resolve("/plain").href).toBe("/plain");
		expect(routes).toEqual([]);
		expect(mockRouter.getRoutes).toHaveBeenCalledOnce();
	});

	test("reset restores the route and each router spy without replacing them", () => {
		const route = mockRoute;
		const router = mockRouter;
		const resolve = mockRouter.resolve;

		setRoute({ name: "member", query: { filter: "open" } });
		mockRouter.push.mockReturnValueOnce("queued");
		mockRouter.push("/next");
		mockRouter.push.mockReturnValueOnce("still queued");
		mockRouter.replace("/other");
		mockRouter.back();
		mockRouter.resolve.mockReturnValueOnce({ href: "/overridden" });
		mockRouter.getRoutes.mockReturnValueOnce(["overridden"]);
		resetRouterMocks();

		expect(mockRoute).toBe(route);
		expect(mockRouter).toBe(router);
		expect(mockRouter.resolve).toBe(resolve);
		expect(mockRoute).toEqual({
			name: null,
			params: {},
			query: {},
			path: "/",
			matched: [],
			meta: {},
		});

		for (const spy of Object.values(mockRouter)) {
			expect(spy).not.toHaveBeenCalled();
		}

		expect(mockRouter.push("/again")).toBeUndefined();
		expect(mockRouter.resolve("/again").href).toBe("/again");
		expect(mockRouter.getRoutes()).toEqual([]);
	});

	test("mocks the real vue-router module with the package export", () => {
		setRoute({ name: "home", path: "/home" });

		expect(useRoute()).toBe(mockRoute);
		expect(useRoute().name).toBe("home");
		expect(useRouter()).toBe(mockRouter);
	});
});
