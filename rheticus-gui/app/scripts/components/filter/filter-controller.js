'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterCtrl',['$rootScope','$scope', function ($rootScope,$scope) {
		angular.extend($scope,{
			"filterPopup" : "scripts/components/filter/filter-popup-view.html",
			"speedModel" : $rootScope.speedModel.init,
			"speedOptions" : {
				"from" : $rootScope.speedModel.from,
				"to" : $rootScope.speedModel.to,
				"step" : $rootScope.speedModel.step,
				"dimension" : $rootScope.speedModel.dimension,
				"scale" : $rootScope.speedModel.scale,
				"css" : {
					"background" : {"background-color" : "silver"},
					"before" : {"background-color" : "purple"},
					"default" : {"background-color" : "white"},
					"after" : {"background-color" : "green"},
					"pointer" : {"background-color" : "red"}
				},
				"callback" : function(value) { // function(value, released) released it triggered on mouse up
					$rootScope.speedModel.init = value;
					if(!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			}
		});
		
		this.filterCtrl= "filter";
		this.getShow = function(){
			console.log($scope.getController(this.filterCtrl));
			return $scope.getController(this.filterCtrl);
		};
		this.setShow = function(){
			$scope.setController(this.filterCtrl);
		};	
	}]);