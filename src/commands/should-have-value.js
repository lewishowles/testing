/**
 * Ensure that the previous element contains the given value.
 *
 * @param  {string}  value
 *     The value to check for.
 */
Cypress.Commands.add("shouldHaveValue", { prevSubject: "element" }, (subject, value) => {
	return cy.wrap(subject).should("have.value", value);
});
