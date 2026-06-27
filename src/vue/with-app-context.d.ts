/**
 * Runs a composable inside a real Vue app that has Pinia and Pinia Colada
 * installed, matching the context the composable expects at runtime.
 *
 * Use this to test composables that call `useQuery`, `useMutation`, or
 * `useStore` outside of a component.
 *
 * @param  callback A function containing the composable call to run.
 * @returns Whatever the callback returns.
 */
export declare function withAppContext<T>(callback: () => T): T;
