'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('TimelineCtrl', ['$scope', function($scope){
		$scope.title = "Sentinel 1 Dataset Timeline";
		$scope.data = [];
	}]);