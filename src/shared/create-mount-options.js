import { deepMerge } from "./deep-merge.js";

/**
 * Normalises mount options by detecting whether the given object is a
 * direct props shorthand or a full options object.
 *
 * If none of the reserved keys are present as own properties, the object
 * is treated as props and wrapped: `{ props: options }`. Otherwise it is
 * returned as-is.
 *
 * Used by `createMount` in both `/vue` and `/playwright` to share the
 * direct-props detection logic while allowing each variant to specify its
 * own set of reserved option keys.
 *
 * @param  {object}  options
 *     The options object passed to the mount function.
 * @param  {string[]}  reservedKeys
 *     Keys that indicate a full options object rather than direct props.
 * @returns {object}
 *     The normalised options, with direct props wrapped if needed.
 * @example
 * normaliseMountOptions({ label: "hi" }, ["props", "slots", "global"]);
 * // → { props: { label: "hi" } }
 *
 * normaliseMountOptions({ props: { label: "hi" } }, ["props", "slots", "global"]);
 * // → { props: { label: "hi" } }
 */
export function normaliseMountOptions(options, reservedKeys) {
	const isDirectProps = reservedKeys.every((key) => !Object.hasOwn(options, key));

	return isDirectProps ? { props: options } : options;
}

/**
 * Merge mount options, preserving component definition references.
 *
 * `deepMerge` recurses into component definition objects inside
 * `global.stubs` and `global.components`, creating copies that break
 * `findComponent` by identity. This function shallow-merges those keys
 * via `Object.assign` to preserve original references, while
 * deep-merging everything else.
 *
 * @param  {...object}  sources
 *     Mount option objects to merge, left-to-right.
 * @returns {object}
 *     A new merged options object with component refs preserved.
 */
export function mergeMountOptions(...sources) {
	// Keys under `global` whose values are objects of component definitions
	// and must be shallow-merged to preserve object identity.
	const identityKeys = ["stubs", "components"];

	// Collect identity-sensitive objects from each source.
	const collected = {};

	for (const key of identityKeys) {
		collected[key] = [];
	}

	for (const source of sources) {
		if (source?.global) {
			for (const key of identityKeys) {
				if (source.global[key]) {
					collected[key].push(source.global[key]);
				}
			}
		}
	}

	const merged = deepMerge(...sources);

	// Only touch merged.global when there are identity-key objects to restore.
	const hasIdentitySources = identityKeys.some((key) => collected[key].length > 0);

	if (hasIdentitySources) {
		merged.global = merged.global || {};
		for (const key of identityKeys) {
			if (collected[key].length > 0) {
				merged.global[key] = Object.assign({}, ...collected[key]);
			}
		}
	}

	return merged;
}
