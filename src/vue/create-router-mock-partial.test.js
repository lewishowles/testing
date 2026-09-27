import { describe, expect, test, vi } from "vite-plus/test";

// The partial module mock follows the documented consumer wiring.
const routerMock = await vi.hoisted(async () =>
	(await import("@lewishowles/testing/vue")).createRouterMock(),
);

vi.mock("vue-router", async (importOriginal) => ({
	...(await importOriginal()),
	useRoute: routerMock.useRoute,
	useRouter: routerMock.useRouter,
}));

import { createRouter, useRoute, useRouter } from "vue-router";

describe("Partial vue-router mock", () => {
	test("replaces the composables and keeps other exports real", async () => {
		const originalRouter = await vi.importActual("vue-router");

		routerMock.setRoute({ name: "home", path: "/home" });

		expect(useRoute()).toBe(routerMock.route);
		expect(useRouter()).toBe(routerMock.router);
		expect(createRouter).toBe(originalRouter.createRouter);
	});
});
