/**
 * Ensure that the given subject has a given attribute with the provided value.
 */
Cypress.Commands.add("shouldHaveAttribute", { prevSubject: "element" }, (subject, attribute, value) => {
	const attributeValue = subject.attr(attribute);

	expect(attributeValue).to.equal(value);
});
