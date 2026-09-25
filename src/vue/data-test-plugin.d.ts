import type { DOMWrapper } from "@vue/test-utils";

declare module "@vue/test-utils" {
	interface BaseWrapper<ElementType extends Node> {
		/** Finds the first descendant with the given data-test value. */
		getByData(name: string): DOMWrapper<Element>;
		/** Finds every descendant with the given data-test value. */
		getAllByData(name: string): DOMWrapper<Element>[];
	}
}

/** Adds data-test lookups to Vue Test Utils wrappers. Repeated calls have no effect. */
export declare function installDataTestPlugin(): void;
