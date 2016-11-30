"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const through = require("through2");
const lodash = require("lodash");
const DepGraph = require("dependency-graph").DepGraph;

/**
 * A Gulp.js plugin that Streams 'package.json' files found in the current workspace in dependency order.
 *
 * @param {string} startingPackageName An optional package name from which streaming should start. If omitted, then all
 * packages in the workspace are returned.
 */
module.exports = function getPackages(startingPackageName) {
	let packageGraph = new DepGraph();

	let collect = function (file, enc, callback) {
		let packageDesc = JSON.parse(file.contents.toString());

		packageGraph.addNode(packageDesc.name);
		packageGraph.setNodeData(packageDesc.name, file);

		for (let dependentPackage in lodash.assign({}, packageDesc.dependencies, packageDesc.peerDependencies, packageDesc.devDependencies, packageDesc.optionalDependencies)) {
			packageGraph.addNode(dependentPackage);
			packageGraph.addDependency(packageDesc.name, dependentPackage)
		}

		callback();
	};

	let flush = function (callback) {
		if (startingPackageName) {
			if (!packageGraph.hasNode(startingPackageName)) throw new util.PluginError("getPackages", `'${startingPackageName}' did not resolve to a workspace package.`, { showProperties: false, showStack: false});

			this.push(packageGraph.getNodeData(startingPackageName));

			for (let packageName of packageGraph.dependenciesOf(startingPackageName)) {
				let data = packageGraph.getNodeData(packageName);

				if (!data || typeof data === "string") continue;

				this.push(data);
			}

			return;
		}

		for (let packageName of packageGraph.overallOrder()) {
			let data = packageGraph.getNodeData(packageName);

			if (!data || typeof data === "string") continue;

			this.push(data);
		}

		callback();
	};

	return gulp.src(["**/*/package.json", "!**/node_modules/**"]).pipe(through.obj(collect, flush));
}
