import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { mockRoute, mockRouter, resetRouterMocks, setRoute } from "./mock-router.js";

// Mocks vue-router the same way as the partial mock example in docs/vue.md.
vi.mock("vue-router", async (importOriginal) => ({
	...(await importOriginal()),
	...(await import("@lewishowles/testing/vue")).mockRouterModule,
}));

import { createRouter, useRoute, useRouter } from "vue-router";

describe("Partial vue-router mock", () => {
	afterEach(resetRouterMocks);

	test("replaces the composables and keeps other exports real", async () => {
		const originalRouter = await vi.importActual("vue-router");

		setRoute({ name: "home", path: "/home" });

		expect(useRoute()).toBe(mockRoute);
		expect(useRouter()).toBe(mockRouter);
		expect(createRouter).toBe(originalRouter.createRouter);
	});
});
