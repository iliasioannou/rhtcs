'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterPopoupCtrl
 * @description
 * # FilterPopoupCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterPopoupCtrl',['$scope',function($scope){
		angular.extend(this,{
			"speedModelValue" : $scope.speedModel.init,
			"speedOptions" : {
				"from" : $scope.speedModel.from,
				"to" : $scope.speedModel.to,
				"step" : $scope.speedModel.step,
				"dimension" : $scope.speedModel.dimension,
				"scale" : $scope.speedModel.scale,
				"css" : {
					"background" : {"background-color" : "silver"},
					"before" : {"background-color" : "purple"},
					"default" : {"background-color" : "white"},
					"after" : {"background-color" : "green"},
					"pointer" : {"background-color" : "red"}
				},
				"callback" : function(value) { // function(value, released) released it triggered on mouse up
					$scope.speedModel.init = value;
					if(!$scope.$$phase) {
						$scope.$apply();
					}
				}
			}
		});
	}]);