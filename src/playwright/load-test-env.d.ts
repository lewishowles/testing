/**
 * Loads the project's `.env` file for Playwright workers.
 *
 * Pass the directory of the calling config file so the `.env` path is resolved
 * relative to the project root, not this package.
 *
 * Silently does nothing when `.env` is absent — in CI, environment variables
 * come from the environment directly.
 *
 * @param  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 *
 * @example
 * loadTestEnv(dirname(fileURLToPath(import.meta.url)))
 */
export declare function loadTestEnv(configDir: string): void;
