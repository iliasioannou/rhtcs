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
					lon: 11.13,
					lat: 46.05,
					zoom: 12
				},
				speedModel: "-40;40",
				detailZoom: 16,
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
				]
			},
			shouldShowDetails: function() {
				return $rootScope.configuration.center.zoom>=$rootScope.configuration.detailZoom;
			}
		});
	});
/*
	//setup dependency injection
	angular.module('d3Service',[]);// this is the service method for getting d3 library
	angular.module('angularD3.controllers', []);
	angular.module('angularD3.directives', ['d3Service']); //passing the d3 service to d3 directive

	angular.module('angularD3.controllers').controller('DemoCtrl', ['$scope', function($scope){
		$scope.title = "DemoCtrl";
		$scope.data = [
			{name: "Greg", score:98, color: "red"},
			{name: "Ari", score:96, color: "blue"},
			{name: "Loser", score: 48, color: "green"}
						 ];
		$scope.d3OnClick = function(){
			alert("item.name");
		};
	}]);
	
	angular.module('angularD3.directives')
	  .directive('d3Bars', [function() {
		return {
			restrict: 'EA',
			replace: true,
		  scope: {
			  data: "="
		  },
		  link: function(scope, ele, attrs) {
			  var svg = d3.select(ele[0])
				.append('svg')
				.style('width', '100%');
			  angular.forEach(scope.data, function (item, index) {
				  svg.append('rect')
			.attr('height', 20)
			.attr('width', item.score)
			.attr('x', 0)
			.attr('y', 20*index)
			.attr('fill', item.color);
			  });
		  }
		};
	  }]);*/