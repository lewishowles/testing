import { RouterLinkStub, mount, shallowMount } from "@vue/test-utils";
import { mergeMountOptions, normaliseMountOptions } from "../shared/create-mount-options.js";

// All wrappers mounted during a test run, used to clean up after each test.
const mountedWrappers = [];

// Default global options applied to every mount call.
const globalOptions = {
	global: {
		components: {
			RouterLink: RouterLinkStub,
		},
	},
};

/**
 * Creates a mount function with shared defaults. When a call passes only props,
 * they can be given directly without a `props` key.
 *
 * Any default options passed here are deep-merged with per-call options on each
 * mount, so individual tests can override specific values.
 *
 * Mounted wrappers are tracked and can be cleaned up via
 * `cleanupMountedWrappers`, which prevents `@vueuse/core` listener pollution
 * between tests.
 *
 * @param  {object}  component
 *     The Vue component to mount.
 * @param  {object}  defaultOptions
 *     Options applied to every mount call unless overridden.
 * @param  {Function}  mountFunction
 *     The `@vue/test-utils` mount function to use. Defaults to `shallowMount`.
 *
 * @returns  {Function}
 *     A function that mounts the component with per-call options.
 */
export function createMount(component, defaultOptions = {}, mountFunction = shallowMount) {
	/**
	 * Mount the component, treating a plain object of options as props unless
	 * `props`, `slots`, `global`, or `attrs` keys are present.
	 *
	 * @param  {object}  options
	 *     Options for this individual mount call.
	 *
	 * @returns  {object}
	 *     The mounted Vue wrapper.
	 */
	return function (options = {}) {
		// This mount's options, with a props-only object moved under `props`.
		const providedOptions = normaliseMountOptions(options, ["props", "slots", "global", "attrs"]);

		// The wrapper tracked for cleanup after the test.
		const wrapper = mountFunction(
			component,
			mergeMountOptions(defaultOptions, globalOptions, providedOptions),
		);

		mountedWrappers.push(wrapper);

		return wrapper;
	};
}

/**
 * Returns a mount function using `mount` instead of `shallowMount`, rendering
 * child components in full.
 *
 * @param  {object}  component
 *     The Vue component to mount.
 * @param  {object}  defaultOptions
 *     Options applied to every mount call unless overridden.
 *
 * @returns  {Function}
 *     A function that fully mounts the component with per-call options.
 */
export function createDeepMount(component, defaultOptions = {}) {
	return createMount(component, defaultOptions, mount);
}

/**
 * Runs a composable inside a fully mounted component so its lifecycle hooks and
 * injected values work during the test. The wrapper is tracked for cleanup.
 *
 * @param  {Function}  fn
 *     The composable to call without arguments during component setup.
 * @param  {object}  options
 *     Options passed directly to Vue Test Utils `mount`.
 *
 * @returns  {object}
 *     The composable result and the mounted Vue wrapper.
 */
export function mountComposable(fn, options = {}) {
	// The value returned by the composable during component setup.
	let result;

	// The component that gives the composable a mounted lifecycle and app
	// context.
	const component = {
		/**
		 * Calls the composable while Vue has an active component instance.
		 *
		 * @returns  {Function}
		 *     An empty render function for the test component.
		 */
		setup() {
			result = fn();

			return () => null;
		},
	};

	// The wrapper tracked with other mounted test components for cleanup.
	const wrapper = mount(component, options);

	mountedWrappers.push(wrapper);

	return { result, wrapper };
}

/**
 * Unmounts all tracked wrappers and clears the tracking list.
 *
 * Call this in `afterEach` to prevent things like `@vueuse/core` event
 * listeners from accumulating across tests. It is exported for manual use when
 * the automatic `afterEach` call is not available.
 */
export function cleanupMountedWrappers() {
	mountedWrappers.forEach((wrapper) => {
		try {
			wrapper.unmount();
		} catch {
			// Keep unmounting the other wrappers if one fails to unmount.
			return;
		}
	});

	mountedWrappers.length = 0;
}
