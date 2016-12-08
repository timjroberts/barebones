import { NumberFormat as IntlNumberFormat } from "intl";

import { CultureInfo } from "./CultureInfo";

export class NumberFormat {
	private _formatter: IntlNumberFormat;

	constructor(culture: CultureInfo) {
		this._formatter = new IntlNumberFormat(culture.name);
	}

	public format(number: number): string {
		return this._formatter.format(number);
	}
}
