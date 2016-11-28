const blacklist: string[] = [
	"freelist",
	"sys"
];

/**
 * Provides the names of the built in Node.js modules.
 */
export var BuiltInModules =
	Object.keys((<any>process).binding("natives"))
		.filter((moduleEntry) => {
			return !/^_|^internal|\//.test(moduleEntry) && blacklist.indexOf(moduleEntry) === -1;
		}).sort();
