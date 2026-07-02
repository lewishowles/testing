import { describe, expect, test, vi } from "vite-plus/test";
import { setupConsole } from "./setup-console.js";

describe("setupConsole", () => {
	const consoleSpies = setupConsole(["error", "warn"]);

	let previousWarn;

	test("suppresses selected console methods", () => {
		console.warn("suppressed");

		expect(consoleSpies.warn).toHaveBeenCalledWith("suppressed");
		expect(vi.isMockFunction(console.log)).toBe(false);
	});

	test("returns a stable handle with fresh spies for each test", () => {
		expect(consoleSpies.warn).not.toHaveBeenCalled();

		previousWarn = consoleSpies.warn;
	});

	test("refreshes spy instances before each test", () => {
		expect(consoleSpies.warn).not.toBe(previousWarn);
	});
});

describe("setupConsole defaults", () => {
	const consoleSpies = setupConsole();

	test("suppresses console.error by default", () => {
		console.error("suppressed");

		expect(consoleSpies.error).toHaveBeenCalledWith("suppressed");
		expect(vi.isMockFunction(console.warn)).toBe(false);
	});
});
