import "./data-test-plugin.js";
import "./wrapper-matchers.js";

/**
 * Adds data-test lookups to Vue Test Utils wrappers, registers the
 * `toExist()` and `toHaveAttribute()` matchers, and registers an
 * `afterEach` hook that unmounts wrappers created by `createMount` and
 * `createDeepMount`.
 *
 * Call once at the top of a setup file or test suite.
 */
export declare function setupVueMounting(): void;
