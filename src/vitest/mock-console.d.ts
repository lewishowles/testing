import type { MockInstance } from "vitest";

/**
 * Spies on the given console methods and suppresses their output, returning
 * the spies for use in assertions.
 *
 * Call inside `beforeEach` to get a fresh spy per test.
 *
 * @param methods The console methods to suppress. Defaults to `["error"].
 * @returns A record mapping method names to their spy instances.
 */
export declare function mockConsole(methods?: string[]): Record<string, MockInstance>;
