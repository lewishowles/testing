/**
 * Simplify the process of retrieving the component in Cypress component
 * testing.
 */
Cypress.Commands.add("getComponent", () => {
	return cy.wrap(Cypress.vueWrapper.vm);
});
