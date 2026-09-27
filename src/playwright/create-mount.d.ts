import type { Component } from "vue";
import type { MountingOptions } from "@vue/test-utils";
import type { Locator } from "@playwright/test";

/**
 * Options for Playwright CT mount calls.
 */
export type PlaywrightMountOptions = MountingOptions<Record<string, unknown>> &
	Record<string, unknown>;

/**
 * Playwright's mount fixture from the component test context.
 */
export type MountFixture = (
	component: Component,
	options?: Record<string, unknown>,
) => Promise<Locator>;

/**
 * Creates a mount function for a Playwright component test. When a call passes
 * only props, they can be given directly without a `props` key.
 *
 * Default options are deep-merged with per-call options on each mount.
 *
 * @param  component
 *     The Vue component to mount.
 * @param  defaultOptions
 *     Options applied to every mount call unless overridden.
 *
 * @returns
 *     A function that mounts the component with Playwright's mount fixture.
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
 * An empty 24 by 24 SVG for filling icon or image slots in component tests.
 *
 * Playwright CT slots accept only strings, so a test cannot pass an icon
 * component there.
 */
// The SVG markup to pass as slot content.
export declare const slotSvg: string;
