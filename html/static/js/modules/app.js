define(['angular', 'ngSanitize', 'ngResource', 'ngRoute'], function (angular) {

    var app = angular.module('ptv', ['ngSanitize', 'ngResource', 'ngRoute'])
		.config(['$controllerProvider',
			'$compileProvider', '$filterProvider', '$provide',
			function ($controllerProvider,
				$compileProvider, $filterProvider, $provide) {

				app.register =
					{
						controller: $controllerProvider.register,
						directive: $compileProvider.directive,
						filter: $filterProvider.register,
						factory: $provide.factory,
						service: $provide.service
					};

			}])


		.directive('a', function () {
			return {
				restrict: 'E',
				link: function (scope, elem, attrs) {
					if (attrs.ngClick && (attrs.href === '' || attrs.href === '#' || attrs.href === '#!')) {
						elem.on('click', function (e) {
							e.preventDefault();
						});
					}
				}
			};
		})
		.directive('ngEnter', function () {
			return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if (event.which === 13 && !event.ctrlKey) {
						scope.$apply(function () {
							scope.$eval(attrs.ngEnter);
						});

						event.preventDefault();
					}
					return true;
				});
			};
		});

	window.app = app;
	return app;
});
