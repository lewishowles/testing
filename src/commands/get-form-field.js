/**
 * This command has two variants:
 *
 * 1. No selector, in which case a form field is found within a previous
 * subject.
 *
 * 2. With selector, in which case that data-test selector is retrieve and an
 * input found within it.
 */
Cypress.Commands.add("getFormField", { prevSubject: "optional" }, (subject, selector) => {
	if (subject) {
		return cy.wrap(subject).find("input, select, textarea");
	}

	return cy.getByData(selector).find("input, select, textarea");
});
