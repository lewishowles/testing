import "./data-test-plugin.js";
import "./wrapper-matchers.js";

/**
 * Adds the `getByData` and `getAllByData` lookups to Vue Test Utils wrappers
 * and registers the `toExist` and `toHaveAttribute` matchers for them. It also
 * registers an `afterEach` hook that unmounts wrappers from `createMount`,
 * `createDeepMount`, and `mountComposable`, then resets the shared API and
 * router mocks.
 *
 * Call once in the project's Vitest setup file.
 */
export declare function setupVueTests(): void;

/**
 * The earlier name for `setupVueTests`, kept so existing setup files keep
 * working until the next major release.
 *
 * @deprecated Use setupVueTests instead.
 */
export declare function setupVueMounting(): void;
