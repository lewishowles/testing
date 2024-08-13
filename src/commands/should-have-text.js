/**
 * Ensure that the previous element contains the given text. This uses include,
 * and will pass for a partial match.
 */
Cypress.Commands.add("shouldHaveText", { prevSubject: "element" }, (subject, text) => {
	const elementText = subject.text();

	expect(elementText).to.include(text);
});
