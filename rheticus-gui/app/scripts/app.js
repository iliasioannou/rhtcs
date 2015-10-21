'use strict';

/**
 * @ngdoc overview
 * @name workspacePilotApp
 * @description
 * # workspacePilotApp
 *
 * Main module of the application.
 */
angular
    .module('workspacePilotApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'openlayers-directive',
	'ui.bootstrap',
	'angularAwesomeSlider',
    'nvd3',
    'smart-table'
  ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function ($rootScope) {
        angular.extend($rootScope, {
            configuration: {
                autozoom: true,
                autocenter: true
            }
        });
    });