import { getPlatformFunctions, IPlatformFunctions } from "@core/platform";

export class CultureInfo {
	private _cultureName: string;

	constructor(cultureName: string) {
		this._cultureName = cultureName;
	}

	public get name(): string {
		return this._cultureName;
	}

	public static getCurrentCulture(): CultureInfo {
		return this.getSystemCulture();
	}

	public static getSystemCulture(): CultureInfo {
		return new CultureInfo(getPlatformFunctions().getSystemCulture());
	}
}
