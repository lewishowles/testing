import { describe, expect, test } from "vite-plus/test";
import { mergeMountOptions, normaliseMountOptions } from "./create-mount-options.js";

describe("normaliseMountOptions", () => {
	describe("with vue reserved keys (props, slots, global, attrs)", () => {
		const reservedKeys = ["props", "slots", "global", "attrs"];

		test("wraps a plain object as props", () => {
			const result = normaliseMountOptions({ label: "hello" }, reservedKeys);

			expect(result).toEqual({ props: { label: "hello" } });
		});

		test("passes through when props key is present", () => {
			const result = normaliseMountOptions({ props: { label: "world" } }, reservedKeys);

			expect(result).toEqual({ props: { label: "world" } });
		});

		test("passes through when slots key is present", () => {
			const result = normaliseMountOptions({ slots: { default: "content" } }, reservedKeys);

			expect(result).toEqual({ slots: { default: "content" } });
		});

		test("passes through when global key is present", () => {
			const result = normaliseMountOptions({ global: { stubs: {} } }, reservedKeys);

			expect(result).toEqual({ global: { stubs: {} } });
		});

		test("passes through when attrs key is present", () => {
			const result = normaliseMountOptions({ attrs: { id: "test" } }, reservedKeys);

			expect(result).toEqual({ attrs: { id: "test" } });
		});
	});

	describe("with playwright reserved keys (props, slots, global)", () => {
		const reservedKeys = ["props", "slots", "global"];

		test("wraps a plain object as props", () => {
			const result = normaliseMountOptions({ label: "hello" }, reservedKeys);

			expect(result).toEqual({ props: { label: "hello" } });
		});

		test("passes through when props key is present", () => {
			const result = normaliseMountOptions({ props: { label: "world" } }, reservedKeys);

			expect(result).toEqual({ props: { label: "world" } });
		});

		test("treats attrs as direct props (not a reserved key)", () => {
			const result = normaliseMountOptions({ attrs: { id: "test" } }, reservedKeys);

			expect(result).toEqual({ props: { attrs: { id: "test" } } });
		});
	});

	test("wraps an empty object as props", () => {
		const result = normaliseMountOptions({}, ["props", "slots", "global"]);

		expect(result).toEqual({ props: {} });
	});
});

describe("mergeMountOptions", () => {
	test("preserves component definitions in global.stubs by reference", () => {
		const SomeStub = { name: "SomeStub", template: "<div />" };

		const defaults = {
			global: {
				stubs: { SomeComponent: SomeStub },
			},
		};

		const result = mergeMountOptions(defaults, { props: { label: "test" } });

		expect(result.global.stubs.SomeComponent).toBe(SomeStub);
	});

	test("preserves component definitions in global.components by reference", () => {
		const SomeComp = { name: "SomeComp", template: "<div />" };

		const defaults = {
			global: {
				components: { SomeComp },
			},
		};

		const result = mergeMountOptions(defaults, { props: { label: "test" } });

		expect(result.global.components.SomeComp).toBe(SomeComp);
	});

	test("preserves refs from multiple sources across stubs and components", () => {
		const StubA = { name: "StubA" };
		const CompB = { name: "CompB" };

		const defaults = {
			global: { stubs: { CompA: StubA } },
		};

		const overrides = {
			global: { components: { CompB } },
		};

		const result = mergeMountOptions(defaults, overrides);

		expect(result.global.stubs.CompA).toBe(StubA);
		expect(result.global.components.CompB).toBe(CompB);
	});

	test("later source overrides earlier by key", () => {
		const StubA = { name: "StubA" };
		const StubB = { name: "StubB" };

		const defaults = {
			global: { stubs: { Shared: StubA } },
		};

		const overrides = {
			global: { stubs: { Shared: StubB } },
		};

		const result = mergeMountOptions(defaults, overrides);

		expect(result.global.stubs.Shared).toBe(StubB);
	});

	test("deep-merges non-identity global options", () => {
		const result = mergeMountOptions(
			{ global: { provide: { a: 1 } } },
			{ global: { provide: { b: 2 } } },
		);

		expect(result.global.provide).toEqual({ a: 1, b: 2 });
	});

	test("returns empty object when given no sources", () => {
		const result = mergeMountOptions();

		expect(result).toEqual({});
	});
});
