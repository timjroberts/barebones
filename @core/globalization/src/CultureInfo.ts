import { getPlatformFunctions, IPlatformFunctions } from "@core/platform";

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
		return new CultureInfo(getPlatformFunctions().getSystemCulture());
	}
}
