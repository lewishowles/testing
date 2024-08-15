/**
 * Ensure that the given subject has a given attribute with the provided value.
 *
 * If no value is provided, a check for the existence of the attribute is
 * performed instead.
 */
Cypress.Commands.add("shouldHaveAttribute", { prevSubject: "element" }, (subject, attribute, value) => {
	if (value) {
		cy.wrap(subject).should("have.attr", attribute, value);
	} else {
		cy.wrap(subject).should("have.attr", attribute);
	}
});
