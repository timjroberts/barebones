"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const through = require("through2");
const lodash = require("lodash");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const CHUNK_SIZE = 50;
const CORE_MODULERESOLVER_SCOPENAME = "@core";
const CORE_MODULERESOLVER_PACKAGENAME = "module-resolver";
const CORE_MODULERESOLVER_QUALIFIEDPACKAGENAME = `${CORE_MODULERESOLVER_SCOPENAME}/${CORE_MODULERESOLVER_PACKAGENAME}`;

module.exports = function installPackage() {
	let workspacePackages = new Map();

	return through.obj((file, enc, callback) => {
		let packageFolderPath = path.parse(file.path).dir;
		let packageDesc = JSON.parse(file.contents.toString());

		let allDependencies = lodash.assign({}, packageDesc.dependencies, packageDesc.peerDependencies, packageDesc.devDependencies, packageDesc.optionalDependencies);

		let allDependencyNames = Object.getOwnPropertyNames(allDependencies);
		let externalDependencyNames = lodash.difference(allDependencyNames, [...workspacePackages.keys()]);

		let npmError = undefined;

		for (let externalDependencyChunk of lodash.chunk(externalDependencyNames, CHUNK_SIZE)) {
			let args =
				["install"]
				.concat(lodash.map(externalDependencyChunk, (dependency) => `${dependency}@${allDependencies[dependency]}`))
				.concat(["--ignore-scripts"]);

			let npmFilePath = process.platform === "win32" ? "npm.cmd" : "npm";

			let npmResult = childProcess.spawnSync(npmFilePath, args, { cwd: packageFolderPath });

			if (npmResult.status !== 0) {
				npmError = npmResult.stderr.toString();
			}
		}

		if (!npmError && allDependencies[CORE_MODULERESOLVER_QUALIFIEDPACKAGENAME]) {
			let moduleResolverFolderPath = path.parse(workspacePackages.get(CORE_MODULERESOLVER_QUALIFIEDPACKAGENAME).path).dir;

			let scopedPath = packageFolderPath;

			for (let pathSegment of ["node_modules", CORE_MODULERESOLVER_SCOPENAME]) {
				scopedPath = path.join(scopedPath, pathSegment);

				if (!fs.existsSync(scopedPath)) {
					fs.mkdirSync(scopedPath);
				}
			}

			scopedPath = path.join(scopedPath, CORE_MODULERESOLVER_PACKAGENAME);

			if (!fs.existsSync(scopedPath)) {
				fs.symlinkSync(moduleResolverFolderPath, scopedPath, "dir");
			}
		}

		workspacePackages.set(packageDesc.name, file);

		file["plugin"] = "installPackage";
		file["packageFile"] = file;
		file["status"] = npmError ? -1 : 0;
		file["error"] = npmError;

		callback(null, file);
	});
}
