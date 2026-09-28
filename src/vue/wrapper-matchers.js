import { dataTestValues } from "./data-test-plugin.js";

// The Vitest matchers for Vue Test Utils wrappers. `setupVueTests()` registers
// them.
export const wrapperMatchers = {
	/**
	 * Passes when a lookup found an element.
	 *
	 * @param  {import("@vue/test-utils").BaseWrapper}  received
	 *     The wrapper returned by a lookup such as `getByData` or `find`.
	 *
	 * @returns  {object}
	 *     The Vitest matcher result. Failure messages name the data-test value
	 *     when the wrapper came from `getByData`.
	 */
	toExist(received) {
		// The data-test value the wrapper was found by, if it came from
		// `getByData`.
		const selector = dataTestValues.get(received);
		// How failure messages refer to the element.
		const target = selector === undefined ? "element" : `[data-test="${selector}"]`;
		// Whether the lookup found an element.
		const pass = received.exists();

		return {
			pass,
			/**
			 * Describes the failed expectation. Vitest only calls this when the
			 * assertion fails.
			 *
			 * @returns  {string}
			 *     The failure message, which says whether the element was
			 *     expected to exist.
			 */
			message: () => `Expected ${target} ${this.isNot ? "not " : ""}to exist.`,
		};
	},

	/**
	 * Passes when the element has the attribute and, when a value is given,
	 * that exact value.
	 *
	 * A missing element fails even with `.not`, so a mistyped data-test value
	 * cannot pass an absence check by accident.
	 *
	 * @param  {import("@vue/test-utils").BaseWrapper}  received
	 *     The wrapper returned by a lookup such as `getByData` or `find`.
	 * @param  {string}  name
	 *     The attribute to look for.
	 * @param  {string}  [value]
	 *     The exact value the attribute must have. Leave it out to check only
	 *     that the attribute is present.
	 *
	 * @returns  {object}
	 *     The Vitest matcher result.
	 */
	toHaveAttribute(received, name, value) {
		// The data-test value the wrapper was found by, if it came from
		// `getByData`.
		const selector = dataTestValues.get(received);
		// How failure messages refer to the element.
		const target = selector === undefined ? "element" : `[data-test="${selector}"]`;

		if (!received.exists()) {
			return {
				// Vitest inverts `pass` under `.not`, so this fails in both
				// directions.
				pass: Boolean(this.isNot),
				/**
				 * Explains that the attribute could not be checked because the
				 * lookup found no element.
				 *
				 * @returns  {string}
				 *     The failure message, which names the attribute and the
				 *     missing element.
				 */
				message: () => `Cannot check attribute "${name}" because ${target} was not found.`,
			};
		}

		// The attribute's current value, or undefined when it is absent.
		const actual = received.attributes(name);
		// Whether the element meets the presence or exact-value check.
		const pass = value === undefined ? actual !== undefined : actual === value;

		// What the failure message says was expected.
		const expectation =
			value === undefined ? `attribute "${name}"` : `attribute "${name}" with value "${value}"`;

		return {
			pass,
			/**
			 * Describes the failed expectation. Vitest only calls this when the
			 * assertion fails.
			 *
			 * @returns  {string}
			 *     The failure message, which names the attribute and, when one
			 *     was given, the expected value.
			 */
			message: () => `Expected ${target} ${this.isNot ? "not " : ""}to have ${expectation}.`,
		};
	},
};
