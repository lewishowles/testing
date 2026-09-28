import { describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { createMount } from "./create-mount.js";
import { setupVueMounting } from "./setup-vue-tests.js";

describe("setupVueMounting", () => {
	// Track whether the alias registers wrapper cleanup after each test.
	const unmounted = vi.fn();

	setupVueMounting();

	test("the alias installs lookups and matchers", () => {
		const mount = createMount(
			defineComponent({
				// Records when the mounted component is removed.
				unmounted,
				/**
				 * Renders an element for the alias lookup and matcher checks.
				 *
				 * @returns  {object}
				 *     The rendered test node.
				 */
				render() {
					return h("div", { "data-test": "example", title: "Example" });
				},
			}),
		);

		const wrapper = mount();
		const element = wrapper.getByData("example");

		expect(wrapper.getAllByData("example")).toHaveLength(1);
		expect(element).toExist();
		expect(element).toHaveAttribute("title", "Example");
	});

	test("the alias unmounts wrappers after each test", () => {
		expect(unmounted).toHaveBeenCalledOnce();
	});
});
