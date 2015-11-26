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
		"legendUrl" : configuration.legends.density.url,
		"legendTitle" : configuration.legends.density.title,
		"legendUom" : configuration.legends.density.uom,
		
		"legendUrlFrane" : configuration.legends.iffi.url,
		"legendTitleFrane" : configuration.legends.iffi.title,
		"legendUomFrane" : configuration.legends.iffi.uom,
	});
	$scope.$watch("center.zoom", function (zoom) { //legend visibility Heatmap/PS
		$scope.legendUrl = configuration.legends[$scope.showDetails() ? "ps" : "density"].url;
		$scope.legendTitle = configuration.legends[$scope.showDetails() ? "ps" : "density"].title;
		$scope.legendUom = configuration.legends[$scope.showDetails() ? "ps" : "density"].uom;
	});
	
	$scope.$watch("overlays", function () { //legend visibility frane
		if ($scope.showLegends("iffi")){
			$scope.legendUrlFrane = configuration.legends["iffi"].url;
			$scope.legendTitleFrane = configuration.legends["iffi"].title;
			$scope.legendUomFrane = configuration.legends["iffi"].uom;
		}
	});
}]);