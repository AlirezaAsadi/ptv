module.exports = function (app) {

    GLOBAL.root = require("path").dirname(require.main.filename) + "/";
    var api = {
        app: app,
        root: require("path").dirname(require.main.filename) + "/"
    };


    // Service initialization
    var ser = require(GLOBAL.root + 'controllers/services')(api);

};