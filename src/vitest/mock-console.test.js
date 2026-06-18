import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { mockConsole } from "./mock-console.js";

describe("mockConsole", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("returns a spy for console.error by default", () => {
		const spies = mockConsole();

		expect(vi.isMockFunction(spies.error)).toBe(true);
	});

	test("suppresses console.error output", () => {
		mockConsole();
		console.error("suppressed");

		expect(console.error).toHaveBeenCalledWith("suppressed");
	});

	test("accepts a custom list of methods", () => {
		const spies = mockConsole(["warn", "log"]);

		expect(vi.isMockFunction(spies.warn)).toBe(true);
		expect(vi.isMockFunction(spies.log)).toBe(true);
	});

	test("does not spy on methods outside the provided list", () => {
		mockConsole(["warn"]);

		expect(vi.isMockFunction(console.log)).toBe(false);
	});

	test("restores the original implementation after vi.restoreAllMocks", () => {
		mockConsole();
		vi.restoreAllMocks();

		expect(vi.isMockFunction(console.error)).toBe(false);
	});
});
