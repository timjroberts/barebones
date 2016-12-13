"use strict";

const gulp = require("gulp");
const through = require("through2");
const getPackages = require("./build/plugins/get-packages");
const compileTypeScriptPackage = require("./build/plugins/compile-typescript-package");
const installPackage = require("./build/plugins/install-package");
const handleResults = require("./build/plugins/handle-results");

gulp.task("install", () => {
	return getPackages()
		.pipe(installPackage())
		.pipe(handleResults());
});

gulp.task("compile-es2015", () => {
	return getPackages()
		.pipe(compileTypeScriptPackage({ target: "es2015" }))
		.pipe(handleResults());
});

gulp.task("compile-es5", () => {
	return getPackages()
		.pipe(compileTypeScriptPackage({ target: "es5", lib: [ "ES2015" ] }))
		.pipe(handleResults());
});
