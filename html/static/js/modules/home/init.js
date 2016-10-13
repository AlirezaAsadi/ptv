define([
    'jquery',
    'app',
    'modules/home/kiosk',
    'modules/kiosk/glider',
    'modules/kiosk/plan_journy',
    'modules/home/ui'

], function (
    $,
    app,
    kiosk,
    glider,
    plan_journy
) {

        $(document).ready(function () {
            kiosk.init();
            glider.init();
            plan_journy.init();
        });
        
    });

