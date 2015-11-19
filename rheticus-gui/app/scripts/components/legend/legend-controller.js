'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:LegendCtrl
 * @description
 * # LegendCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
.controller('LegendCtrl',['$scope','configuration', function ($scope,configuration) {
	angular.extend($scope,{
		"legendUrl" : configuration.legends.velocity.url,
		"legendTitle" : configuration.legends.velocity.title,
		"legendUom" : configuration.legends.velocity.uom
	});
	$scope.$watch("center.zoom", function (zoom) { //legend visibility Heatmap/PS
		$scope.legendUrl = configuration.legends[$scope.showDetails() ? "ps" : "velocity"].url;
		$scope.legendTitle = configuration.legends[$scope.showDetails() ? "ps" : "velocity"].title;
		$scope.legendUom = configuration.legends[$scope.showDetails() ? "ps" : "velocity"].uom;
	});
}]);