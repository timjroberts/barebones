"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const through = require("through2");
const lodash = require("lodash");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const DEFAULT_OPTIONS = {
	continueOnError: false
};

module.exports = function handleResults(options) {
	options = lodash.assign({}, DEFAULT_OPTIONS, options);

	return through.obj((file, enc, callback) => {
		let pluginName = undefined;

		//if (path.parse(file.path).base === "package.json") return callback(null, file);
		if (!file["plugin"]) return callback(null, file);

		let packageDesc = JSON.parse(file["packageFile"].contents.toString());

		pluginName = file["plugin"];

		if (file["status"] === 0) {
			util.log(util.colors.green(`'${util.colors.cyan(pluginName)}': ${packageDesc.name}`));

			callback(null, file);
		}
		else {
			util.log(util.colors.red(`'${util.colors.cyan(pluginName)}': ${packageDesc.name}\n${file["error"]}`));

			if (options.continueOnError) return callback(null, file);

			callback(new util.PluginError(pluginName, util.colors.red(`One or more packages failed at '${util.colors.cyan(pluginName)}'.`, { showProperties: false, showStack: false})));
		}
	});
}
