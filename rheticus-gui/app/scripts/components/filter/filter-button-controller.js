'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterButtonCtrl
 * @description
 * # FilterButtonCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterButtonCtrl',['$scope', function ($scope) {
		angular.extend($scope,{
			"filterPopup" : "scripts/components/filter/filter-popup-view.html"
		});
	}]);