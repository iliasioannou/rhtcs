'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterButtonCtrl
 * @description
 * # FilterButtonCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterButtonCtrl',['$scope',function($scope){
		angular.extend(this,{
			"filterPopup" : "scripts/components/filter/filter-popup-view.html",
			"getShow" : function(){
				return $scope.getController("filter");
			},
			"setShow" : function(){
				$scope.setController("filter");
			}
		});
	}]);