'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeocoderCtrl',['$scope','$http','olData', function ($scope,$http,olData) {
		angular.extend($scope,{
			//"geoPopup" : "scripts/components/geocoder/geo-popup-view.html",			
			"geoFocus": {
				"lat": "",
				"lng": "",
				"zoom": 12
			},
			"searching" : false,
			"results":{}
		});
		this.urlQuery= "http://nominatim.openstreetmap.org/search?q=";
		this.urlParams="&limit=5&format=json";
		this.location="";
		this.results={};
		this.zoom= 10;
		this.searchLocation = function(){
			this.location = this.location.replace('/[^a-zA-Z0-9]/g','+');
			//console.log(this.location);
			$http.get(this.urlQuery+this.location+this.urlParams+"").success(function (response) {
				$scope.results= response;
			});
		};
		
		this.getLocation = function(index){			
			var jsonLocation= $scope.results[index];			
			var extent = [parseFloat(jsonLocation.boundingbox[2]),
					parseFloat(jsonLocation.boundingbox[0]),
					parseFloat(jsonLocation.boundingbox[3]),
					parseFloat(jsonLocation.boundingbox[1])
					];
			console.log(extent);
			olData.getMap().then(function(map) {
				
				map.getView().fit(extent, map.getSize());
				$scope.center.bounds = extent;
				$scope.center.lon = parseFloat(jsonLocation.lon);
                $scope.center.lat = parseFloat(jsonLocation.lat);				
                $scope.center.zoom = 10;
				//$scope.center.zoom = map.getZoomForExtent(extent);
			});
				
			$scope.searching=false;			//hide search after delection
			$scope.results= {};
			this.location="";
			console.log($scope.center);			
		};
	}]);