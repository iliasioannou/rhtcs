'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterPopoupCtrl
 * @description
 * # FilterPopoupCtrl
 * Filter Popoup Controller for rheticus project
 */
angular.module('rheticus')
	.controller('FilterPopoupCtrl',['$rootScope','$scope','configuration',function($rootScope,$scope,configuration){



		angular.extend(this,{
			//SPEED SLIDER
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
			},
			//COHERENCE SLIDER
			"coherenceModelValue" : $scope.coherenceModel.init,
			"coherenceOptions" : {
				"from" : $scope.coherenceModel.from,
				"to" : $scope.coherenceModel.to,
				"step" : $scope.coherenceModel.step,
				"dimension" : $scope.coherenceModel.dimension,
				"scale" : $scope.coherenceModel.scale,
				"css" : {
					"background" : {"background-color" : "silver"},
					"before" : {"background-color" : "purple"},
					"default" : {"background-color" : "white"},
					"after" : {"background-color" : "green"},
					"pointer" : {"background-color" : "red"}
				},
				"callback" : function(value) { // function(value, released) released it triggered on mouse up
					$scope.coherenceModel.init = value;
					if(!$scope.$$phase) {
						$scope.$apply();
					}
				}
			},
			"dataProviders" : configuration.dataProviders, // data providers
			"updateSelection" : function(position, entities) {
				$rootScope.providersFilter=entities;
				$scope.setSpatialFilter();
				$scope.applyFiltersToMap();

			}
		});
	}]);
