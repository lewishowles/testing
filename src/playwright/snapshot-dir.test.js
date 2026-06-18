import { describe, expect, test } from "vite-plus/test";
import { snapshotDir } from "./snapshot-dir.js";

describe("snapshotDir", () => {
	test("appends snapshots to the provided directory", () => {
		expect(snapshotDir("/project/test")).toBe("/project/test/snapshots");
	});

	test("returns an absolute path when given an absolute configDir", () => {
		const result = snapshotDir("/absolute/path");

		expect(result.startsWith("/")).toBe(true);
	});
});
