import { mount, shallowMount, RouterLinkStub } from "@vue/test-utils";

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
		const isDirectProps =
			!Object.hasOwn(options, "props") &&
			!Object.hasOwn(options, "slots") &&
			!Object.hasOwn(options, "global") &&
			!Object.hasOwn(options, "attrs");

		const providedOptions = isDirectProps ? { props: options } : options;

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
 * Call this in `afterEach` to prevent `@vueuse/core` event listeners from
 * accumulating across tests. It is exported for manual use when the automatic
 * `afterEach` call is not available.
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

// --- Internal helpers ---

/**
 * Recursively merges two or more objects. Later sources override earlier ones.
 *
 * @param  {object}  target
 *     The base object to merge into.
 * @param  {...object}  sources
 *     One or more objects whose values are merged onto the target.
 */
function deepMerge(target, ...sources) {
	if (!sources.length) {
		return target;
	}

	const source = sources.shift();

	if (!isObject(target) || !isObject(source)) {
		return deepMerge(target, ...sources);
	}

	const result = { ...target };

	for (const key in source) {
		if (mismatchingTypes(result[key], source[key])) {
			result[key] = source[key];
		} else if (isObject(source[key])) {
			result[key] = deepMerge(result[key] ?? {}, source[key]);
		} else {
			result[key] = source[key];
		}
	}

	return deepMerge(result, ...sources);
}

/**
 * Returns true if the value is a plain non-null, non-array object.
 *
 * @param  {any}  value
 *     The value to check.
 */
function isObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Returns true when the target and source values have incompatible types,
 * meaning the source value should replace the target rather than be merged.
 *
 * @param  {any}  targetValue
 *     The value currently in the target object.
 * @param  {any}  sourceValue
 *     The value from the source object.
 */
function mismatchingTypes(targetValue, sourceValue) {
	return (
		typeof targetValue !== typeof sourceValue ||
		Array.isArray(targetValue) !== Array.isArray(sourceValue) ||
		isObject(targetValue) !== isObject(sourceValue)
	);
}
