import { describe, expect, test } from "vite-plus/test";
import { loadTestEnv } from "./load-test-env.js";

describe("loadTestEnv", () => {
	test("does not throw when .env is absent", () => {
		expect(() => loadTestEnv("/nonexistent/path")).not.toThrow();
	});

	test("does not throw when configDir does not exist", () => {
		expect(() => loadTestEnv("/this/path/does/not/exist")).not.toThrow();
	});
});
