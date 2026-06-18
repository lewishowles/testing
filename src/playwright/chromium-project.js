import { devices } from "@playwright/test";

/**
 * A Playwright project definition targeting Desktop Chrome.
 *
 * Pass as an entry in the `projects` array of `defineConfig`.
 *
 * @example
 * export default defineConfig({ projects: [chromiumProject] })
 */
export const chromiumProject = {
	name: "chromium",
	use: { ...devices["Desktop Chrome"] },
};
