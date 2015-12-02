'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MapCtrl',['$rootScope','$scope','configuration', function ($rootScope,$scope,configuration) {
		angular.extend($scope,{
			"mapPopup" : ""//""scripts/components/maps/map-popup-view.html"
		});
	}]);