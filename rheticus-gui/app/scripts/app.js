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

	.module('rheticus', [
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
			.when('/', {
				templateUrl: 'scripts/components/main/main-view.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/about', {
				templateUrl: 'scripts/components/about/about-view.html',
				controller: 'AboutCtrl',
				controllerAs: 'about'
			})
			.otherwise({
				redirectTo: '/'
			});
	})

	.run(function ($rootScope,configuration) {
		angular.extend($rootScope, {
			autozoom: false,
			autocenter: false,
			speedModel: configuration.filters.speedSlider.init,
			center: {
				lon: configuration.maps.center.lon,
				lat: configuration.maps.center.lat,
				zoom: configuration.maps.zoom.center
			},
			datasets: configuration.datasets,
			shouldShowDetails: function() {
				return $rootScope.center.zoom>=configuration.maps.zoom.detail;
			}
		});
	});
/*
    .constant('default_graph_options', {
        chart: {
            type: 'lineChart',
            width: 650,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true,             
            xAxis: {
                axisLabel: 'Data',
                tickFormat: function (d) {
                    return d3.time.format('%d/%m/%Y')(new Date(d));
                }
            },
            yAxis: {
                axisLabel: 'Spostamento (mm)',
                tickFormat: function (d) {
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            }
        },
        title: {
            enable: true,
            html: ''
        },
        subtitle: {
            enable: false            
        },
        caption: {
            enable: false
        }
    })
*/