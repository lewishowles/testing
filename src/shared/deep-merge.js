/**
 * Deep-merges multiple plain objects, with later sources overriding earlier
 * ones. Nested plain objects are merged recursively; arrays and other values
 * replace entirely.
 *
 * Used by `createMount` in both `/vue` and `/playwright` to merge default
 * options with per-call overrides without pulling in a runtime dependency.
 *
 * @param  {...object} sources
 *     Objects to merge, left-to-right.
 * @returns {object}
 *     A new merged object.
 * @example
 * deepMerge({ props: { label: "default" } }, { props: { label: "override" } });
 * // → { props: { label: "override" } }
 */
export function deepMerge(...sources) {
	const result = {};

	for (const source of sources) {
		if (!source || typeof source !== "object") {
			continue;
		}

		for (const [key, value] of Object.entries(source)) {
			if (value && typeof value === "object" && !Array.isArray(value)) {
				result[key] = deepMerge(result[key] || {}, value);
			} else {
				result[key] = value;
			}
		}
	}

	return result;
}
