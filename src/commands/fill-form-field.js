/**
 * Fill a text-based form field with the given value.
 *
 * Usage:
 * cy.fillFormField("selector", "value");
 * cy.getByData("selector").fillFormField("value");
 */
Cypress.Commands.add("fillFormField", { prevSubject: "optional" }, (subject, selectorOrValue, value) => {
	if (subject) {
		return cy.wrap(subject).getFormField().type(selectorOrValue);
	}

	return cy.getFormField(selectorOrValue).type(value);
});
