import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { mockLocalStorage } from "./mock-local-storage.js";

describe("mockLocalStorage", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("stubs window.localStorage", () => {
		mockLocalStorage();

		expect(window.localStorage).toBeDefined();
	});

	test("returns the mock object", () => {
		const mock = mockLocalStorage();

		expect(mock).toBeDefined();
	});

	describe("mock methods", () => {
		test("provides a getItem mock", () => {
			const mock = mockLocalStorage();

			expect(vi.isMockFunction(mock.getItem)).toBe(true);
		});

		test("provides a setItem mock", () => {
			const mock = mockLocalStorage();

			expect(vi.isMockFunction(mock.setItem)).toBe(true);
		});

		test("provides a removeItem mock", () => {
			const mock = mockLocalStorage();

			expect(vi.isMockFunction(mock.removeItem)).toBe(true);
		});

		test("provides a clear mock", () => {
			const mock = mockLocalStorage();

			expect(vi.isMockFunction(mock.clear)).toBe(true);
		});

		test("provides a key mock", () => {
			const mock = mockLocalStorage();

			expect(vi.isMockFunction(mock.key)).toBe(true);
		});

		test("sets length to zero", () => {
			const mock = mockLocalStorage();

			expect(mock.length).toBe(0);
		});
	});

	test("the stub and the returned mock are the same object", () => {
		const mock = mockLocalStorage();

		expect(window.localStorage).toBe(mock);
	});

	test("stores string values and returns them by key", () => {
		const mock = mockLocalStorage();

		mock.setItem("count", 3);

		expect(mock.getItem("count")).toBe("3");
		expect(mock.getItem("missing")).toBeNull();
		expect(mock.setItem).toHaveBeenCalledWith("count", 3);
		expect(mock.getItem).toHaveBeenCalledWith("count");
	});

	test("replaces a value without increasing length", () => {
		const mock = mockLocalStorage();

		mock.setItem("mode", "light");
		mock.setItem("mode", "dark");

		expect(mock.getItem("mode")).toBe("dark");
		expect(mock.length).toBe(1);
	});

	test("removes a value and updates length", () => {
		const mock = mockLocalStorage();

		mock.setItem("mode", "dark");
		mock.removeItem("mode");

		expect(mock.getItem("mode")).toBeNull();
		expect(mock.length).toBe(0);
		expect(mock.removeItem).toHaveBeenCalledWith("mode");
	});

	test("clears all values and updates length", () => {
		const mock = mockLocalStorage();

		mock.setItem("mode", "dark");
		mock.setItem("token", "abc123");
		mock.clear();

		expect(mock.getItem("mode")).toBeNull();
		expect(mock.getItem("token")).toBeNull();
		expect(mock.length).toBe(0);
		expect(mock.clear).toHaveBeenCalledOnce();
	});

	test("returns keys in storage order and null outside the range", () => {
		const mock = mockLocalStorage();

		mock.setItem("mode", "dark");
		mock.setItem("token", "abc123");

		expect(mock.key(0)).toBe("mode");
		expect(mock.key(1)).toBe("token");
		expect(mock.key(2)).toBeNull();
		expect(mock.key).toHaveBeenCalledWith(2);
	});

	test("starts each mock with an empty store", () => {
		const first = mockLocalStorage();

		first.setItem("mode", "dark");

		const second = mockLocalStorage();

		expect(second.length).toBe(0);
		expect(second.getItem("mode")).toBeNull();
		expect(first.getItem("mode")).toBe("dark");
	});

	test("keeps stored values when spy calls are cleared", () => {
		const mock = mockLocalStorage();

		mock.setItem("mode", "dark");
		vi.clearAllMocks();

		expect(mock.setItem).not.toHaveBeenCalled();
		expect(mock.getItem("mode")).toBe("dark");
	});
});
