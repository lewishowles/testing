/**
 * Ensure that the subject is checked. If the subject is not itself a checkbox,
 * we run `getFormField` automatically to try to find a checkbox first.
 */
Cypress.Commands.add("shouldBeChecked", { prevSubject: "element" }, subject => {
	if (subject.is(":checkbox")) {
		return cy.wrap(subject).should("be.checked");
	} else {
		return cy.wrap(subject).getFormField().should("be.checked");
	}
});
