# Testing

Supercharge Cypress and Vitest testing with super-handy helpers for everything from selecting and counting elements to API mocking.

## Cypress

To use the library in Cypress, simply import the `commands.js` into `cypress/support/commands.js`. For example:

`import @lewishowles/testing/src/commands.js`;

### `getByData(selector)`

Retrieve an element by its `data-test` attribute. For example `[data-test="selector"]`.

### `element.getFormField()`

Retrieve the underlying form element (`input`, `select`, `textarea`) for a previous subject.

### `cy.getFormField(selector)`

Retrieve the element via `getByData`, then find the underlying form element.

### `shouldBeVisible`

Ensure that an element is visible.

### `shouldNotBeVisible`

Ensure that an element is not visible.

### `shouldHaveClass(className)`

Ensure that an element has the given `className`.

### `shouldNotHaveClass(className)`

Ensure that an element does not have the given `className`.

### `shouldHaveAttribute(attribute, value)`

Ensure that an element has `attribute` with value `value`. If no value is provided, the existence of `attribute` is checked.

### `shouldNotHaveAttribute(attribute, value)`

Ensure that an element does not have `attribute` with value `value`. If no value is provided, the existence of `attribute` is checked.

### `shouldHaveCount(count)`

Ensure that there are `count` elements.

### `shouldHaveText(text)`

Ensure that an element _contains_ the given `text` (including partial matches).

### `shouldNotHaveText(text)`

Ensure that an element does not _contain_ the given `text` (including partial matches).
