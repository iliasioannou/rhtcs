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
		//'nvd3ChartDirectives',
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
	})
	.run(function ($rootScope,configuration,utils) {
		angular.extend($rootScope,{
			"baselayers" : configuration.layers.baselayers, // basemap layer list
			"overlays" : configuration.layers.overlays.olLayers, // overlay layer list
			"metadata" : configuration.layers.overlays.metadata, // overlay layer list
			"speedModel" : configuration.filters.speedSlider.init,
			"center" : configuration.map.center,
			"iffi" : null,
			"sentinel" : null,
			"ps" : null,
			"marker" : false,
			"aoi" : configuration.aoi			
		});
		angular.extend($rootScope,{
			"overlaysHashMap" : {
				"iffi" : utils.getIndexByAttributeValue($rootScope.overlays,"id","iffi"),
				"sentinel" : utils.getIndexByAttributeValue($rootScope.overlays,"id","sentinel"),
				"ps" : utils.getIndexByAttributeValue($rootScope.overlays,"id","ps")
			},
			"showDetails" : function() {
				return $rootScope.center.zoom>=configuration.map.query.zoom;
			}
		});
	});