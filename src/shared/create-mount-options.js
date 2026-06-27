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
