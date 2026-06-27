import { describe, expect, test } from "vite-plus/test";
import { normaliseMountOptions } from "./create-mount-options.js";

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
