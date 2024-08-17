/**
 * Ensure that the previous element has the given class.
 */
Cypress.Commands.add("shouldHaveClass", { prevSubject: "element" }, (subject, className) => {
	return cy.wrap(subject).should("have.class", className);
});
