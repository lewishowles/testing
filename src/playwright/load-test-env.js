import { join } from "node:path";

/**
 * Loads the project's `.env` file for Playwright workers.
 *
 * Pass the directory of the calling config file so the `.env` path is resolved
 * relative to the project root, not this package.
 *
 * Silently does nothing when `.env` is absent — in CI, environment variables
 * come from the environment directly.
 *
 * @param  {string}  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 *
 * @example
 * loadTestEnv(dirname(fileURLToPath(import.meta.url)))
 */
export function loadTestEnv(configDir) {
	try {
		process.loadEnvFile(join(configDir, "../.env"));
	} catch {
		// No .env present — CI provides env vars directly.
	}
}
