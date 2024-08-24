/**
 * Ensure that the previous element does not contain the given text. This uses
 * include, and will pass for a partial match.
 */
Cypress.Commands.add("shouldNotHaveText", { prevSubject: "element" }, (subject, text) => {
	return cy.wrap(subject).should("not.contain.text", text);
});
