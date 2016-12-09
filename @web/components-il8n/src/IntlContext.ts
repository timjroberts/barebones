import { CultureInfo } from "@core/globalization";

export class IntlContext {
	private _culture: CultureInfo;

	constructor(culture: CultureInfo) {
		this._culture = culture;
	}

	public get culture(): CultureInfo {
		return this._culture;
	}
}
