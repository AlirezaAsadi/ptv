//create the page lonks for the webpage
module.exports = function (app) {


    app.get('/kiosk', function (req, res) {
        res.render('kiosk', {body_class: 'kiosk-view'});
    });

    app.get('/', function (req, res) {
        var MobileDetect = require('mobile-detect'),
        md = new MobileDetect(req.headers['user-agent']);
        if(md.mobile()){
            res.render('kiosk', {body_class: 'mobile-view'});
        }else{
            res.render('home', {body_class: 'desktop-view'});
        }
    });
//create the next5 link
    app.get('/next5', function (req, res) {
        res.render('next5');
    });
//create the journey planner link

    app.get('/plan_journey', function (req, res) {
        res.render('plan_journey');
    });
//create the map link

    app.get('/map', function (req, res) {
        res.render('map');
    });
//create the glider link

    app.get('/glider', function (req, res) {
        res.render('glider');
    });
//create the about link
    app.get('/about', function (req, res) {
        res.render('about');
    });
//create the contact link

    app.get('/contact', function (req, res) {
        res.render('contact');
    });
//create the myki link

    app.get('/myki', function (req, res) {
        res.render('myki');
    });

};