'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterPopoupCtrl
 * @description
 * # FilterPopoupCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterPopoupCtrl',['$rootScope','$scope', function ($rootScope,$scope) {
		angular.extend($scope,{
			"speedModelValue" : $rootScope.speedModel.init,
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
				"callback" : function(value, released) { // released it triggered on mouse up
					$rootScope.speedModel.init = value;
					if(!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			}
		});
	}]);