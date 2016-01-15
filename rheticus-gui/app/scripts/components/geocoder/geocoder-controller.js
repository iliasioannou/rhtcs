'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeocoderCtrl',['$scope','$http','configuration',function($scope,$http,configuration){

		var self = this; //this controller

		angular.extend(self,{
			"results" : {},
			"location" : "",
			"getShow" : function(){
				return $scope.getController("geocoder");
			},
			"setShow" : function(){
				$scope.setController("geocoder");
			},
			"getLocation" : function(index){
				var jsonLocation = self.results[index];
				$scope.setCenter({
					"lon" : parseFloat(jsonLocation.lon),
					"lat" : parseFloat(jsonLocation.lat)
				});
				self.results = {};
				self.location = "";
			},
			"searchLocation" : function(){
				if (this.location.length>2){
					self.location = self.location.replace('/[^a-zA-Z0-9]/g','+');
					var url = configuration.geocoder.url+self.location+configuration.geocoder.params;
					$http.get(url)
						.success(function (response) {
							self.results = response;
						});
				} else {
					self.results = {};
				}
			}
		});
	}]);
