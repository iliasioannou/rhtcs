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
        'services.config',
		'angularHelpOverlay'
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
		.when('/sp', {
			"templateUrl": "scripts/components/switch-panel/switch-panel-view.html",
			"controller": "SwitchPanelCtrl",
			"controllerAs": "switch-panel"
		})
		.otherwise({
			"redirectTo": "/"
		});
	})
	.run(function ($rootScope,configuration) {
		angular.extend($rootScope,{
			"speedModel" : configuration.filters.speedSlider.init,
			"center" : configuration.map.center,
			"ps" : null,
			"marker" : false,
			"timeline" : null,
			"aoi" : configuration.aoi,
			"showDetails" : function() {
				return $rootScope.center.zoom>=configuration.map.query.zoom;
			},
			"showLegends" : function(mapDir) {
				return configuration.layers.overlays[mapDir].view.visible;
			}
		});
	});