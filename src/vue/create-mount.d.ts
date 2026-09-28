import type { Component } from "vue";
import type { MountingOptions, VueWrapper } from "@vue/test-utils";
import type { StubEntry } from "./create-stubs.js";

/**
 * Vue Test Utils options passed to mountComposable or a mount function.
 */
export type MountOptions = MountingOptions<Record<string, unknown>> & Record<string, unknown>;

/**
 * Options accepted by createMount, createDeepMount and their mount functions.
 */
export type CreateMountOptions = MountOptions & {
	/**
	 * Components to replace with named stubs, in the list form createStubs
	 * accepts.
	 */
	stubs?: StubEntry[];
};

/**
 * Creates a mount function with shared defaults. When a call passes only props,
 * they can be given directly without a `props` key.
 *
 * Any default options passed here are deep-merged with per-call options on each
 * mount, so individual tests can override specific values.
 *
 * Mounted wrappers are tracked and can be cleaned up via
 * `cleanupMountedWrappers`, which prevents `@vueuse/core` listener pollution
 * between tests.
 *
 * @param  component      The Vue component to mount.
 * @param  defaultOptions Options applied to every mount call unless overridden.
 * @param  mountFunction  Either `mount` or `shallowMount` (the default).
 *
 * @returns  A function accepting options or props and returning a `VueWrapper`.
 */
export declare function createMount(
	component: Component,
	defaultOptions?: CreateMountOptions,
	mountFunction?: (component: Component, options?: MountOptions) => VueWrapper,
): (options?: CreateMountOptions | Record<string, unknown>) => VueWrapper;

/**
 * Returns a mount function using `mount` instead of `shallowMount`, rendering
 * child components in full.
 *
 * @param  component      The Vue component to mount.
 * @param  defaultOptions Options applied to every mount call unless overridden.
 *
 * @returns  A function accepting options or props and returning a `VueWrapper`.
 */
export declare function createDeepMount(
	component: Component,
	defaultOptions?: CreateMountOptions,
): (options?: CreateMountOptions | Record<string, unknown>) => VueWrapper;

/**
 * Runs a composable inside a fully mounted component so its lifecycle hooks and
 * injected values work during the test. The wrapper is tracked for cleanup.
 *
 * @param  fn      The composable to call without arguments during component setup.
 * @param  options Options passed directly to Vue Test Utils `mount`.
 *
 * @returns  The composable result and the mounted Vue wrapper.
 */
export declare function mountComposable<Result>(
	fn: () => Result,
	options?: MountOptions,
): { result: Result; wrapper: VueWrapper };

/**
 * Unmounts all tracked wrappers and clears the tracking list.
 *
 * Call this in `afterEach` to prevent things like `@vueuse/core` event
 * listeners from accumulating across tests. It is exported for manual use when
 * the automatic `afterEach` call is not available.
 */
export declare function cleanupMountedWrappers(): void;
