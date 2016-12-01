"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

var majorVersion = parseInt(/v(\d*).\d*.\d*/.exec(process.version)[1]);

if (majorVersion >= 6) {
	__export(require("./dist-es2015/index"));
}
else {
	__export(require("./dist-es5/index"));
}
