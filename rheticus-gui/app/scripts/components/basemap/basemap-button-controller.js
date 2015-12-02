'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:BasemapButtonCtrl
 * @description
 * # BasemapButtonCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('BasemapButtonCtrl',['$scope', function ($scope) {
		angular.extend($scope,{
			"mapPopup" : "scripts/components/basemap/basemap-popup-view.html"
		});
	}]);