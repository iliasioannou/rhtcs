'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('HeaderCtrl',['$scope','configuration', function ($scope,configuration) {
		angular.extend($scope,{
			"rheticusHeaderTitle" : configuration.rheticusHeaderTitle
		});
	}]);