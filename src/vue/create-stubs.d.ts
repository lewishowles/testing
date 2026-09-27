import type { Component } from "vue";

/**
 * A component name with the slots and props its stub should expose.
 */
export type StubEntry = string | Record<string, string[] | { slots?: string[]; props?: string[] }>;

/**
 * Creates named slot-rendering stubs to spread into `global.stubs`. String
 * entries render the default slot. Object entries can list slots in render
 * order and declare props so Vue Test Utils exposes them through
 * `wrapper.props()`.
 *
 * @param  entries
 *     Component names, or objects mapping one name to a slot list or to an
 *     object with `slots` and `props`.
 *
 * @returns  A map of component names to stub components.
 */
export declare function createStubs(entries: StubEntry[]): Record<string, Component>;
