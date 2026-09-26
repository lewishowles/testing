import "./data-test-plugin.js";
import "./wrapper-matchers.js";

/**
 * Adds the `getByData` and `getAllByData` lookups to Vue Test Utils wrappers
 * and registers the `toExist` and `toHaveAttribute` matchers for them. It also
 * registers an `afterEach` hook that unmounts wrappers from `createMount` and
 * `createDeepMount`.
 *
 * Call once at the top of a setup file or test suite.
 */
export declare function setupVueMounting(): void;
