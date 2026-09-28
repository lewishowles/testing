import { config, mount } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { installDataTestPlugin } from "./data-test-plugin.js";
import { setupVueTests } from "./setup-vue-tests.js";

// Provides nested and repeated data-test values for wrapper lookup tests.
const TestComponent = defineComponent({
	/**
	 * Renders a form holding an email input and two error messages that share
	 * one data-test value.
	 *
	 * @returns  {import("vue").VNode}
	 *     The section containing the form.
	 */
	render() {
		return h("section", [
			h("form", { "data-test": "profile.form" }, [
				h("input", { "data-test": "profile.email" }),
				h("span", { "data-test": "profile.error" }),
				h("span", { "data-test": "profile.error" }),
			]),
		]);
	},
});

describe("Data-test wrapper lookups", () => {
	setupVueTests();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("finds a descendant from a component wrapper", () => {
		const wrapper = mount(TestComponent);

		expect(wrapper.getByData("profile.form").element).toBe(
			wrapper.find('[data-test="profile.form"]').element,
		);
		wrapper.unmount();
	});

	test("finds a descendant from a found element wrapper", () => {
		const wrapper = mount(TestComponent);
		const form = wrapper.getByData("profile.form");

		expect(form.getByData("profile.email").exists()).toBe(true);
		wrapper.unmount();
	});

	test("returns the Vue Test Utils empty wrapper when no element matches", () => {
		const wrapper = mount(TestComponent);

		expect(wrapper.getByData("profile.missing").exists()).toBe(false);
		wrapper.unmount();
	});

	test("finds every matching descendant from both wrapper types", () => {
		const wrapper = mount(TestComponent);
		const form = wrapper.getByData("profile.form");

		expect(wrapper.getAllByData("profile.error")).toHaveLength(2);
		expect(form.getAllByData("profile.error")).toHaveLength(2);
		expect(form.getAllByData("profile.missing")).toEqual([]);
		wrapper.unmount();
	});

	test("does not reinstall plugins on repeated setup calls", () => {
		const installVue = vi.spyOn(config.plugins.VueWrapper, "install");
		const installDOM = vi.spyOn(config.plugins.DOMWrapper, "install");

		installDataTestPlugin();
		installDataTestPlugin();

		expect(installVue).not.toHaveBeenCalled();
		expect(installDOM).not.toHaveBeenCalled();
	});
});
