
module.exports = function (app) {

    app.get('/kiosk', function (req, res) {
        res.render('kiosk');
    });

};