import type { MockInstance } from "vitest";

/**
 * A mock localStorage object with Vitest mock functions for each method.
 */
export interface MockLocalStorage {
	getItem: MockInstance;
	setItem: MockInstance;
	removeItem: MockInstance;
	clear: MockInstance;
	key: MockInstance;
	length: number;
}

/**
 * Replaces `window.localStorage` with a Vitest mock, returning the mock
 * object for use in assertions.
 *
 * Call once at the top of a setup file or test suite.
 *
 * @returns The mock localStorage object.
 */
export declare function mockLocalStorage(): MockLocalStorage;
