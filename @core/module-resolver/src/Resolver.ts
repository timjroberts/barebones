import * as path from "path";
import * as fs from "fs";

const Module = require("module");

import { BuiltInModules } from "./BuiltinModules";
import { ResourceModuleGenerator } from "./ResourceModuleGenerator";

/**
 * Defines a Javascript target.
 */
enum TargetFlags {
	es2015 = 1 << 0,
	es5 = 1 << 2,
	any = es2015 & es5
}

/**
 * A function that resolve a name and a base module to an absolute path.
 *
 * @param name A module or package name to be resolved.
 * @param module The module that requires the resolution.
 *
 * @returns A string representing the absolute path of _name_ relative to _module_.
 */
type ResolveFunc = (name: string, module: NodeModule) => string;

/**
 * Provides utilities for resolving modules.
 */
export class Resolver {
	private static DEFAULT_FILE: string = "index.js";

	/**
	 * The default extension to use when one isn't present on a required path.
	 */
	private static DEFAULT_EXTENSION: string = ".js";

	/**
	 * A collection of packges that must be resolved via their 'main' package.json entry regardless of target.
	 * 
	 * @remarks
	 * Some packages use the 'jsnext:main' package.json entry to indicate that they support ES2015. However, the
	 * ES2105 modules will also use import/export features which isn't currently supported by Node.js. For these
	 * packages we need to ensure we force resolution to the ES5 version of the modules instead.
	 */
	private static REMAPPED_PACKAGES: string[] = [
		"intl-messageformat",
		"intl-messageformat-parser"
	];

	/**
	 * Provides mapping between a target string and a {@link TargetFlags} value.
	 */
	private static TARGET_MAP = {
		"es2015": TargetFlags.es2015,
		"es5": TargetFlags.es5,
		"any": TargetFlags.any
	};

	/**
	 * Registers the system defined resolve function.
	 */
	public static register(): void {
		let systemResolveFunc: ResolveFunc = Module._resolveFilename;

		Module._resolveFilename = function (name: string, module: NodeModule) {
			if (BuiltInModules.indexOf(name) >= 0) return systemResolveFunc(name, module);

			// TODO: change TargetFlags to 'any'
			return Resolver.resolveInternal(name, module.filename, TargetFlags.es2015);
		};
	}

	/**
	 * Resolves a required path to an absolute path relative to a supplied base path.
	 *
	 * @param requiredPath A path, which may be relative, that should be resolved to an
	 * absolute path.
	 * @param basePath The path that is relative to _requiredPath_.
	 * @param supportedTargets A string arrary that defines the allowable targets that should
	 * be considered during resolution.
	 *
	 * @returns A string representing the absolute path of _requiredPath_ that is relative to
	 * _basePath_.
	 */
	public static resolve(requiredPath: string, basePath: string, supportedTargets: ("es2015" | "es5" | "any")[] = ["es5"]): string {
		let targets = TargetFlags.es5;

		for (let supportedTarget of supportedTargets) {
			targets |= Resolver.TARGET_MAP[supportedTarget] || TargetFlags.es5;
		}

		return Resolver.resolveInternal(requiredPath, basePath, targets);
	}

	/**
	 * Resolves a required path to an absolute path relative to a supplied base path.
	 *
	 * @param requiredPath A path, which may be relative, that should be resolved to an
	 * absolute path.
	 * @param basePath The path that is relative to _requiredPath_.
	 * @param supportedTargets A {@link TargetFlags} value representing the allowable targets that
	 * should be considered during resolution.
	 *
	 * @returns A string representing the absolute path of _requiredPath_ that is relative to
	 * _basePath_.
	 */
	private static resolveInternal(requiredPath: string, basePath: string, supportedTargets: TargetFlags): string {
		let resourcePathMatches = /(.*)#resources/g.exec(requiredPath);

		if (resourcePathMatches) return Resolver.resolveResources(resourcePathMatches[1], basePath);

		if (path.isAbsolute(requiredPath)) return requiredPath;

		if (requiredPath[0] === '.') {
			let absoluteRequiredPath = path.join(path.parse(basePath).dir, requiredPath);

			if (path.parse(absoluteRequiredPath).ext === "") {
				absoluteRequiredPath +=
					fs.existsSync(absoluteRequiredPath) && fs.statSync(absoluteRequiredPath).isDirectory()
						? path.sep + Resolver.DEFAULT_FILE
						: Resolver.DEFAULT_EXTENSION
			}

			return absoluteRequiredPath;
		}

		let packageJsonFilePath = Resolver.resolveBasePackageFilePath(path.parse(basePath).dir);

		if (!packageJsonFilePath) throw new Error(`Cannot find module '${requiredPath}'`);

		let basePackageFolderPath = path.parse(packageJsonFilePath).dir;
		let requiredPathSegments = requiredPath.split('/');
		let requiredPackage = requiredPathSegments[0][0] === '@' ? `${requiredPathSegments[0]}/${requiredPathSegments[1]}` : requiredPathSegments[0];
		let requiredPathAdditionalSegments = requiredPathSegments.slice(requiredPath[0] === '@' ? 2 : 1).join('/');

		let localPackageJsonFilePath = path.join(basePackageFolderPath, "node_modules", requiredPackage, "package.json");
		let currentPath: string | undefined = undefined;

		if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments, supportedTargets);

		localPackageJsonFilePath = path.join(path.join(localPackageJsonFilePath, "../../../.."), requiredPackage, "package.json");

		while (localPackageJsonFilePath != currentPath) {
			if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments, supportedTargets);

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

			if (fs.existsSync(localPackageJsonFilePath)) return Resolver.resolvePackageMain(localPackageJsonFilePath, requiredPathAdditionalSegments, supportedTargets);
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
	 * @param supportedTargets A {@link TargetFlags} value representing the allowable targets that
	 * should be considered during resolution.
	 *
	 * @returns A file path to the main module of the package described by _packageJsonFilePath_.
	 */
	private static resolvePackageMain(packageJsonFilePath: string, childPath: string, supportedTargets: TargetFlags): string {
		let packageFolderPath = path.parse(packageJsonFilePath).dir;
		let packageDesc = JSON.parse(fs.readFileSync(packageJsonFilePath).toString());

		let versionMatches = /v(\d*).\d*.\d*/.exec(process.version);

		let packageMainFilePath = "";

		if ((versionMatches ? parseInt(versionMatches[1]) : 0) >= 6
				&& packageDesc["jsnext:main"]
				&& supportedTargets & TargetFlags.es2015
				&& Resolver.REMAPPED_PACKAGES.indexOf(packageDesc["name"]) < 0) {
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
