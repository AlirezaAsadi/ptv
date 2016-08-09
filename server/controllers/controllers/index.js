
var fs = require("fs");
var path = require("path");


module.exports = function (api) {

  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
      var fileName =  file.replace('.js', '');
      module.exports = require(path.join(__dirname, file))(api);
    });

};


