/**
 * Ensure that the subject has focus.
 */
Cypress.Commands.add("shouldHaveFocus", { prevSubject: "element" }, (subject) => {
	cy.wrap(subject).should("have.focus");
});
