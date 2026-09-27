import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { cleanupMountedWrappers, createMount } from "./create-mount.js";
import { createStubs } from "./create-stubs.js";

// The child must be a real component for Vue Test Utils to replace it.
const PageTitle = defineComponent({ name: "PageTitle" });
// A default-slot child used to check string entries.
const UiButton = defineComponent({ name: "UiButton" });

// The parent gives each stub slots, props, and an attribute to inspect.
const Parent = defineComponent({
	/**
	 * Renders a page title and a button for the stubs to replace.
	 *
	 * @returns  {object}
	 *     The rendered parent node.
	 */
	render() {
		return h("div", [
			h(
				PageTitle,
				{ level: 2, "data-test": "title" },
				{
					/**
					 * Renders the heading in the default slot.
					 *
					 * @returns  {string}
					 *     The text shown in the heading.
					 */
					default: () => "Heading",
					/**
					 * Renders the introduction in a named slot.
					 *
					 * @returns  {string}
					 *     The text shown in the introduction.
					 */
					introduction: () => "Introduction",
				},
			),
			h(UiButton, null, {
				/**
				 * Renders the button label in the default slot.
				 *
				 * @returns  {string}
				 *     The text shown on the button.
				 */
				default: () => "Save",
			}),
		]);
	},
});

describe("createStubs", () => {
	afterEach(cleanupMountedWrappers);

	test("renders the default slot in a named stub element", () => {
		const wrapper = mount(Parent, { global: { stubs: createStubs(["UiButton"]) } });
		const button = wrapper.findComponent({ name: "UiButton" });

		expect(button.exists()).toBe(true);
		expect(button.element.tagName.toLowerCase()).toBe("ui-button-stub");
		expect(button.text()).toBe("Save");
	});

	test("renders named slots in order without wrapper elements", () => {
		const wrapper = mount(Parent, {
			global: { stubs: createStubs([{ PageTitle: ["introduction", "default"] }]) },
		});

		const title = wrapper.findComponent({ name: "PageTitle" });

		expect(title.element.tagName.toLowerCase()).toBe("page-title-stub");
		expect(title.element.childElementCount).toBe(0);
		expect(title.text()).toBe("IntroductionHeading");
	});

	test("renders listed slots in order and declares props together", () => {
		const wrapper = mount(Parent, {
			global: {
				stubs: createStubs([
					{ PageTitle: { slots: ["introduction", "default"], props: ["level"] } },
				]),
			},
		});

		const title = wrapper.findComponent({ name: "PageTitle" });

		expect(title.text()).toBe("IntroductionHeading");
		expect(title.props()).toEqual({ level: 2 });
	});

	test("declares props and passes other attributes to the stub element", () => {
		const wrapper = mount(Parent, {
			global: { stubs: createStubs([{ PageTitle: { props: ["level"] } }]) },
		});

		const title = wrapper.findComponent({ name: "PageTitle" });

		expect(title.props()).toEqual({ level: 2 });
		expect(title.attributes("data-test")).toBe("title");
		expect(title.text()).toBe("Heading");
	});

	test("merges generated stubs with plain true entries through createMount", () => {
		const mountParent = createMount(Parent, {
			global: { stubs: { ...createStubs(["UiButton"]), PageTitle: true } },
		});

		const wrapper = mountParent();

		expect(wrapper.findComponent({ name: "UiButton" }).text()).toBe("Save");
		expect(wrapper.find("page-title-stub").exists()).toBe(true);
	});

	test.each([
		[null, "index 0"],
		["", "index 0"],
		[{}, "index 0"],
		[{ A: [], B: [] }, "index 0"],
		[{ "": [] }, "index 0"],
		[["PageTitle"], "index 0"],
		[{ PageTitle: "default" }, "PageTitle"],
		[{ PageTitle: { slots: "default" } }, "PageTitle"],
		[{ PageTitle: { slots: null } }, "PageTitle"],
		[{ PageTitle: { props: "level" } }, "PageTitle"],
		[{ PageTitle: { slots: [null] } }, "PageTitle"],
	])("rejects invalid entry %j with its name or position", (entry, message) => {
		expect(() => createStubs([entry])).toThrowError(TypeError);
		expect(() => createStubs([entry])).toThrow(message);
	});
});
