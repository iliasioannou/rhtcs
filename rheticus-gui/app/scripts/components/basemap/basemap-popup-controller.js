'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:BasemapPopoupCtrl
 * @description
 * # BasemapPopoupCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('BasemapPopoupCtrl',['$rootScope','$scope','utils', function ($rootScope,$scope,utils) {
		angular.extend($scope,{
			"active" : {
				"name" : $rootScope.baselayers[utils.getIndexByAttributeValue($rootScope.baselayers,"active",true)].name //"Ortofoto RealVista 1.0"
			},
			"changeLayer": function(layer) {
				$rootScope.baselayers.map(function(l) {
					l.active = (l === layer);
				});
			}
		});
	}]);