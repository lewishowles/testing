/**
 * A Playwright project definition that runs tests in Chromium with default
 * browser settings.
 *
 * Pass as an entry in the `projects` array of `defineConfig`.
 *
 * @example
 * export default defineConfig({ projects: [chromiumProject] })
 */
// The project entry that runs tests in Chromium.
export const chromiumProject = {
	name: "chromium",
	use: { browserName: "chromium" },
};
