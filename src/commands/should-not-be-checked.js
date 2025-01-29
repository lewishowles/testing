/**
 * Ensure that the subject is not checked. If the subject is not itself a
 * checkbox, we run `getFormField` automatically to try to find a checkbox
 * first.
 */
Cypress.Commands.add("shouldNotBeChecked", { prevSubject: "element" }, subject => {
	if (subject.is(":checkbox")) {
		return cy.wrap(subject).should("not.be.checked");
	} else {
		return cy.wrap(subject).getFormField().should("not.be.checked");
	}
});
