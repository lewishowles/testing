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

	test("preserves a Date instance rather than flattening it", () => {
		const date = new Date("2024-01-15");
		const result = deepMerge({ date });

		expect(result.date).toBe(date);
	});

	test("replaces a Date with another Date at the same key", () => {
		const date1 = new Date("2024-01-01");
		const date2 = new Date("2024-06-01");
		const result = deepMerge({ date: date1 }, { date: date2 });

		expect(result.date).toBe(date2);
	});

	test("preserves a class instance rather than flattening it", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMerge({ token });

		expect(result.token).toBe(token);
		expect(result.token).toBeInstanceOf(Token);
	});

	test("replaces rather than merges when source is a class instance and target has a plain object at the same key", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMerge({ config: { a: 1 } }, { config: token });

		expect(result.config).toBe(token);
		expect(result.config).toBeInstanceOf(Token);
	});

	test("preserves a Vue ref rather than recursing into it", () => {
		const mockRef = { __v_isRef: true, value: "reactive-value" };
		const result = deepMerge({ ref: mockRef });

		expect(result.ref).toBe(mockRef);
		expect(result.ref.value).toBe("reactive-value");
	});

	test("replaces a Vue ref at the same key without merging its internals", () => {
		const ref1 = { __v_isRef: true, value: "first" };
		const ref2 = { __v_isRef: true, value: "second" };
		const result = deepMerge({ injected: ref1 }, { injected: ref2 });

		expect(result.injected).toBe(ref2);
		expect(result.injected.value).toBe("second");
	});

	test("createMount shape: global.provide refs survive merging with defaults", () => {
		const countRef = { __v_isRef: true, value: 0 };

		const defaults = {
			global: {
				provide: {
					count: countRef,
				},
			},
		};

		const overrides = {
			props: { label: "override" },
		};

		const result = deepMerge(defaults, overrides);

		expect(result.global.provide.count).toBe(countRef);
		expect(result.global.provide.count.value).toBe(0);
		expect(result.props.label).toBe("override");
	});
});
