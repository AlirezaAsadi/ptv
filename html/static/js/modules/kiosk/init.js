define([
    'jquery',
    'app',
    'modules/kiosk/kiosk',
    'modules/kiosk/glider',
    'modules/kiosk/plan_journy',
    'modules/kiosk/nav'
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
