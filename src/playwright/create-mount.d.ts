import type { Component } from "vue";
import type { MountingOptions } from "@vue/test-utils";
import type { Locator } from "@playwright/test";

/** Options for Playwright CT mount calls. */
export type PlaywrightMountOptions = MountingOptions<Record<string, unknown>> &
	Record<string, unknown>;

/** Playwright's mount fixture from the component test context. */
export type MountFixture = (
	component: Component,
	options?: Record<string, unknown>,
) => Promise<Locator>;

/**
 * Returns a function that mounts the given component in a Playwright component
 * test with shared default options, removing the need to specify a `props` key
 * when only props are provided.
 *
 * Any default options passed here are deep-merged with per-call options on
 * each mount.
 *
 * @param  component      The Vue component to mount.
 * @param  defaultOptions Options applied to every mount call unless overridden.
 * @returns A mount function that accepts Playwright's mount fixture and per-call options.
 *
 * @example
 * const mount = createMount(MyComponent, { props: { label: "default" } });
 * // In a test:
 * const component = await mount(mountFixture, { label: "override" });
 */
export declare function createMount(
	component: Component,
	defaultOptions?: PlaywrightMountOptions,
): (
	mount: MountFixture,
	options?: PlaywrightMountOptions | Record<string, unknown>,
) => Promise<Locator>;

/**
 * Minimal SVG string for use in slot tests.
 *
 * Playwright CT's string-only slot API does not accept component references,
 * so this provides a valid SVG placeholder where an icon or image slot is
 * required.
 */
export declare const slotSvg: string;
