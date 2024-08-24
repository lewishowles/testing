/**
 * Ensure that the previous element does not have the given class.
 */
Cypress.Commands.add("shouldNotHaveClass", { prevSubject: "element" }, (subject, className) => {
	return cy.wrap(subject).should("not.have.class", className);
});
