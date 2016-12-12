const Resolver = require("../index").Resolver;

module.exports = function ResolverPlugin() {
    return {
        manipulateOptions: function (babelOpts) {
            babelOpts.resolveModuleSource = function (source, filename) {
                console.log("[RESOLVE] " + source + " -> " + filename);

                return Resolver.resolve(source, filename, [ "es2015" ]);
            }
        }
    };
}
