/**
 * Loads the project's `.env` file for Playwright workers.
 *
 * Pass the directory of the calling config file so the `.env` path is resolved
 * relative to the project root, not this package.
 *
 * Does nothing when `.env` is missing or cannot be read, because CI sets
 * environment variables directly.
 *
 * @param  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 *
 * @example
 * loadTestEnv(dirname(fileURLToPath(import.meta.url)))
 */
export declare function loadTestEnv(configDir: string): void;
