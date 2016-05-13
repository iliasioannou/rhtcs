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

		var searchLocation = function(event){
			if (event.which!=13){
				GeocodingService.geocode(this.location, searchLocationCallback);
			}else{
				getLocation(0);
			}

		};

		var searchLocationCallback = function(list){
			self.results = (list!==null) ? list : {};
		};

		var getLocation = function(index){
			if(self.results[index]){
				var jsonLocation = self.results[index];
				//jsonLocation.geojson.type == Polygon
				$scope.setMapViewExtent(
					jsonLocation.geojson.type,
					jsonLocation.geojson.coordinates
				);
				self.results = {};
				self.location = "";
				self.visibleSearchBar=false;
				if(document.getElementById('searchForm')){
					document.getElementById('searchForm').style.width="50px";
				}
			}

		};


		angular.extend(self,{
			"results" : {},
			"location" : "",
			"visibleSearchBar" : false,
			"getShow" : function(){
				return $scope.getController("geocoder");
			},
			"setShow" : function(){
				$scope.setController("geocoder");
			},
			"showSearchBar" : function(){
				self.visibleSearchBar=!self.visibleSearchBar;
				if(self.visibleSearchBar){
					if(document.getElementById('searchForm')){
						document.getElementById('searchForm').style.width="175px";
					}

				}else{
					if(document.getElementById('searchForm')){
						document.getElementById('searchForm').style.width="50px";
					}
				}

			},
			"getLocation" : getLocation,
			"searchLocation" : searchLocation
		});

	}]);
