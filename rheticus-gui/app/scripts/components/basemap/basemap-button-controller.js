'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:BasemapButtonCtrl
 * @description
 * # BasemapButtonCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('BasemapButtonCtrl',['$scope',function ($scope){
		angular.extend(this,{
			"mapPopup" : "scripts/components/basemap/basemap-popup-view.html",
			"getShow" : function(){
				return $scope.getController("basemap");
			},
			"setShow" : function(){
				$scope.setController("basemap");
			}
		});
	}]);