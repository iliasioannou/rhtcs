'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Geocoder Controller for rheticus project
 */
angular.module('rheticus')
	.controller('GeocoderCtrl',['$scope','GeocodingService',function($scope,GeocodingService){

		var self = this; //this controller

		var searchLocation = function(){
			GeocodingService.geocode(this.location, searchLocationCallback);
		};

		var searchLocationCallback = function(list){
			self.results = (list!==null) ? list : {};
		};

		var getLocation = function(index){
			var jsonLocation = self.results[index];
			//jsonLocation.geojson.type == Polygon
			$scope.setMapViewExtent(
				jsonLocation.geojson.type,
				jsonLocation.geojson.coordinates
			);
			self.results = {};
			self.location = "";
		};

		angular.extend(self,{
			"results" : {},
			"location" : "",
			"getShow" : function(){
				return $scope.getController("geocoder");
			},
			"setShow" : function(){
				$scope.setController("geocoder");
			},
			"getLocation" : getLocation,
			"searchLocation" : searchLocation
		});

	}]);
