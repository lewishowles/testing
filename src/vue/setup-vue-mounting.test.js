import { describe, expect, test } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { createMount } from "./create-mount.js";
import { setupVueMounting } from "./setup-vue-mounting.js";

// Track component unmounts to verify the registered afterEach hook.
let unmountCount = 0;

// A minimal component with an unmount hook, used to prove wrapper cleanup runs.
const TestComponent = defineComponent({
	/**
	 * Counts unmounts so the test can check that cleanup ran.
	 */
	unmounted() {
		unmountCount += 1;
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

describe("setupVueMounting", () => {
	setupVueMounting();

	test("registers cleanup after each test", () => {
		const mount = createMount(TestComponent);

		mount();
	});

	test("unmounts wrappers created by createMount", () => {
		expect(unmountCount).toBe(1);
	});
});
