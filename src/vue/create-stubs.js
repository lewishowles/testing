import { defineComponent, h } from "vue";

/**
 * Creates named stubs that render the requested slots inside Vue Test Utils
 * style stub elements. Most tests pass the same list as the `stubs` option of
 * `createMount` instead of calling this directly. The result can also be spread
 * into `global.stubs` alongside ordinary `true` or `false` entries.
 *
 * @param  {(string|object)[]}  entries
 *     The components to stub. Each entry is a component name, which renders the
 *     default slot; an object mapping one name to a list of slot names; or an
 *     object mapping one name to `{ slots, props }`. A stub renders the default
 *     slot when `slots` is left out.
 *
 * @throws  {TypeError}
 *     When the list or an entry has an invalid shape.
 *
 * @returns  {object}
 *     A map of component names to stub components.
 *
 * @example
 * createStubs(["UiButton", { PageTitle: ["default", "introduction"] }]);
 */
export function createStubs(entries) {
	if (!Array.isArray(entries)) {
		throw new TypeError("createStubs entries must be an array");
	}

	// The stubs to return, keyed by the name of the component each one
	// replaces.
	const stubs = {};

	for (const [index, entry] of entries.entries()) {
		// The component name, and the slots and props its stub uses.
		const [name, options] = normaliseEntry(entry, index);
		// The stub's element name, such as `page-title-stub`, matching Vue Test
		// Utils' own stubs.
		const tag = `${hyphenate(name)}-stub`;

		stubs[name] = defineComponent({
			name,
			props: options.props,
			/**
			 * Renders each requested slot directly in the stub element.
			 *
			 * @param  {object}  _
			 *     The declared props. The stub does not render them; tests read
			 *     them through the wrapper's `props()`.
			 * @param  {object}  context
			 *     The setup context, which holds the slots passed to the stub.
			 *
			 * @returns  {Function}
			 *     A render function that outputs the stub element with the
			 *     requested slots, in the order they were listed.
			 */
			setup(_, context) {
				return () =>
					h(
						tag,
						options.slots.flatMap((slot) => context.slots[slot]?.() ?? []),
					);
			},
		});
	}

	return stubs;
}

/**
 * Reads one entry and rejects shapes that cannot describe a single stub.
 *
 * @param  {unknown}  entry
 *     The entry supplied by the caller.
 * @param  {number}  index
 *     The entry's position in the list, used in error messages.
 *
 * @throws  {TypeError}
 *     When the entry cannot describe one stub.
 *
 * @returns  {[string, { slots: string[], props: string[] }]}
 *     The component name and its slot and prop names.
 */
function normaliseEntry(entry, index) {
	if (typeof entry === "string" && entry.trim()) {
		return [entry, { slots: ["default"], props: [] }];
	}

	if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
		throw new TypeError(`Invalid createStubs entry at index ${index}: ${String(entry)}`);
	}

	// The entry's keys, which must be a single component name.
	const names = Object.keys(entry);

	if (names.length !== 1 || !names[0].trim()) {
		throw new TypeError(`Invalid createStubs entry at index ${index}: expected one component name`);
	}

	// The name of the component the stub replaces.
	const name = names[0];
	// The entry's value: a list of slot names, or an options object.
	const value = entry[name];
	// The entry's options, with a bare slot list read as `{ slots }`.
	const options = Array.isArray(value) ? { slots: value } : value;

	if (!options || typeof options !== "object" || Array.isArray(options)) {
		throw new TypeError(`Invalid createStubs entry ${name}: expected slots or options`);
	}

	// The slots to render, in the caller's order.
	const slots = options.slots === undefined ? ["default"] : options.slots;
	// The props the stub declares, so the wrapper's `props()` returns them.
	const props = options.props === undefined ? [] : options.props;

	if (!Array.isArray(slots) || !Array.isArray(props)) {
		throw new TypeError(`Invalid createStubs entry ${name}: slots and props must be arrays`);
	}

	if (![...slots, ...props].every((item) => typeof item === "string" && item.trim())) {
		throw new TypeError(
			`Invalid createStubs entry ${name}: slot and prop names must be non-empty strings`,
		);
	}

	return [name, { slots, props }];
}

/**
 * Converts a PascalCase or camelCase component name to kebab-case, as Vue Test
 * Utils does when it names its own stub elements.
 *
 * @param  {string}  name
 *     The component name to convert.
 *
 * @returns  {string}
 *     The kebab-case name, such as `page-title` for `PageTitle`.
 */
function hyphenate(name) {
	return name.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}
