/**
 * Ensure that the previous subject has the given number of elements.
 */
Cypress.Commands.add("shouldHaveCount", { prevSubject: "element" }, (subject, count) => {
	const elementCount = subject.length;

	expect(elementCount).to.equal(count);
});
