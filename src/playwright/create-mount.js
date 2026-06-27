import { deepMerge } from "../shared/deep-merge.js";

/**
 * Returns a function that mounts the given component in a Playwright component
 * test with shared default options, removing the need to specify a `props` key
 * when only props are provided.
 *
 * Any default options passed here are deep-merged with per-call options on
 * each mount.
 *
 * @param  {object}  component
 *     The Vue component to mount.
 * @param  {object}  defaultOptions
 *     Options applied to every mount call unless overridden.
 *
 * @example
 * const mount = createMount(MyComponent, { props: { label: "default" } });
 * // In a test:
 * const component = await mount(mountFixture, { label: "override" });
 */
export function createMount(component, defaultOptions = {}) {
	/**
	 * Mount the component using Playwright's mount fixture, treating a plain
	 * object of options as props unless `props`, `slots`, or `global` keys are
	 * present.
	 *
	 * @param  {Function}  mount
	 *     Playwright's mount fixture, provided by the test context.
	 * @param  {object}  options
	 *     Options for this individual mount call.
	 */
	return function mountComponent(mount, options = {}) {
		const isDirectProps =
			!Object.hasOwn(options, "props") &&
			!Object.hasOwn(options, "slots") &&
			!Object.hasOwn(options, "global");

		const providedOptions = isDirectProps ? { props: options } : options;

		return mount(component, deepMerge(defaultOptions, providedOptions));
	};
}

/**
 * Minimal SVG string for use in slot tests.
 *
 * Playwright CT's string-only slot API does not accept component references,
 * so this provides a valid SVG placeholder where an icon or image slot is
 * required.
 */
export const slotSvg = "<svg width='24' height='24' viewBox='0 0 24 24'></svg>";
