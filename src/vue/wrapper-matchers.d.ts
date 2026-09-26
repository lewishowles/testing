declare module "vitest" {
	interface Assertion<T = any> {
		/**
		 * Passes when a Vue Test Utils lookup found an element.
		 */
		toExist(): void;
		/**
		 * Passes when the element has the attribute and, when a value is given,
		 * that exact value. Fails on a missing element, even with `.not`.
		 */
		toHaveAttribute(name: string, value?: string): void;
	}
}

export {};
