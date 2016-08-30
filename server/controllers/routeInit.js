
module.exports = function (app) {

    app.get('/kiosk', function (req, res) {
        res.render('kiosk');
    });

    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/next5', function (req, res) {
        res.render('next5');
    });

    app.get('/plan_journey', function (req, res) {
        res.render('plan_journey');
    });

    app.get('/map', function (req, res) {
        res.render('map');
    });

    app.get('/glider', function (req, res) {
        res.render('glider');
    });

    app.get('/about', function (req, res) {
        res.render('about');
    });
    
    app.get('/contact', function (req, res) {
        res.render('contact');
    });

    app.get('/myki', function (req, res) {
        res.render('myki');    
    });

};