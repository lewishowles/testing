import type { Plugin } from "vue";

/** Extra app context to install before running the callback. */
export type AppContextOptions = {
	/** Additional Vue plugins to install after Pinia and Pinia Colada. */
	plugins?: (Plugin | [Plugin, ...unknown[]])[];
	/** Values to provide on the app context before the callback runs. */
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
 * @returns Whatever the callback returns.
 */
export declare function withAppContext<T>(callback: () => T, options?: AppContextOptions): T;
