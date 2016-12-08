import IntlMessageFormat from "intl-messageformat";

import { CultureInfo } from "./CultureInfo";

export class StringFormat {
	private _formatter: IntlMessageFormat;

	constructor(message: string, culture: CultureInfo, formats?: any) {
		this._formatter = new IntlMessageFormat(message, culture.name, formats);
	}

	public format(context?: any): string {
		return this._formatter.format(context);
	}
}
