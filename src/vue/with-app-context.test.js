import { useQuery } from "@pinia/colada";
import { describe, expect, test } from "vite-plus/test";
import { defineStore, getActivePinia } from "pinia";
import { inject } from "vue";
import { withAppContext } from "./with-app-context.js";

describe("withAppContext", () => {
	test("provides an active Pinia instance", () => {
		withAppContext(() => {
			expect(getActivePinia()).not.toBeNull();
		});
	});

	test("allows Pinia stores to be used", () => {
		const useCounterStore = defineStore("counter", {
			/**
			 * Gives the test store a count to read through Pinia.
			 *
			 * @returns  {object}
			 *     The initial store state.
			 */
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
					/**
					 * Supplies a resolved value for the test query.
					 *
					 * @returns  {Promise<string>}
					 *     The query result.
					 */
					query: async () => "result",
				});
			});
		}).not.toThrow();
	});

	test("returns the value from the callback", () => {
		const result = withAppContext(() => 42);

		expect(result).toBe(42);
	});

	test("installs additional plugins", () => {
		const testPlugin = {
			/**
			 * Provides a value so the test can check plugin installation.
			 *
			 * @param  {object}  app
			 *     The app receiving the test plugin.
			 */
			install(app) {
				app.provide("plugin-value", "provided by plugin");
			},
		};

		const result = withAppContext(() => inject("plugin-value"), {
			plugins: [testPlugin],
		});

		expect(result).toBe("provided by plugin");
	});

	test("passes options to additional plugins", () => {
		const testPlugin = {
			/**
			 * Provides the passed option so the test can read it back.
			 *
			 * @param  {object}  app
			 *     The app receiving the test plugin.
			 * @param  {string}  value
			 *     The option passed to the plugin.
			 */
			install(app, value) {
				app.provide("plugin-options", value);
			},
		};

		const result = withAppContext(() => inject("plugin-options"), {
			plugins: [[testPlugin, "configured"]],
		});

		expect(result).toBe("configured");
	});

	test("provides additional values", () => {
		const result = withAppContext(() => inject("feature-flag"), {
			provides: {
				"feature-flag": true,
			},
		});

		expect(result).toBe(true);
	});

	test("supports symbol provide keys", () => {
		const key = Symbol("test-key");

		const result = withAppContext(() => inject(key), {
			provides: {
				[key]: "provided by symbol",
			},
		});

		expect(result).toBe("provided by symbol");
	});
});
