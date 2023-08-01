/**
 * An editing user is a user that is currently editing a cell in a document.
 * each user has a formula builder and a cell that they are editing.
 */

import { FormulaBuilder } from "./FormulaBuilder";

export class EditingUser {
    private _formulaBuilder: FormulaBuilder;
    private _cellLabel: string;

    constructor(cellLabel: string) {
        this._formulaBuilder = new FormulaBuilder();
        this._cellLabel = cellLabel;
    }

    public set cellLabel(cellLabel: string) {
        this._cellLabel = cellLabel;
    }

    public get cellLabel(): string {
        return this._cellLabel;
    }

    public get formulaBuilder(): FormulaBuilder {
        return this._formulaBuilder;
    }


}
