const webPack = require("webpack");
const Resolver = require("../@core/module-resolver").Resolver;

const CoreResolver = {
	apply: function(resolver) {
		resolver.plugin("module", function (request, callback) {
			let resolvedPath = Resolver.resolve(request.request, request.path);

			this.doResolve(["file"], {
				path: request.path,
				request: resolvedPath,
				query: request.query,
				directory: request.directory
			}, callback);
		});
	}
};

module.exports = {
	entry: "./dist-es2015/index.js",
	output: {
		path: ".",
		filename: "spa-app-es2015.js"
	},

	devtool: "source-map",

	module: {
		preLoaders: [
			{ test: /\.js$/, loader: "source-map-loader" }
		]
	},

	plugins: [
		new webPack.ResolverPlugin([CoreResolver])
	]
};
