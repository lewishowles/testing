import { describe, expect, test } from "vite-plus/test";
import { sharedUse } from "./shared-use.js";

describe("sharedUse", () => {
	test("sets testIdAttribute to data-test", () => {
		expect(sharedUse.testIdAttribute).toBe("data-test");
	});
});
