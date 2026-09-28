import { describe, expect, test, vi } from "vite-plus/test";
import {
	mockApiModule,
	mockDelete,
	mockGet,
	mockHasAuthToken,
	mockHead,
	mockIsLoading,
	mockIsReady,
	mockOptions,
	mockPatch,
	mockPost,
	mockPut,
	mockSetAuthToken,
	resetApiMocks,
} from "./mock-api.js";
import { setupVueTests } from "./setup-vue-tests.js";

// The shared API members that tests may import directly.
const apiMembers = {
	get: mockGet,
	post: mockPost,
	put: mockPut,
	patch: mockPatch,
	delete: mockDelete,
	head: mockHead,
	options: mockOptions,
	setAuthToken: mockSetAuthToken,
	hasAuthToken: mockHasAuthToken,
	isLoading: mockIsLoading,
	isReady: mockIsReady,
};

// The names of the shared members that are spies, leaving out the state
// objects.
const apiMethodNames = Object.keys(apiMembers).filter((name) =>
	vi.isMockFunction(apiMembers[name]),
);

describe("mockApiModule", () => {
	setupVueTests();

	test("returns one API object holding exactly the shared members", () => {
		const api = mockApiModule.default();

		expect(Object.keys(mockApiModule)).toEqual(["default"]);
		expect(mockApiModule.default()).toBe(api);
		expect(api).toEqual(apiMembers);

		for (const method of apiMethodNames) {
			expect(vi.isMockFunction(api[method])).toBe(true);
		}

		expect(mockIsLoading).toEqual({ value: false });
		expect(mockIsReady).toEqual({ value: false });
	});

	test("records calls through the same spies that tests import", async () => {
		mockGet.mockResolvedValue({ id: "7" });

		expect(await mockApiModule.default().get("/members/7")).toEqual({ id: "7" });
		expect(mockGet).toHaveBeenCalledWith("/members/7");
	});

	test("restores every shared member and removes extra members", () => {
		const api = mockApiModule.default();
		const loading = api.isLoading;
		const ready = api.isReady;

		for (const method of apiMethodNames) {
			api[method].mockReturnValueOnce("queued");
			api[method]("request");
			api[method].mockReturnValue("changed");
			api[method].mockReturnValueOnce("pending");
		}

		mockIsLoading.value = true;
		mockIsReady.value = true;
		api.get = vi.fn();
		api.isLoading = { value: true };
		api.upload = vi.fn();

		resetApiMocks();

		expect(api).toBe(mockApiModule.default());
		expect(api).toEqual(apiMembers);
		expect(api.isLoading).toBe(loading);
		expect(api.isReady).toBe(ready);
		expect(mockIsLoading.value).toBe(false);
		expect(mockIsReady.value).toBe(false);
		expect(api).not.toHaveProperty("upload");

		for (const method of apiMethodNames) {
			expect(api[method]).toBe(apiMembers[method]);
			expect(api[method]).not.toHaveBeenCalled();
			expect(api[method]()).toBeUndefined();
		}
	});
});
