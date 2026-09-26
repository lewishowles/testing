import { config } from "@vue/test-utils";

// Remembers the data-test value each `getByData` result was found by, so
// matcher failures can name it. It is kept in this map rather than on the
// result, because Vue Test Utils' empty wrapper throws when code reads a
// property it does not have.
export const dataTestValues = new WeakMap();

// Prevents repeated setup calls from installing duplicate wrapper methods.
let installed = false;

/**
 * Adds data-test lookups to component and element wrappers.
 */
export function installDataTestPlugin() {
	if (installed) {
		return;
	}

	config.plugins.VueWrapper.install(dataTestPlugin);
	config.plugins.DOMWrapper.install(dataTestPlugin);

	installed = true;
}

/**
 * Builds the data-test lookups for one wrapper. They return exactly what `find`
 * and `findAll` return for `[data-test="name"]`.
 *
 * @param  {import("@vue/test-utils").VueWrapper | import("@vue/test-utils").DOMWrapper}  wrapper
 *     The wrapper receiving the lookup methods.
 *
 * @returns  {object}
 *     The methods added to the wrapper.
 */
function dataTestPlugin(wrapper) {
	return {
		/**
		 * Finds the first descendant with the given data-test value.
		 *
		 * @param  {string}  name
		 *     The data-test value to find.
		 *
		 * @returns  {import("@vue/test-utils").DOMWrapper}
		 *     The first match. When nothing matches, Vue Test Utils' empty
		 *     wrapper, whose `exists()` returns false.
		 */
		getByData(name) {
			// The first match or the empty wrapper. The next line records which
			// data-test value it was found by.
			const result = wrapper.find(`[data-test="${name}"]`);

			dataTestValues.set(result, name);

			return result;
		},
		/**
		 * Finds every descendant with the given data-test value.
		 *
		 * @param  {string}  name
		 *     The data-test value to find.
		 *
		 * @returns  {import("@vue/test-utils").DOMWrapper[]}
		 *     Every match in document order, or an empty array.
		 */
		getAllByData(name) {
			return wrapper.findAll(`[data-test="${name}"]`);
		},
	};
}
