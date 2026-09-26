import type { Plugin } from "vue";

/**
 * These options add app context before the callback runs.
 */
export type AppContextOptions = {
	/**
	 * These plugins are installed after Pinia and Pinia Colada.
	 */
	plugins?: (Plugin | [Plugin, ...unknown[]])[];
	/**
	 * These values are available through Vue's inject during the callback.
	 */
	provides?: Record<string | symbol, unknown>;
};

/**
 * Runs a composable inside a real Vue app that has Pinia and Pinia Colada
 * installed, matching the context the composable expects at runtime.
 *
 * Use this to test composables that call `useQuery`, `useMutation`, or
 * `useStore` outside of a component.
 *
 * @param  callback A function containing the composable call to run.
 * @param  options  Extra app context to install before running the callback.
 *
 * @returns  The value returned by the callback.
 */
export declare function withAppContext<T>(callback: () => T, options?: AppContextOptions): T;
