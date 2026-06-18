import { PiniaColada } from "@pinia/colada";
import { createApp } from "vue";
import { createPinia } from "pinia";

/**
 * Runs a composable inside a real Vue app that has Pinia and Pinia Colada
 * installed, matching the context the composable expects at runtime.
 *
 * Use this to test composables that call `useQuery`, `useMutation`, or
 * `useStore` outside of a component.
 *
 * @param  {Function}  callback
 *     A function containing the composable call to run.
 */
export function withAppContext(callback) {
	const app = createApp({});
	const pinia = createPinia();

	app.use(pinia);
	app.use(PiniaColada);

	return app.runWithContext(callback);
}
