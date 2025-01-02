# Changelog

## 0.8.0 - 2025-01-02

### Cypress

Added one new commands:

- `shouldNotExist()` - Assert that an element does not exist on the page.

## 0.7.0 - 2024-11-01

### Cypress

Added two new commands:

- `shouldHaveFocus()` - Assert that an element has focus in the document.
- `shouldNotHaveFocus()` - Assert that an element does not have focus in the document.

## 0.6.0 - 2024-09-02

### Cypress

Added two new commands:

- `fillFormField(selector, value)` - Fill a text-based form field with `data-test` attribute `selector` with `value`.
- `shouldHaveValue(value)` - Assert that a previous form field has `value`.

## 0.5.0 - 2024-08-24

### Cypress

Added three new commands:

- `shouldNotHaveClass(className)` - Assert that an element does not have the given `className`.
- `shouldNotHaveAttribute(attribute, value)` - Assert that an element does not have an `attribute` with a given `value`.
- `shouldNotHaveText(text)` - Assert that the element does not _contain_ the given `text` (including partial matches).

## 0.4.0 - 2024-08-17

### Cypress

Added one new command:

- `shouldHaveClass(className)` - Assert that an element has the given `className`.

## 0.3.0 - 2024-08-15

### Cypress

- `shouldHaveAttribute` can now accept only an attribute, in which case the existence of that attribute is checked.
- `getFormField(selector)` can now be used without a previous element, in which case a provided selector will be used to first select the element, then find a form field within it.

## 0.2.1 - 2024-08-14

### Cypress

Fixed an incorrect command name that would stop `getFormField` from working.

## 0.2.0 - 2024-08-14

### Cypress

Added two new commands:

- `shouldNotBeVisible()` - Assert that an element is not visible.
- `getFormField()` - Get the underlying form field (`input`, `select`, `textarea`) for a previous subject.

## 0.1.0 - 2024-08-13

### Cypress

Added five initial commands:

- `getByData(selector)` - Retrieve an element by its `data-test` attribute.
- `shouldBeVisible()` - Assert that an element is visible.
- `shouldHaveAttribute(attribute, value)` - Assert that an element has an `attribute` with a given `value`.
- `shouldHaveCount(count)` - Assert that there are `count` elements.
- `shouldHaveText(text)` - Assert that the element _contains_ the given `text` (including partial matches).
