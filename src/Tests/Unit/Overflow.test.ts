import { getCellValue, getCellEditor } from "../../Components/SheetComponent";

describe("Cell Utilities", () => {
  it("getCellValue should limit the cell value to 10 characters", () => {
    const cell = "1234567890123|editor";
    expect(getCellValue(cell)).toBe("1234567890");
  });

  it("getCellEditor should limit the editor's name to 15 characters", () => {
    const cell = "1234567890|editorNameLongerThan15Characters";
    expect(getCellEditor(cell)).toBe("editorNameLonge...");
  });
});
