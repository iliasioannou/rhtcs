'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeoCtrl
 * @description
 * # GeoCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeoCtrl',['$rootScope','$scope','configuration','$http','olData', function ($rootScope,$scope,configuration,$http,olData) {
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
                //$scope.center.zoom = map.getZoom();
				//$scope.center.zoom = map.getZoomForExtent(extent);
			});
				
			$scope.searching=false;			//hide search after delection
			$scope.results= {};
			this.location="";
			console.log($scope.center);			
		};
	}]);