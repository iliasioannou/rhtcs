'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:ViewSwitcherCtrl
 * @description
 * # ViewSwitcherCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('ViewSwitcherCtrl',['$scope', function ($scope) {
		angular.extend($scope,{
			views_type : {
				ps_view : "ps",
				S1_identifier : "S1_Identifier"
			},
			radioModel : ""
		});
		$scope.radioModel = $scope.views_type.ps_view;
	}]);