import { mergeMountOptions, normaliseMountOptions } from "../shared/create-mount-options.js";

/**
 * Creates a mount function for a Playwright component test. When a call passes
 * only props, they can be given directly without a `props` key.
 *
 * Default options are deep-merged with per-call options on each mount.
 *
 * @param  {object}  component
 *     The Vue component to mount.
 * @param  {object}  defaultOptions
 *     Options applied to every mount call unless overridden.
 *
 * @returns  {Function}
 *     A function that mounts the component with Playwright's mount fixture.
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
		// The per-call options, with a props-only object moved under `props`.
		const providedOptions = normaliseMountOptions(options, ["props", "slots", "global"]);

		return mount(component, mergeMountOptions(defaultOptions, providedOptions));
	};
}

/**
 * An empty 24 by 24 SVG for filling icon or image slots in component tests.
 *
 * Playwright CT slots accept only strings, so a test cannot pass an icon
 * component there.
 */
// The SVG markup to pass as slot content.
export const slotSvg = "<svg width='24' height='24' viewBox='0 0 24 24'></svg>";
