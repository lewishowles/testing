import { join } from "node:path";

/**
 * Returns the absolute path of the `snapshots` directory next to the calling
 * config file.
 *
 * Pass the directory of the Playwright config file so the path is resolved
 * correctly in the consumer project, not relative to this package.
 *
 * @param  {string}  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 *
 * @returns  {string}
 *     The absolute path of the snapshots directory.
 *
 * @example
 * snapshotDir(dirname(fileURLToPath(import.meta.url))) // → /project/test/snapshots
 */
export function snapshotDir(configDir) {
	return join(configDir, "snapshots");
}
