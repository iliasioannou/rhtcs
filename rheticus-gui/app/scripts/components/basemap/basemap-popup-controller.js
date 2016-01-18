'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:BasemapPopoupCtrl
 * @description
 * # BasemapPopoupCtrl
 * Basemap Popoup Controller for rheticus project
 */
angular.module('rheticus')
	.controller('BasemapPopoupCtrl',['$scope',function($scope){
		angular.extend(this,{
			"baselayers" : $scope.getBaselayers()
		});
		angular.extend(this,{
			"active" : {
				"name" : $scope.getActiveBaselayer().name
			},
			"changeLayer": function(layer) {
				this.baselayers.map(function(l) {
					l.active = (l === layer);
				});
			}
		});
	}]);
