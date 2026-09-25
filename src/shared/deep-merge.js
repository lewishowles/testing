/**
 * Checks whether `deepMerge` should merge into a value rather than replace it.
 * Vue refs also have `constructor === Object`, so they are recognised by Vue's
 * `__v_isRef` marker instead, which avoids importing Vue.
 *
 * @param  {unknown}  value
 *     The value to check.
 *
 * @returns  {boolean}
 *     True for a plain object that is not a Vue ref.
 */
function isPlainObject(value) {
	return (
		value !== null &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		value.constructor === Object &&
		!value.__v_isRef
	);
}

/**
 * Deep-merges multiple plain objects, with later sources overriding earlier
 * ones. Nested plain objects are merged recursively; arrays and other values
 * replace entirely.
 *
 * Used by `createMount` in both `/vue` and `/playwright` to merge default
 * options with per-call overrides without pulling in a runtime dependency.
 *
 * @param  {...object}  sources
 *     Objects to merge, left-to-right.
 * @returns  {object}
 *     A new merged object.
 * @example
 * deepMerge({ props: { label: "default" } }, { props: { label: "override" } });
 * // → { props: { label: "override" } }
 */
export function deepMerge(...sources) {
	// Build a new result so no source object is modified.
	const result = {};

	for (const source of sources) {
		if (!source || typeof source !== "object" || Array.isArray(source)) {
			continue;
		}

		for (const [key, value] of Object.entries(source)) {
			if (isPlainObject(value) && (result[key] === undefined || isPlainObject(result[key]))) {
				result[key] = deepMerge(result[key] || {}, value);
			} else {
				result[key] = value;
			}
		}
	}

	return result;
}
