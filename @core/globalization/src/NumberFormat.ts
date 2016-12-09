import { NumberFormat as IntlNumberFormat } from "intl";

import { CultureInfo } from "./CultureInfo";
import { NumberFormatOptions } from "./NumberFormatOptions";

export class NumberFormat {
	private _formatter: IntlNumberFormat;

	constructor(culture: CultureInfo,  options?: NumberFormatOptions) {
		this._formatter = new IntlNumberFormat(culture.name, options);
	}

	public format(number: number): string {
		return this._formatter.format(number);
	}
}
