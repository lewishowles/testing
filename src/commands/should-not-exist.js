/**
 * Ensure that a given subject does NOT exist. We don't look for a prevSubject
 * here because when there is a required subject, Cypress internally ensures
 * that the subject exists.
 */
Cypress.Commands.add("shouldNotExist", subject => {
	cy.wrap(subject).should("not.exist");
});
