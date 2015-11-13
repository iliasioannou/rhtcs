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
		'ui.bootstrap',
		'angularAwesomeSlider',
		'nvd3',
		'smart-table',
        'services.config'
	])
    .constant('default_graph_options',
    {
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
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'scripts/components/main/main-view.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/header', {
				templateUrl: 'scripts/components/header/header-view.html',
				controller: 'HeaderCtrl',
				controllerAs: 'header'
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