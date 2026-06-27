import { mount, shallowMount, RouterLinkStub } from "@vue/test-utils";
import { deepMerge } from "../shared/deep-merge.js";
import { normaliseMountOptions } from "../shared/create-mount-options.js";

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
 * Returns a function that mounts the given component with shared default
 * options, removing the need to specify a `props` key when only props are
 * provided.
 *
 * Any default options passed here are deep-merged with per-call options on
 * each mount, so individual tests can override specific values.
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
 */
export function createMount(component, defaultOptions = {}, mountFunction = shallowMount) {
	/**
	 * Mount the component, treating a plain object of options as props unless
	 * `props`, `slots`, `global`, or `attrs` keys are present.
	 *
	 * @param  {object}  options
	 *     Options for this individual mount call.
	 */
	return function (options = {}) {
		const providedOptions = normaliseMountOptions(options, ["props", "slots", "global", "attrs"]);

		const wrapper = mountFunction(
			component,
			deepMerge(defaultOptions, globalOptions, providedOptions),
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
 */
export function createDeepMount(component, defaultOptions = {}) {
	return createMount(component, defaultOptions, mount);
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
			// Wrapper may already be unmounted; ignore.
		}
	});

	mountedWrappers.length = 0;
}
