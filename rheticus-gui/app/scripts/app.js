'use strict';

/**
 * @ngdoc overview
 * @name workspacePilotApp
 * @description
 * # workspacePilotApp
 *
 * Main module of the application.
 */

 var app = angular
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
				center: {
					lon: 15.85,
					lat: 38.325,
					zoom: 14
				},
				speedModel: "0;20",
				detailZoom: 17,
				datasets: [
					{
						name: 'dataset1',
						selected: true
					},
					{
						name: 'dataset2',
						selected: false
					},
					{
						name: 'dataset3',
						selected: false
					}
				]
			},
			shouldShowDetails: function() {
				return $rootScope.configuration.center.zoom>=$rootScope.configuration.detailZoom;
			}
		});
	});