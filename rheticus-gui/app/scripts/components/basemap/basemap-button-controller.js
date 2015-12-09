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
		
		//controller variables
		this.basemapCtrl= "basemap";
		this.getShow = function(){
			console.log($scope.activeController===this.basemapCtrl);
			return $scope.getController(this.basemapCtrl);
		};
		this.setShow = function(){
			$scope.setController(this.basemapCtrl);
		};	
	}]);