'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:CreditsController
 * @description
 * # CreditsController
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('CreditsController',['$scope',function($scope){
		angular.extend(this,{
			"baselayers" : $scope.getBaselayers(),
			"overlays" : $scope.getOverlays(),
			"show" : false
		});
	}]);