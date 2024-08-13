/**
 * Ensure that the subject is visible.
 */
Cypress.Commands.add("shouldBeVisible", { prevSubject: "element" }, (subject) => {
	cy.wrap(subject).should("be.visible");
});
