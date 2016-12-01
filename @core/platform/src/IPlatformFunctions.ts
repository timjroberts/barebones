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

	/**
	 * Locates the nearest 'package.json' file from a given path, traversing the directory structure as
	 * needed.
	 *
	 * @param basePath The path from which the search should begin.
	 *
	 * @returns A string representing the path to the nearest 'package.json' file that is relative
	 * to _basePath_; otherwise *undefined* if a 'package.json' file could not be resolved.
	 */
	resolveBasePackageFilePath(basePath: string): string | undefined;
}
