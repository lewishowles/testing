import { useQuery } from "@pinia/colada";
import { describe, expect, test } from "vite-plus/test";
import { defineStore, getActivePinia } from "pinia";
import { withAppContext } from "./with-app-context.js";

describe("withAppContext", () => {
	test("provides an active Pinia instance", () => {
		withAppContext(() => {
			expect(getActivePinia()).not.toBeNull();
		});
	});

	test("allows Pinia stores to be used", () => {
		const useCounterStore = defineStore("counter", {
			state: () => ({ count: 0 }),
		});

		withAppContext(() => {
			const store = useCounterStore();

			expect(store.count).toBe(0);
		});
	});

	test("allows Pinia Colada queries to be used", () => {
		expect(() => {
			withAppContext(() => {
				useQuery({
					key: ["test"],
					query: async () => "result",
				});
			});
		}).not.toThrow();
	});

	test("returns the value from the callback", () => {
		const result = withAppContext(() => 42);

		expect(result).toBe(42);
	});
});
