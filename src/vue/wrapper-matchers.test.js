import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { setupVueMounting } from "./setup-vue-mounting.js";

/** A component with one data-test input that has a `type` value and an empty `disabled` attribute. */
const TestComponent = defineComponent({
	render() {
		return h("div", [h("input", { "data-test": "profile.email", type: "email", disabled: "" })]);
	},
});

describe("Wrapper matchers", () => {
	setupVueMounting();

	test("checks whether a data-test lookup exists with and without .not", () => {
		const wrapper = mount(TestComponent);

		expect(wrapper.getByData("profile.email")).toExist();
		expect(wrapper.getByData("profile.missing")).not.toExist();
		expect(() => expect(wrapper.getByData("profile.missing")).toExist()).toThrow(
			'[data-test="profile.missing"]',
		);
		expect(() => expect(wrapper.getByData("profile.email")).not.toExist()).toThrow(
			'[data-test="profile.email"]',
		);
		wrapper.unmount();
	});

	test("checks attribute presence and exact values with and without .not", () => {
		const wrapper = mount(TestComponent);
		const email = wrapper.getByData("profile.email");

		expect(email).toHaveAttribute("disabled");
		expect(email).toHaveAttribute("type", "email");
		expect(email).not.toHaveAttribute("readonly");
		expect(email).not.toHaveAttribute("type", "text");
		expect(() => expect(email).toHaveAttribute("type", "text")).toThrow(
			'[data-test="profile.email"]',
		);
		expect(() => expect(email).not.toHaveAttribute("type", "email")).toThrow(
			'[data-test="profile.email"]',
		);
		wrapper.unmount();
	});

	test("rejects attribute checks on a missing element even when negated", () => {
		const wrapper = mount(TestComponent);
		const missing = wrapper.getByData("profile.missing");

		// The failure message, which is the same with and without .not.
		const message =
			'Cannot check attribute "type" because [data-test="profile.missing"] was not found.';

		expect(() => expect(missing).toHaveAttribute("type")).toThrow(message);
		expect(() => expect(missing).not.toHaveAttribute("type")).toThrow(message);
		wrapper.unmount();
	});

	test("uses a generic failure message for wrappers found without getByData", () => {
		const wrapper = mount(TestComponent);

		expect(() => expect(wrapper.find("textarea")).toExist()).toThrow("Expected element to exist");
		expect(() => expect(wrapper.find("input")).toHaveAttribute("type", "text")).toThrow(
			'Expected element to have attribute "type" with value "text"',
		);
		wrapper.unmount();
	});
});
