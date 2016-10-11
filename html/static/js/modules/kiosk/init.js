define([
    'jquery',
    'angular',
    'app',
    'modules/kiosk/kiosk',
    'modules/kiosk/glider',
    'modules/kiosk/plan_journy',
    'modules/kiosk/nav'
], function (
    $,
    angular,
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
        angular.element(document).ready(function () { angular.bootstrap(document, ['ptv']); });
    });
