/**
 * Retrieve an element by a data-test selector. If a previous subject is found,
 * the search is scoped inside that subject. Otherwise, looks for the subject
 * anywhere on the page.
 */
Cypress.Commands.add("getByData", { prevSubject: "optional" }, (subject, selector) => {
	const query = `[data-test=${selector}]`;

	if (subject) {
		return cy.wrap(subject).find(query);
	} else {
		return cy.get(query);
	}
});
