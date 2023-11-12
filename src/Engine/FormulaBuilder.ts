/**
 *  class TokenProcessor
 *
 * This class is responsible for processing the tokens
 *
 * a local Formula is used to store the current formula
 *
 * It provides a method to add a token to the formula
 *
 * It provides a method to get the formula
 *
 * It provides a method to get the display string
 *
 */
import Cell from "./Cell";

export class FormulaBuilder {
  // the current formula
  private formula: FormulaType = [];
  // define the max length of the formula
  private readonly maxFormulaLength: number = 100;
  private _lastErrorMessage: string = "";

  constructor() {
    this.formula = [];
  }

  /**
   *
   * @param
   * @returns the value of the formula
   *
   * */
  getFormula(): FormulaType {
    return this.formula;
  }

  /**
   *  Set the formula
   */
  setFormula(formula: FormulaType): void {
    this.formula = [...formula];
    if (formula.length === 0) {
      this._lastErrorMessage = ""; // Reset error message when formula is cleared
    }
  }

  private formulaLengthWithNewToken(): number {
    // This needs to be implemented according to how you calculate the length
    // For example, if each token is a string, you can just sum up the lengths
    let tempLength = 0;
    for (const token of this.formula) {
      if (isNaN(Number(token)) && token !== ".") {
        tempLength += token.length + 2;
      } else {
        tempLength += token.length;
      }
    }
    return tempLength;
  }

  // get error message
  public getLastError(): string {
    return this._lastErrorMessage;
  }

  /**
   *  add token to current formula
   * 
   * @param token
   * 
   * If the last token in the formula is a number and the input token is a number then append the input token to the last token
   * If the last token in the formula is a number and the input token is . then append the input token to the last token
   * If we updated the last token then replace the last token in the formula with the updated token
   * If we did not update the last token then add the token to the formula
   * 
  
   */
  addToken(token: TokenType): void {
    let lastTokenUpdated = false;
    let ignoringToken = false;
    if (
      this.formulaLengthWithNewToken() + token.length >
      this.maxFormulaLength
    ) {
      // Here you can handle the scenario when the formula is too long
      // For example, you can ignore the new token or display an error message
      this._lastErrorMessage = "Please limit your formula into 100 words.";
      return;
    }

    // if there is no formula then add the token to the formula
    if (this.formula.length === 0) {
      this.formula = [...this.formula, token];
      return;
    }

    // get the last token of the formula
    let lastToken = this.formula[this.formula.length - 1];

    // if the last token is a number and the input token is a number then append the input token to the last token
    if (!isNaN(Number(lastToken)) && !isNaN(Number(token))) {
      lastToken += token;
      lastTokenUpdated = true;
    }

    // if the last token is not a number and the input token is a number then add the token to the formula
    if (isNaN(Number(lastToken)) && token === ".") {
      ignoringToken = true;
    }

    // check for the existence of a period in the previous token first
    // if the last token is a number and the input token is . and the number contains a . then do not append the input token to the last token
    // if the last token contains a "."
    if (!isNaN(Number(lastToken)) && token === "." && lastToken.includes(".")) {
      lastTokenUpdated = false;
      ignoringToken = true;
    }

    // if the last token is a number and the input token is . then append the input token to the last token
    // if the last token does not contain a "."
    if (
      !isNaN(Number(lastToken)) &&
      token === "." &&
      !lastToken.includes(".")
    ) {
      lastToken += token;
      lastTokenUpdated = true;
    }

    // If we updated the last token then replace the last token in the formula with the updated token
    // if the ignoringToken flag is set to true then do not update the last token
    if (lastTokenUpdated) {
      this.formula[this.formula.length - 1] = lastToken;
    } else if (!ignoringToken) {
      // add the token to the formula
      this.formula = [...this.formula, token];
    } else {
      // do nothing but leave the else here for clarity
      // this is where we would handle the case where we are ignoring the token
      // fortunately we do not need to do anything here
    }
  }

  /**
   * remove the last token from the formula
   *
   * if the last token is a number with more than one character it should only remove the last character of that token
   */
  removeToken(): void {
    // if there is no formula then do nothing
    if (this.formula.length === 0) {
      return;
    }

    // get the last token of the formula
    let lastToken = this.formula[this.formula.length - 1];

    // if the last token is a number with more than one character it should only remove the last character of that token
    if (!isNaN(Number(lastToken)) && lastToken.length > 1) {
      lastToken = lastToken.substring(0, lastToken.length - 1);
      this.formula[this.formula.length - 1] = lastToken;
    } else {
      // remove the last token from the formula
      this.formula.pop();
    }
    // Re-evaluate conditions and reset error message if conditions are no longer violated
    if (this.formulaLengthWithNewToken() <= this.maxFormulaLength) {
      this._lastErrorMessage = "";
    }
  }

  /**
   * getFormulaString
   * return the formula as a string
   * add a space between each token
   * remove the last space if there is one
   */
  getFormulaString(): string {
    let result = "";

    for (let i = 0; i < this.formula.length; i++) {
      result += this.formula[i] + " ";
    }
    // remove the last space if there is one
    if (result.length > 0) {
      result = result.substring(0, result.length - 1);
    }

    return result;
  }

  /**
   * parse the formula and return a list of cell references (deduped)
   *
   * @returns a list of cell references
   * */
  public static getCellReferences(formula: string[]): string[] {
    let result: string[] = [];
    for (let i = 0; i < formula.length; i++) {
      let token = formula[i];

      // if the token is a cell reference then add it to the list
      // and make sure it is not already in the list
      if (Cell.isValidCellLabel(token) && !result.includes(token)) {
        result.push(token);
      }
    }

    return result;
  }
}

export default FormulaBuilder;
