'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:LegendCtrl
 * @description
 * # LegendCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
.controller('LegendCtrl',['$scope','configuration',function ($scope,configuration) {
	angular.extend($scope,{
		"legendUrl" : configuration.legends.density.url,
		"legendTitle" : configuration.legends.density.title,
		"legendUom" : configuration.legends.density.uom
	});
	$scope.$watch("center.zoom",function (zoom) { //legend visibility Heatmap/PS
		$scope.legendUrl = configuration.legends[$scope.shouldShowDetails() ? "ps" : "density"].url;
		$scope.legendTitle = configuration.legends[$scope.shouldShowDetails() ? "ps" : "density"].title;
		$scope.legendUom = configuration.legends[$scope.shouldShowDetails() ? "ps" : "density"].uom;
	});
}]);