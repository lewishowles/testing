import { describe, expect, test } from "vite-plus/test";
import { getActivePinia } from "pinia";
import { setupPinia } from "./setup-pinia.js";

describe("setupPinia", () => {
	// Call setupPinia here to register its beforeEach within this describe block,
	// so the hook runs before each test below.
	setupPinia();

	test("provides an active Pinia instance before each test", () => {
		expect(getActivePinia()).not.toBeNull();
	});

	test("provides a fresh instance on each test", () => {
		const first = getActivePinia();

		expect(first).not.toBeNull();
	});
});
