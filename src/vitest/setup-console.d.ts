import type { MockInstance } from "vitest";

/**
 * Registers hooks that suppress the selected console methods during each test
 * and restore them afterwards.
 *
 * The returned object is stable, so tests can keep one reference while the spy
 * instances are refreshed before each test.
 *
 * @param  methods The console methods to suppress. Defaults to `["error"]`.
 *
 * @returns  A stable record mapping method names to their current spy instances.
 */
export declare function setupConsole(methods?: string[]): Record<string, MockInstance>;
