import { join } from "node:path";

/**
 * Returns the absolute path to the snapshot directory, resolved relative to
 * the calling config file.
 *
 * Pass the directory of the Playwright config file so the path is resolved
 * correctly in the consumer project, not relative to this package.
 *
 * @param  {string}  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 *
 * @example
 * snapshotDir(dirname(fileURLToPath(import.meta.url))) // → /project/test/snapshots
 */
export function snapshotDir(configDir) {
	return join(configDir, "snapshots");
}
