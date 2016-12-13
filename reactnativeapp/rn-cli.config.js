const path = require("path");

function getWorkspaceFolderPaths() {
    return [
        __dirname,
        path.resolve(__dirname, "../@core/platform"),
        path.resolve(__dirname, "../@web/web-platform"),
        path.resolve(__dirname, "../@web/components-il8n"),
        path.resolve(__dirname, "../@core/resources"),
        path.resolve(__dirname, "../@core/globalization")
    ];
}
module.exports = {
    getProjectRoots: function () {
        return getWorkspaceFolderPaths();
    },

    getAssetRoots: function () {
        return getWorkspaceFolderPaths();
    }
};
