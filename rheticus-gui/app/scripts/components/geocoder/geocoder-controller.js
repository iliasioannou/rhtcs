'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeocoderCtrl',['$rootScope','$scope','$http','configuration', function ($rootScope,$scope,$http,configuration) {
		//controller variables
		this.searching = false;
		this.results = {};
		this.location = "";
		this.searchLocation = function(){
			this.location = this.location.replace('/[^a-zA-Z0-9]/g','+');
			var that = this;
			$http.get(configuration.geocoder.url+this.location+configuration.geocoder.params)
				.success(function (response) {
					that.results = response;
				});
		};
		
		this.getLocation = function(index){			
			var jsonLocation = this.results[index];			
			$rootScope.center.lon = parseFloat(jsonLocation.lon);
            $rootScope.center.lat = parseFloat(jsonLocation.lat);
			this.searching = false;			//hide search after delection
			this.results = {};
			this.location = "";
		};
	}]);