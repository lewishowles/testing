import { describe, expect, test, vi } from "vite-plus/test";
import { createMount, slotSvg } from "./create-mount.js";

// A minimal component stub — CT createMount only needs the reference, not a
// real Vue component, since mounting is delegated to the mount fixture.
const TestComponent = {};

describe("createMount", () => {
	test("returns a mount function", () => {
		const mount = createMount(TestComponent);

		expect(typeof mount).toBe("function");
	});

	describe("direct props shorthand", () => {
		test("treats a plain object as props", () => {
			const mountFixture = vi.fn();
			const mount = createMount(TestComponent);

			mount(mountFixture, { label: "hello" });

			expect(mountFixture).toHaveBeenCalledWith(
				TestComponent,
				expect.objectContaining({ props: { label: "hello" } }),
			);
		});

		test("passes through options when props key is present", () => {
			const mountFixture = vi.fn();
			const mount = createMount(TestComponent);

			mount(mountFixture, { props: { label: "world" } });

			expect(mountFixture).toHaveBeenCalledWith(
				TestComponent,
				expect.objectContaining({ props: { label: "world" } }),
			);
		});

		test("passes through options when slots key is present", () => {
			const mountFixture = vi.fn();
			const mount = createMount(TestComponent);

			mount(mountFixture, { slots: { default: "content" } });

			expect(mountFixture).toHaveBeenCalledWith(
				TestComponent,
				expect.objectContaining({ slots: { default: "content" } }),
			);
		});
	});

	describe("default options", () => {
		test("applies default props when no per-call options are provided", () => {
			const mountFixture = vi.fn();
			const mount = createMount(TestComponent, { props: { label: "default" } });

			mount(mountFixture);

			expect(mountFixture).toHaveBeenCalledWith(
				TestComponent,
				expect.objectContaining({ props: { label: "default" } }),
			);
		});

		test("merges default props with per-call props", () => {
			const mountFixture = vi.fn();
			const mount = createMount(TestComponent, { props: { label: "default" } });

			mount(mountFixture, { label: "override" });

			expect(mountFixture).toHaveBeenCalledWith(
				TestComponent,
				expect.objectContaining({ props: { label: "override" } }),
			);
		});
	});
});

describe("slotSvg", () => {
	test("is a string", () => {
		expect(typeof slotSvg).toBe("string");
	});

	test("contains an svg element", () => {
		expect(slotSvg).toContain("<svg");
	});
});
