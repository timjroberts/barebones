/**
 * Represents the @core platform functions.
 */
export interface IPlatformFunctions {
	/**
	 * Retrieves a string representing the current system culture.
	 *
	 * @returns A string representing the system culture name in the ISO 639-1 format ('languagecode2-country/regioncode2').
	 */
	getSystemCulture(): string;
}
