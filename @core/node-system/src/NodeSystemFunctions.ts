import * as path from "path";
import * as fs from "fs";
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

	/**
	 * Locates the nearest 'package.json' file from a given path, traversing the directory structure as
	 * needed.
	 *
	 * @param basePath The path from which the search should begin.
	 *
	 * @returns A string representing the path to the nearest 'package.json' file that is relative
	 * to _basePath_; otherwise *undefined* if a 'package.json' file could not be resolved.
	 */
	public resolveBasePackageFilePath(basePath: string): string | undefined {
        let currentPath: string | undefined = undefined;

        while (basePath != currentPath) {
            let packageJsonFilePath = path.join(basePath, "package.json");

            if (fs.existsSync(packageJsonFilePath)) return packageJsonFilePath;

            currentPath = basePath;

            basePath = path.join(currentPath, "..");
        }

        return undefined;
	}
}
