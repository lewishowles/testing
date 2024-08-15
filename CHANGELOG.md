# Changelog

- `getFormField` can now be used without a previous element, in which case a provided selector will be used to first select the element, then find a form field within it.
## 0.2.1 - 2024-08-14

### Cypress

Fixed an incorrect command name that would stop `getFormField` from working.

## 0.2.0 - 2024-08-14

### Cypress

Added two new commands:

- `shouldNotBeVisible()` - Ensure that an element is not visible.
- `getFormField()` - Get the underlying form field (`input`, `select`, `textarea`) for a previous subject.

## 0.1.0 - 2024-08-13

### Cypress

Added five initial commands:

- `getByData(attribute)` - Retrieve an element by its `data-test` attribute.
- `shouldBeVisible()` - Ensure that an element is visible.
- `shouldHaveAttribute(attribute, value)` - Ensure that an element has an `attribute` with a given `value`.
- `shouldHaveCount(count)` - Ensure that there are `count` elements.
- `shouldHaveText(text)` - Ensure that the element _contains_ the given `text` (including partial matches).
