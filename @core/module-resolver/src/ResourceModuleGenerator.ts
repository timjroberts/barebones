import * as path from "path";
import * as fs from "fs";

/**
 * Generates a resources module by walking the contents of a resources folder contained in a
 * package.
 */
export class ResourceModuleGenerator {
	constructor(private resourceFolderPath: string) {
	}

	/**
	 * Generates the resources module to a given file path.
	 *
	 * @param resourceModuleFilePath The file path where the resources module should be written.
	 */
	public generate(resourceModuleFilePath: string): void {
		let resources: Object = {};

		for (let cultureFolderPath of this.getCultureFolderPaths()) {
			let stringsFilePath = path.join(cultureFolderPath, "strings.json");

			if (!fs.existsSync(stringsFilePath)) continue;

			let cultureName = path.parse(stringsFilePath).dir.split(path.sep).reverse()[0];

			resources[cultureName] = {
				"importPath": stringsFilePath,
				"strings": JSON.parse(fs.readFileSync(stringsFilePath, "utf8"))
			}
		}

		fs.writeFileSync(resourceModuleFilePath, `exports.resources = ${JSON.stringify(resources, null, 2)}`, "utf8");
	}

	/**
	 * Retrieves an array of folder paths that represent the cultures contained in the current
	 * resources folder.
	 *
	 * @returns An array of folder paths representing the cultures defined in the current
	 * resources folder.
	 */
	private getCultureFolderPaths(): string[] {
		let cultureFolderPaths: string[] = [];

		for (let folderPath of fs.readdirSync(this.resourceFolderPath)) {
			let cultureFolderPath = path.join(this.resourceFolderPath, folderPath);

			if (!fs.statSync(cultureFolderPath).isDirectory()) continue;

			cultureFolderPaths.push(cultureFolderPath);
		}

		return cultureFolderPaths;
	}
}
