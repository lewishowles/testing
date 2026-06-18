import { describe, expect, test } from "vite-plus/test";
import { chromiumProject } from "./chromium-project.js";

describe("chromiumProject", () => {
	test("is named chromium", () => {
		expect(chromiumProject.name).toBe("chromium");
	});

	test("includes Desktop Chrome device settings", () => {
		expect(chromiumProject.use).toBeDefined();
		expect(chromiumProject.use.userAgent).toContain("Chrome");
	});
});
