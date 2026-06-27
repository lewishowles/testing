/** Shared `use` options for Playwright CT and E2E configs. */
export interface SharedUseOptions {
	/** The attribute used by `page.getByTestId()`. */
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
export declare const sharedUse: SharedUseOptions;
