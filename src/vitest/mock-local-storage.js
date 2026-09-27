import { vi } from "vite-plus/test";

/**
 * Replaces `window.localStorage` with a storage mock whose methods are spies.
 *
 * Call in `beforeEach` for an empty store in every test. `vi.clearAllMocks()`
 * resets spy calls but keeps stored values.
 *
 * @returns  {import("./mock-local-storage.d.ts").MockLocalStorage}
 *     The mock localStorage with an empty store.
 */
export function mockLocalStorage() {
	// Each mock owns its stored values so tests can start with an empty store.
	const values = new Map();

	// The object tests see as `localStorage`. Each method is a spy that also
	// reads or writes the stored values, so tests can check both calls and
	// results.
	const mock = {
		/**
		 * Returns the stored value for a key.
		 *
		 * @param  {string}  key
		 *     The key to look up.
		 *
		 * @returns  {string|null}
		 *     The stored string, or `null` when nothing is stored under the
		 *     key, as in browsers.
		 */
		getItem: vi.fn((key) => values.get(String(key)) ?? null),
		/**
		 * Stores a value under a key, replacing any value already there.
		 *
		 * @param  {string}  key
		 *     The key to store the value under.
		 * @param  {*}  value
		 *     The value to store. It is converted to a string, as browsers do,
		 *     so `getItem` returns `"1"` after storing `1`.
		 */
		setItem: vi.fn((key, value) => {
			values.set(String(key), String(value));
		}),
		/**
		 * Deletes the stored value for a key. Does nothing when the key is not
		 * stored.
		 *
		 * @param  {string}  key
		 *     The key to delete.
		 */
		removeItem: vi.fn((key) => {
			values.delete(String(key));
		}),
		/**
		 * Deletes every stored value. Spy call history is kept.
		 */
		clear: vi.fn(() => {
			values.clear();
		}),
		/**
		 * Returns the key at a position in the store, in the order keys were
		 * first stored.
		 *
		 * @param  {number}  index
		 *     The position of the key to return.
		 *
		 * @returns  {string|null}
		 *     The key, or `null` when there is no key at that position.
		 */
		key: vi.fn((index) => Array.from(values.keys())[index] ?? null),
		/**
		 * Reflects the number of stored keys after each write or removal.
		 *
		 * @returns  {number}
		 *     The current number of stored keys.
		 */
		get length() {
			return values.size;
		},
	};

	vi.stubGlobal("localStorage", mock);

	return mock;
}
