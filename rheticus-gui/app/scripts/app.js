'use strict';

/**
 * @ngdoc overview
 * @name rheticus
 * @description
 * # rheticus
 *
 * Main module of the application.
 */

angular
	.module('rheticus',[
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'openlayers-directive',
		'openlayers-layerswitcher',
		'ui.bootstrap',
		'angularAwesomeSlider',
		'nvd3',
		'smart-table',
        'services.config'
	])
	.config(function ($routeProvider) {
		$routeProvider
		.when('/',{
			"templateUrl" : "scripts/components/main/main-view.html",
			"controller" : "MainCtrl",
			"controllerAs" : "main"
		})
		.when('/about', {
			"templateUrl": "scripts/components/about/about-view.html",
			"controller": "AboutCtrl",
			"controllerAs": "about"
		})
		.otherwise({
			"redirectTo": "/"
		});
	})
	.run(function ($rootScope,configuration) {
		angular.extend($rootScope,{
			"speedModel" : configuration.filters.speedSlider.init,
			"center" : {
				"lon" : configuration.maps.center.lon,
				"lat" : configuration.maps.center.lat,
				"zoom" : configuration.maps.zoom.center
			},
			"datasets" : configuration.datasets,
			"psTrendsData" : {
				"point" : null,
				"features" : null
			},
			"shouldShowDetails" : function() {
				return $rootScope.center.zoom>=configuration.maps.zoom.detail;
			}
		});
	});