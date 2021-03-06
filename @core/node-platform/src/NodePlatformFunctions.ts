import * as path from "path";
import * as fs from "fs";
import * as oslocale from "os-locale";

import { IPlatformFunctions } from "@core/platform";

/**
 * Represents the @core system functions as they map to a Node.js runtime.
 */
export class NodeSystemFunctions implements IPlatformFunctions {
	/**
	 * Retrieves a string representing the current system culture.
	 *
	 * @returns A string representing the system culture name in the ISO 639-1 format ('languagecode2-country/regioncode2').
	 */
	public getSystemCulture(): string {
		let sysLocale = oslocale.sync();

		return sysLocale.replace("_", "-");
	}
}
