import * as path from "path";
import * as fs from "fs";

/**
 * Generates a resources module by walking the contents of a resources folder contained in a
 * package.
 */
export class ResourceModuleGenerator {
	private _resourceFolderPath: string;

	constructor(resourceFolderPath: string) {
		this._resourceFolderPath = resourceFolderPath;
	}

	/**
	 * Generates the resources module to a given file path.
	 *
	 * @param resourceModuleFilePath The file path where the resources module should be written.
	 */
	public generate(resourceModuleFilePath: string): void {
		let resources: Object = { };

		for (let cultureFolderPath of this.getCultureFolderPaths()) {
			let cultureName = cultureFolderPath.split(path.sep).reverse()[0];

			let stringsFilePath = path.join(cultureFolderPath, "strings.json");

			resources[cultureName] = {
				"importPath": cultureFolderPath,
				"strings": fs.existsSync(stringsFilePath) ? JSON.parse(fs.readFileSync(stringsFilePath, "utf8")) : { },
				"images": { }

			};

			for (let cultureImageFilePath of this.getCultureImageFilePaths(cultureFolderPath)) {
				let imageName = cultureImageFilePath.split(path.sep).reverse()[0];

				resources[cultureName]["images"][imageName] = this.toBase64EncodedString(fs.readFileSync(cultureImageFilePath));
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

		for (let folderPath of fs.readdirSync(this._resourceFolderPath)) {
			let cultureFolderPath = path.join(this._resourceFolderPath, folderPath);

			if (!fs.statSync(cultureFolderPath).isDirectory()) continue;

			cultureFolderPaths.push(cultureFolderPath);
		}

		return cultureFolderPaths;
	}

	private getCultureImageFilePaths(cultureFolderPath: string): string[] {
		let cultureFilePaths: string[] = [];

		for (let filePath of fs.readdirSync(cultureFolderPath)) {
			let cultureFilePath = path.join(cultureFolderPath, filePath);

			if (!fs.statSync(cultureFilePath).isFile()) continue;
			if (path.parse(cultureFilePath).ext !== ".png") continue;

			cultureFilePaths.push(cultureFilePath);
		}

		return cultureFilePaths;
	}

	private toBase64EncodedString(buffer: Buffer): string {
		return buffer.toString("base64");
	}
}
