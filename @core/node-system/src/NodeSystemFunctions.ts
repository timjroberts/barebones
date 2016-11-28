import * as oslocale from "os-locale";

import { ISystemFunctions } from "@core/system";

/**
 * Represents the @core system functions as they map to a Node.js runtime.
 */
export class NodeSystemFunctions {
	/**
	 * Retrieves a string representing the current system culture.
	 *
	 * @returns A string representing the system culture name in the ISO 639-1 format ('languagecode2-country/regioncode2').
	 */
	public getSystemCulture(): string {
		let sysLocale = oslocale.sync();

		return sysLocale.replace("_", "-")
	}
}
