
module.exports = function (api) {

    var controller = require(GLOBAL.root + 'controllers/controllers/kioskController')(api);

    api.app.post('/services/kiosk/getData', function (req, res) {
        controller.getData(req, function (result) {
            res.send(result);
        });

    });
	
	
    api.app.post('/services/kiosk/testMethod', function (req, res) {
        controller.testMethod(req, function (result) {
            res.send(result);
        });

    });
	
	
	
	

};