import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h, inject, onMounted, onUnmounted, useAttrs, useSlots } from "vue";
import {
	cleanupMountedWrappers,
	createDeepMount,
	createMount,
	mountComposable,
} from "./create-mount.js";

// A minimal component with one prop and one child component slot, used to
// verify mounting, prop passing, and stub behaviour.
const TestComponent = defineComponent({
	props: {
		label: {
			type: String,
			default: "",
		},
	},
	/**
	 * Renders the prop and link used to check mount options.
	 *
	 * @returns  {object}
	 *     The test component's rendered node.
	 */
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
	/**
	 * Renders a child that only a deep mount shows in full.
	 *
	 * @returns  {object}
	 *     The rendered child node.
	 */
	render() {
		return h("span", { class: "child" }, "child");
	},
});

// A parent that lets tests compare shallow and deep mounting of its child.
const ParentComponent = defineComponent({
	components: { ChildComponent },
	/**
	 * Renders the child used to compare mounting modes.
	 *
	 * @returns  {object}
	 *     The rendered parent node.
	 */
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

		test("treats a stubs list as mount options rather than props", () => {
			const mountFunction = vi.fn(() => ({ unmount: vi.fn() }));
			const mount = createMount(ParentComponent, {}, mountFunction);

			mount({ stubs: ["ChildComponent"] });

			const options = mountFunction.mock.calls[0][1];

			expect(options.props).toBeUndefined();
			expect(options.stubs).toBeUndefined();
			expect(options.global.stubs.ChildComponent).toBeTypeOf("object");
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

		test("applies a default stubs list", () => {
			const mount = createDeepMount(ParentComponent, { stubs: ["ChildComponent"] });
			const wrapper = mount();

			expect(wrapper.find("child-component-stub").exists()).toBe(true);
			expect(wrapper.find(".child").exists()).toBe(false);
		});

		test("merges a stubs list with global.stubs", () => {
			const mountFunction = vi.fn(() => ({ unmount: vi.fn() }));
			const mount = createMount(ParentComponent, {}, mountFunction);

			mount({ stubs: ["ChildComponent"], global: { stubs: { IconClose: true } } });

			const options = mountFunction.mock.calls[0][1];

			expect(options.global.stubs.ChildComponent).toBeTypeOf("object");
			expect(options.global.stubs.IconClose).toBe(true);
		});

		test("prefers a direct global stub on a name clash", () => {
			const mountFunction = vi.fn(() => ({ unmount: vi.fn() }));
			const mount = createMount(ParentComponent, {}, mountFunction);

			mount({ stubs: ["ChildComponent"], global: { stubs: { ChildComponent: true } } });

			const options = mountFunction.mock.calls[0][1];

			expect(options.global.stubs.ChildComponent).toBe(true);
		});

		test("lets per-call stubs override default global stubs", () => {
			const mountFunction = vi.fn(() => ({ unmount: vi.fn() }));

			const mount = createMount(
				ParentComponent,
				{ global: { stubs: { ChildComponent: true } } },
				mountFunction,
			);

			mount({ stubs: ["ChildComponent"] });

			const options = mountFunction.mock.calls[0][1];

			expect(options.global.stubs.ChildComponent).toBeTypeOf("object");
		});

		test("preserves stub identity so findComponent matches by reference", () => {
			const MyStub = defineComponent({
				/**
				 * Renders the stub used to check component identity.
				 *
				 * @returns  {object}
				 *     The rendered stub node.
				 */
				render() {
					return h("div", { class: "my-stub" }, "stubbed");
				},
			});

			const mount = createMount(ParentComponent, {
				global: { stubs: { ChildComponent: MyStub } },
			});

			const wrapper = mount();

			expect(wrapper.findComponent(MyStub).exists()).toBe(true);
		});

		test("preserves component identity in global.components so findComponent matches by reference", () => {
			const MyComp = defineComponent({
				/**
				 * Renders the registered component used in the identity check.
				 *
				 * @returns  {object}
				 *     The rendered component node.
				 */
				render() {
					return h("div", { class: "my-comp" });
				},
			});

			// The parent renders MyComp so global.components can resolve it.
			const Parent = defineComponent({
				/**
				 * Renders the registered child for the identity check.
				 *
				 * @returns  {object}
				 *     The rendered parent node.
				 */
				render() {
					return h("div", [h(MyComp)]);
				},
			});

			const mount = createDeepMount(Parent, {
				global: { components: { MyComp } },
			});

			const wrapper = mount();

			expect(wrapper.findComponent(MyComp).exists()).toBe(true);
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

describe("mountComposable", () => {
	afterEach(cleanupMountedWrappers);

	test("returns the composable result and a mounted wrapper", () => {
		const result = { count: 1 };
		const composable = vi.fn(() => result);
		const { result: composableResult, wrapper } = mountComposable(composable);

		expect(composable).toHaveBeenCalledOnce();
		expect(composable).toHaveBeenCalledWith();
		expect(composableResult).toBe(result);
		expect(wrapper.exists()).toBe(true);
	});

	test("runs mount and unmount hooks", () => {
		const mounted = vi.fn();
		const unmounted = vi.fn();

		const { wrapper } = mountComposable(() => {
			// Confirm Vue runs the composable's mount hook.
			onMounted(mounted);
			// Confirm Vue runs the composable's unmount hook.
			onUnmounted(unmounted);
		});

		expect(mounted).toHaveBeenCalledOnce();
		expect(unmounted).not.toHaveBeenCalled();

		wrapper.unmount();

		expect(unmounted).toHaveBeenCalledOnce();
	});

	test("passes global provides, slots, attrs, and props to mount", () => {
		const { result } = mountComposable(
			() => ({
				injected: inject("message"),
				attrs: useAttrs(),
				slot: useSlots().default?.()[0].children,
			}),
			{
				attrs: { title: "from attrs" },
				global: { provide: { message: "from app" } },
				props: { label: "from props" },
				slots: { default: "slot content" },
			},
		);

		expect(result.injected).toBe("from app");
		expect(result.attrs).toMatchObject({ label: "from props", title: "from attrs" });
		expect(result.slot).toBe("slot content");
	});

	test("cleanupMountedWrappers unmounts the composable wrapper", () => {
		const unmounted = vi.fn();

		const { wrapper } = mountComposable(() => {
			// Confirm cleanup runs the composable's unmount hook.
			onUnmounted(unmounted);
		});

		const unmount = vi.spyOn(wrapper, "unmount");

		cleanupMountedWrappers();

		expect(unmount).toHaveBeenCalledOnce();
		expect(unmounted).toHaveBeenCalledOnce();
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
