# Changelog

## 0.2.0

### Cypress

Added two new commands:

- `shouldNotBeVisible()` - Ensure that an element is not visible.
- `getFormField()` - Get the underlying form field (`input`, `select`, `textarea`) for a previous subject.

## 0.1.0

### Cypress

Added five initial commands:

- `getByData(attribute)` - Retrieve an element by its `data-test` attribute.
- `shouldBeVisible()` - Ensure that an element is visible.
- `shouldHaveAttribute(attribute, value)` - Ensure that an element has an `attribute` with a given `value`.
- `shouldHaveCount(count)` - Ensure that there are `count` elements.
- `shouldHaveText(text)` - Ensure that the element _contains_ the given `text` (including partial matches).
