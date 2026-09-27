/**
 * Shared `use` options for Playwright CT and E2E configs.
 */
export interface SharedUseOptions {
	/**
	 * The attribute used by `page.getByTestId()`.
	 */
	testIdAttribute: string;
}

/**
 * Shared `use` options for Playwright CT and E2E configs.
 *
 * Spread into the `use` key of `defineConfig` to apply consistent defaults
 * across all projects.
 *
 * @example
 * export default defineConfig({ use: { ...sharedUse } })
 */
// Makes `page.getByTestId()` match `data-test`, the same attribute the Vue
// unit-test `getByData` helpers look up.
export declare const sharedUse: SharedUseOptions;
