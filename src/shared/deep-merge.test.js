import { describe, expect, test } from "vite-plus/test";
import { deepMerge } from "./deep-merge.js";

describe("deepMerge", () => {
	test("returns an empty object when given no sources", () => {
		expect(deepMerge()).toEqual({});
	});

	test("merges two flat objects", () => {
		const result = deepMerge({ a: 1 }, { b: 2 });

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("later sources override earlier ones", () => {
		const result = deepMerge({ a: 1 }, { a: 2 });

		expect(result).toEqual({ a: 2 });
	});

	test("deep-merges nested objects", () => {
		const result = deepMerge(
			{ global: { components: { Foo: "foo" } } },
			{ global: { components: { Bar: "bar" } } },
		);

		expect(result).toEqual({ global: { components: { Foo: "foo", Bar: "bar" } } });
	});

	test("nested override replaces leaf values", () => {
		const result = deepMerge({ props: { label: "default" } }, { props: { label: "override" } });

		expect(result).toEqual({ props: { label: "override" } });
	});

	test("arrays replace rather than merge", () => {
		const result = deepMerge({ plugins: [1, 2] }, { plugins: [3] });

		expect(result).toEqual({ plugins: [3] });
	});

	test("skips null and undefined sources", () => {
		const result = deepMerge(null, { a: 1 }, undefined, { b: 2 });

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("does not mutate input objects", () => {
		const a = { props: { label: "default" } };
		const b = { props: { label: "override" } };

		deepMerge(a, b);

		expect(a.props.label).toBe("default");
		expect(b.props.label).toBe("override");
	});

	test("merges three sources left-to-right", () => {
		const result = deepMerge({ props: { a: 1, b: 2 } }, { props: { b: 3 } }, { props: { c: 4 } });

		expect(result).toEqual({ props: { a: 1, b: 3, c: 4 } });
	});
});
