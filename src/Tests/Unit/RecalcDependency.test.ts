/**
 * RecalcDependency.ts
 */
import RecalcDependency from "../../Engine/RecalcDependency";
import SheetMemory from "../../Engine/SheetMemory";
import Cell from "../../Engine/Cell";
import { get } from "http";

let testMemory: SheetMemory;
let recalcDependency: RecalcDependency;
beforeAll(() => {
  testMemory = new SheetMemory(3, 3);
  recalcDependency = new RecalcDependency();

  const cellA1 = new Cell();
  cellA1.setFormula(["A2"]);
  cellA1.setValue(1);
  cellA1.setDisplayString("1");
  cellA1.setDependsOn(["A2"]);

  testMemory.setCurrentCellCoordinates(0, 0);
  testMemory.setCurrentCell(cellA1);


  const cellA2 = new Cell();
  cellA2.setFormula(["2"]);
  cellA2.setValue(2);
  cellA2.setDisplayString("2");
  cellA2.setDependsOn([]);
  testMemory.setCurrentCellCoordinates(0, 1);
  testMemory.setCurrentCell(cellA2);

  const cellA3 = new Cell();
  cellA3.setFormula(["A1"]);
  cellA3.setValue(3);
  cellA3.setDisplayString("3");
  cellA3.setDependsOn(["A1", "A2"]);
  testMemory.setCurrentCellCoordinates(0, 2);
  testMemory.setCurrentCell(cellA3);
}
);

describe("RecalcDependency", () => {

  describe("WORKING updateComputationOrder", () => {
    it("should update the computationOrder to be in the correct order", () => {

      const computationOrder = recalcDependency.updateComputationOrder(testMemory);
      expect(computationOrder[0]).toEqual("A2");
      expect(computationOrder[1]).toEqual("A1");
    });
  });




  describe("add two Dependency to cell", () => {
    it("should add the new dependency to the cell", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let testWriteCell: Cell = new Cell();
      testWriteCell.setFormula(["A2", "-", "A3"]);
      testWriteCell.setValue(0);
      testWriteCell.setDisplayString("0");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(testWriteCell);

      const cellB1 = new Cell();
      cellB1.setFormula(["A1"]);
      testMemory.setCurrentCellCoordinates(1, 0);
      testMemory.setCurrentCell(cellB1);

      recalcDependency.updateDependencies(testMemory);
      const B1DependsOn = testMemory.getCellByLabel("B1").getDependsOn();

      const foundFirstDependency = (B1DependsOn[0] === "A2" || B1DependsOn[0] === "A3");
      const foundSecondDependency = (B1DependsOn[1] === "A2" || B1DependsOn[1] === "A3") && B1DependsOn[1] !== B1DependsOn[0];
      const foundThirdDependency = B1DependsOn[2] === "A1";
      const satisfiedTest = foundFirstDependency && foundSecondDependency && foundThirdDependency;
      expect(satisfiedTest).toEqual(true);
      expect(B1DependsOn[2]).toEqual("A1");

    }
    );
  });

  describe("REVERSE add a chain A1 depends on A2, A2 depends on A3, A3 depends on A4", () => {
    it("should add the new dependency to the cell", () => {
      let testMemory: SheetMemory = new SheetMemory(5, 5);
      let A1Cell = new Cell();
      A1Cell.setFormula(["A2"]);
      A1Cell.setValue(0);
      A1Cell.setDisplayString("0");

      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(A1Cell);

      let A2Cell = new Cell();
      A2Cell.setFormula(["A3"]);
      A2Cell.setValue(0);
      A2Cell.setDisplayString("0");

      testMemory.setCurrentCellCoordinates(0, 1);
      testMemory.setCurrentCell(A2Cell);

      let A3Cell = new Cell();
      A3Cell.setFormula(["A4"]);
      A3Cell.setValue(0);
      A3Cell.setDisplayString("0");

      testMemory.setCurrentCellCoordinates(0, 2);
      testMemory.setCurrentCell(A3Cell);

      let A4Cell = new Cell();
      A4Cell.setFormula(["4"]);
      A4Cell.setValue(4);
      A4Cell.setDisplayString("4");

      testMemory.setCurrentCellCoordinates(0, 3);
      testMemory.setCurrentCell(A4Cell);
      recalcDependency.updateDependencies(testMemory);

      expect(testMemory.getCellByLabel("A1").getDependsOn()).toEqual(["A4", "A3", "A2"]);
      expect(testMemory.getCellByLabel("A2").getDependsOn()).toEqual(["A4", "A3"]);
      expect(testMemory.getCellByLabel("A3").getDependsOn()).toEqual(["A4"]);
    }
    );
  });

  describe("FORWARD add a chain A1 depends on A2, A2 depends on B1, B1 depends on B2", () => {
    it("should add the new dependency to the cell", () => {
      let testMemoryInt: SheetMemory = new SheetMemory(2, 2);
      let A1Cell = new Cell();
      A1Cell.setFormula(["A2"]);
      A1Cell.setValue(0);
      A1Cell.setDisplayString("0");


      testMemoryInt.setCurrentCellCoordinates(0, 0);
      testMemoryInt.setCurrentCell(A1Cell);

      let A2Cell = new Cell();
      A2Cell.setFormula(["B1"]);
      A2Cell.setValue(0);
      A2Cell.setDisplayString("0");


      testMemoryInt.setCurrentCellCoordinates(0, 1);
      testMemoryInt.setCurrentCell(A2Cell);

      let B1Cell = new Cell();
      B1Cell.setFormula(["B2"]);
      B1Cell.setValue(0);
      B1Cell.setDisplayString("0");


      testMemoryInt.setCurrentCellCoordinates(1, 0);
      testMemoryInt.setCurrentCell(B1Cell);

      let B2Cell = new Cell();
      B2Cell.setFormula(["2"]);
      B2Cell.setValue(2);
      B2Cell.setDisplayString("2");


      recalcDependency.updateDependencies(testMemoryInt);



      expect(testMemoryInt.getCellByLabel("A1").getDependsOn()).toEqual(["B2", "B1", "A2"]);
      expect(testMemoryInt.getCellByLabel("A2").getDependsOn()).toEqual(["B2", "B1"]);
      expect(testMemoryInt.getCellByLabel("B1").getDependsOn()).toEqual(["B2"]);

    });
  });
  describe("A 3 by 3 sheet with the first cell being a sum of all the other cells", () => {
    it("should result in a dependsOn array of all the other cells", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let cellA1: Cell = new Cell();
      cellA1.setFormula(["A2", "+", "A3", "+", "B1", "+", "B2", "+", "B3", "+", "C1", "+", "C2", "+", "C3"]);
      cellA1.setValue(0);
      cellA1.setDisplayString("0");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(cellA1);



      recalcDependency.updateDependencies(testMemory);
      const A1DependsOn = testMemory.getCellByLabel("A1").getDependsOn();
      let A1DependsOnSet = new Set(A1DependsOn);
      let expectedSet = new Set(["A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]);
      expect(A1DependsOnSet).toEqual(expectedSet);
    });
  });

  describe("A 3 by 3 sheet with all the cells (exept for the first one) to contain the formula A1", () => {
    it("should result in each other cell having A1 in their dependsOn array", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let cellA1: Cell = new Cell();
      cellA1.setFormula([]);
      cellA1.setValue(0);
      cellA1.setDisplayString("0");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(cellA1);

      let cellOther: Cell = new Cell();
      cellOther.setFormula(["A1"]);
      cellOther.setValue(0);
      cellOther.setDisplayString("0");

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          testMemory.setCurrentCellCoordinates(i, j);
          testMemory.setCurrentCell(cellOther);
        }
      }
      recalcDependency.updateDependencies(testMemory);

      const A1DependsOn = testMemory.getCellByLabel("A1").getDependsOn();
      expect(A1DependsOn).toEqual([]);

      const A2DependsOn = testMemory.getCellByLabel("A2").getDependsOn();
      expect(A2DependsOn).toEqual(["A1"]);

      const A3DependsOn = testMemory.getCellByLabel("A3").getDependsOn();
      expect(A3DependsOn).toEqual(["A1"]);

      const B1DependsOn = testMemory.getCellByLabel("B1").getDependsOn();
      expect(B1DependsOn).toEqual(["A1"]);

      const B2DependsOn = testMemory.getCellByLabel("B2").getDependsOn();
      expect(B2DependsOn).toEqual(["A1"]);

      const B3DependsOn = testMemory.getCellByLabel("B3").getDependsOn();
      expect(B3DependsOn).toEqual(["A1"]);

      const C1DependsOn = testMemory.getCellByLabel("C1").getDependsOn();
      expect(C1DependsOn).toEqual(["A1"]);

      const C2DependsOn = testMemory.getCellByLabel("C2").getDependsOn();
      expect(C2DependsOn).toEqual(["A1"]);

      const C3DependsOn = testMemory.getCellByLabel("C3").getDependsOn();
      expect(C3DependsOn).toEqual(["A1"]);

    });
  });


});
