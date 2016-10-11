
module.exports = function (api) {

    var controller = require(GLOBAL.root + 'controllers/controllers/kioskController')(api);

    api.app.post('/services/kiosk/getData', function (req, res) {
        controller.getData(req, function (result) {
            res.send(result);
        });

    });
	
	
    api.app.post('/services/kiosk/search', function (req, res) {
        controller.search(req, function (result) {
            res.send(result);
        });

    });
	
	
    api.app.post('/services/kiosk/getGliderLocation', function (req, res) {
        controller.getGliderLocation(req, function (result) {
            res.send(result);
        });

    });
	
	

};