"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const through = require("through2");
const lodash = require("lodash");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const DEFAULT_OPTIONS = {
	target: "es2015"
}

function getTscArgs(compileOptions) {
	if (compileOptions.target === "es2015") {
		return [ "-t", "es2015", "--outDir", "./dist-es2015" ];
	}
	else if (compileOptions.target === "es5") {
		let args = [ "-t", "es5", "--outDir", "./dist-es5" ];

		if (compileOptions.lib) {
			args = args.concat[ "--lib", compileOptions.lib.join(',')];
		}

		return args;
	}
	else {
		return [];
	}
}

module.exports = function compileTypeScriptPackage(options) {
	let compileOptions = Object.assign({}, DEFAULT_OPTIONS, options);

	return through.obj((file, enc, callback) => {
		let packageFolderPath = path.parse(file.path).dir;
		let tsConfigFilePath = path.join(packageFolderPath, "tsconfig.json");

		if (!fs.existsSync(tsConfigFilePath)) return callback();

		let tscFilePath = path.join(file.cwd, "node_modules/.bin", process.platform === "win32" ? "tsc.cmd" : "tsc");

		let tscResult = childProcess.spawnSync(tscFilePath, getTscArgs(compileOptions), { cwd: packageFolderPath });

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
