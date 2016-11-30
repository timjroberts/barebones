"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const through = require("through2");
const lodash = require("lodash");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = function compileTypeScriptPackage() {
	return through.obj((file, enc, callback) => {
		let packageFolderPath = path.parse(file.path).dir;
		let tsConfigFilePath = path.join(packageFolderPath, "tsconfig.json");

		if (!fs.existsSync(tsConfigFilePath)) return callback();

		let tscFilePath = path.join(file.cwd, "node_modules/.bin", process.platform === "win32" ? "tsc.cmd" : "tsc");

		let tscResult = childProcess.spawnSync(tscFilePath, [], { cwd: packageFolderPath });

		if (tscResult.error) throw new util.PluginError("compileTypeScriptPackage", "Could not locate a TypeScript compiler. Have you installed the root packages?", { showProperties: false, showStack: false});

		let tsconfigFile = new util.File({
			base: file.base,
			cwd: file.cwd,
			path: tsConfigFilePath,
		});

		tsconfigFile["plugin"] = "compileTypeScriptPackage";
		tsconfigFile["packageFile"] = file;
		tsconfigFile["status"] = tscResult.status;
		tsconfigFile["error"] = tscResult.stdout.toString();

		callback(null, tsconfigFile);
	});
}
