define([
    'jquery',
    'angular',
    'app',
    'modules/kiosk/glider'
], function (
    $,
    angular,
    app,
    glider
) {
        var START_TIME = new Date();

        var init = function () {
            getGliderLocation();

            setInterval(function(){
                getGliderLocation();
            }, 10 * 1000);
        };

        var getGliderLocation = function(){
            $.post("/services/kiosk/getGliderLocation", {'time': (new Date()).getTime()}, function (data) {
                if (data) {
                    $('.glider-row div').removeClass('active');
                    $('.glider-row div').eq(data.stop - 1).addClass('active');
                }
            });
        };

        return {
            init: init
        };

    });
