import { describe, expect, test } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { createMount } from "./create-mount.js";
import { mockGet } from "./mock-api.js";
import { mockRoute, mockRouter, setRoute } from "./mock-router.js";
import { setupVueTests } from "./setup-vue-tests.js";

// Track component unmounts to verify the registered afterEach hook.
let unmountCount = 0;

// A minimal component with an unmount hook, used to prove wrapper cleanup runs.
const TestComponent = defineComponent({
	/**
	 * Counts unmounts so the test can check that cleanup ran, and calls the
	 * shared GET spy so the test can check that the API mocks are reset after
	 * the wrappers are unmounted.
	 */
	unmounted() {
		unmountCount += 1;

		mockGet();
		mockRouter.push("/after-unmount");
		setRoute({ path: "/after-unmount" });
	},
	/**
	 * Renders a component for the cleanup test to mount.
	 *
	 * @returns  {object}
	 *     The rendered test node.
	 */
	render() {
		return h("div", "Mounted");
	},
});

describe("setupVueTests", () => {
	setupVueTests();

	test("registers cleanup after each test", () => {
		const mount = createMount(TestComponent);

		mount();
	});

	test("unmounts wrappers before resetting the shared API and router mocks", () => {
		expect(unmountCount).toBe(1);
		expect(mockGet).not.toHaveBeenCalled();
		expect(mockRouter.push).not.toHaveBeenCalled();
		expect(mockRoute.path).toBe("/");
		expect(mockRouter.resolve("/ready").href).toBe("/ready");
	});
});
