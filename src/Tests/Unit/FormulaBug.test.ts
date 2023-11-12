import FormulaBuilder from "../../Engine/FormulaBuilder"; // Adjust the import path as necessary

describe("FormulaBuilder", () => {
  it("should display the complete formula within 100 words", () => {
    const formulaBuilder1 = new FormulaBuilder();
    const formula = "1234567890".repeat(10); // Creates a string with 100 characters
    formulaBuilder1.addToken(formula);
    expect(formulaBuilder1.getFormulaString()).toBe(formula);
  });

  it("should limit the formula length to 100 characters", () => {
    const formulaBuilder2 = new FormulaBuilder();
    const formula = "1234567890".repeat(10); // Creates a string with 100 characters
    formulaBuilder2.addToken(formula);
    const newWord = "*";
    formulaBuilder2.addToken(newWord);

    // Check if the length of the formula is limited to 100 characters
    expect(formulaBuilder2.getFormulaString().length).toBe(formula.length); // This will fail if the limit is implemented
  });

  it("should limit the formula length to 100 characters and not include '*'", () => {
    const formulaBuilder2 = new FormulaBuilder();
    const formula = "1234567890".repeat(10); // Creates a string with 100 characters
    formulaBuilder2.addToken(formula);
    const newWord = "*";
    formulaBuilder2.addToken(newWord);

    // Check if the length of the formula is limited to 100 characters
    const resultingFormula = formulaBuilder2.getFormulaString();
    expect(resultingFormula.length).toBe(100);

    // Check if the resulting formula string does not contain '*'
    expect(resultingFormula).not.toContain("*");
  });
});
