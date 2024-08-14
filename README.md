# Testing

Supercharge Cypress and Vitest testing with super-handy helpers for everything from selecting and counting elements to API mocking.

## Cypress

To use the library in Cypress, simply import the `commands.js` into `cypress/support/commands.js`. For example:

`import @lewishowles/testing/src/commands.js`;

### `getByData(selector)`

Retrieve an element by its `data-test` attribute. For example `[data-test="selector"]`.

### `getFormField()`

Retrieve the underlying form element (`input`, `select`, `textarea`) for a previous subject.

### `shouldBeVisible`

Ensure that an element is visible.

### `shouldNotBeVisible`

Ensure that an element is not visible.

### `shouldHaveAttribute(attribute, value)`

Ensure that an element has `attribute` with value `value`.

### `shouldHaveCount(count)`

Ensure that there are `count` elements.

### `shouldHaveText(text)`

Ensure that an element _contains_ the given `text` (including partial matches).
