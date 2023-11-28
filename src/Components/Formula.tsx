import React from "react";

import "./Formula.css";

// FormulaComponentProps
// we pass in value for the formula 
// and the value for the current result
type FormulaProps = {
  formulaString: string;
  resultString: string;
} // interface FormulaProps


const Formula: React.FC<FormulaProps> = ({ formulaString, resultString }) => {
  return (
    <div>
      <table className="formula-table">
        <tr>
          <td><span className="formula-title" data-testid="FormulaTitle">Formula</span></td>
          <td><div className="formula">
         {/* make formula scrollable */}
        <span data-testid="FormulaValue">{formulaString} </span>
      </div></td>
        </tr>
        <tr>
          <td><span className="formula-title" data-testid="Result">Result</span></td>
          <td> <div className="formula">
        <span data-testid="FormulaResult">{resultString}</span>
      </div> </td>
        </tr>
      </table>
    </div>

  );
} // const Formula 

export default Formula; 