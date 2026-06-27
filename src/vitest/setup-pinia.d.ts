/**
 * Registers a `beforeEach` hook that creates and activates a fresh Pinia
 * instance before every test, preventing store state from leaking between
 * tests.
 *
 * Call once at the top of a setup file or test suite.
 */
export declare function setupPinia(): void;
