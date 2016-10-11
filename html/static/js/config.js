var require={
    waitSeconds: 60,
    baseUrl: "/static/js",
    paths: {

        app: 'modules/app',
        form: 'utils/form',
        common: 'modules/common',

        angular:              'vendors/angular.min',
        jquery:               'vendors/jquery-2.1.1.min',
        ngSanitize:           'vendors/angular-sanitize.min',
        ngRoute:              'vendors/angular-route.min',
        ngResource:           'vendors/angular-resource.min',
        underscore:           'vendors/underscore-min',
        validator:            'vendors/jquery.validate.min',
        google:               '//maps.googleapis.com/maps/api/js?key=AIzaSyCq2IKcNbdT0gATARU38Dr0JFkSp5qJFVM'

    },
    shim: {
        angular: {
                        deps: ['jquery'],
                        exports: 'angular'
                 },
        ngSanitize: {
                        deps: ['jquery','angular'],
                        exports: 'ngSanitize'
                 },
        ngRoute: {
                        deps: ['jquery','angular'],
                        exports: 'ngRoute'
                 },
        ngResource: {
                        deps: ['jquery','angular'],
                        exports: 'ngResource'
                 },
        validator: ['jquery'],
        angularRoute: ['angular'],
        angularCookie: ['angular']

    },
    dep: ['app']
};