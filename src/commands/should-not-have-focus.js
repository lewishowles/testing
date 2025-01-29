/**
 * Ensure that the subject does not have focus.
 */
Cypress.Commands.add("shouldNotHaveFocus", { prevSubject: "element" }, subject => {
	cy.wrap(subject).should("not.have.focus");
});
