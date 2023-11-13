import React from "react";

import Cell from "../Engine/Cell";

import "./SheetComponent.css";

// a component that will render a two dimensional array of cells
// the cells will be rendered in a table
// the cells will be rendered in rows
// a click handler will be passed in

interface SheetComponentProps {
  cellsValues: Array<Array<string>>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentCell: string;
  currentlyEditing: boolean;
} // interface SheetComponentProps

export function getCellValue(cell: string) {
  // split on | return the first part
  let cellForShort = cell.split("|")[0];
  if (cellForShort.length >= 10) { 
    cellForShort = cellForShort.substring(0, 10);
  }
  return cellForShort;
}
export function getCellEditor(cell: string) {
  // split on | return the second part
  let editorForShort = cell.split("|")[1];
  if (editorForShort.length >= 15) { 
    editorForShort = editorForShort.substring(0, 15) + '...';
  }
  return editorForShort;
}

function SheetComponent({ cellsValues, onClick, currentCell, currentlyEditing }: SheetComponentProps) {

  /**
   * 
   * @param cellLabel 
   * @returns the class name for the cell
   * 
   * if the cell is the current cell and the sheet is in edit mode
   * then the cell will be rendered with the class name "cell-editing"
   * 
   * if the cell is the current cell and the sheet is not in edit mode
   * then the cell will be rendered with the class name "cell-selected"
   * 
   * otherwise the cell will be rendered with the class name "cell"
   */
  function getCellClass(cellLabel: string) {

    if (cellLabel === currentCell && currentlyEditing) {
      return "cell-editing";
    }
    if (cellLabel === currentCell) {
      return "cell-selected";
    }
    return "cell";
  }

  return (
    <table className="table">
      <tbody>
        {/*add a row with column cellsValues */}
        <tr>
          <th></th>
          {cellsValues[0].map((col, colIndex) => (
            <th className="column-label" key={colIndex}>
              {Cell.columnNumberToName(colIndex)}
            </th>
          ))}
        </tr>
        {cellsValues.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="row-label"> {Cell.rowNumberToName(rowIndex)}</td>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button
                  onClick={onClick}
                  value={cell}
                  cell-label={Cell.columnRowToCell(colIndex, rowIndex)}
                  data-testid={Cell.columnRowToCell(colIndex, rowIndex)}
                  className={(getCellClass(Cell.columnRowToCell(colIndex, rowIndex)))}
                >
                  {getCellValue(cell)}
                  <label className="cell-label">{getCellEditor(cell)}</label>
                </button>

              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
} // SheetComponent




export default SheetComponent;