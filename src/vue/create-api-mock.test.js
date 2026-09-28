import { describe, expect, test, vi } from "vite-plus/test";
import { createApiMock } from "./create-api-mock.js";

describe("createApiMock", () => {
	test("returns one API object with spies for each supported method", () => {
		const mock = createApiMock();
		const api = mock.default();

		const methods = [
			"get",
			"post",
			"put",
			"patch",
			"delete",
			"head",
			"options",
			"setAuthToken",
			"hasAuthToken",
		];

		expect(mock.default()).toBe(api);
		expect(mock.api).toBe(api);

		for (const method of methods) {
			expect(vi.isMockFunction(api[method])).toBe(true);
		}

		expect(api.isLoading).toEqual({ value: false });
		expect(api.isReady).toEqual({ value: false });
	});

	test("applies overrides and adds app-specific members", async () => {
		const get = vi.fn().mockResolvedValue({ id: "7" });
		const mock = createApiMock({ get, upload: vi.fn() });

		expect(mock.default().get).toBe(get);
		expect(vi.isMockFunction(mock.api.upload)).toBe(true);
		expect(await mock.api.get("/members/7")).toEqual({ id: "7" });
	});

	test("restores creation-time members and spy implementations without replacing the API object", async () => {
		const get = vi.fn().mockResolvedValue({ id: "7" });
		const upload = vi.fn().mockReturnValue("uploaded");
		const mock = createApiMock({ get, upload });
		const api = mock.default();
		const loading = api.isLoading;

		await api.get("/members/7");
		api.upload("file");
		api.post("/members");
		get.mockResolvedValue({ id: "8" });
		get.mockResolvedValueOnce({ id: "9" });
		upload.mockReturnValue("changed");

		api.get = vi.fn();
		api.extra = "temporary";
		api.isLoading.value = true;
		api.isReady.value = true;

		mock.reset();

		expect(mock.default()).toBe(api);
		expect(api.get).toBe(get);
		expect(api.isLoading).toBe(loading);
		expect(api.isLoading.value).toBe(false);
		expect(api.isReady.value).toBe(false);
		expect(api).not.toHaveProperty("extra");
		expect(get).not.toHaveBeenCalled();
		expect(upload).not.toHaveBeenCalled();
		expect(api.post).not.toHaveBeenCalled();
		expect(await api.get("/members/7")).toEqual({ id: "7" });
		expect(api.upload("file")).toBe("uploaded");
	});

	test("restores overridden state values without replacing their objects", () => {
		const isLoading = { value: true };
		const isReady = { value: true };
		const mock = createApiMock({ isLoading, isReady });

		isLoading.value = false;
		isReady.value = false;

		mock.reset();

		expect(mock.api.isLoading).toBe(isLoading);
		expect(mock.api.isReady).toBe(isReady);
		expect(isLoading.value).toBe(true);
		expect(isReady.value).toBe(true);
	});
});
