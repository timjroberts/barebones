import { getSystemFunctions, ISystemFunctions } from "@core/system";

export class CultureInfo {
	constructor(private cultureName: string) {
	}

	public get name(): string {
		return this.cultureName;
	}

	public static getCurrentCulture(): CultureInfo {
		return this.getSystemCulture();
	}

	public static getSystemCulture(): CultureInfo {
		return new CultureInfo(getSystemFunctions().getSystemCulture());
	}
}
