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
                autozoom: false,
                autocenter: false,
                pinwindow: false,
                datasets: [
                    {
                        name: 'dataset1',
                        selected: false
                    },
                    {
                        name: 'dataset2',
                        selected: false
                    },
                    {
                        name: 'DS3',
                        selected: false
                    },
                    {
                        name: 'DS4',
                        selected: false
                    },
                    {
                        name: 'DS5',
                        selected: false
                    }
			],
            }
        });
    });