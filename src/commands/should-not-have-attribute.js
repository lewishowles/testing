/**
 * Ensure that the given subject does not have a given attribute with the
 * provided value.
 *
 * If no value is provided, a check for the existence of the attribute is
 * performed instead.
 */
Cypress.Commands.add("shouldNotHaveAttribute", { prevSubject: "element" }, (subject, attribute, value) => {
	if (value) {
		cy.wrap(subject).should("not.have.attr", attribute, value);
	} else {
		cy.wrap(subject).should("not.have.attr", attribute);
	}
});
