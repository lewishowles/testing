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
 * @param  {object}  options
 *     Extra app context to install before running the callback.
 *
 * @returns  {*}
 *     The value returned by the callback.
 */
export function withAppContext(callback, options = {}) {
	// A temporary app supplies Vue's injection context for the callback.
	const app = createApp({});
	// Each callback runs with its own Pinia instance.
	const pinia = createPinia();
	// The test can add its own plugins and provided values.
	const { plugins = [], provides = {} } = options;

	app.use(pinia);
	app.use(PiniaColada);

	for (const plugin of plugins) {
		if (Array.isArray(plugin)) {
			app.use(...plugin);
		} else {
			app.use(plugin);
		}
	}

	for (const key of Reflect.ownKeys(provides)) {
		app.provide(key, provides[key]);
	}

	return app.runWithContext(callback);
}
