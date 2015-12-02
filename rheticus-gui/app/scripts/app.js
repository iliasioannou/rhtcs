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
			"iffi" : null,
			"sentinel" : null,
			"ps" : null,
			"marker" : false,
			//"aoi" : configuration.aoi,
			"showDetails" : function() {
				return $rootScope.center.zoom>=configuration.map.query.zoom;
			},
			"showLegends" : function(mapDir) {
				return configuration.layers.overlays[mapDir].view.visible;
			}
		});
	})
	.factory('utils', function() {
		return {
			/**
			 * Parameters:
			 * list - {Object}
			 * attribute - {String}
			 * idValue - {String}
			 * 
			 * Returns:
			 * {Integer} - Position in list
			 */
			"getIndexByAttributeValue" : function(list,attribute,idValue) {
				var res = -1;
				try {
					if ((list!=null) && (list.length>0)) {
						if (attribute!=""){
							for (var i=0; i<list.length; i++){
								if (eval("list[i]."+attribute)==idValue){
									res = i;
									break;
								}
							}
						} else {
							for (var i=0; i<list.length; i++){
								if (list[i]==idValue){
									res = i;
									break;
								}
							}
						}
					}
				} catch (e) {
					console.log("[timeline-controller :: getIndexByAttributeValue] EXCEPTION : '"+e);
				} finally {
					return(res);
				}
			}
		};
	});