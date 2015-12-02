'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeocoderCtrl',['$scope', function ($scope) {
		angular.extend($scope,{
			/*
			"geoPopup" : "scripts/components/geocoder/geocoder-popup-view.html",
			"geoFocus": {
				"lat": "",
				"lng": "",
				"zoom": 12
			}
			*/
		});
	}]);