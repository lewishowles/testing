/**
 * Get the underlying form field (`input`, `select`, `textarea`) for a previous
 * subject.
 */
Cypress.Commands.add("shouldNotBeVisible", { prevSubject: "element" }, (subject) => {
	cy.wrap(subject).find("input, select, textarea");
});
