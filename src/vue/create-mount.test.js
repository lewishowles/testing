import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { cleanupMountedWrappers, createDeepMount, createMount } from "./create-mount.js";

// A minimal component with one prop and one child component slot, used to
// verify mounting, prop passing, and stub behaviour.
const TestComponent = defineComponent({
	props: {
		label: {
			type: String,
			default: "",
		},
	},
	render() {
		return h("div", { class: "test-component" }, [
			h("span", this.label),
			h("router-link", { to: "/" }, "link"),
		]);
	},
});

// A child component used to confirm that createDeepMount renders children
// rather than stubbing them.
const ChildComponent = defineComponent({
	render() {
		return h("span", { class: "child" }, "child");
	},
});

// A parent that renders a ChildComponent, used to compare shallow vs deep mounting.
const ParentComponent = defineComponent({
	components: { ChildComponent },
	render() {
		return h("div", h(ChildComponent));
	},
});

describe("createMount", () => {
	afterEach(() => {
		cleanupMountedWrappers();
	});

	test("returns a mount function", () => {
		const mount = createMount(TestComponent);

		expect(typeof mount).toBe("function");
	});

	describe("direct props shorthand", () => {
		test("treats a plain object as props", () => {
			const mount = createMount(TestComponent);
			const wrapper = mount({ label: "hello" });

			expect(wrapper.props("label")).toBe("hello");
		});

		test("passes through options when props key is present", () => {
			const mount = createMount(TestComponent);
			const wrapper = mount({ props: { label: "world" } });

			expect(wrapper.props("label")).toBe("world");
		});

		test("passes through options when slots key is present", () => {
			const mount = createMount(TestComponent);

			expect(() => mount({ slots: { default: "slot content" } })).not.toThrow();
		});
	});

	describe("default options", () => {
		test("merges default props with per-call props", () => {
			const mount = createMount(TestComponent, { props: { label: "default" } });
			const wrapper = mount({ label: "override" });

			expect(wrapper.props("label")).toBe("override");
		});

		test("applies default props when no per-call options are provided", () => {
			const mount = createMount(TestComponent, { props: { label: "default" } });
			const wrapper = mount();

			expect(wrapper.props("label")).toBe("default");
		});
	});

	describe("shallow mounting", () => {
		test("stubs child components by default", () => {
			const mount = createMount(ParentComponent);
			const wrapper = mount();

			expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
			expect(wrapper.find(".child").exists()).toBe(false);
		});
	});
});

describe("createDeepMount", () => {
	afterEach(() => {
		cleanupMountedWrappers();
	});

	test("renders child components in full", () => {
		const mount = createDeepMount(ParentComponent);
		const wrapper = mount();

		expect(wrapper.find(".child").exists()).toBe(true);
	});

	test("supports direct props shorthand", () => {
		const mount = createDeepMount(TestComponent);
		const wrapper = mount({ label: "deep" });

		expect(wrapper.props("label")).toBe("deep");
	});
});

describe("cleanupMountedWrappers", () => {
	test("unmounts all tracked wrappers", () => {
		const mount = createMount(TestComponent);
		const wrapper = mount();
		const unmount = vi.spyOn(wrapper, "unmount");

		cleanupMountedWrappers();

		expect(unmount).toHaveBeenCalledOnce();
	});

	test("clears the tracking list so a second call does nothing", () => {
		const mount = createMount(TestComponent);
		const wrapper = mount();
		const unmount = vi.spyOn(wrapper, "unmount");

		cleanupMountedWrappers();
		cleanupMountedWrappers();

		expect(unmount).toHaveBeenCalledOnce();
	});

	test("does not throw when a wrapper has already been unmounted", () => {
		const mount = createMount(TestComponent);
		const wrapper = mount();

		wrapper.unmount();

		expect(() => cleanupMountedWrappers()).not.toThrow();
	});
});
