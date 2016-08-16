
module.exports = function (api) {

    var controller = require(GLOBAL.root + 'controllers/controllers/kioskController')(api);

    api.app.post('/services/kiosk/getData', function (req, res) {
        controller.getData(req, function (result) {
            res.send(result);
        });

    });

};