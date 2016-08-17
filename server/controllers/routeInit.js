
module.exports = function (app) {

    app.get('/kiosk', function (req, res) {
        res.render('kiosk');
    });

    app.get('/', function (req, res) {
        res.render('home');
    });

};