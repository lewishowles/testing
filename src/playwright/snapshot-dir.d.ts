/**
 * Returns the absolute path to the snapshot directory, resolved relative to
 * the calling config file.
 *
 * Pass the directory of the Playwright config file so the path is resolved
 * correctly in the consumer project, not relative to this package.
 *
 * @param  configDir
 *     Absolute path to the directory containing the Playwright config file.
 *     Typically `dirname(fileURLToPath(import.meta.url))`.
 * @returns Absolute path to the snapshots directory.
 *
 * @example
 * snapshotDir(dirname(fileURLToPath(import.meta.url))) // → /project/test/snapshots
 */
export declare function snapshotDir(configDir: string): string;
