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
});
