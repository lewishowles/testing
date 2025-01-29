/**
 * Ensure that the subject is NOT visible.
 */
Cypress.Commands.add("shouldNotBeVisible", { prevSubject: "element" }, subject => {
	cy.wrap(subject).should("not.be.visible");
});
