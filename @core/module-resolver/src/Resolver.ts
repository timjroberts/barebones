import * as path from "path";
import * as fs from "fs";

const Module = require("module");

import { BuiltInModules } from "./BuiltinModules";
import { ResourceModuleGenerator } from "./ResourceModuleGenerator";

export type ResolveFunc = (name: string, module: NodeModule) => string;

/**
 * Provides utilities for resolving modules.
 */
export class Resolver {
	private static DEFAULT_EXTENSION: string = ".js";

	/**
	 * Registers the system defined resolve function.
	 */
	public static register(): void;
	/**
	 * Registers a supplied resolve function.
	 *
	 * @param resolveFunc A function that can be used to resolve modules.
	 */
	public static register(resolveFunc: ResolveFunc): void;
	public static register(p1?: ResolveFunc): void {
		let systemResolveFunc: ResolveFunc = Module._resolveFilename;

		Module._resolveFilename = p1 || function (name: string, module: NodeModule) {
			if (BuiltInModules.indexOf(name) >= 0) return systemResolveFunc(name, module);

			return Resolver.resolve(name, module.filename);
		};
	}

	/**
	 * Resolves a required path to an absolute path relative to a supplied base path.
	 *
	 * @param requiredPath A path, which may be relative, that should be resolved to an
	 * absolute path.
	 * @param basePath The path that is relative to _requiredPath_.
	 *
	 * @returns A string representing the absolute path of _requiredPath_ that is relative to
	 * _basePath_.
	 */
	public static resolve(requiredPath: string, basePath: string): string {
		let resourcePathMatches = /(.*)!resources/g.exec(requiredPath);

		if (resourcePathMatches) return Resolver.resolveResources(resourcePathMatches[1], basePath);

		if (path.isAbsolute(requiredPath)) return requiredPath;

		if (requiredPath[0] === '.') {
			if (path.parse(requiredPath).ext === "") {
				requiredPath = requiredPath + Resolver.DEFAULT_EXTENSION;
			}
			return path.join(path.parse(basePath).dir, requiredPath);
		}

		let packageJsonFilePath = Resolver.resolveBasePackageFilePath(path.parse(basePath).dir);

		if (!packageJsonFilePath) throw new Error(`Cannot find module '${requiredPath}'`);

		let basePackageFolderPath = path.parse(packageJsonFilePath).dir;
		let requiredPathSegments = requiredPath.split('/');
		let requiredPackage = requiredPathSegments[0][0] === '@' ? `${requiredPathSegments[0]}/${requiredPathSegments[1]}` : requiredPathSegments[0];
		let requiredPathAdditionalSegments = requiredPathSegments.slice(requiredPath[0] === '@' ? 2 : 1).join('/');

		let localPackageJsonFilePath = path.join(basePackageFolderPath, "node_modules", requiredPackage, "package.json");
		let currentPath: string | undefined = undefined;

		if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments);

		localPackageJsonFilePath = path.join(path.join(localPackageJsonFilePath, "../../../.."), requiredPackage, "package.json");

		while (localPackageJsonFilePath != currentPath) {
			if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments);

			currentPath = localPackageJsonFilePath;

			localPackageJsonFilePath = path.join(path.join(basePackageFolderPath, ".."), "node_modules", requiredPackage, "package.json");
		}

		let projectFilePath = path.join(basePackageFolderPath, "tsconfig.json");

		if (!fs.existsSync(projectFilePath)) {
			projectFilePath = packageJsonFilePath;
		}

		if (!fs.existsSync(projectFilePath)) throw new Error(`Cannot find module '${requiredPath}'`);

		let projectOptions = JSON.parse(fs.readFileSync(projectFilePath).toString());
		let paths = projectOptions["compilerOptions"] ? projectOptions["compilerOptions"]["paths"] : projectOptions["paths"] || { };

		if (!paths || !paths[requiredPackage]) throw new Error(`Cannot find module '${requiredPath}'`);

		for (let pathMapping of paths[requiredPackage]) {
			localPackageJsonFilePath = path.join(basePackageFolderPath, pathMapping, "package.json");

			if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments);
		}

		throw new Error(`Cannot find module '${requiredPath}'`);
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
	private static resolveBasePackageFilePath(basePath: string): string | undefined {
        let currentPath: string | undefined = undefined;

        while (basePath != currentPath) {
            let packageJsonFilePath = path.join(basePath, "package.json");

            if (fs.existsSync(packageJsonFilePath)) return packageJsonFilePath;

            currentPath = basePath;

            basePath = path.join(currentPath, "..");
        }

        return undefined;
	}

	/**
	 * Determines the main script to load for a given package.
	 *
	 * @param packageJsonFilePath The file path to the 'package.json' file that is being resolved.
	 * @param childPath An additional path to request relative to the package being resolved.
	 *
	 * @returns A file path to the main module of the package described by _packageJsonFilePath_.
	 */
	private static resolvePackageMain(packageJsonFilePath: string, childPath: string): string {
		let packageFolderPath = path.parse(packageJsonFilePath).dir;
		let packageDesc = JSON.parse(fs.readFileSync(packageJsonFilePath).toString());

		let versionMatches = /v(\d*).\d*.\d*/.exec(process.version);

		let packageMainFilePath = "";

		if ((versionMatches ? parseInt(versionMatches[1]) : 0) >= 6 && packageDesc["jsnext:main"]) {
			packageMainFilePath = packageDesc["jsnext:main"];
		}
		else if (packageDesc["main"]) {
			packageMainFilePath = packageDesc["main"];
		}
		else {
			packageMainFilePath = "./index.js";
		}

		if (childPath && childPath.length > 0) {
			return path.join(path.parse(path.join(packageFolderPath, packageMainFilePath)).dir, childPath);
		}

		return path.join(packageFolderPath, packageMainFilePath);
	}

	private static resolveResources(resourcePath: string, basePath: string): string {
		if (resourcePath !== "" && resourcePath !== "local") throw new Error(`Cannot find module '${resourcePath}!resources'`);

		let packageJsonFilePath = Resolver.resolveBasePackageFilePath(path.parse(basePath).dir);

		if (!packageJsonFilePath) throw new Error(`Cannot find module '${resourcePath}!resources'`);

		let resourceFolderPath = path.join(path.parse(packageJsonFilePath).dir, ".resources");
		let resourceModuleFilePath = path.join(resourceFolderPath, "resources.js");

		if (!fs.existsSync(resourceFolderPath)) throw new Error(`Cannot find module '${resourcePath}!resources'`);

		new ResourceModuleGenerator(resourceFolderPath).generate(resourceModuleFilePath);

		return resourceModuleFilePath;
	}
}
