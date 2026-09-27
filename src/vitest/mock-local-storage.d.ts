import type { MockInstance } from "vitest";

/**
 * A storage mock whose methods are Vitest spies and whose length reflects
 * stored values.
 */
export interface MockLocalStorage {
	/**
	 * Returns the stored string for a key, or `null` when nothing is stored.
	 */
	getItem: MockInstance;
	/**
	 * Stores a value under a key as a string, replacing any value already
	 * there.
	 */
	setItem: MockInstance;
	/**
	 * Deletes the stored value for a key.
	 */
	removeItem: MockInstance;
	/**
	 * Deletes every stored value. Spy call history is kept.
	 */
	clear: MockInstance;
	/**
	 * Returns the key at a position in the store, or `null` when there is none.
	 */
	key: MockInstance;
	/**
	 * The number of stored keys, updated after each write or removal.
	 */
	readonly length: number;
}

/**
 * Replaces `window.localStorage` with a storage mock whose methods are spies.
 *
 * Call in `beforeEach` for an empty store in every test. Clearing mocks resets
 * spy calls but keeps stored values.
 *
 * @returns  The mock localStorage object.
 */
export declare function mockLocalStorage(): MockLocalStorage;
