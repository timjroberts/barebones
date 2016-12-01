import { IPlatformFunctions } from "@core/platform";

/**
 * Represents the @core system functions as they map to a Node.js runtime.
 */
export class WebPlatformFunctions implements IPlatformFunctions {
	private static DEFAULT_SYSTEM_CULTURE: string = "en";

	/**
	 * Retrieves a string representing the current system culture.
	 *
	 * @returns A string representing the system culture name in the ISO 639-1 format ('languagecode2-country/regioncode2').
	 */
	public getSystemCulture(): string {
		return window.navigator.language || WebPlatformFunctions.DEFAULT_SYSTEM_CULTURE;
	}
}
