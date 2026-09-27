import { computed } from "vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { createRouterMock } from "./create-router-mock.js";

// The module mock follows the documented consumer wiring.
const moduleMock = await vi.hoisted(async () =>
	(await import("@lewishowles/testing/vue")).createRouterMock(),
);

vi.mock("vue-router", () => moduleMock);

import { useRoute, useRouter } from "vue-router";

describe("createRouterMock", () => {
	afterEach(() => moduleMock.reset());

	test("updates route readers and restores omitted fields", () => {
		const mock = createRouterMock();
		const route = mock.useRoute();
		const routeName = computed(() => route.name);

		mock.setRoute({ name: "member", params: { id: "7" }, meta: { title: "Member" } });

		expect(routeName.value).toBe("member");
		expect(route.params).toEqual({ id: "7" });
		expect(route.meta).toEqual({ title: "Member" });

		mock.setRoute({ path: "/about" });

		expect(mock.useRoute()).toBe(route);
		expect(routeName.value).toBeNull();
		expect(route.params).toEqual({});
		expect(route.path).toBe("/about");
		expect(route.matched).toEqual([]);
		expect(route.meta).toEqual({});
	});

	test("provides router spies and a route-like resolve result", () => {
		const { router, useRouter } = createRouterMock();

		router.push("/next");
		router.replace("/other");
		router.back();

		const resolved = router.resolve({ path: "/member", name: "member" });
		const routes = router.getRoutes();

		expect(useRouter()).toBe(router);
		expect(router.push).toHaveBeenCalledWith("/next");
		expect(router.replace).toHaveBeenCalledWith("/other");
		expect(router.back).toHaveBeenCalledOnce();
		expect(router.resolve).toHaveBeenCalledWith({ path: "/member", name: "member" });
		expect(resolved).toMatchObject({ path: "/member", name: "member", href: "/member" });
		expect(router.resolve("/plain").href).toBe("/plain");
		expect(routes).toEqual([]);
		expect(router.getRoutes).toHaveBeenCalledOnce();
	});

	test("reset restores the route and clears all router calls", () => {
		const mock = createRouterMock();

		mock.setRoute({ name: "member", query: { filter: "open" } });
		mock.router.push("/next");
		mock.router.replace("/other");
		mock.router.back();
		mock.router.resolve("/next");
		mock.router.getRoutes();
		mock.reset();

		expect(mock.route).toEqual({
			name: null,
			params: {},
			query: {},
			path: "/",
			matched: [],
			meta: {},
		});

		for (const spy of Object.values(mock.router)) {
			expect(spy).not.toHaveBeenCalled();
		}

		expect(mock.router.resolve("/again").href).toBe("/again");
	});

	test("reset restores the default resolve behaviour after an override", () => {
		const mock = createRouterMock();

		mock.router.resolve.mockReturnValue({ href: "/overridden" });
		mock.reset();

		expect(mock.router.resolve("/x").href).toBe("/x");
	});

	test("mocks the real vue-router module with the package export", () => {
		moduleMock.setRoute({ name: "home", path: "/home" });

		expect(useRoute()).toBe(moduleMock.route);
		expect(useRoute().name).toBe("home");
		expect(useRouter()).toBe(moduleMock.router);
	});
});
