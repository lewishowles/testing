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

### `element.fillFormField(value)`

Retrieve the underlying form element (`input`, `select`, `textarea`) for a previous subject and fill it with the text `value`.

### `cy.fillFormField(selector, value)`

Retrieve the element via `getByData`, then find the underlying form element, and fill it with `value`.

### `shouldHaveValue`

Assert that a previous form field has `value`.

### `shouldBeVisible`

Assert that an element is visible.

### `shouldNotBeVisible`

Assert that an element is not visible.

### `shouldHaveClass(className)`

Assert that an element has the given `className`.

### `shouldNotHaveClass(className)`

Assert that an element does not have the given `className`.

### `shouldHaveAttribute(attribute, value)`

Assert that an element has `attribute` with value `value`. If no value is provided, the existence of `attribute` is checked.

### `shouldNotHaveAttribute(attribute, value)`

Assert that an element does not have `attribute` with value `value`. If no value is provided, the existence of `attribute` is checked.

### `shouldHaveCount(count)`

Assert that there are `count` elements.

### `shouldHaveText(text)`

Assert that an element _contains_ the given `text` (including partial matches).

### `shouldNotHaveText(text)`

Assert that an element does not _contain_ the given `text` (including partial matches).

### `shouldHaveFocus()`

Assert that an element has the current focus.

### `shouldNotHaveFocus()`

Assert that an element does not have the current focus.
